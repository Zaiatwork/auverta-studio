'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { ScrollTrigger } from '@/lib/gsap'
import { MARK_PATHS } from '@/components/ui/BrandMark'
import { buildKeyframes, emptyState, sampleJourney, type Half, type Keyframe } from '@/lib/journey'

const SVG_SCALE = 0.0118
const MARK_HEIGHT = 262 * SVG_SCALE // world units at scale 1

const LIME = '#d4f52a'
const VIOLET = '#5b21fa'

type Pointer = { x: number; y: number }

function useMarkGeometries(quality: 'high' | 'low') {
  return useMemo(() => {
    const loader = new SVGLoader()
    return MARK_PATHS.map((d) => {
      const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`)
      const shapes = data.paths.flatMap((p) => p.toShapes())
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 46,
        bevelEnabled: true,
        bevelThickness: 7,
        bevelSize: 5,
        bevelSegments: quality === 'high' ? 6 : 2,
        curveSegments: quality === 'high' ? 24 : 8,
      })
      // SVG space â†’ scene space: centre on the mark, flip Y. Both halves share this origin,
      // so identical transforms put them back together as the complete mark.
      geo.translate(-256, -258, -23)
      geo.scale(SVG_SCALE, -SVG_SCALE, SVG_SCALE)
      geo.computeVertexNormals()
      return geo
    })
  }, [quality])
}

const makeMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: '#20202c',
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 2.4,
    transparent: true,
  })

/** Drives both halves from the scroll-anchored journey, easing the rendered pose towards it. */
function Journey({ pointer, quality, reduced }: { pointer: React.RefObject<Pointer>; quality: 'high' | 'low'; reduced: boolean }) {
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const [geoL, geoR] = useMarkGeometries(quality)
  const mats = useMemo(() => [makeMaterial(), makeMaterial()], [])
  const { viewport, invalidate } = useThree()

  const keys = useRef<Keyframe[]>([])
  const target = useRef(emptyState())
  const current = useRef<ReturnType<typeof emptyState> | null>(null)
  const intro = useRef(reduced ? 1 : 0)
  const spin = useRef({ angle: 0, lastY: -1 })

  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats])

  // Rebuild the choreography whenever ScrollTrigger re-measures the page (load, resize, fonts).
  useEffect(() => {
    const rebuild = () => {
      const mode = window.matchMedia('(min-width: 1025px)').matches ? 'desktop' : 'compact'
      keys.current = buildKeyframes(mode)
      invalidate()
    }
    const raf = requestAnimationFrame(rebuild)
    ScrollTrigger.addEventListener('refresh', rebuild)
    const onScroll = () => invalidate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      ScrollTrigger.removeEventListener('refresh', rebuild)
      window.removeEventListener('scroll', onScroll)
    }
  }, [invalidate])

  useFrame((state, delta) => {
    const l = left.current
    const r = right.current
    if (!l || !r || !keys.current.length) return
    const dt = Math.min(delta, 1 / 30)

    const tgt = sampleJourney(keys.current, window.scrollY, target.current)
    if (!current.current) current.current = structuredClone(tgt)
    const cur = current.current

    // Ease towards the scroll target: smooth even when scrolling fast, and it never overshoots.
    let moving = false
    const damp = (a: number, b: number, lambda = 7) => {
      const v = THREE.MathUtils.damp(a, b, lambda, dt)
      if (Math.abs(v - b) > 1e-4) moving = true
      return v
    }
    const follow = (c: Half, t: Half) => {
      c.x = damp(c.x, t.x)
      c.y = damp(c.y, t.y)
      c.s = damp(c.s, t.s)
      c.r = damp(c.r, t.r)
      c.o = damp(c.o, t.o, 9)
    }
    follow(cur.L, tgt.L)
    follow(cur.R, tgt.R)
    cur.yaw = damp(cur.yaw, tgt.yaw, 4)
    cur.pitch = damp(cur.pitch, tgt.pitch, 4)
    cur.tilt = damp(cur.tilt, tgt.tilt, 4)

    // Burst spin: scroll speed turns the mark about its vertical axis, then it settles face-on
    // on the nearest full turn, so a quick flick is a coin flip and a slow scroll barely moves it.
    const sp = spin.current
    const sy = window.scrollY
    if (sp.lastY >= 0) sp.angle = THREE.MathUtils.clamp(sp.angle + THREE.MathUtils.clamp(sy - sp.lastY, -150, 150) * 0.004, -4 * Math.PI, 4 * Math.PI)
    sp.lastY = sy
    const home = Math.round(sp.angle / (2 * Math.PI)) * 2 * Math.PI
    sp.angle = damp(sp.angle, home, 2.5)

    // Intro: the halves travel in from a split and lock together (~1.6s).
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + dt / 1.6)
      moving = true
    }
    const introSplit = (1 - (1 - Math.pow(1 - intro.current, 4))) * 1.4

    // Pointer tilt and a slow idle sway, scaled by how "present" the mark is (full in the hero, none in the footer).
    const p = pointer.current ?? { x: 0, y: 0 }
    const t = state.clock.elapsedTime
    const sway = reduced ? 0 : cur.tilt
    const yaw = cur.yaw + sp.angle + (p.x * 0.35 + Math.sin(t * 0.25) * 0.06) * sway
    const pitch = cur.pitch + (-p.y * 0.22 + Math.cos(t * 0.2) * 0.04) * sway
    if (sway > 0.05) moving = true

    const place = (mesh: THREE.Mesh, h: Half, dir: number, mat: THREE.MeshPhysicalMaterial) => {
      const k = (h.s * viewport.height) / MARK_HEIGHT
      mesh.visible = h.o > 0.01 && h.s > 0.001
      mesh.position.set(
        (h.x * viewport.width) / 2 + dir * introSplit * 0.55 * k,
        (h.y * viewport.height) / 2 - dir * introSplit * 0.35 * k,
        0
      )
      mesh.scale.setScalar(k)
      mesh.rotation.set(pitch, yaw, h.r - dir * introSplit * 0.08)
      mat.opacity = h.o
    }
    place(l, cur.L, -1, mats[0])
    place(r, cur.R, 1, mats[1])

    if (moving) invalidate()
  })

  return (
    <>
      <mesh ref={left} geometry={geoL} material={mats[0]} />
      <mesh ref={right} geometry={geoR} material={mats[1]} />
    </>
  )
}

function Lights() {
  // Studio lighting rendered into a cube map once. No HDR download.
  return (
    <>
      <Environment resolution={256} frames={1}>
        {/* Broad violet wash from the left, a lime strip from the right, soft white key from above. */}
        <Lightformer form="rect" intensity={3} color={VIOLET} position={[-5, 0, 3]} rotation-y={Math.PI / 2.5} scale={[10, 8, 1]} />
        <Lightformer form="rect" intensity={7} color={LIME} position={[5, 1, 2]} rotation-y={-Math.PI / 2.5} scale={[1.2, 8, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, 3]} rotation-x={Math.PI / 2.2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0, 8]} scale={[4, 4, 1]} />
        <Lightformer form="ring" intensity={4} color={VIOLET} position={[0, -4, -3]} scale={6} />
      </Environment>
      {/* No point lights: at frame scale they leave a hard hotspot on the flat faces. */}
    </>
  )
}

export default function JourneyScene() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })
  const invalidateRef = useRef<(() => void) | null>(null)
  // Client-only component (dynamic, ssr: false), so reading the browser here is safe.
  const [env] = useState(() => {
    const probe = document.createElement('canvas')
    return {
      webgl: !!(probe.getContext('webgl2') || probe.getContext('webgl')),
      small: window.innerWidth < 1025,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarse: window.matchMedia('(pointer: coarse)').matches,
    }
  })
  const enabled = env.webgl && !env.reduced

  useEffect(() => {
    if (env.coarse || !enabled) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
      invalidateRef.current?.()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [env.coarse, enabled])

  // The static SVG marks in the hero and footer stand in whenever the journey isn't running.
  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    return () => html.classList.remove('has-journey')
  }, [enabled])

  if (!enabled) return null
  const quality = env.small || env.coarse ? 'low' : 'high'

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      dpr={quality === 'high' ? [1, 1.6] : [1, 1.5]}
      frameloop="demand"
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, invalidate }) => {
        // Neutral keeps brand violet violet; ACES filmic hue-shifts saturated purples to blue.
        gl.toneMapping = THREE.NeutralToneMapping
        gl.toneMappingExposure = 1
        invalidateRef.current = invalidate
        requestAnimationFrame(() => document.documentElement.classList.add('has-journey'))
      }}
    >
      <Lights />
      <Journey pointer={pointer} quality={quality} reduced={env.reduced} />
    </Canvas>
  )
}
