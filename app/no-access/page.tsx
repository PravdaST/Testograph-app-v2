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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Logout Button - Top Right */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Излез
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/20 rounded-full mb-6">
              <Package className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Благодарим ти за попълнения тест!
            </h1>
            <p className="text-xl text-slate-300">
              Твоят персонализиран план е готов
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                За да достъпиш персонализираната програма
              </h2>
              <p className="text-lg text-slate-300">
                Необходимо е да закупиш <span className="text-amber-500 font-semibold">TestoUp</span>
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Персонализиран 30-дневен план</h3>
                  <p className="text-slate-400">
                    Уникална програма базирана на твоите резултати от теста
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Храна, тренировки и сън</h3>
                  <p className="text-slate-400">
                    Детайлен план за хранене, тренировки и възстановяване
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">TestoUp добавка</h3>
                  <p className="text-slate-400">
                    Научно доказана формула за повишаване на тестостерона
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Достъп до приложението</h3>
                  <p className="text-slate-400">
                    Пълен достъп докато ти траят капсулите
                  </p>
                </div>
              </div>
            </div>

            {/* Access Info */}
            {accessData && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-8">
                <h3 className="font-semibold mb-3">Твой статус:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Email</p>
                    <p className="font-mono text-white">{email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Капсули</p>
                    <p className="text-2xl font-bold text-amber-500">
                      {accessData.capsulesRemaining ?? 0}
                    </p>
                  </div>
                </div>
                {(accessData.capsulesRemaining ?? 0) > 0 ? (
                  <p className="mt-4 text-sm text-amber-400">
                    Имаш капсули! Опресни страницата за достъп.
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">
                    Необходими са капсули за достъп до програмата
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4">
              <a
                href="https://shop.testograph.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Купи TestoUp и получи достъп
                <ArrowRight className="w-5 h-5" />
              </a>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors"
              >
                Опресни страницата (ако вече си закупил)
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-slate-400">
            <p>
              След покупка от{' '}
              <a
                href="https://shop.testograph.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline"
              >
                shop.testograph.eu
              </a>
              , използвай същия email: <span className="font-mono text-white">{email}</span>
            </p>
            <p className="mt-2">
              Достъпът се активира автоматично след потвърждение на плащането
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
