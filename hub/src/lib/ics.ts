/** Utilidades ICS (RFC 5545) para exportar eventos, zona America/La_Paz (UTC−4). */

export function icsEscape(text: string): string {
  return (text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

/** Dobla líneas a ~75 octetos según RFC 5545. */
export function foldLine(line: string): string {
  if (line.length <= 74) return line
  const parts: string[] = []
  let rest = line
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74))
    rest = " " + rest.slice(74)
  }
  parts.push(rest)
  return parts.join("\r\n")
}

/** ISO cualquiera → ICS local La_Paz: YYYYMMDDTHHMMSS-0400. */
export function icsStamp(iso: string, plusMinutes = 0): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const t = new Date(d.getTime() + plusMinutes * 60_000)
  const fecha = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(t)
    .replace(/[- :]/g, "")
  return fecha + "-0400"
}

/** Ahora (UTC) en formato ICS Z. */
export function icsStampUtc(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

export function vevent(uid: string, iso: string, titulo: string, desc: string): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${icsEscape(uid)}`,
    `DTSTAMP:${icsStampUtc()}`,
    `DTSTART;TZID=America/La_Paz:${icsStamp(iso)}`,
    `DTEND;TZID=America/La_Paz:${icsStamp(iso, 30)}`,
    `SUMMARY:${icsEscape(titulo)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    "END:VEVENT",
  ]
}

export function icsCalendar(events: string[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mkt Hub Agro-Prime//Pipeline//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events.map((e) => (e.includes("\r\n") ? e.split("\r\n") : [e]).map(foldLine).join("\r\n")),
    "END:VCALENDAR",
  ].join("\r\n")
}
