import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <Compass className="h-10 w-10 text-ink-300 dark:text-ink-600" />
      <h1 className="text-2xl font-bold text-ink-900 dark:text-white">Sahifa topilmadi</h1>
      <p className="max-w-sm text-sm muted">
        Siz izlagan sahifa mavjud emas yoki ko‘chirilgan bo‘lishi mumkin.
      </p>
      <Link to="/" className="btn-primary mt-2">Boshqaruv paneliga qaytish</Link>
    </div>
  )
}
