const fmt = new Intl.NumberFormat('en-US')

/** The text a counting figure shows at progress t (0..1). */
export function countFrame(value: string, t: number): string {
  const m = /^(\D*)(\d[\d,]*)(.*)$/.exec(value)
  if (!m) return value
  const [, prefix, digits, suffix] = m
  const end = Number(digits.replace(/,/g, ''))
  if (end < 10) return value
  const n = Math.round(end * Math.min(1, Math.max(0, t)))
  return prefix + (digits.includes(',') ? fmt.format(n) : n) + suffix
}
