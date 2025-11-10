import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env.local') })

const API_KEY = process.env.EXERCISEDB_API_KEY
const API_HOST = process.env.EXERCISEDB_API_HOST || 'exercisedb.p.rapidapi.com'

if (!API_KEY) {
  console.error('❌ EXERCISEDB_API_KEY not found in .env.local')
  process.exit(1)
}

// List of missing exercise IDs with their Bulgarian names
const missingExercises = [
  { id: 'walking', name_bg: 'Бърза разходка', search: 'walking' },
  { id: '1jXLYEw', name_bg: 'Стречинг', search: 'stretching' },
  { id: 'lBDjFxJ', name_bg: 'Австралийски лост (тежък)', search: 'inverted row' },
  { id: 'bWlZvXh', name_bg: 'Йога / Разтягане', search: 'yoga stretch' },
  { id: 'eL6Lz0v', name_bg: 'Високи колене', search: 'high knees' },
  { id: 'rjiM4L3', name_bg: 'Ходба (опционално)', search: 'walking' },
  { id: '7zdxRTl', name_bg: 'Лег прес', search: 'leg press' },
  { id: '4IKbhHV', name_bg: 'Лат пулдаун', search: 'lat pulldown' },
  { id: 'rjtuP6X', name_bg: 'Елиптична машина', search: 'elliptical' },
  { id: 'dmgMp3n', name_bg: 'Барбел гребане', search: 'barbell row' },
  { id: '0rHfvy9', name_bg: 'Кабел упражнения (леки)', search: 'cable' },
  { id: 'YUYAMEj', name_bg: 'Фоам ролер', search: 'foam roller' },
  { id: 'W9pFVv1', name_bg: 'Барбел бенч прес', search: 'barbell bench press' },
  { id: '1gFNTZV', name_bg: 'Барбел клекове', search: 'barbell squat' },
  { id: 'iPm26QU', name_bg: 'Скокове на кутия', search: 'box jump' },
  { id: 'UHJlbu3', name_bg: 'Кетълбел суинг (тежък)', search: 'kettlebell swing' },
  { id: 'oHg8eop', name_bg: 'Удари с медицинска топка', search: 'medicine ball slam' },
  { id: 'LIlE5Tn', name_bg: 'Скокови клекове', search: 'jump squat' },
  { id: 'Fey3oVx', name_bg: 'Планински катерач', search: 'mountain climber' },
  { id: 'PM1PZjg', name_bg: 'Скокови напади', search: 'jump lunge' },
  { id: 'UVo2Qs2', name_bg: 'Флътър кикс', search: 'flutter kicks' },
  { id: 'sVvXT5J', name_bg: 'Пайк опори (стръмни)', search: 'pike push up' },
  { id: 'aWedzZX', name_bg: 'Мост на един крак', search: 'single leg bridge' },
  { id: '2ORFMoR', name_bg: 'Изправяне на прасци', search: 'standing calf raise' },
  { id: 'RJa4tCo', name_bg: 'Battle ropes (вълни)', search: 'battle rope' },
  { id: 'yn2lLSI', name_bg: 'Sled push (ако има)', search: 'sled push' },
  { id: 'SGY8Zui', name_bg: 'Барбел клийн', search: 'barbell clean' },
  { id: 'GibBPPg', name_bg: 'Глутеус мост (обем)', search: 'glute bridge' },
  { id: '7aVz15j', name_bg: 'Дипс (напреднал)', search: 'dips' },
  { id: '17lJ1kr', name_bg: 'Лег къръл', search: 'leg curl' },
  { id: 'IeDEXTe', name_bg: 'Прасци на машина', search: 'calf raise machine' },
  { id: 'PQStVXH', name_bg: 'Кабел гребане', search: 'cable row' },
  { id: '5bpPTHv', name_bg: 'Български сплит клекове', search: 'bulgarian split squat' },
  { id: 'GUT8I22', name_bg: 'Мъртва тяга', search: 'deadlift' },
  { id: 'u4bAmKp', name_bg: 'Раменна прес стоеща', search: 'shoulder press' },
  { id: '25GPyDY', name_bg: 'Барбел къръл', search: 'barbell curl' },
  { id: 'my33uHU', name_bg: 'Лег екстеншън', search: 'leg extension' },
  { id: 'ns0SIbU', name_bg: 'Наклонена прес с дъмбели', search: 'incline dumbbell press' },
  { id: 'goJ6ezq', name_bg: 'Странични махове', search: 'lateral raise' },
  { id: 'qRZ5S1N', name_bg: 'Трицепс пушдаун', search: 'tricep pushdown' },
  { id: 'slDvUAU', name_bg: 'Чук къръл', search: 'hammer curl' },
  { id: 'qPEzJjA', name_bg: 'Фермер ход', search: 'farmers walk' },
  { id: 'F7vjXqT', name_bg: 'Наклонени опори (ръце на повдигната повърхност)', search: 'incline push up' },
  { id: 'bKWbrTA', name_bg: 'Гребане с кърпа (едноръчно)', search: 'towel row' },
  { id: '4GqRrAk', name_bg: 'Супермен (темпо)', search: 'superman' },
  { id: 'FVmZVhk', name_bg: 'Кабел флай', search: 'cable fly' },
  { id: '5uFK1xr', name_bg: 'Френска прес', search: 'french press' },
  { id: '7vG5o25', name_bg: 'Едноръчно гребане с дъмбел', search: 'dumbbell row' },
  { id: 'G61cXLk', name_bg: 'Фейс пул', search: 'face pull' },
  { id: 'bZGHsAZ', name_bg: 'Австралийски лост (маса)', search: 'inverted row' },
  { id: 'XUUD0Fs', name_bg: 'Разперки за задни рамене', search: 'rear delt fly' },
  { id: 'XooAdhl', name_bg: 'Handstand hold (на стена)', search: 'handstand' },
  { id: 'KhHJ338', name_bg: 'Странично ходене в планк', search: 'plank walk' },
  { id: 'uTBt1HV', name_bg: 'Скапуларни лицеви опори', search: 'scapular push up' },
  { id: 'T2mxWqc', name_bg: 'Негативи на лост (бицепс)', search: 'negative pull up' },
  { id: 'Hgs6Nl1', name_bg: 'Вдигане на крака', search: 'leg raise' },
  { id: 'yaMIo4D', name_bg: 'Наклонена лежанка с дъмбели', search: 'incline dumbbell bench' },
  { id: 'K5TldTr', name_bg: 'Разперки с дъмбели', search: 'dumbbell fly' },
  { id: 'j7XMAyn', name_bg: 'Кръстосани изтегляния на кабели', search: 'cable crossover' },
  { id: 'dU605di', name_bg: 'Пушдаун с въже', search: 'rope pushdown' },
  { id: 'Qqi7bko', name_bg: 'Лост широк захват', search: 'wide grip pull up' },
  { id: 'fUBheHs', name_bg: 'Гребане на кабел седнал', search: 'seated cable row' },
  { id: 'W74bXnw', name_bg: 'Къдрене с дъмбели на пейка', search: 'incline dumbbell curl' },
  { id: 'TFA88iB', name_bg: 'Предни махове', search: 'front raise' },
  { id: 'trmte8s', name_bg: 'Свиване на рамене', search: 'shrug' },
  { id: 'I3tsCnC', name_bg: 'Повдигане на крака на лост', search: 'hanging leg raise' },
  { id: 'XVDdcoj', name_bg: 'Руски завъртания', search: 'russian twist' },
  { id: 'q2ADGqV', name_bg: 'Кабел коремни', search: 'cable crunch' },
  { id: 'AQ0mC4Y', name_bg: 'Странични махове (бутилки)', search: 'lateral raise bottle' },
  { id: 'yz9nUhF', name_bg: 'Дъмбел флай', search: 'dumbbell fly' },
  { id: 'WcHl7ru', name_bg: 'Тесен хват бенч', search: 'close grip bench' },
  { id: 'b6hQYMb', name_bg: 'Прийчър къръл', search: 'preacher curl' },
  { id: 'qAmNMJY', name_bg: 'Дъмбел къръл', search: 'dumbbell curl' },
]

// Helper to download file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }

      response.pipe(file)

      file.on('finish', () => {
        file.close()
        resolve()
      })

      file.on('error', (err) => {
        fs.unlink(filepath, () => {})
        reject(err)
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

// Search exercise by name
async function searchExercise(searchTerm) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: API_HOST,
      port: null,
      path: `/exercises/name/${encodeURIComponent(searchTerm)}?limit=1&offset=0`,
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.end()
  })
}

// Main function
async function downloadMissingGifs() {
  const exercisesDir = path.join(projectRoot, 'public', 'exercises')

  // Create directory if it doesn't exist
  if (!fs.existsSync(exercisesDir)) {
    fs.mkdirSync(exercisesDir, { recursive: true })
  }

  console.log(`\n🚀 Starting download of ${missingExercises.length} missing GIF animations...\n`)

  let successCount = 0
  let failCount = 0
  const failed = []

  for (const exercise of missingExercises) {
    const gifPath = path.join(exercisesDir, `${exercise.id}.gif`)

    // Skip if already exists
    if (fs.existsSync(gifPath)) {
      console.log(`⏭️  ${exercise.id} - Already exists, skipping`)
      successCount++
      continue
    }

    try {
      console.log(`🔍 Searching: ${exercise.name_bg} (${exercise.search})...`)

      // Search for exercise
      const results = await searchExercise(exercise.search)

      if (!results || results.length === 0) {
        console.log(`❌ ${exercise.id} - No results found`)
        failCount++
        failed.push(exercise)
        continue
      }

      const foundExercise = results[0]
      const gifUrl = foundExercise.gifUrl

      if (!gifUrl) {
        console.log(`❌ ${exercise.id} - No GIF URL in response`)
        failCount++
        failed.push(exercise)
        continue
      }

      console.log(`📥 Downloading: ${gifUrl}`)
      await downloadFile(gifUrl, gifPath)

      console.log(`✅ ${exercise.id} - Downloaded successfully\n`)
      successCount++

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.log(`❌ ${exercise.id} - Error: ${error.message}\n`)
      failCount++
      failed.push(exercise)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Download Summary:')
  console.log('='.repeat(60))
  console.log(`✅ Successfully downloaded: ${successCount}/${missingExercises.length}`)
  console.log(`❌ Failed: ${failCount}/${missingExercises.length}`)

  if (failed.length > 0) {
    console.log('\n❌ Failed exercises:')
    failed.forEach((ex) => {
      console.log(`  • ${ex.id} - ${ex.name_bg}`)
    })
  }
}

downloadMissingGifs().catch(console.error)
