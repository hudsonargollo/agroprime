import { listAssets } from "@/lib/content"
import CalendarBoard from "@/components/CalendarBoard"

export const dynamic = "force-dynamic"

export default async function CalendarioPage() {
  const assets = listAssets(false).filter((a) => a.fecha)
  return (
    <div>
      <div className="toolbar">
        <h1 style={{ margin: 0, flex: 1 }}>Calendario de publicaciones</h1>
        <a className="btn-ghost" href="/api/export.ics" download="mkt-hub.ics">
          Exportar ICS (±2 meses)
        </a>
      </div>
      <p className="muted small">
        Zona horaria: America/La_Paz (UTC−4). Los datos salen de fecha_programada (front-matter) y
        fecha_publicacion (post-specs). Clic en un evento para editar la fecha en el editor del asset.
      </p>
      <CalendarBoard assets={assets} />
    </div>
  )
}
