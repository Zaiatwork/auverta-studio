'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

// The two strokes of the Auverta mark, straight from the brand favicon (512×512 viewBox).
const MARK_PATHS = [
  'M124.96,129.8c-5.94-7.22-17.65-3.02-17.65,6.33v235.11c0,11.18,15.59,13.88,19.35,3.35l28.15-78.88c2.2-6.15,9.62-8.56,15.01-4.87l143.25,98.17c9.52,6.52,20.66-5.64,13.32-14.55L124.96,129.8Z',
  'M403.85,140c-.04-11.18-15.64-13.82-19.36-3.28l-27.87,78.98c-2.17,6.16-9.59,8.6-15,4.92l-143.6-97.65c-9.54-6.49-20.63,5.72-13.27,14.6l202.31,243.93c5.97,7.19,17.66,2.95,17.63-6.4l-.84-235.11Z',
]

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
      // SVG space → scene space: centre on the viewBox, flip Y, scale to ~3 units.
      geo.translate(-256, -256, -23)
      geo.scale(0.0118, -0.0118, 0.0118)
      geo.computeVertexNormals()
      return geo
    })
  }, [quality])
}

function AuvertaMark({
  pointer,
  scroll,
  reduced,
  quality,
}: {
  pointer: RefObject<Pointer>
  scroll: RefObject<number>
  reduced: boolean
  quality: 'high' | 'low'
}) {
  const group = useRef<THREE.Group>(null)
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const intro = useRef(reduced ? 1 : 0)
  const [geoLeft, geoRight] = useMarkGeometries(quality)
  const { viewport } = useThree()

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#20202c',
        metalness: 0.92,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 2.4,
      }),
    []
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const g = group.current
    if (!g || !left.current || !right.current) return
    const dt = Math.min(delta, 1 / 30)

    // Intro: halves travel in from a split and lock together (~1.6s).
    if (intro.current < 1) intro.current = Math.min(1, intro.current + dt / 1.6)
    const introEase = 1 - Math.pow(1 - intro.current, 4)

    // Scroll: as the hero leaves, the halves separate along the mark's diagonal.
    const s = scroll.current ?? 0
    const split = (1 - introEase) * 1.4 + s * 1.6

    left.current.position.set(-split * 0.55, split * 0.35, 0)
    right.current.position.set(split * 0.55, -split * 0.35, 0)
    left.current.rotation.z = -split * 0.08
    right.current.rotation.z = -split * 0.08

    // Pointer tilt + a slow idle drift — never constant spinning.
    const p = pointer.current ?? { x: 0, y: 0 }
    const t = state.clock.elapsedTime
    const idle = reduced ? 0 : 1
    const targetY = -0.35 + p.x * 0.35 + Math.sin(t * 0.25) * 0.06 * idle
    const targetX = 0.12 - p.y * 0.22 + Math.cos(t * 0.2) * 0.04 * idle
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY + s * 0.6, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt)

    // Composition follows orientation (and live resizes): landscape puts the mark right of
    // the headline; portrait sets it in the upper area, clear of the bottom-aligned copy.
    // The mark is ~3.5 × 3.1 units at scale 1.
    const portrait = viewport.aspect < 1
    let scale: number
    let baseX: number
    let baseY: number
    if (portrait) {
      scale = Math.min(0.14 * viewport.width, 0.62)
      baseX = viewport.width * 0.1
      baseY = viewport.height / 2 - (3.1 * scale) / 2 - viewport.height * 0.085
    } else {
      scale = 0.7
      baseX = Math.min(viewport.width * (viewport.aspect < 1.5 ? 0.27 : 0.25), 2.5)
      baseY = 0.05
    }
    g.position.x = baseX
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + Math.sin(t * 0.5) * 0.06 * idle + s * 0.8, 4, dt)
    g.scale.setScalar(scale * (0.92 + introEase * 0.08))
  })

  return (
    <group ref={group}>
      <mesh ref={left} geometry={geoLeft} material={material} />
      <mesh ref={right} geometry={geoRight} material={material} />
    </group>
  )
}

function Lights() {
  // Studio lighting rendered into a cube map once — no HDR download.
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
      <pointLight position={[4, 3, 4]} intensity={18} color={LIME} distance={14} />
      <pointLight position={[-4, -3, 2]} intensity={10} color="#7a45ff" distance={12} />
    </>
  )
}

export default function HeroScene({
  scroll,
  active,
  onReady,
}: {
  scroll: RefObject<number>
  active: boolean
  onReady?: () => void
}) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })
  // This component is client-only (dynamic, ssr: false), so reading the browser here is safe.
  const [env] = useState(() => {
    if (typeof window === 'undefined') return { webgl: false, mobile: false, reduced: false, coarse: false }
    const probe = document.createElement('canvas')
    return {
      webgl: !!(probe.getContext('webgl2') || probe.getContext('webgl')),
      mobile: window.innerWidth < 768,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarse: window.matchMedia('(pointer: coarse)').matches,
    }
  })

  useEffect(() => {
    if (env.coarse) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [env.coarse])

  const quality = env.mobile || env.coarse ? 'low' : 'high'

  // No WebGL: the hero stands on typography and the CSS glow alone.
  if (!env.webgl) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.5]}
      frameloop={active && !env.reduced ? 'always' : 'demand'}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        // Neutral keeps brand violet violet — ACES filmic hue-shifts saturated purples to blue.
        gl.toneMapping = THREE.NeutralToneMapping
        gl.toneMappingExposure = 1
        requestAnimationFrame(() => onReady?.())
      }}
      aria-hidden="true"
    >
      <Lights />
      <AuvertaMark pointer={pointer} scroll={scroll} reduced={env.reduced} quality={quality} />
    </Canvas>
  )
}
