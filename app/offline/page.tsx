'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-muted/30">
            <WifiOff className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Няма интернет връзка</h1>
          <p className="text-muted-foreground">
            Изглежда нямаш достъп до интернет. Провери връзката си и опитай отново.
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Опитай отново
        </button>

        {/* Info */}
        <div className="text-left bg-background rounded-lg p-4 border border-border space-y-2">
          <p className="text-sm font-medium">Докато чакаш:</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Провери дали WiFi или мобилните данни са включени</li>
            <li>Провери дали си в самолетен режим</li>
            <li>Опитай да се свържеш с друга мрежа</li>
          </ul>
        </div>

        {/* Cached Data Note */}
        <p className="text-xs text-muted-foreground">
          Някои данни може да са налични offline, ако са били кеширани преди това.
        </p>
      </div>
    </div>
  )
}
