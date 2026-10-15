import SiteShell from '@/components/layout/SiteShell'

// Shared frame for every inner page. The home page composes its own (it owns the
// travelling mark), so it lives outside this route group.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell mainClassName="inner">{children}</SiteShell>
}
