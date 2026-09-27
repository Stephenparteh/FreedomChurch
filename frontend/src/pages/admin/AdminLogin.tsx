import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StateMessage } from '@/components/shared/StateMessage'
import { usePageMeta } from '@/hooks/usePageMeta'

export function AdminLogin() {
  usePageMeta('Admin login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <Card className="w-full max-w-sm">
        <p className="font-display text-lg font-semibold text-text">NFPC Admin</p>
        <StateMessage
          className="mt-6"
          title="Authentication isn't implemented yet"
          description="Login will be built in Milestone 4 alongside the rest of the administration dashboard (see docs/DASHBOARD_PLAN.md)."
          action={<Button to="/">Back to site</Button>}
        />
      </Card>
    </div>
  )
}
