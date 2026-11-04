import { currentUser } from "@/lib/guard"
import { listAssets } from "@/lib/content"
import Kanban from "@/components/Kanban"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await currentUser()
  const assets = listAssets(false)
  return (
    <div>
      <div className="toolbar">
        <h1 style={{ margin: 0, flex: 1 }}>Pipeline de contenido</h1>
        <span className="muted small">{assets.length} activos</span>
      </div>
      <Kanban assets={assets} role={user!.role} />
    </div>
  )
}
