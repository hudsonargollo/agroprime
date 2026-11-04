"use client"

import CopyBtn from "./CopyBtn"
import { CTA_TIPOS, FORMATOS, PLATAFORMAS, PostSpec } from "@/lib/types"

/** Formulario estructurado para post-specs JSON (sin editar JSON crudo). */
export default function SpecEditor({
  spec,
  setSpec,
  readonly,
}: {
  spec: PostSpec
  setSpec: (s: PostSpec) => void
  readonly: boolean
}) {
  const set = <K extends keyof PostSpec>(k: K, v: PostSpec[K]) => setSpec({ ...spec, [k]: v })
  const togglePlatExtra = (p: string) => {
    const cur = spec.plataformas_extra ?? []
    set("plataformas_extra", cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p])
  }
  const setMedia = (i: number, k: "tipo" | "brief" | "referencia_importada", v: string) => {
    const rows = spec.media.map((m, j) => (j === i ? { ...m, [k]: v } : m))
    set("media", rows)
  }
  const displ = spec.plataformas_extra.filter((p) => p !== spec.plataforma)

  return (
    <div className="card">
      <div className="formgrid">
        <div>
          <label>
            <span className="flabel">
              id <CopyBtn text={spec.id} />
            </span>
          </label>
          <input style={{ width: "100%" }} value={spec.id} disabled readOnly />
        </div>
        <div>
          <label>schema</label>
          <input style={{ width: "100%" }} value={spec.schema} disabled readOnly />
        </div>

        <div>
          <label>
            <span className="flabel">
              plataforma <CopyBtn text={spec.plataforma} />
            </span>
          </label>
          <select
            style={{ width: "100%" }}
            value={spec.plataforma}
            disabled={readonly}
            onChange={(e) => set("plataforma", e.target.value)}
          >
            {PLATAFORMAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            plataformas_extra
            {displ.length > 0 && <CopyBtn text={displ.join(", ")} />}
          </label>
          <div className="checks">
            {PLATAFORMAS.filter((p) => p !== "ambas_fb_ig").map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={spec.plataformas_extra.includes(p)}
                  disabled={readonly}
                  onChange={() => togglePlatExtra(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>
            <span className="flabel">
              fecha_publicacion <CopyBtn text={spec.fecha_publicacion} />
            </span>
          </label>
          <input style={{ width: "100%" }} value={spec.fecha_publicacion} disabled readOnly />
        </div>
        <div>
          <label>formato</label>
          <select
            style={{ width: "100%" }}
            value={spec.formato}
            disabled={readonly}
            onChange={(e) => set("formato", e.target.value)}
          >
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="full">
          <label>
            <span className="flabel">
              titulo <CopyBtn text={spec.titulo} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.titulo}
            disabled={readonly}
            onChange={(e) => set("titulo", e.target.value)}
          />
        </div>

        <div className="full">
          <label>
            <span className="flabel">
              caption <CopyBtn text={spec.caption} />{" "}
              <CopyBtn
                text={[spec.caption, spec.primer_comentario].filter(Boolean).join("\n\n")}
                label="copiar caption + comentario"
              />
            </span>
          </label>
          <textarea
            rows={9}
            value={spec.caption}
            disabled={readonly}
            onChange={(e) => set("caption", e.target.value)}
          />
        </div>

        <div className="full">
          <label>
            <span className="flabel">
              primer_comentario <CopyBtn text={spec.primer_comentario} />
            </span>
          </label>
          <textarea
            rows={2}
            value={spec.primer_comentario}
            disabled={readonly}
            onChange={(e) => set("primer_comentario", e.target.value)}
          />
        </div>

        <div className="full">
          <label>
            <span className="flabel">
              hashtags (separados por coma) <CopyBtn text={spec.hashtags.join(" ")} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.hashtags.join(", ")}
            disabled={readonly}
            onChange={(e) =>
              set(
                "hashtags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>

        <div className="full">
          <label>
            <span className="flabel">
              media ({spec.media.length})
              {!readonly && (
                <button
                  type="button"
                  className="btn-ghost copybtn"
                  onClick={() =>
                    set("media", [
                      ...spec.media,
                      { tipo: "imagen", brief: "", referencia_importada: "" },
                    ])
                  }
                >
                  + añadir media
                </button>
              )}
            </span>
          </label>
          {spec.media.map((m, i) => (
            <div className="media-row" key={i}>
              <select value={m.tipo} disabled={readonly} onChange={(e) => setMedia(i, "tipo", e.target.value)}>
                {["imagen", "video", "audio", "carrusel", "texto"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                placeholder="brief (dirección de arte si aplica)"
                value={m.brief}
                disabled={readonly}
                onChange={(e) => setMedia(i, "brief", e.target.value)}
              />
              <input
                placeholder="referencia_importada (ej: instagram/posts/…_video.mp4)"
                value={m.referencia_importada}
                disabled={readonly}
                onChange={(e) => setMedia(i, "referencia_importada", e.target.value)}
              />
              <button
                type="button"
                className="btn-ghost copybtn"
                title="Quitar fila"
                disabled={readonly}
                onClick={() => set("media", spec.media.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          {spec.media.length === 0 && <p className="muted small">Sin media todavía.</p>}
        </div>

        <div>
          <label>cta.tipo</label>
          <select
            style={{ width: "100%" }}
            value={spec.cta.tipo}
            disabled={readonly}
            onChange={(e) => set("cta", { ...spec.cta, tipo: e.target.value })}
          >
            {CTA_TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div></div>

        <div>
          <label>
            <span className="flabel">
              cta.texto <CopyBtn text={spec.cta.texto} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.cta.texto}
            disabled={readonly}
            onChange={(e) => set("cta", { ...spec.cta, texto: e.target.value })}
          />
        </div>
        <div>
          <label>
            <span className="flabel">
              cta.url <CopyBtn text={spec.cta.url} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.cta.url}
            disabled={readonly}
            onChange={(e) => set("cta", { ...spec.cta, url: e.target.value })}
          />
        </div>

        <div>
          <label>
            <span className="flabel">
              campania <CopyBtn text={spec.campania ?? ""} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.campania ?? ""}
            disabled={readonly}
            onChange={(e) => set("campania", e.target.value || null)}
          />
        </div>
        <div>
          <label>
            <span className="flabel">
              estado <CopyBtn text={spec.estado} />
            </span>
          </label>
          <input style={{ width: "100%" }} value={spec.estado} disabled readOnly />
        </div>

        <div>
          <label>
            <span className="flabel">
              responsable <CopyBtn text={spec.responsable} />
            </span>
          </label>
          <input
            style={{ width: "100%" }}
            value={spec.responsable}
            disabled={readonly}
            onChange={(e) => set("responsable", e.target.value)}
          />
        </div>
        <div>
          <label>notas</label>
          <input
            style={{ width: "100%" }}
            value={spec.notas}
            disabled={readonly}
            onChange={(e) => set("notas", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
