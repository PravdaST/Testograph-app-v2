import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Testograph - Персонализиран план за тестостерон',
    short_name: 'Testograph',
    description: 'Персонализирана 30-дневна програма за повишаване на тестостерона с храна, тренировки и TestoUp добавка',
    start_url: '/app',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#667eea',
    orientation: 'portrait',
    icons: [
      {
        src: '/testograph-logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
}
