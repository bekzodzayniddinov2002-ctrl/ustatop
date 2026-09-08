import { useEffect, useRef, useState } from 'react'

/**
 * Socket.io oqimining demo taqlidi.
 *
 * Backend ulanganda bu hook ichidagi interval `io(API_URL)` bilan almashtiriladi:
 * `socket.on('order:new' | 'worker:location' | 'order:status', ...)` hodisalari
 * aynan shu shakldagi obyektlarni qaytaradi.
 */
export function useRealtime({ enabled = true, onTick } = {}) {
  const [connected, setConnected] = useState(false)
  const [lastEventAt, setLastEventAt] = useState(null)
  const cb = useRef(onTick)
  cb.current = onTick

  useEffect(() => {
    if (!enabled) { setConnected(false); return }
    const hello = setTimeout(() => setConnected(true), 400)
    const id = setInterval(() => {
      cb.current?.()
      setLastEventAt(new Date())
    }, 4000)
    return () => { clearTimeout(hello); clearInterval(id); setConnected(false) }
  }, [enabled])

  return { connected, lastEventAt }
}
