import { notFound, redirect } from "next/navigation"
import { currentUser } from "@/lib/guard"
import { FullAsset, readFullAsset } from "@/lib/content"
import { decodeId, isValidRelPath } from "@/lib/paths"
import { history } from "@/lib/git"
import Editor from "@/components/Editor"

export const dynamic = "force-dynamic"

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!isValidRelPath(safeDecode(id))) notFound()

  let data: FullAsset
  try {
    data = readFullAsset(safeDecode(id))
  } catch {
    notFound()
  }

  const hist = await history(safeDecode(id), 20)

  return (
    <Editor
      id={id}
      data={{ ...data, tituloFallback: safeDecode(id).split("/").pop() ?? "" }}
      role={user!.role}
      history={hist}
    />
  )
}

function safeDecode(id: string): string {
  try {
    return decodeId(id)
  } catch {
    return ""
  }
}
