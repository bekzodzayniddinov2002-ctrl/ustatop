import { useEffect, useState } from 'react'

const KEY = 'ustatop.theme'

/** Yorug'/qorong'i rejim — tanlov brauzerda saqlanadi. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* private mode — standart rejim */ }
    // Referens dizayn tungi ko'k — standart holat qorong'i rejim
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem(KEY, theme) } catch { /* saqlab bo'lmadi — muhim emas */ }
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
