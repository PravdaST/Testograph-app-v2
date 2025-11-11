import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get all workout files
const dataDir = path.join(__dirname, '..', 'lib', 'data')
const workoutFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('mock-workouts') && f.endsWith('.ts'))

// Collect all exercises with their details
const exercisesMap = new Map()

for (const file of workoutFiles) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')

  // Extract exercises using regex
  const exercisePattern = /{\s*exercisedb_id:\s*'([^']+)',\s*name_bg:\s*'([^']+)',\s*name_en:\s*'([^']+)'/g

  let match
  while ((match = exercisePattern.exec(content)) !== null) {
    const [, id, nameBg, nameEn] = match

    if (!exercisesMap.has(id)) {
      exercisesMap.set(id, {
        id,
        nameBg,
        nameEn,
        gifExists: fs.existsSync(path.join(__dirname, '..', 'public', 'exercises', `${id}.gif`))
      })
    }
  }
}

// Sort exercises by ID
const exercises = Array.from(exercisesMap.values()).sort((a, b) => a.id.localeCompare(b.id))

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Проверка на всички упражнения - Testograph</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }

    h1 {
      text-align: center;
      margin-bottom: 10px;
      color: #333;
    }

    .summary {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .summary h2 {
      color: #2563eb;
      margin-bottom: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .exercise-number {
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }

    .exercise-info {
      flex: 1;
    }

    .exercise-name-bg {
      font-size: 18px;
      font-weight: bold;
      color: #111;
      margin-bottom: 4px;
    }

    .exercise-name-en {
      font-size: 14px;
      color: #666;
    }

    .exercise-id {
      font-size: 12px;
      color: #999;
      font-family: 'Courier New', monospace;
      margin-top: 4px;
    }

    .gif-container {
      width: 100%;
      aspect-ratio: 1;
      background: #f9fafb;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #e5e7eb;
    }

    .gif-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .gif-missing {
      background: #fee;
      border-color: #f87171;
    }

    .missing-text {
      color: #dc2626;
      font-size: 14px;
      text-align: center;
      padding: 20px;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }

    .status-ok {
      background: #dcfce7;
      color: #166534;
    }

    .status-missing {
      background: #fee2e2;
      color: #991b1b;
    }

    .instructions {
      max-width: 1400px;
      margin: 0 auto 30px;
      padding: 20px;
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 12px;
    }

    .instructions h3 {
      color: #856404;
      margin-bottom: 10px;
    }

    .instructions p {
      color: #856404;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>🏋️ Проверка на всички упражнения</h1>

  <div class="summary">
    <h2>Общо: ${exercises.length} упражнения</h2>
    <p>✅ С GIF: ${exercises.filter(e => e.gifExists).length} | ❌ Липсващи: ${exercises.filter(e => !e.gifExists).length}</p>
  </div>

  <div class="instructions">
    <h3>📋 Инструкции за проверка:</h3>
    <p>
      Прегледай всяко упражнение и провери дали GIF анимацията съответства на името и описанието на упражнението.
      Обърни внимание дали движенията са правилни и дали използва правилния инвентар (дъмбели, тяло, машини и т.н.).
    </p>
  </div>

  <div class="grid">
${exercises.map((ex, index) => `
    <div class="card">
      <div class="card-header">
        <div class="exercise-number">${index + 1}</div>
        <div class="exercise-info">
          <div class="exercise-name-bg">${ex.nameBg}</div>
          <div class="exercise-name-en">${ex.nameEn}</div>
          <div class="exercise-id">ID: ${ex.id}</div>
          <div class="status-badge ${ex.gifExists ? 'status-ok' : 'status-missing'}">
            ${ex.gifExists ? '✅ GIF наличен' : '❌ GIF липсва'}
          </div>
        </div>
      </div>

      <div class="gif-container ${!ex.gifExists ? 'gif-missing' : ''}">
        ${ex.gifExists
          ? `<img src="/exercises/${ex.id}.gif" alt="${ex.nameBg}" loading="lazy">`
          : `<div class="missing-text">GIF файлът липсва</div>`
        }
      </div>
    </div>
`).join('\n')}
  </div>
</body>
</html>`

// Write HTML file
const outputPath = path.join(__dirname, '..', 'public', 'exercise-verification.html')
fs.writeFileSync(outputPath, html, 'utf-8')

console.log(`\n✅ Генерирана страница за проверка: ${outputPath}`)
console.log(`\n📊 Статистика:`)
console.log(`   Общо упражнения: ${exercises.length}`)
console.log(`   С GIF: ${exercises.filter(e => e.gifExists).length}`)
console.log(`   Липсващи GIF: ${exercises.filter(e => !e.gifExists).length}`)
console.log(`\n🌐 Отвори в браузър: http://localhost:3002/exercise-verification.html`)
