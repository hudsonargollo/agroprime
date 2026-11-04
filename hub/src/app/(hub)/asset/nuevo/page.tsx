import { currentUser } from "@/lib/guard"
import NuevoAsset from "@/components/NuevoAsset"
import { allAllowedDirs } from "@/lib/paths"

export const dynamic = "force-dynamic"

export default async function NuevoPage({
  searchParams,
}: {
  searchParams: Promise<{ canal?: string; tipo?: string; dir?: string; titulo?: string }>
}) {
  const user = await currentUser()
  if (user!.role === "viewer") {
    return <p className="err">Tu rol es de solo lectura: no puedes crear assets.</p>
  }
  const params = await searchParams
  return (
    <div className="narrow">
      <h1>Nuevo asset</h1>
      <p className="muted small">
        Se crea el archivo prestamado según canal/tipo (front-matter + cuerpo inicial en español), en
        el directorio que elijas. Para social post/reel se crea además un post-spec JSON emparejado
        en social/calendario con el mismo id.
      </p>
      <NuevoAsset
        dirs={allAllowedDirs().slice()}
        pref={params}
      />
    </div>
  )
}
