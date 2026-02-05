'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '@/lib/animations'
import PageHeader from '@/components/PageHeader'
import { formatPrice } from '@/lib/formatPrice'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
}

interface SiteSettings {
  currencySymbol: string
  currencyCode: string
}

/** Parse first number from price string (e.g. "1000/-" -> 1000, "$14" -> 14) for filtering */
function getPriceNumber(price: string): number {
  if (!price || typeof price !== 'string') return 0
  const match = price.replace(/,/g, '').match(/\d+(?:\.\d+)?/)
  return match ? parseFloat(match[0]) : 0
}

const PRICE_RANGES = [
  { value: 'all', label: 'Any price' },
  { value: '0-1000', label: 'Under 1000/-', min: 0, max: 1000 },
  { value: '1000-2000', label: '1000 - 2000/-', min: 1000, max: 2000 },
  { value: '2000-5000', label: '2000 - 5000/-', min: 2000, max: 5000 },
  { value: '5000-10000', label: '5000 - 10000/-', min: 5000, max: 10000 },
  { value: '10000+', label: '10000/- and above', min: 10000, max: Infinity },
] as const

const defaultCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages']
const defaultItems: MenuItem[] = [
  { id: '1', name: 'Bruschetta Trio', description: 'Three varieties of artisanal bruschetta with fresh tomatoes, basil, and mozzarella', price: '$14', category: 'Appetizers' },
  { id: '2', name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan, croutons, and house-made Caesar dressing', price: '$12', category: 'Appetizers' },
  { id: '3', name: 'Crab Cakes', description: 'Pan-seared crab cakes with lemon aioli and microgreens', price: '$18', category: 'Appetizers' },
  { id: '4', name: 'Grilled Salmon', description: 'Atlantic salmon with roasted vegetables and herb butter', price: '$28', category: 'Main Courses' },
  { id: '5', name: 'Ribeye Steak', description: '12oz prime ribeye with garlic mashed potatoes and seasonal vegetables', price: '$42', category: 'Main Courses' },
  { id: '6', name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara sauce, mozzarella, and pasta', price: '$24', category: 'Main Courses' },
  { id: '7', name: 'Vegetarian Risotto', description: 'Creamy arborio rice with seasonal vegetables and parmesan', price: '$22', category: 'Main Courses' },
  { id: '8', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream', price: '$10', category: 'Desserts' },
  { id: '9', name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', price: '$9', category: 'Desserts' },
  { id: '10', name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar topping', price: '$9', category: 'Desserts' },
  { id: '11', name: 'Wine Selection', description: 'Curated selection of red, white, and sparkling wines', price: '$8-15', category: 'Beverages' },
  { id: '12', name: 'Craft Cocktails', description: 'Handcrafted cocktails made with premium spirits', price: '$12-16', category: 'Beverages' },
]

export default function Menu() {
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultItems)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [logoVisible, setLogoVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/menu/categories').then((r) => r.ok ? r.json() : []),
      fetch('/api/menu/items').then((r) => r.ok ? r.json() : []),
      fetch('/api/settings').then((r) => r.ok ? r.json() : { currencySymbol: '$', currencyCode: 'USD' }),
    ]).then(([catList, itemList, siteSettings]: [{ name: string }[], MenuItem[], SiteSettings]) => {
      if (catList?.length) setCategories(catList.map((c) => c.name))
      if (itemList?.length) setMenuItems(itemList)
      setSettings(siteSettings ?? { currencySymbol: '$', currencyCode: 'USD' })
    }).catch(() => setSettings({ currencySymbol: '$', currencyCode: 'USD' }))
  }, [])

  const filteredItems = useMemo(() => {
    let items = menuItems

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      )
    }

    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    if (priceRange !== 'all') {
      const range = PRICE_RANGES.find((r) => r.value === priceRange) as (typeof PRICE_RANGES)[number] | undefined
      if (range && 'min' in range && 'max' in range) {
        const { min, max } = range
        items = items.filter((item) => {
          const n = getPriceNumber(item.price)
          return n >= min && n <= max
        })
      }
    }

    return items
  }, [menuItems, searchQuery, selectedCategory, priceRange])

  const categoriesToShow = useMemo(() => {
    if (selectedCategory !== 'all') return [selectedCategory]
    const hasItems = new Set(filteredItems.map((i) => i.category))
    return categories.filter((c) => hasItems.has(c))
  }, [categories, filteredItems, selectedCategory])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(typeof window !== 'undefined' && window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    registerGSAP()
    const ctx = gsap.context(() => {
      categoryRefs.current.forEach((el, i) => {
        if (!el) return
        const cards = el.querySelector('.menu-cards')
        const heading = el.querySelector('h2')
        if (heading) {
          gsap.from(heading, {
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
            y: 36,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
          })
        }
        if (cards?.children?.length) {
          gsap.from(cards.children, {
            scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none reverse' },
            y: 44,
            opacity: 0,
            stagger: 0.06,
            duration: 0.6,
            ease: 'power3.out',
          })
          Array.from(cards.children).forEach((card) => {
            const c = card as HTMLElement
            c.addEventListener('mouseenter', () => gsap.to(c, { scale: 1.02, duration: 0.3, ease: 'power2.out' }))
            c.addEventListener('mouseleave', () => gsap.to(c, { scale: 1, duration: 0.3, ease: 'power2.out' }))
          })
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10">
        <PageHeader
          title="Our Menu"
          subtitle="Discover our carefully crafted selection of dishes"
        />

        <section ref={sectionRef} className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="section-container w-full">
          {/* Search and filters */}
          <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="menu-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  id="menu-search"
                  type="search"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="menu-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="menu-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="menu-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price range
                </label>
                <select
                  id="menu-price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setPriceRange('all')
                }}
                className="mt-4 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] sm:min-h-0"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8 sm:py-12 text-sm sm:text-base">
              No dishes match your search or filters. Try adjusting them.
            </p>
          ) : (
            categoriesToShow.map((category, index) => {
              const items = filteredItems.filter((item) => item.category === category)
              if (items.length === 0) return null
              return (
                <div
                  key={category}
                  ref={(el) => { categoryRefs.current[index] = el }}
                  className="mb-10 sm:mb-16"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 border-b-2 border-primary-600 pb-3 sm:pb-4 px-2">
                    {category}
                  </h2>
                  <div className="menu-cards grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white opacity-100 border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors duration-200 shadow-sm min-w-0"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2 min-w-0">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 break-words">{item.name}</h3>
                          <span className="text-primary-500 font-bold text-base sm:text-lg flex-shrink-0">{formatPrice(item.price, settings?.currencySymbol ?? '$')}</span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
      </div>

      {/* Site logo watermark: behind content (under menu cards), centered in viewport, 30% opacity; pointer-events-none so menu stays clickable */}
      <div
        aria-hidden
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <img
          src="/api/site/logo"
          alt=""
          className="max-w-[min(240px,85vw)] sm:max-w-[min(280px,40vw)] md:max-w-[min(320px,40vw)] w-auto max-h-[40vh] sm:max-h-[50vh] object-contain opacity-30"
          onLoad={() => setLogoVisible(true)}
          onError={() => setLogoVisible(false)}
          style={{ display: logoVisible ? undefined : 'none' }}
        />
      </div>

      {/* Scroll to top: bottom center, visible when scrolled down */}
      {showScrollTop && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
