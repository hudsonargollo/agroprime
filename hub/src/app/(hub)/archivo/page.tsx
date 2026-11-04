import Link from "next/link"
import { listAssets } from "@/lib/content"
import { NOMBRE_DIRS } from "@/lib/types"
import { currentUser } from "@/lib/guard"
import ArchivoView from "@/components/ArchivoView"

export const dynamic = "force-dynamic"

export default async function ArchivoPage() {
  const user = await currentUser()
  const all = listAssets(true)
  return (
    <div>
      <div className="toolbar">
        <h1 style={{ margin: 0, flex: 1 }}>Archivo de contenido</h1>
        {user!.role !== "viewer" && (
          <Link className="btn" href="/asset/nuevo">
            + Nuevo asset
          </Link>
        )}
      </div>
      <ArchivoView assets={all} />
      <p className="muted small mt">
        {all.length} archivos en {Object.keys(NOMBRE_DIRS).length} directorios. Las listas CSV de
        outreach se editan desde su editor de texto en el repo; el Hub solo las muestra y exporta.
      </p>
    </div>
  )
}
