'use client'

import { Smartphone, Monitor } from 'lucide-react'
import { useRouter } from 'next/navigation'
import QRCode from 'react-qr-code'

export default function MobileOnlyPage() {
  const router = useRouter()

  const handleContinueOnDesktop = () => {
    // Set flag to allow desktop access
    localStorage.setItem('allowDesktop', 'true')

    // Check if user is logged in
    const quizEmail = localStorage.getItem('quizEmail')
    if (quizEmail) {
      router.push('/app')
    } else {
      router.push('/quiz')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-primary/5 border-2 border-primary/10">
            <Smartphone className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">
            Отвори на телефон
          </h1>
          <p className="text-lg text-muted-foreground">
            Testograph е оптимизиран за мобилни устройства
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 text-left bg-background rounded-lg p-6 shadow-sm border border-border">
          <div className="space-y-2">
            <h2 className="font-semibold text-sm text-primary">
              За да използваш приложението:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Отвори този линк на твоя смартфон</li>
              <li>Добави приложението към началния екран</li>
              <li>Започни своя 30-дневен план</li>
            </ol>
          </div>
        </div>

        {/* QR Code */}
        <div className="p-6 bg-background rounded-lg shadow-lg border border-border">
          <div className="mb-3">
            <p className="text-sm font-semibold">
              Сканирай с камерата на телефона
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              value="https://app.testograph.eu/"
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>

        {/* Desktop Continue Button */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={handleContinueOnDesktop}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors group"
          >
            <Monitor className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Продължи на Desktop въпреки това
            </span>
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Някои функции може да не работят оптимално
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          Минималната поддържана ширина на екрана е 320px
        </p>
      </div>
    </div>
  )
}
