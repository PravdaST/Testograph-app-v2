'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Check, ChevronDown, ChevronRight, Shield, Truck, Package, Award, Clock, Heart, Zap, Dumbbell, Brain, Smartphone, Sparkles, UtensilsCrossed, TrendingUp, Target } from 'lucide-react'

// Checkout URL with discount code
const CHECKOUT_URL = 'https://shop.testograph.eu/checkouts/cn/hWN5mYLrYhkHrMjP1upLxFD9/bg-bg?discount=QuizzOff38'

// Product images
const productImages = [
  'https://shop.testograph.eu/cdn/shop/files/testoup-1.webp?v=1731075648&width=800',
  'https://shop.testograph.eu/cdn/shop/files/testoup-2.webp?v=1731075648&width=800',
  'https://shop.testograph.eu/cdn/shop/files/testoup-3.webp?v=1731075648&width=800',
]

// Reviews data
const reviews = [
  {
    name: 'Стефан П.',
    text: 'Либидото ми не е било толкова високо, пак се чувствам жив.',
    image: 'https://shop.testograph.eu/cdn/shop/files/testoup-review-3.webp?v=1731075648&width=200',
  },
  {
    name: 'Ивайло Г.',
    text: 'Тренирам по-дълго, възстановявам се по-бързо, и държа повече ;).',
    image: 'https://shop.testograph.eu/cdn/shop/files/testoup-review-2.webp?v=1731075648&width=200',
  },
  {
    name: 'Богдан К.',
    text: 'Фокус, енергия и мотивация - TestoUP промени играта.',
    image: 'https://shop.testograph.eu/cdn/shop/files/testoup-review-1.webp?v=1731075648&width=200',
  },
]

// Extended reviews for carousel - with photos from Shopify CDN
const extendedReviews = [
  { name: 'Радо', age: 36, text: 'Отлагах да се видя с приятели, бях постоянно изморен. Сега аз им звъня.', image: 'https://shop.testograph.eu/cdn/shop/files/6.webp?v=1761478631&width=400' },
  { name: 'Никола', age: 33, text: 'Не съм спортист. Но не исках да се чувствам на 50, като съм на 33. Сега пак имам заряд!', image: 'https://shop.testograph.eu/cdn/shop/files/8.webp?v=1761478632&width=400' },
  { name: 'Калоян', age: 32, text: 'Преди ми трябваше половин час да се навия да започна. Сега просто тренирам и ми върви.', image: 'https://shop.testograph.eu/cdn/shop/files/5_0660ffce-4d57-4ff9-997e-999ac9cb8145.webp?v=1761478626&width=400' },
  { name: 'Николай', age: 35, text: 'Чувствам се по-жив, имам сила и с желание започнах да ходя в залата.', image: 'https://shop.testograph.eu/cdn/shop/files/Gemini_Generated_Image_rk0rjmrk0rjmrk0r-vmake.webp?v=1761240973&width=400' },
  { name: 'Петър', age: 25, text: 'При мен след втората седмица възстановяването ми стана нереално бързо.', image: 'https://shop.testograph.eu/cdn/shop/files/start-before-after-2.webp?v=1761478628&width=400' },
  { name: 'Стоил', age: 22, text: 'Върнах си отново фокуса, либидото и увереността в залата.', image: 'https://shop.testograph.eu/cdn/shop/files/photo_2025-10-19_17-20-42.webp?v=1761478633&width=400' },
  { name: 'Владо', age: 40, text: 'Сутрин гледах кафето пет минути преди да го пия. Сега го пия, обличам се и тръгвам – без да се моля да дойде уикенда по-бързо.', image: 'https://shop.testograph.eu/cdn/shop/files/3_9aa1b6c8-35c4-4bb3-8f0c-baf3449fda22.webp?v=1761478625&width=400' },
  { name: 'Иван', age: 28, text: 'В залата давах всичко, ама после бях труп. С TestoUP се чувствам по-нормално — възстановявам се по-бързо и ми се тренира пак.', image: 'https://shop.testograph.eu/cdn/shop/files/1_5baa1c8c-4b91-49d9-9bdb-c777acbd29ed.webp?v=1761478621&width=400' },
  { name: 'Стефан', age: 36, text: 'Винаги съм бил редовен във фитнеса, но последната година — все едно беше на празно. Сега пак усещам онова „искам да тренирам"!', image: 'https://shop.testograph.eu/cdn/shop/files/2_5e8d0ee7-7565-40cc-9cfa-8adab0bb21e6.webp?v=1761478623&width=400' },
  { name: 'Петър', age: 37, text: 'До скоро след работа само се пльосвах на дивана. Нито децата, нито жената – нищо не ми се правеше. Сега най-накрая живнах, можело!', image: 'https://shop.testograph.eu/cdn/shop/files/1_02c68b6b-a2e5-424c-b0d3-5b15da3f56fc.webp?v=1761478620&width=400' },
  { name: 'Стефан', age: 30, text: 'За всяка тренировка трябваше да се навивам. Сега не мисля, просто ми се тренира. Тялото ми вече не се влачи!', image: 'https://shop.testograph.eu/cdn/shop/files/5.webp?v=1761478627&width=400' },
  { name: 'Алекс', age: 34, text: 'След обяд в офиса ми спираше токът... Сега поне не се чудя как да не заспя на бюрото.', image: 'https://shop.testograph.eu/cdn/shop/files/7.webp?v=1761478629&width=400' },
]

// Ingredients
const ingredients = [
  { name: 'Витамин D', dose: '60 мкг (2400 IU)' },
  { name: 'Витамин E', dose: '300 мг (444 IU)' },
  { name: 'Витамин C', dose: '200 мг' },
  { name: 'Цинков цитрат', dose: '30 мг' },
  { name: 'Магнезиев бисглицинат', dose: '400 мг' },
  { name: 'K2 - MK7', dose: '200 мкг' },
  { name: 'Витамин B6', dose: '10 мг' },
  { name: 'Витамин B12', dose: '600 мкг' },
  { name: 'Витамин B9', dose: '400 мкг' },
  { name: 'Ашваганда', dose: '400 мг' },
  { name: 'Трибулус', dose: '600 мг' },
  { name: 'Селенометионин', dose: '200 мкг' },
]

// FAQs
const faqs = [
  { q: 'Пие ли се по определен начин?', a: 'Приемай 2 капсули сутрин с храна. Най-добре с протеинова закуска - мазнините подпомагат усвояването. Избягвай прием на гладно.' },
  { q: 'Има ли странични ефекти?', a: 'Не. При правилен прием и спазване на програмата, TestoUP няма странични ефекти. Препоръчителната доза е 2 капсули дневно.' },
  { q: 'Ще повлияе ли на либидото и ерекцията?', a: 'Да. Трибулусът и цинкът подпомагат естественото производство на тестостерон, което подобрява желанието, ерекцията и самочувствието.' },
  { q: 'Трябва ли да ходя на фитнес докато я пия?', a: 'Не е важно къде тренираш. Важното е да тренираш 3-4 пъти седмично с прогресивно натоварване. Без тренировки ефектът няма как да е същия.' },
  { q: 'Какво ако не подейства?', a: 'Ако след 30 дни, спазвайки на 100% програмата, не усетиш промяна, връщаме ти парите - толкова сме уверени във формулата си.' },
]

// Additional Judge.me reviews
const judgeMeReviews = [
  { name: 'DobromirM', date: '11/27/2025', text: 'Продукта номер едно за повишаване на естествения тестостерон!', hasPhoto: false },
  { name: 'Georgey', date: '10/27/2025', text: 'Тва да ви кажа наистина помага - спермата ми се покачи значително, жената е доволна', hasPhoto: true, photo: 'https://judgeme.imgix.net/testograph/1761554571__generatedimageoctober272025-10_30am__original.png?auto=format&w=100' },
  { name: 'Tomi', date: '10/26/2025', text: 'край това е, това ще вземема вече цял живот май... направо нямам думи, за пръв път нещо да ми действа така добре, направо все едно ми се върна желаниято от като бях на 20, не е реално обаче е!', hasPhoto: true, photo: 'https://judgeme.imgix.net/testograph/1761485665__generatedimageoctober262025-2_40pm__original.png?auto=format&w=100' },
  { name: 'Петър', date: '10/26/2025', text: 'Много добре действа на ден 3 съм в момента още от първия ден някакво зверско желания да награбя някоя... в случая награбих жена ми, защото не съм беладжия ама да, това си е наистина топ!', hasPhoto: true, photo: 'https://judgeme.imgix.net/testograph/1761485482__generatedimageoctober262025-2_32pm__original.png?auto=format&w=100' },
  { name: 'Илян', date: '10/26/2025', text: 'Това е супер, не само продукта ами и цялото това дето го давата като програма, доста е добре лесно я следвам и имам напредък направо много ме кефи за пръв път да оставя мнение на някой шоп...', hasPhoto: true, photo: 'https://judgeme.imgix.net/testograph/1761485310__generatedimageoctober262025-2_33pm__original.png?auto=format&w=100' },
  { name: 'Мартин К.', date: '10/25/2025', text: 'Взех да пробвам защото приятел ми го препоръча. След 2 седмици вече усещам разлика в енергията сутрин.', hasPhoto: false },
  { name: 'Димитър С.', date: '10/24/2025', text: 'На 42 съм и последните години бях някак отпаднал. TestoUP ме върна в играта, жената забеляза първа.', hasPhoto: false },
  { name: 'Красимир П.', date: '10/23/2025', text: 'Скептик бях, но резултатите говорят. По-добър сън, повече енергия и желание за тренировки.', hasPhoto: false },
  { name: 'Борислав Н.', date: '10/22/2025', text: 'Тренирам от 10 години и това е първата добавка която реално усещам че работи за възстановяването.', hasPhoto: false },
  { name: 'Атанас В.', date: '10/21/2025', text: 'Най-накрая нещо което не е измама. Усещам се по-силен в залата и имам повече издръжливост.', hasPhoto: false },
  { name: 'Виктор Д.', date: '10/20/2025', text: 'Препоръчвам! След месец употреба съм с по-добро настроение и не се чувствам като дърво след работа.', hasPhoto: false },
  { name: 'Пламен Т.', date: '10/19/2025', text: 'Жена ми е доволна, аз съм доволен. Какво повече да кажа? 5 звезди!', hasPhoto: false },
  { name: 'Станислав Г.', date: '10/18/2025', text: 'Взимам втори месец вече. Резултатите са стабилни, не е плацебо.', hasPhoto: false },
  { name: 'Емил К.', date: '10/17/2025', text: 'Помага ми да се концентрирам по-добре на работа. Не очаквах такъв ефект.', hasPhoto: false },
  { name: 'Георги М.', date: '10/16/2025', text: 'Най-добрата инвестиция в здравето ми тази година. Чувствам се на 25 пак!', hasPhoto: false },
  { name: 'Христо Б.', date: '10/15/2025', text: 'Програмата е супер, не е просто добавка. Цялостен подход към мъжкото здраве.', hasPhoto: false },
  { name: 'Даниел Р.', date: '10/14/2025', text: 'Ставах сутрин и веднага искаше да легна пак. Вече не е така, имам заряд!', hasPhoto: false },
  { name: 'Иван П.', date: '10/13/2025', text: 'Пробвах много добавки преди, но TestoUP е различен. Работи!', hasPhoto: false },
  { name: 'Тодор К.', date: '10/12/2025', text: 'След 3 седмици започнах да виждам резултати в залата. Вдигам повече и се възстановявам по-бързо.', hasPhoto: false },
  { name: 'Николай Ч.', date: '10/11/2025', text: 'Либидото ми беше на нулата. Сега жена ми се оплаква че я "тормозя" много. Хаха!', hasPhoto: false },
  { name: 'Васил Х.', date: '10/10/2025', text: 'Качествен продукт, бърза доставка. Взимам трети месец.', hasPhoto: false },
  { name: 'Александър С.', date: '10/09/2025', text: 'На 38 съм и се чувствам по-добре от на 28. Сериозно го препоръчвам!', hasPhoto: false },
  { name: 'Милен В.', date: '10/08/2025', text: 'Жена ми ми го поръча като подарък. Най-добрият подарък досега!', hasPhoto: false },
  { name: 'Симеон Д.', date: '10/07/2025', text: 'Работя на смени и бях постоянно изморен. TestoUP ми помогна да се справя.', hasPhoto: false },
  { name: 'Радослав И.', date: '10/06/2025', text: 'Четох много ревюта преди да поръчам. Сега съм щастлив че го направих!', hasPhoto: false },
  { name: 'Костадин Л.', date: '10/05/2025', text: 'Програмата с хранене и тренировки е голям плюс. Не е просто хапче.', hasPhoto: false },
  { name: 'Стоян М.', date: '10/04/2025', text: 'Забелязах подобрение в съня първо. После дойде и енергията.', hasPhoto: false },
  { name: 'Венцислав К.', date: '10/03/2025', text: 'Взех 3 опаковки наведнъж. Не съжалявам, резултатите са очевидни.', hasPhoto: false },
  { name: 'Йордан Н.', date: '10/02/2025', text: 'Децата ме изморяваха ужасно. Сега играя с тях без проблем след работа.', hasPhoto: false },
  { name: 'Огнян П.', date: '10/01/2025', text: 'Съставките са качествени, вижда се. Не е като евтините от аптеката.', hasPhoto: false },
  { name: 'Божидар Т.', date: '09/30/2025', text: 'Поръчах за втори път. Първият ми стигна месец и половина.', hasPhoto: false },
  { name: 'Ангел С.', date: '09/29/2025', text: 'Приятел ми го препоръча, сега аз препоръчвам на всички!', hasPhoto: false },
  { name: 'Любомир Г.', date: '09/28/2025', text: 'Най-накрая намерих нещо което работи. Благодаря Testograph!', hasPhoto: false },
  { name: 'Кирил Б.', date: '09/27/2025', text: 'Добра цена за качеството което получаваш. Определено си заслужава.', hasPhoto: false },
  { name: 'Здравко М.', date: '09/26/2025', text: 'На 45 се чувствах на 60. Сега се чувствам на 35! Магия!', hasPhoto: false },
]

// Countdown Timer Component
function CountdownTimer() {
  const [time, setTime] = useState({ hours: 4, minutes: 47, seconds: 38 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-0.5 md:gap-1 text-white font-mono text-[10px] md:text-sm">
      <span className="bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded">{String(time.hours).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded">{String(time.minutes).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded">{String(time.seconds).padStart(2, '0')}</span>
    </div>
  )
}

// Star Rating Component
function StarRating({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export default function TestoUpOfferPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [reviewSlide, setReviewSlide] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  // Auto-slide reviews carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewSlide((prev) => (prev + 1) % reviews.length)
    }, 4000) // Change every 4 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide {
          animation: slide 30s linear infinite;
        }
        @keyframes slowScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-100% + 320px)); }
        }
        @media (min-width: 768px) {
          @keyframes slowScroll {
            0% { transform: translateY(0); }
            100% { transform: translateY(calc(-100% + 580px)); }
          }
        }
      `}</style>
      {/* Black Friday Banner */}
      <div className="bg-gradient-to-r from-[#499167] to-[#5ba878] py-1.5 md:py-2">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-4 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <p className="text-white text-[11px] md:text-sm">
            <strong>ЧЕРЕН ПЕТЪК</strong> до <strong>50% НАМАЛЕНИЕ</strong>
          </p>
          <CountdownTimer />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 md:gap-2">
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#499167] rounded-full"></span>
              <span className="text-base md:text-xl font-black tracking-tight text-gray-900">TESTOGRAPH</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <a href="#product" className="hover:text-gray-900">TestoUP</a>
              <a href="#how-it-works" className="hover:text-gray-900">Как работи</a>
              <a href="#faq" className="hover:text-gray-900">ЧЗВ</a>
            </div>
            <a href={CHECKOUT_URL} className="bg-[#499167] hover:bg-[#3d7d58] text-white font-semibold px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all">
              Поръчай
            </a>
          </div>
        </div>
      </nav>

      {/* Main Product Section - Shopify Style */}
      <section id="product" className="py-3 md:py-12 overflow-hidden">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-4 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 overflow-hidden">

            {/* LEFT: Product Gallery */}
            <div className="overflow-hidden">
              {/* Main Image */}
              <div className="bg-gray-50 rounded-xl md:rounded-2xl mb-2 md:mb-4 aspect-[4/3] md:aspect-square max-h-[280px] md:max-h-none flex items-center justify-center overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt="TestoUP - Естествен Тестостерон Бустер"
                  className="w-full h-full object-contain p-2 md:p-8"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#499167]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Изглед ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Ingredients Carousel */}
              <div className="mt-2 md:mt-6">
                <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-xl md:rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] relative overflow-hidden p-1.5 md:p-6">
                  <h4 className="text-[9px] md:text-sm font-mono text-gray-900/50 mb-1 md:mb-4 uppercase tracking-wider">12 Активни Съставки</h4>
                  <div className="overflow-hidden">
                    <div className="flex gap-1.5 md:gap-4 animate-[slide_30s_linear_infinite]">
                      {[
                        { img: '/Testoup formula/vitamin-D.webp', name: 'Витамин Д3', dose: '2400 МЕ' },
                        { img: '/Testoup formula/zinc-img.webp', name: 'Цинк', dose: '50мг' },
                        { img: '/Testoup formula/ashwagandha-img.webp', name: 'Ашваганда', dose: '400мг' },
                        { img: '/Testoup formula/magnesium-img.webp', name: 'Магнезий', dose: '400мг' },
                        { img: '/Testoup formula/tribulus-terestris-img.webp', name: 'Трибулус', dose: '500мг' },
                        { img: '/Testoup formula/selenium-img.webp', name: 'Селен', dose: '100mcg' },
                        { img: '/Testoup formula/vitamin-C.webp', name: 'Витамин C', dose: '200mg' },
                        { img: '/Testoup formula/vitamin-E.webp', name: 'Витамин E', dose: '30mg' },
                        { img: '/Testoup formula/vitamin-K2.webp', name: 'Витамин K2', dose: '100mcg' },
                        { img: '/Testoup formula/vitamin-B6.webp', name: 'Витамин B6', dose: '5mg' },
                        { img: '/Testoup formula/vitamin-B12.webp', name: 'Витамин B12', dose: '10mcg' },
                        { img: '/Testoup formula/vitamin-B9.webp', name: 'Витамин B9', dose: '400mcg' },
                        { img: '/Testoup formula/vitamin-D.webp', name: 'Витамин Д3', dose: '2400 МЕ' },
                        { img: '/Testoup formula/zinc-img.webp', name: 'Цинк', dose: '50мг' },
                      ].map((item, i) => (
                        <div key={i} className="flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 border border-white/60 flex items-center gap-1.5 md:gap-3 min-w-[100px] md:min-w-[180px]">
                          <div className="w-7 h-7 md:w-12 md:h-12 rounded-full overflow-hidden bg-white">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[10px] md:text-sm font-bold">{item.name}</p>
                            <p className="text-[8px] md:text-xs text-gray-500">{item.dose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <StarRating />
                <span className="text-xs md:text-sm text-gray-600">4.8/5 (247 отзива)</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 text-gray-900">
                <span className="text-[#499167]">TestoUP</span> - Естествен Тестостерон Бустер
              </h1>

              {/* Benefits */}
              <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#499167]" />
                  <span>Твърди и редовни ерекции</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#499167]" />
                  <span>Либидо и енергия през целия ден</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <Dumbbell className="w-4 h-4 md:w-5 md:h-5 text-[#499167]" />
                  <span>По-голяма сила и самочувствие</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#499167]" />
                  <span>Бързо възстановяване</span>
                </div>
              </div>

              {/* Fixed 3-Month Offer */}
              <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl border-2 border-[#499167] bg-[#499167]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-base md:text-lg text-gray-900">3 опаковки TestoUP</span>
                    <p className="text-gray-600 text-xs md:text-sm">90 дни пълна програма</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-xs md:text-sm">201 лв</span>
                    <p className="text-xl md:text-2xl font-black text-[#499167]">90.45 лв</p>
                    <span className="bg-orange-100 text-orange-700 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-semibold">
                      -55% Спестяваш 110.55 лв
                    </span>
                  </div>
                </div>
              </div>

              {/* App Unlock Message */}
              <div className="bg-[#499167]/10 border border-[#499167]/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <p className="text-gray-700 text-xs md:text-sm mb-1">Покупката на TestoUP отключва</p>
                <p className="font-bold text-[#3d7d58] flex items-center gap-2 text-sm md:text-base">
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  Testograph - Приложение за мъжко здраве
                </p>
              </div>

              {/* CTA Button */}
              <div className="mb-4 md:mb-6">
                <a
                  href={CHECKOUT_URL}
                  className="block w-full bg-[#499167] hover:bg-[#3d7d58] text-white font-bold py-3 md:py-4 rounded-xl text-center text-sm md:text-base transition-all"
                >
                  Купи сега
                </a>
              </div>

              {/* Mini Reviews Carousel */}
              <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={reviews[reviewSlide].image} alt={reviews[reviewSlide].name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                  <div>
                    <StarRating className="mb-1" />
                    <p className="text-gray-700 text-xs md:text-sm mb-1.5 md:mb-2">{reviews[reviewSlide].text}</p>
                    <p className="text-gray-500 text-xs md:text-sm font-medium">{reviews[reviewSlide].name}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-2 md:mt-3">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${reviewSlide === i ? 'bg-[#499167]' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Начин на прием - Steps */}
              <div className="bg-gradient-to-br from-[#499167]/5 to-[#499167]/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-[#499167]/20">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#499167]" />
                  Начин на прием
                </h4>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                  {[
                    { step: '1', title: 'ВЗЕМИ', desc: '2 капсули сутрин', icon: '💊' },
                    { step: '2', title: 'С ХРАНА', desc: 'С храна и вода', icon: '🍳' },
                    { step: '3', title: 'СЛЕДВАЙ', desc: 'Активирай приложението', icon: '📱' },
                    { step: '4', title: 'ИЗЧАКАЙ', desc: 'Резултати: 4-8 седмици', icon: '⏰' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-lg md:rounded-xl p-2 md:p-3 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-1.5 md:gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-[#499167] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] md:text-xs font-bold">{item.step}</span>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs font-bold text-gray-900">{item.title}</p>
                          <p className="text-[9px] md:text-[10px] text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#499167] py-2 md:py-3">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 text-[11px] md:text-sm">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Award className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="font-semibold text-white">Сертифицирано БАБХ</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="font-semibold text-white">GMP стандарт</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="font-semibold text-white">Произведено в ЕС</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="font-semibold text-white">HACCP качество</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-6 md:py-20 bg-white">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-6">
          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 text-gray-900">
              Реални Истории от Клиенти
            </h2>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto">
              Вижте как TestoUP промени живота на мъже в България
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-2 md:gap-3 mb-6 md:mb-12">
            <button className="px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-[11px] md:text-sm uppercase tracking-wider transition-all duration-300 bg-[#499167] text-white shadow-lg shadow-[#499167]/30">
              Либидо
            </button>
          </div>

          {/* Video Slider (mobile) / Grid (desktop) */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            {/* Video 1 */}
            <div className="flex-shrink-0 w-[70%] md:w-auto snap-start bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-2xl md:rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30">
              <div className="relative aspect-[9/16] bg-gray-100">
                <video className="w-full h-full object-cover" controls preload="metadata">
                  <source src="/testimonials/TestoUp%20-%20Libido%201.mp4" type="video/mp4" />
                  Вашият браузър не поддържа видео елемент.
                </video>
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider bg-[#499167]/90 backdrop-blur-sm text-white">
                    ЛИБИДО
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-4">
                <h3 className="font-bold text-xs md:text-base text-gray-900 line-clamp-2">
                  Подобрено либидо след 2 седмици
                </h3>
              </div>
            </div>

            {/* Video 2 */}
            <div className="flex-shrink-0 w-[70%] md:w-auto snap-start bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-2xl md:rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30">
              <div className="relative aspect-[9/16] bg-gray-100">
                <video className="w-full h-full object-cover" controls preload="metadata">
                  <source src="/testimonials/TestoUP%20-%20LIBIDO%202.mp4" type="video/mp4" />
                  Вашият браузър не поддържа видео елемент.
                </video>
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider bg-[#499167]/90 backdrop-blur-sm text-white">
                    ЛИБИДО
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-4">
                <h3 className="font-bold text-xs md:text-base text-gray-900 line-clamp-2">
                  Връщане на сексуалната енергия
                </h3>
              </div>
            </div>

            {/* Video 3 */}
            <div className="flex-shrink-0 w-[70%] md:w-auto snap-start bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-2xl md:rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30">
              <div className="relative aspect-[9/16] bg-gray-100">
                <video className="w-full h-full object-cover" controls preload="metadata">
                  <source src="/testimonials/TestoUP%20-%20Libido%203.mp4" type="video/mp4" />
                  Вашият браузър не поддържа видео елемент.
                </video>
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                  <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider bg-[#499167]/90 backdrop-blur-sm text-white">
                    ЛИБИДО
                  </span>
                </div>
              </div>
              <div className="p-2 md:p-4">
                <h3 className="font-bold text-xs md:text-base text-gray-900 line-clamp-2">
                  По-силно желание и увереност
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <h2 className="text-xl md:text-3xl font-black text-center mb-3 md:mb-6 text-gray-900">Решението</h2>
          <p className="text-sm md:text-lg text-gray-700 text-center mb-4 md:mb-8">
            <strong>TestoUP</strong> съдържа <strong>12 съставки в клинични дози</strong>, които:
          </p>

          {/* Two Column Layout: Image Left, Cards Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8 items-center">
            {/* Left: Image */}
            <div className="flex justify-center order-2 md:order-1">
              <img
                src="https://shop.testograph.eu/cdn/shop/files/Your_paragraph_text_4.webp?v=1763997509&width=750"
                alt="TestoUP Решението"
                className="w-full max-w-[200px] md:max-w-sm rounded-xl md:rounded-2xl shadow-lg"
              />
            </div>

            {/* Right: 4 Cards Stacked */}
            <div className="flex flex-col gap-2 md:gap-4 order-1 md:order-2">
              <div className="flex items-start gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-[#499167] flex-shrink-0 mt-0.5" />
                <p className="text-gray-900 text-sm md:text-base"><strong>Стимулират</strong> естественото производство.</p>
              </div>
              <div className="flex items-start gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-[#499167] flex-shrink-0 mt-0.5" />
                <p className="text-gray-900 text-sm md:text-base"><strong>Намаляват</strong> кортизола който го блокира.</p>
              </div>
              <div className="flex items-start gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-[#499167] flex-shrink-0 mt-0.5" />
                <p className="text-gray-900 text-sm md:text-base"><strong>Доставят</strong> есенциалните минерали.</p>
              </div>
              <div className="flex items-start gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-[#499167] flex-shrink-0 mt-0.5" />
                <p className="text-gray-900 text-sm md:text-base"><strong>Блокират</strong> конверсията към естроген.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm md:text-lg text-[#3d7d58] font-semibold mb-4 md:mb-6">
            Повече свободен тестостерон = повече енергия, либидо и сила.
          </p>
          <div className="text-center">
            <a href="#product" className="inline-block bg-[#499167] hover:bg-[#3d7d58] text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-full text-sm md:text-base transition-all">
              Вземи Сега
            </a>
          </div>
        </div>
      </section>

      {/* 60-Day Transformation Section with Interactive Slider */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
            {/* Left: Text */}
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-black mb-2 md:mb-4 text-gray-900">60-Дневна трансформация</h2>
              <p className="text-gray-600 text-sm md:text-lg">
                Само за 60 дни - видимо стопени мазнини, повече сила, мускулна маса и увереност. Постижима промяна, постигната заради TestoUP и персонализираната програма.
              </p>
            </div>

            {/* Right: Interactive Before/After Comparison Slider */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] max-w-md mx-auto">
                {/* Labels */}
                <div className="absolute top-4 left-4 z-20 bg-[#499167] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Преди
                </div>
                <div className="absolute top-4 right-4 z-20 bg-[#499167] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  След
                </div>

                {/* After Image (Full Background) */}
                <img
                  src="https://shop.testograph.eu/cdn/shop/files/photo_2025-10-23_17-05-42.jpg?v=1761228802&width=832"
                  alt="След TestoUP"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before Image (Clipped by slider position) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src="https://shop.testograph.eu/cdn/shop/files/Gemini_Generated_Image_phm395phm395phm3-vmake.jpg?v=1761228802&width=832"
                    alt="Преди TestoUP"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
                  />
                </div>

                {/* Slider Line */}
                <div
                  className="absolute inset-y-0 z-10 w-1 bg-white cursor-ew-resize"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Slider Handle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-gray-500 -ml-1" />
                    <ChevronRight className="w-4 h-4 text-gray-500 -ml-3 rotate-180" />
                  </div>
                </div>

                {/* Range Input (invisible, controls slider) */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-it-works" className="py-8 md:py-16">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <h2 className="text-xl md:text-3xl font-black text-center mb-6 md:mb-12 text-gray-900">Какво се случва след прием на TestoUP</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Day 7 */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-[#499167]/20">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#499167]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#499167] font-bold text-sm md:text-base">7</span>
                </div>
                <div>
                  <p className="text-[#499167] font-bold text-sm md:text-base">ДЕН 7</p>
                  <p className="text-gray-500 text-xs md:text-sm">Началото</p>
                </div>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-xs md:text-sm">
                <li>Твърди сутрешни ерекции.</li>
                <li>Огромно увеличение на либидото.</li>
                <li>Дълбок сън и бързо възстановяване.</li>
                <li>Енергия, която те държи цял ден.</li>
              </ul>
            </div>

            {/* Day 30 */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-[#499167]/30">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#499167]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#3d7d58] font-bold text-sm md:text-base">30</span>
                </div>
                <div>
                  <p className="text-[#3d7d58] font-bold text-sm md:text-base">ДЕН 30</p>
                  <p className="text-gray-500 text-xs md:text-sm">Моментум</p>
                </div>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-xs md:text-sm">
                <li>Високо самочувствие в спалнята.</li>
                <li>Партньорката ти забелязва промяната.</li>
                <li>Бърз прогрес в залата.</li>
                <li>Ментално си фокусиран и продуктивен.</li>
              </ul>
            </div>

            {/* Day 60 */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-[#499167]">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#499167] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">60</span>
                </div>
                <div>
                  <p className="text-[#499167] font-bold text-sm md:text-base">ДЕН 60</p>
                  <p className="text-gray-500 text-xs md:text-sm">Трансформация</p>
                </div>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-xs md:text-sm">
                <li>Чувстваш се неуморим и желан в спалнята.</li>
                <li>Имаш повече сила и виждаш реален прогрес.</li>
                <li>Вече не си спомняш какво е да си уморен.</li>
                <li>Спокоен и уверен си във всяка ситуация!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Ingredients Carousel Section */}
      <section className="py-8 md:py-16 bg-white overflow-hidden">
        <div className="w-full md:max-w-7xl mx-auto px-2 md:px-4">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-6 md:mb-12 text-gray-900">
            <span className="text-[#6d388b]">12</span> Съставки
          </h2>

          {/* Carousel Container */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div className="overflow-hidden">
              <div className="flex gap-4 md:gap-8 animate-slide" style={{ width: 'max-content' }}>
                {[
                  { name: 'Трибулус', img: 'https://shop.testograph.eu/cdn/shop/files/tribulus.webp?v=1763727976&width=400' },
                  { name: 'Ашваганда', img: 'https://shop.testograph.eu/cdn/shop/files/ashwagandha_1.webp?v=1763727976&width=400' },
                  { name: 'Витамин D', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_D.webp?v=1763727976&width=400' },
                  { name: 'Витамин B6', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_B6.webp?v=1763727976&width=400' },
                  { name: 'Цинк', img: 'https://shop.testograph.eu/cdn/shop/files/zinc_1.webp?v=1763727976&width=400' },
                  { name: 'Витамин B9', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_B9.webp?v=1763727976&width=400' },
                  { name: 'Витамин B12', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_B12.webp?v=1763727976&width=400' },
                  { name: 'Магнезий', img: 'https://shop.testograph.eu/cdn/shop/files/magnezium.webp?v=1763727976&width=400' },
                  { name: 'Витамин E', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_E.webp?v=1763727976&width=400' },
                  { name: 'Витамин K2', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_K2.webp?v=1763727976&width=400' },
                  { name: 'Селен', img: 'https://shop.testograph.eu/cdn/shop/files/Sustavka-Selenium.webp?v=1763724937&width=400' },
                  { name: 'Витамин C', img: 'https://shop.testograph.eu/cdn/shop/files/vitaminC.webp?v=1763727976&width=400' },
                  // Duplicate for infinite scroll effect
                  { name: 'Трибулус', img: 'https://shop.testograph.eu/cdn/shop/files/tribulus.webp?v=1763727976&width=400' },
                  { name: 'Ашваганда', img: 'https://shop.testograph.eu/cdn/shop/files/ashwagandha_1.webp?v=1763727976&width=400' },
                  { name: 'Витамин D', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_D.webp?v=1763727976&width=400' },
                  { name: 'Витамин B6', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_B6.webp?v=1763727976&width=400' },
                  { name: 'Цинк', img: 'https://shop.testograph.eu/cdn/shop/files/zinc_1.webp?v=1763727976&width=400' },
                  { name: 'Витамин B9', img: 'https://shop.testograph.eu/cdn/shop/files/Vitamin_B9.webp?v=1763727976&width=400' },
                ].map((item, i) => (
                  <div key={i} className="flex-shrink-0 w-[200px] md:w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gray-50">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-[#499167] py-6">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-white">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">По-добър секс</p>
            </div>
            <div className="text-white">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Повече енергия</p>
            </div>
            <div className="text-white">
              <Dumbbell className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Повече сила</p>
            </div>
            <div className="text-white">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Остър фокус</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testograph Bento Grid Section */}
      <section className="py-6 md:py-20 px-3 md:px-6 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-16">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-red-50 text-red-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-sm font-medium mb-3 md:mb-4">
            <Target className="w-3 h-3 md:w-4 md:h-4" />
            Уморени ли сте да не виждате резултати?
          </div>
          <h2 className="font-bold text-xl md:text-4xl lg:text-5xl text-gray-900 mb-2 md:mb-4">Testograph</h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-3xl mb-3 md:mb-6">Вашата програма: Хранителна, Тренировъчна и Релакс</p>
          <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#499167]/10 to-[#499167]/5 border border-[#499167]/20 px-3 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#499167]/20 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-[#499167]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-[11px] md:text-sm">Безплатен достъп до приложението</p>
              <p className="text-[10px] md:text-xs text-gray-600">При покупка получавате достъп за колкото дни имате капсули</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto gap-3 md:gap-6">
          {/* Live Preview Card */}
          <div className="md:col-span-2 md:row-span-3">
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-8 h-full bg-gradient-to-br from-gray-900 via-gray-900 to-[#499167]/20">
              <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-[#499167] text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full z-20">LIVE PREVIEW</div>
              <div className="relative h-full flex items-center justify-center py-4 md:py-0">
                <div className="relative w-[160px] md:w-[280px] h-[320px] md:h-[580px] bg-gray-900 rounded-[24px] md:rounded-[40px] p-1.5 md:p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[20px] md:rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full animate-[slowScroll_40s_linear_infinite]">
                      <img src="/Application-fullpage-scroll.png" alt="Testograph App" className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-32 h-3 md:h-6 bg-gray-900 rounded-b-xl md:rounded-b-2xl z-10"></div>
                </div>
                <div className="hidden md:block absolute top-8 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg text-white text-xs font-mono">
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  iOS & Android
                </div>
                <div className="hidden md:block absolute bottom-8 left-4 bg-[#499167]/20 backdrop-blur-md border border-[#499167]/40 px-3 py-2 rounded-lg text-white text-xs font-bold">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  AI-Powered
                </div>
              </div>
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-5xl md:text-9xl font-bold text-white/5 select-none">V2</div>
            </div>
          </div>

          {/* Problem Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-8 bg-gray-50 hover:bg-white h-full">
              <div className="w-8 md:w-12 h-8 md:h-12 rounded-xl md:rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-2 md:mb-4">
                <Target className="w-4 md:w-6 h-4 md:h-6" />
              </div>
              <h3 className="font-bold text-base md:text-2xl mb-2 md:mb-3 text-gray-900">Проблемът не е във вашите усилия</h3>
              <p className="text-[11px] md:text-base text-gray-600 leading-relaxed">Инвестирате време и пари в тренировки и добавки, но усещате застой. Енергията е ниска, напредъкът бавен. Проблемът е в липсата на персонализирана система, която обединява хранене, тренировки, добавки и почивка.</p>
            </div>
          </div>

          {/* Personalized Plan Card */}
          <div>
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-6 bg-gray-50 hover:bg-white h-full group">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Персонализиран План</h4>
              <p className="text-[11px] md:text-sm text-gray-600">AI въпросник избира една от 9 програми, 100% съобразени с вашето тяло.</p>
            </div>
          </div>

          {/* Nutrition Card */}
          <div>
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-6 bg-gray-50 hover:bg-white h-full group">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Хранителни Режими</h4>
              <p className="text-[11px] md:text-sm text-gray-600">Седмични планове с точни грамажи и макроси за оптимален тестостерон.</p>
            </div>
          </div>

          {/* Training Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-8 bg-gray-50 hover:bg-white h-full relative overflow-hidden group">
              <div className="w-8 md:w-12 h-8 md:h-12 rounded-xl md:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Dumbbell className="w-4 md:w-6 h-4 md:h-6" />
              </div>
              <h4 className="font-bold text-base md:text-2xl mb-2 md:mb-3 text-gray-900 relative z-10">Тренировъчни Програми</h4>
              <p className="text-[11px] md:text-base text-gray-600 leading-relaxed mb-2 md:mb-4 relative z-10">5,000+ упражнения с видео демонстрации на български. Вкъщи, в залата или йога - имате всичко необходимо.</p>
              <div className="flex items-center gap-2 text-[10px] md:text-sm font-medium text-[#499167] relative z-10">
                <Check className="w-3 md:w-4 h-3 md:h-4" />
                Правилна техника, безопасност, максимален ефект
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 md:w-32 h-20 md:h-32 bg-orange-100 rounded-full opacity-20 group-hover:scale-150 transition-transform"></div>
            </div>
          </div>

          {/* Tracking Card */}
          <div>
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-6 bg-gray-50 hover:bg-white h-full group">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 md:w-5 h-4 md:h-5" />
              </div>
              <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Проследяване</h4>
              <p className="text-[11px] md:text-sm text-gray-600">Напомняния за TestoUP, записване на тегло и прогрес в реално време.</p>
            </div>
          </div>

          {/* CTA Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-[16px] border border-white/60 shadow-lg rounded-3xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl hover:shadow-[#499167]/10 hover:border-[#499167]/30 p-3 md:p-8 bg-gradient-to-r from-[#499167]/10 via-gray-50 to-[#499167]/10 hover:bg-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                <div className="flex-1">
                  <h4 className="text-lg md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Повече от Добавка – Цялостна Трансформация</h4>
                  <p className="text-[11px] md:text-lg text-gray-600 mb-3 md:mb-6">С Testograph, TestoUP престава да бъде просто добавка. Той се превръща в катализатор на цялостна система.</p>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-6">
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-base text-gray-700">
                      <Check className="w-3 md:w-5 h-3 md:h-5 text-[#499167] flex-shrink-0" />
                      <span>Увеличете енергията</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-base text-gray-700">
                      <Check className="w-3 md:w-5 h-3 md:h-5 text-[#499167] flex-shrink-0" />
                      <span>Пробиете застоя</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-base text-gray-700">
                      <Check className="w-3 md:w-5 h-3 md:h-5 text-[#499167] flex-shrink-0" />
                      <span>Подобрете либидото</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-base text-gray-700">
                      <Check className="w-3 md:w-5 h-3 md:h-5 text-[#499167] flex-shrink-0" />
                      <span>Пълен контрол</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <a href="https://shop.testograph.eu/checkouts/cn/hWN5mYLrYhkHrMjP1upLxFD9/bg-bg?discount=QuizzOff38" className="inline-flex items-center justify-center w-full md:w-auto gap-2 px-4 md:px-8 py-2.5 md:py-4 bg-[#499167] text-white font-bold text-sm md:text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-xl shadow-[#499167]/20 hover:bg-[#3d7d58]">
                    Започни сега
                    <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <h2 className="text-lg md:text-3xl font-black text-center mb-6 md:mb-12 text-gray-900">Помогнахме на 1300+ мъже да върнат увереността си</h2>

          <div className="grid grid-cols-3 gap-2 md:gap-8 text-center">
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-8">
              <p className="text-2xl md:text-5xl font-black text-[#499167] mb-1 md:mb-2">92%</p>
              <p className="text-gray-600 text-[10px] md:text-base">Забелязват огромен скок в либидото още първите 10 дни.</p>
            </div>
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-8">
              <p className="text-2xl md:text-5xl font-black text-[#499167] mb-1 md:mb-2">97%</p>
              <p className="text-gray-600 text-[10px] md:text-base">Споделиха, че сексуалният им живот е бил значително подобрен още първия месец.</p>
            </div>
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-8">
              <p className="text-2xl md:text-5xl font-black text-[#499167] mb-1 md:mb-2">91%</p>
              <p className="text-gray-600 text-[10px] md:text-base">От всички клиенти се връщат отново при нас.</p>
            </div>
          </div>
          <p className="text-center text-[10px] md:text-sm text-gray-500 mt-3 md:mt-6">* Проведена статистика от екипа на Testograph за 2025 година.</p>
        </div>
      </section>

      {/* Extended Reviews - With Photos */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="w-full md:max-w-6xl mx-auto px-2 md:px-4">
          <h2 className="text-xl md:text-3xl font-black text-center mb-6 md:mb-12 text-gray-900">Какво ни казахте</h2>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            {extendedReviews.map((review, i) => (
              <div key={i} className="flex-shrink-0 w-[45%] md:w-auto snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Square Photo */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={review.image}
                    alt={`${review.name} - TestoUP отзив`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-3 md:p-4">
                  {/* Quote Icon */}
                  <div className="mb-2">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#6d388b]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  {/* 5 Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm mb-2 md:mb-3 line-clamp-3">{review.text}</p>
                  <p className="text-gray-900 text-xs md:text-sm">
                    <span className="font-bold">{review.name}</span>
                    <span className="italic">, {review.age}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Judge.me Customer Reviews */}
      <section className="py-8 md:py-16 bg-white">
        <div className="w-full md:max-w-4xl mx-auto px-2 md:px-4">
          <h2 className="text-xl md:text-3xl font-black text-center mb-6 md:mb-8 text-gray-900">Отзиви от клиенти</h2>

          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 p-6 bg-gray-50 rounded-2xl">
            {/* Stars and Rating */}
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg font-semibold">5.00 от 5</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 justify-center">
                На базата на {judgeMeReviews.length} отзива
                <Check className="w-4 h-4 text-[#499167]" />
              </p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 max-w-xs space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= stars ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#499167] rounded-full"
                      style={{ width: stars === 5 ? '100%' : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-4">{stars === 5 ? judgeMeReviews.length : '0'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            {judgeMeReviews.map((review, i) => (
              <div key={i} className="flex-shrink-0 w-[75%] md:w-auto snap-start border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating />
                    <span className="text-gray-400 text-sm">{review.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=6d388b&color=fff&size=32&bold=true`}
                    alt={review.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm text-gray-500">{review.name}</p>
                </div>
                <p className={`text-gray-700 ${review.hasPhoto ? 'mb-3' : ''}`}>{review.text}</p>
                {review.hasPhoto && review.photo && (
                  <img
                    src={review.photo}
                    alt="Customer photo"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-8 md:py-16">
        <div className="w-full md:max-w-3xl mx-auto px-2 md:px-4">
          <h2 className="text-xl md:text-3xl font-black text-center mb-6 md:mb-12 text-gray-900">Често задавани въпроси</h2>

          <div className="space-y-2 md:space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 md:p-5 text-left hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 pr-3 md:pr-4 text-sm md:text-base">{i + 1}. {faq.q}</h3>
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-3 md:px-5 pb-3 md:pb-5 text-gray-600 border-t border-gray-100 pt-3 md:pt-4 text-sm md:text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30-Day Guarantee */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-[#499167] to-[#5ba878]">
        <div className="w-full md:max-w-3xl mx-auto px-2 md:px-4 text-center">
          <h2 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-4">30-Дневна гаранция</h2>
          <p className="text-white/90 text-sm md:text-lg mb-4 md:mb-8">
            Ако не видиш резултат до 30 дни като си следвал на 100% програмата ти връщаме парите.
          </p>
          <a
            href={CHECKOUT_URL}
            className="inline-block bg-white text-[#499167] font-bold py-3 md:py-4 px-8 md:px-12 rounded-full text-sm md:text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Вземи сега
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-12 pb-24 md:pb-12 bg-gray-100">
        <div className="w-full md:max-w-xl mx-auto px-2 md:px-4 text-center">
          <h2 className="text-lg md:text-2xl font-black mb-1 md:mb-2">Стани част от нас!</h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Бъди сред първите, които получават промоции, подаръци и новини.</p>
          <form className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Имейл"
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#499167] text-sm md:text-base"
            />
            <button type="submit" className="bg-[#499167] hover:bg-[#3d7d58] text-white font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base">
              Абониране
            </button>
          </form>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <a
          href={CHECKOUT_URL}
          className="block w-full bg-[#499167] hover:bg-[#3d7d58] text-white font-bold py-3 rounded-xl text-center text-sm transition-all"
        >
          Купи сега - 90.45 лв
        </a>
      </div>
    </div>
  )
}
