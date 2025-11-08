'use client'

/**
 * No Access Page
 * Shown when user completed quiz but hasn't purchased TestoUp
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package, CheckCircle, ArrowRight, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AccessData {
  capsulesRemaining?: number
  [key: string]: unknown
}

export default function NoAccessPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [accessData, setAccessData] = useState<AccessData | null>(null)

  useEffect(() => {
    const userEmail = localStorage.getItem('quizEmail')
    if (!userEmail) {
      router.push('/quiz')
      return
    }

    setEmail(userEmail)

    // Fetch access details
    fetch(`/api/user/access?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setAccessData(data))
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white safe-area-inset">
      <div className="container-mobile py-4">
        {/* Logout Button - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg transition-colors text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Излез
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/20 rounded-full mb-3">
            <Package className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Благодарим ти за попълнения тест!
          </h1>
          <p className="text-base text-slate-300">
            Твоят персонализиран план е готов
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 mb-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold mb-2">
              За да достъпиш персонализираната програма
            </h2>
            <p className="text-sm text-slate-300">
              Необходимо е да закупиш <span className="text-amber-500 font-semibold">TestoUp</span>
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Персонализиран 30-дневен план</h3>
                <p className="text-xs text-slate-400">
                  Уникална програма базирана на твоите резултати от теста
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Храна, тренировки и сън</h3>
                <p className="text-xs text-slate-400">
                  Детайлен план за хранене, тренировки и възстановяване
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-0.5">TestoUp добавка</h3>
                <p className="text-xs text-slate-400">
                  Научно доказана формула за повишаване на тестостерона
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Достъп до приложението</h3>
                <p className="text-xs text-slate-400">
                  Пълен достъп докато ти траят капсулите
                </p>
              </div>
            </div>
          </div>

          {/* Access Info */}
          {accessData && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 mb-4">
              <h3 className="text-sm font-semibold mb-2">Твой статус:</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 mb-1">Email</p>
                  <p className="font-mono text-white text-xs truncate">{email}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Капсули</p>
                  <p className="text-xl font-bold text-amber-500">
                    {accessData.capsulesRemaining ?? 0}
                  </p>
                </div>
              </div>
              {(accessData.capsulesRemaining ?? 0) > 0 ? (
                <p className="mt-2 text-xs text-amber-400">
                  Имаш капсули! Опресни страницата за достъп.
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  Необходими са капсули за достъп до програмата
                </p>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2.5">
            <a
              href="https://shop.testograph.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Купи TestoUp и получи достъп
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl transition-colors text-xs"
            >
              Опресни страницата (ако вече си закупил)
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-slate-400 px-2">
          <p className="leading-relaxed">
            След покупка от{' '}
            <a
              href="https://shop.testograph.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline"
            >
              shop.testograph.eu
            </a>
            , използвай същия email: <span className="font-mono text-white break-all">{email}</span>
          </p>
          <p className="mt-1.5 leading-relaxed">
            Достъпът се активира автоматично след потвърждение на плащането
          </p>
        </div>
      </div>
    </div>
  )
}
