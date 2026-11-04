/**
 * Versionado git: commit por guardado, historial, diff y restauración.
 * Todo falla silenciosamente (el git del repo padre es gestionado por alguien más;
 * el Hub solo registra, nunca interrumpe).
 */
import { execFile } from "node:child_process"
import path from "node:path"
import { contentDir, repoRoot } from "./paths"

const DISABLED = () => process.env.HUB_GIT_DISABLE === "1"

function gitFile(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    execFile(
      "git",
      args,
      { cwd: repoRoot(), timeout: 15_000, maxBuffer: 8 * 1024 * 1024 },
      (err, stdout, stderr) => {
        // exit code de git en err.code
        const code = err && typeof (err as { code?: number }).code === "number" ? (err as { code: number }).code : err ? 1 : 0
        if (code !== 0 || (stderr ?? "").trim()) {
          console.error("[mkt-hub git]", code, (stderr ?? "").trim(), "| args:", args.join(" "))
        }
        resolve({ stdout: stdout ?? "", stderr: stderr ?? "", code })
      }
    )
  })
}

/** Ruta relativa al repo raíz: marketing-machine/workflow/<rel>. */
function repoRel(rel: string): string {
  return path.relative(repoRoot(), path.join(contentDir(), rel))
}

/** git add + commit para un asset editado. Ignora fallos silenciosamente. */
export async function snapshot(rel: string, action: string, email: string): Promise<void> {
  if (DISABLED()) return
  try {
    const repoPath = repoRel(rel)
    const add = await gitFile(["-C", repoRoot(), "add", "--", repoPath])
    if (add.code !== 0) return
    const status = await gitFile(["-C", repoRoot(), "diff", "--cached", "--name-only", "--", repoPath])
    if (!status.stdout.trim()) return // sin cambios reales: no hay commit
    await gitFile([
      "-C",
      repoRoot(),
      "commit",
      "-m",
      `hub: ${path.basename(rel)} — ${action} por ${email}`,
      "--",
      repoPath,
    ])
  } catch {
    /* silencio */
  }
}

export interface HistoryEntry {
  hash: string
  date: string
  author: string
  subject: string
}

/** Últimos N commits que tocan el archivo. */
export async function history(rel: string, n = 20): Promise<HistoryEntry[]> {
  if (DISABLED()) return []
  const { stdout, code } = await gitFile([
    "-C",
    repoRoot(),
    "log",
    "-n",
    String(n),
    "--format=%h|%ad|%an|%s",
    "--date=iso",
    "--follow",
    "--",
    repoRel(rel),
  ])
  if (code !== 0) return []
  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, date, author, ...rest] = line.split("|")
      return { hash, date, author, subject: rest.join("|") }
    })
}

/** git diff entre dos commits para un archivo. */
export async function diff(rel: string, a: string, b: string): Promise<string> {
  const safe = (h: string) => (process.env.HUB_GIT_DISABLE === "1" ? "" : /^[0-9a-fA-F]{4,40}$/.test(h) ? h : "")
  const ha = safe(a)
  const hb = safe(b)
  if (!ha || !hb) return ""
  const { stdout } = await gitFile(["-C", repoRoot(), "diff", ha, hb, "--", repoRel(rel)])
  return stdout
}

/** git show <hash>:<path> → texto restaurado (string). Sin commit: lo hace el caller. */
export async function showAt(rel: string, hash: string): Promise<string | null> {
  if (!/^[0-9a-fA-F]{4,40}$/.test(hash)) return null
  const { stdout, code } = await gitFile(["-C", repoRoot(), "show", `${hash}:${repoRel(rel)}`])
  return code === 0 ? stdout : null
}
