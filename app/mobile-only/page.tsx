import { Smartphone } from 'lucide-react'
import QRCode from 'react-qr-code'

export default function MobileOnlyPage() {
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
        <div className="space-y-4 text-left bg-white rounded-lg p-6 shadow-sm border border-border">
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
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">
              Сканирай с камерата на телефона
            </p>
          </div>
          <QRCode
            value="https://app.testograph.eu/"
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox={`0 0 256 256`}
          />
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          Минималната поддържана ширина на екрана е 320px
        </p>
      </div>
    </div>
  )
}
