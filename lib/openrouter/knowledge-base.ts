/**
 * Testograph Knowledge Base - Articles from testograph.eu/learn
 *
 * Used by AI Coach to provide relevant article recommendations
 */

export interface Article {
  title: string
  url: string
  category: string
  description: string
  keywords: string[]
}

export const ARTICLES: Article[] = [
  // === ХРАНЕНЕ (Nutrition) ===
  {
    title: 'Витамини за мъжко здраве',
    url: 'https://testograph.eu/learn/nutrition/vitamini-za-muzko-zdrave',
    category: 'Хранене',
    description: 'Пълно ръководство за витамините, които са от решаващо значение за мъжкото здраве, енергия и хормонален баланс.',
    keywords: ['витамини', 'витамин D', 'цинк', 'магнезий', 'здраве', 'хормони'],
  },
  {
    title: 'Хранителен режим за повишаване на тестостерона',
    url: 'https://testograph.eu/learn/nutrition/hranitelen-rezhim-povishavane-testosteron',
    category: 'Хранене',
    description: 'Оптимизирането на тестостерона чрез храна - правилните градивни елементи и избягване на хормоналните нарушители.',
    keywords: ['хранене', 'диета', 'тестостерон', 'храни', 'режим'],
  },
  {
    title: 'Здравословни мазнини и тестостерон',
    url: 'https://testograph.eu/learn/nutrition/zdravoslovni-maznini-testosteron',
    category: 'Хранене',
    description: 'Мазнините като основен съюзник за производството на тестостерон. Холестеролът и хормоналното производство.',
    keywords: ['мазнини', 'холестерол', 'омега-3', 'здравословни мазнини', 'тестостерон'],
  },
  {
    title: 'Хранене за мъже: Макроси, микроси и храни за тестостерон',
    url: 'https://testograph.eu/learn/nutrition/hranene-za-mazhe-makrosi-mikrosi-testosteron',
    category: 'Хранене',
    description: 'Баланс на макронутриентите - протеини, мазнини и въглехидрати за оптимално мъжко здраве.',
    keywords: ['макроси', 'протеини', 'въглехидрати', 'микроелементи', 'хранене'],
  },

  // === ДОБАВКИ (Supplements) ===
  {
    title: 'Цинк за тестостерон',
    url: 'https://testograph.eu/learn/supplements/tsink-za-testosteron',
    category: 'Добавки',
    description: 'Цинкът е незаменим минерал за мъжкото здраве и оптималното производство на тестостерон.',
    keywords: ['цинк', 'минерали', 'добавки', 'тестостерон', 'дефицит'],
  },
  {
    title: 'Трибулус терестрис',
    url: 'https://testograph.eu/learn/supplements/tribulus-terrestris-polzi-upotreba',
    category: 'Добавки',
    description: 'Научен анализ на Трибулус Терестрис - митове и реалност за тестостерон бустера.',
    keywords: ['трибулус', 'билки', 'добавки', 'либидо', 'тестостерон бустер'],
  },
  {
    title: 'Ашваганда за мъже',
    url: 'https://testograph.eu/learn/supplements/ashwagandha-za-mazhe',
    category: 'Добавки',
    description: 'Ашваганда - мощна адаптогенна билка с хилядолетна история за стрес и хормонален баланс.',
    keywords: ['ашваганда', 'адаптоген', 'стрес', 'кортизол', 'добавки'],
  },
  {
    title: 'TestoUP: Съставки, действие и ползи',
    url: 'https://testograph.eu/learn/supplements/testoup-sustavki-deystvie-polzi',
    category: 'Добавки',
    description: 'Цялостна синергична формула за подкрепа на естественото производство на тестостерон.',
    keywords: ['TestoUP', 'добавка', 'съставки', 'формула', 'тестостерон'],
  },

  // === ПОТЕНЦИЯ (Potency) ===
  {
    title: 'Психологически фактори при еректилната дисфункция',
    url: 'https://testograph.eu/learn/potency/psihologicheski-faktori-erektilna-disfunktsiya',
    category: 'Потенция',
    description: 'Еректилната дисфункция и психологическият компонент - умът като най-важен сексуален орган.',
    keywords: ['психология', 'ерекция', 'стрес', 'тревожност', 'ЕД'],
  },
  {
    title: 'Сексуално здраве за съвременния мъж',
    url: 'https://testograph.eu/learn/potency/seksualno-zdrave-mazhe-potency',
    category: 'Потенция',
    description: 'Сексуалното здраве като огледало на общото здраве - ранни сигнали и превенция.',
    keywords: ['сексуално здраве', 'потенция', 'либидо', 'мъжко здраве'],
  },
  {
    title: 'Причини за еректилна дисфункция',
    url: 'https://testograph.eu/learn/potency/prichini-za-erektilna-disfunktsiya',
    category: 'Потенция',
    description: 'Еректилната дисфункция като ранен предупредителен знак за системни заболявания.',
    keywords: ['еректилна дисфункция', 'причини', 'здраве', 'сърце'],
  },
  {
    title: 'Мъжка потентност и либидо: Ръководство за сексуално здраве',
    url: 'https://testograph.eu/learn/potency/mazhka-potentnost-libido-seksualno-zdrave',
    category: 'Потенция',
    description: 'Потентността като барометър за здравето - грижа за сърдечно-съдовата система.',
    keywords: ['потентност', 'либидо', 'ерекция', 'сексуално здраве'],
  },

  // === ТЕСТОСТЕРОН (Testosterone) ===
  {
    title: 'Естествени начини за повишаване на тестостерона',
    url: 'https://testograph.eu/learn/testosterone/estestveni-nachini-povishavane-testosteron',
    category: 'Тестостерон',
    description: 'Оптимизиране на тестостерона чрез здравословен начин на живот - маратон, не спринт.',
    keywords: ['естествено', 'повишаване', 'тестостерон', 'lifestyle', 'здраве'],
  },
  {
    title: 'Храни, които повишават тестостерона',
    url: 'https://testograph.eu/learn/testosterone/hrani-povishava-testosterona',
    category: 'Тестостерон',
    description: 'Диетата като мощен инструмент - цели, необработени храни за оптимален тестостерон.',
    keywords: ['храни', 'тестостерон', 'диета', 'хранене', 'повишаване'],
  },
  {
    title: 'Тренировки за повишаване на тестостерона',
    url: 'https://testograph.eu/learn/testosterone/trenirovki-za-povisavane-na-testosterona',
    category: 'Тестостерон',
    description: 'Пълно ръководство за оптимизиране на тренировките за естествено повишаване на тестостерона.',
    keywords: ['тренировки', 'упражнения', 'тестостерон', 'фитнес', 'сила'],
  },
  {
    title: 'Симптоми на нисък тестостерон',
    url: 'https://testograph.eu/learn/testosterone/simptomi-nisuk-testosteron',
    category: 'Тестостерон',
    description: 'Хипогонадизъм - разпознаване на симптомите и първи стъпки към възстановяване.',
    keywords: ['симптоми', 'нисък тестостерон', 'хипогонадизъм', 'признаци'],
  },
  {
    title: 'Какво е тестостерон и как работи',
    url: 'https://testograph.eu/learn/testosterone/kakvo-e-testosteron-i-kak-raboti',
    category: 'Тестостерон',
    description: 'Тестостеронът като основен мъжки полов хормон - синтез от холестерол и функции.',
    keywords: ['тестостерон', 'хормон', 'андроген', 'функции', 'основи'],
  },
  {
    title: 'Тестостерон - Пълно ръководство за мъже',
    url: 'https://testograph.eu/learn/testosterone/testosteron-guide-za-mizhe',
    category: 'Тестостерон',
    description: 'Тестостеронът влияе на енергията, настроението, когнитивните функции и качеството на живот.',
    keywords: ['тестостерон', 'ръководство', 'мъже', 'здраве', 'енергия'],
  },

  // === ФИТНЕС (Fitness) ===
  {
    title: 'Тренировъчна програма за начинаещи',
    url: 'https://testograph.eu/learn/fitness/trenirovcna-programa-za-nachinaeshti',
    category: 'Фитнес',
    description: 'Пълно ръководство за мъже, които започват със силовите тренировки.',
    keywords: ['начинаещи', 'програма', 'тренировки', 'фитнес', 'сила'],
  },
  {
    title: 'Тренировъчна програма за напреднали',
    url: 'https://testograph.eu/learn/fitness/trenirovcna-programma-za-naprednali',
    category: 'Фитнес',
    description: 'Ръководство за напреднали атлети, които са достигнали тренировъчно плато.',
    keywords: ['напреднали', 'програма', 'плато', 'прогрес', 'тренировки'],
  },
  {
    title: 'Силови Тренировки за Мъже: Изгради тяло и повиши тестостерона',
    url: 'https://testograph.eu/learn/fitness/silovi-trenirovki-mazhe-testosteron',
    category: 'Фитнес',
    description: 'Силовите тренировки като най-ефективен метод за мускулна маса и тестостерон.',
    keywords: ['силови', 'тренировки', 'мускули', 'тестостерон', 'метаболизъм'],
  },

  // === НАЧИН НА ЖИВОТ (Lifestyle) ===
  {
    title: 'Тютюнопушене и мъжко здраве',
    url: 'https://testograph.eu/learn/lifestyle/tyutyunopushene-mazko-zdrave',
    category: 'Начин на живот',
    description: 'Тютюнопушенето като директна атака срещу мъжката виталност - над 7000 химикала.',
    keywords: ['тютюнопушене', 'цигари', 'здраве', 'вреди', 'отказване'],
  },
  {
    title: 'Сън и тестостерон',
    url: 'https://testograph.eu/learn/lifestyle/san-i-testosteron-vliyanie-na-sunia',
    category: 'Начин на живот',
    description: 'Сънят като най-важен фактор за производството на тестостерон - 7-9 часа са критични.',
    keywords: ['сън', 'тестостерон', 'възстановяване', 'хормони', 'качество'],
  },
  {
    title: 'Алкохол и тестостерон',
    url: 'https://testograph.eu/learn/lifestyle/alkohol-i-testosteron-vliyanie-vyrhu-mazkoto-zdrave',
    category: 'Начин на живот',
    description: 'Хроничната консумация на алкохол понижава тестостерона чрез токсичност върху Лайдиговите клетки.',
    keywords: ['алкохол', 'тестостерон', 'вреди', 'черен дроб', 'хормони'],
  },
  {
    title: 'Стресът като враг №1 на мъжкото здраве',
    url: 'https://testograph.eu/learn/lifestyle/stresat-mazko-zdrave',
    category: 'Начин на живот',
    description: 'Хроничният стрес и кортизолът директно потискат производството на тестостерон.',
    keywords: ['стрес', 'кортизол', 'хормони', 'баланс', 'релаксация'],
  },
]

/**
 * Find relevant articles based on user query keywords
 */
export function findRelevantArticles(query: string, maxResults: number = 3): Article[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)

  // Score each article based on keyword matches
  const scored = ARTICLES.map((article) => {
    let score = 0

    // Check title match (high weight)
    if (article.title.toLowerCase().includes(queryLower)) {
      score += 10
    }

    // Check category match
    if (article.category.toLowerCase().includes(queryLower)) {
      score += 5
    }

    // Check description match
    if (article.description.toLowerCase().includes(queryLower)) {
      score += 3
    }

    // Check keyword matches
    for (const keyword of article.keywords) {
      for (const word of queryWords) {
        if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
          score += 2
        }
      }
    }

    // Check individual word matches in title
    for (const word of queryWords) {
      if (word.length > 2 && article.title.toLowerCase().includes(word)) {
        score += 1
      }
    }

    return { article, score }
  })

  // Sort by score and return top results
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.article)
}

/**
 * Format articles for AI context
 */
export function formatArticlesForContext(articles: Article[]): string {
  if (articles.length === 0) return ''

  return articles
    .map(
      (a) =>
        `- "${a.title}" (${a.category}): ${a.url}`
    )
    .join('\n')
}

/**
 * Build knowledge base section for system prompt
 */
export function buildKnowledgeBasePrompt(): string {
  const categories = [...new Set(ARTICLES.map((a) => a.category))]

  let prompt = `\nНАУЧЕН ЦЕНТЪР - НАЛИЧНИ СТАТИИ (testograph.eu/learn):\n`
  prompt += `Използвай тези линкове когато отговаряш на въпроси. Препоръчвай релевантни статии на потребителя.\n\n`

  for (const category of categories) {
    const categoryArticles = ARTICLES.filter((a) => a.category === category)
    prompt += `${category}:\n`
    for (const article of categoryArticles) {
      prompt += `  - ${article.title}: ${article.url}\n`
    }
    prompt += '\n'
  }

  prompt += `ПРАВИЛО: Когато отговаряш на въпрос, ВИНАГИ препоръчвай поне 1 релевантна статия с пълен линк.\n`
  prompt += `Формат: "Прочети повече тук: [заглавие](линк)"\n`

  return prompt
}
