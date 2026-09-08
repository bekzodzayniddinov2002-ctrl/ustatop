/** Shartli class nomlarini birlashtirish (clsx'ning minimal varianti). */
export function clsxLite(...parts) {
  return parts.filter(Boolean).join(' ')
}
