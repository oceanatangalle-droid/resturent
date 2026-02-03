import { eq, asc, desc } from 'drizzle-orm'
import { db } from './db'
import {
  menuCategories,
  menuItems,
  contactInfo,
  homeContent,
  siteBranding,
  siteSettings,
  reservations as reservationsTable,
} from './db/schema'

export interface MenuCategory {
  id: string
  name: string
  sortOrder: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  sortOrder: number
}

export interface ContactInfo {
  heading: string
  intro: string
  address: string
  addressLine2: string
  phone: string
  email: string
  hours: string
}

export interface HomeContent {
  heroWords: string[]
  subtitle: string
  aboutTitle: string
  aboutText: string
  feature1Title: string
  feature1Text: string
  feature2Title: string
  feature2Text: string
  feature3Title: string
  feature3Text: string
  menuSectionTitle: string
  menuSectionSubtitle: string
  featuredMenuLimit: number
  discountVisible: boolean
  discountTitle: string
  discountSubtitle: string
  discountCtaText: string
  discountCtaLink: string
  discountImageBase64?: string
}

export interface SiteBrandingData {
  faviconBase64: string
  logoBase64: string
}

export interface SiteSettingsData {
  currencySymbol: string
  currencyCode: string
}

export type ReservationStatus = 'pending' | 'accepted' | 'rejected'

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  specialRequests: string
  status: ReservationStatus
  respondedAt?: string
  createdAt: string
}

// ---- In-memory fallback when DATABASE_URL is not set ----
const defaultCategories: MenuCategory[] = [
  { id: '1', name: 'Appetizers', sortOrder: 1 },
  { id: '2', name: 'Main Courses', sortOrder: 2 },
  { id: '3', name: 'Desserts', sortOrder: 3 },
  { id: '4', name: 'Beverages', sortOrder: 4 },
]
const defaultItems: MenuItem[] = [
  { id: '1', name: 'Bruschetta Trio', description: 'Three varieties of artisanal bruschetta with fresh tomatoes, basil, and mozzarella', price: '$14', category: 'Appetizers', sortOrder: 1 },
  { id: '2', name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan, croutons, and house-made Caesar dressing', price: '$12', category: 'Appetizers', sortOrder: 2 },
  { id: '3', name: 'Crab Cakes', description: 'Pan-seared crab cakes with lemon aioli and microgreens', price: '$18', category: 'Appetizers', sortOrder: 3 },
  { id: '4', name: 'Grilled Salmon', description: 'Atlantic salmon with roasted vegetables and herb butter', price: '$28', category: 'Main Courses', sortOrder: 4 },
  { id: '5', name: 'Ribeye Steak', description: '12oz prime ribeye with garlic mashed potatoes and seasonal vegetables', price: '$42', category: 'Main Courses', sortOrder: 5 },
  { id: '6', name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara sauce, mozzarella, and pasta', price: '$24', category: 'Main Courses', sortOrder: 6 },
  { id: '7', name: 'Vegetarian Risotto', description: 'Creamy arborio rice with seasonal vegetables and parmesan', price: '$22', category: 'Main Courses', sortOrder: 7 },
  { id: '8', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream', price: '$10', category: 'Desserts', sortOrder: 8 },
  { id: '9', name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', price: '$9', category: 'Desserts', sortOrder: 9 },
  { id: '10', name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar topping', price: '$9', category: 'Desserts', sortOrder: 10 },
  { id: '11', name: 'Wine Selection', description: 'Curated selection of red, white, and sparkling wines', price: '$8-15', category: 'Beverages', sortOrder: 11 },
  { id: '12', name: 'Craft Cocktails', description: 'Handcrafted cocktails made with premium spirits', price: '$12-16', category: 'Beverages', sortOrder: 12 },
]
const defaultContact: ContactInfo = {
  heading: 'Get in Touch',
  intro: "Have a question or want to make a reservation? We're here to help. Reach out to us through any of the following ways.",
  address: '123 Restaurant Street',
  addressLine2: 'City, State 12345',
  phone: '(555) 123-4567',
  email: 'info@veloria.com',
  hours: 'Monday - Thursday: 5:00 PM - 10:00 PM\nFriday - Saturday: 5:00 PM - 11:00 PM\nSunday: 4:00 PM - 9:00 PM',
}
const defaultHome: HomeContent = {
  heroWords: ['Welcome', 'to', 'Veloria'],
  subtitle: 'Experience exceptional cuisine in an elegant atmosphere. Where every meal is a celebration.',
  aboutTitle: 'About Veloria',
  aboutText: 'At Veloria, we believe that dining is an experience that should engage all your senses. Our chefs craft each dish with passion, using only the finest ingredients sourced from local farms and trusted suppliers. Every plate tells a story, and every meal creates a memory.',
  feature1Title: 'Fine Dining',
  feature1Text: 'Exquisite dishes prepared with the finest ingredients and culinary expertise.',
  feature2Title: 'Elegant Atmosphere',
  feature2Text: 'A sophisticated ambiance perfect for special occasions and intimate dinners.',
  feature3Title: 'Quality Service',
  feature3Text: 'Attentive staff dedicated to making your dining experience unforgettable.',
  menuSectionTitle: 'Featured from Our Menu',
  menuSectionSubtitle: 'A taste of what we offer. Explore our full menu for the complete experience.',
  featuredMenuLimit: 6,
  discountVisible: true,
  discountTitle: 'Special Offer',
  discountSubtitle: 'Enjoy 20% off your next dinner when you book online. Limited time only.',
  discountCtaText: 'Book Now',
  discountCtaLink: '/book-a-table',
  discountImageBase64: '',
}

let memoryCategories = [...defaultCategories]
let memoryItems = [...defaultItems]
let memoryContact = { ...defaultContact }
let memoryHome = { ...defaultHome }
const memoryReservations: Reservation[] = []
let memoryBranding: SiteBrandingData = { faviconBase64: '', logoBase64: '' }
let memorySettings: SiteSettingsData = { currencySymbol: '$', currencyCode: 'USD' }
let nextCategoryId = 5
let nextItemId = 13

function rowToCategory(r: { id: number; name: string; sortOrder: number }): MenuCategory {
  return { id: String(r.id), name: r.name, sortOrder: r.sortOrder }
}
function rowToItem(r: { id: number; name: string; description: string; price: string; category: string; sortOrder: number }): MenuItem {
  return { id: String(r.id), name: r.name, description: r.description, price: r.price, category: r.category, sortOrder: r.sortOrder }
}

// ---- API ----

export async function getCategories(): Promise<MenuCategory[]> {
  if (db) {
    const rows = await db.select().from(menuCategories).orderBy(asc(menuCategories.sortOrder))
    return rows.map(rowToCategory)
  }
  return [...memoryCategories].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function addCategory(name: string): Promise<MenuCategory> {
  if (db) {
    const [row] = await db.insert(menuCategories).values({ name, sortOrder: 0 }).returning()
    if (!row) throw new Error('Insert failed')
    const maxOrder = await db.select({ max: menuCategories.sortOrder }).from(menuCategories).then((r) => Math.max(0, ...r.map((x) => x.max ?? 0)))
    await db.update(menuCategories).set({ sortOrder: maxOrder + 1 }).where(eq(menuCategories.id, row.id))
    return rowToCategory({ ...row, sortOrder: maxOrder + 1 })
  }
  const id = String(nextCategoryId++)
  memoryCategories.push({ id, name, sortOrder: memoryCategories.length })
  return { id, name, sortOrder: memoryCategories.length - 1 }
}

export async function updateCategory(id: string, name: string): Promise<MenuCategory | null> {
  if (db) {
    const [row] = await db.update(menuCategories).set({ name }).where(eq(menuCategories.id, parseInt(id, 10))).returning()
    return row ? rowToCategory(row) : null
  }
  const i = memoryCategories.findIndex((c) => c.id === id)
  if (i === -1) return null
  memoryCategories[i].name = name
  return memoryCategories[i]
}

export async function deleteCategory(id: string): Promise<void> {
  if (db) {
    const name = (await db.select({ name: menuCategories.name }).from(menuCategories).where(eq(menuCategories.id, parseInt(id, 10))).then((r) => r[0]?.name))
    await db.delete(menuCategories).where(eq(menuCategories.id, parseInt(id, 10)))
    if (name) await db.delete(menuItems).where(eq(menuItems.category, name))
    return
  }
  const name = memoryCategories.find((c) => c.id === id)?.name
  memoryCategories = memoryCategories.filter((c) => c.id !== id)
  if (name) memoryItems = memoryItems.filter((i) => i.category !== name)
}

export async function getItems(): Promise<MenuItem[]> {
  if (db) {
    const rows = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder))
    return rows.map(rowToItem)
  }
  return [...memoryItems].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function addItem(data: { name: string; description: string; price: string; category: string }): Promise<MenuItem> {
  if (db) {
    const count = await db.select().from(menuItems).then((r) => r.length)
    const [row] = await db.insert(menuItems).values({ ...data, sortOrder: count }).returning()
    if (!row) throw new Error('Insert failed')
    return rowToItem(row)
  }
  const id = String(nextItemId++)
  const sortOrder = memoryItems.length
  memoryItems.push({ ...data, id, sortOrder })
  return { ...data, id, sortOrder }
}

export async function updateItem(id: string, data: Partial<{ name: string; description: string; price: string; category: string }>): Promise<MenuItem | null> {
  if (db) {
    const [row] = await db.update(menuItems).set(data as Record<string, unknown>).where(eq(menuItems.id, parseInt(id, 10))).returning()
    return row ? rowToItem(row) : null
  }
  const i = memoryItems.findIndex((it) => it.id === id)
  if (i === -1) return null
  memoryItems[i] = { ...memoryItems[i], ...data }
  return memoryItems[i]
}

export async function deleteItem(id: string): Promise<void> {
  if (db) {
    await db.delete(menuItems).where(eq(menuItems.id, parseInt(id, 10)))
    return
  }
  memoryItems = memoryItems.filter((it) => it.id !== id)
}

export async function getContact(): Promise<ContactInfo> {
  if (db) {
    const [row] = await db.select().from(contactInfo).where(eq(contactInfo.id, 1))
    if (row)
      return {
        heading: row.heading,
        intro: row.intro,
        address: row.address,
        addressLine2: row.addressLine2,
        phone: row.phone,
        email: row.email,
        hours: row.hours,
      }
  }
  return { ...memoryContact }
}

export async function updateContact(data: Partial<ContactInfo>): Promise<ContactInfo> {
  if (db) {
    await db.update(contactInfo).set(data as Record<string, unknown>).where(eq(contactInfo.id, 1))
    return getContact()
  }
  memoryContact = { ...memoryContact, ...data }
  return memoryContact
}

export async function getHome(): Promise<HomeContent> {
  if (db) {
    const [row] = await db.select().from(homeContent).where(eq(homeContent.id, 1))
    if (row) {
      const visible =
        row.discountVisible !== undefined ? row.discountVisible !== 0 : true
      return {
        heroWords: Array.isArray(row.heroWords) ? row.heroWords : ['Welcome', 'to', 'Veloria'],
        subtitle: row.subtitle,
        aboutTitle: row.aboutTitle,
        aboutText: row.aboutText,
        feature1Title: row.feature1Title,
        feature1Text: row.feature1Text,
        feature2Title: row.feature2Title,
        feature2Text: row.feature2Text,
        feature3Title: row.feature3Title,
        feature3Text: row.feature3Text,
        menuSectionTitle: row.menuSectionTitle,
        menuSectionSubtitle: row.menuSectionSubtitle,
        featuredMenuLimit: row.featuredMenuLimit,
        discountVisible: visible,
        discountTitle: row.discountTitle ?? 'Special Offer',
        discountSubtitle: row.discountSubtitle ?? '',
        discountCtaText: row.discountCtaText ?? 'Book Now',
        discountCtaLink: row.discountCtaLink ?? '/book-a-table',
        discountImageBase64: (row as { discountImageBase64?: string }).discountImageBase64 ?? '',
      }
    }
  }
  return { ...memoryHome }
}

export async function updateHome(data: Partial<HomeContent>): Promise<HomeContent> {
  if (db) {
    const payload: Record<string, unknown> = { ...data }
    if (Array.isArray(data.heroWords)) payload.heroWords = data.heroWords
    if (typeof data.discountVisible === 'boolean') payload.discountVisible = data.discountVisible ? 1 : 0
    if (typeof (data as { discountImageBase64?: string }).discountImageBase64 === 'string') payload.discountImageBase64 = (data as { discountImageBase64: string }).discountImageBase64
    await db.update(homeContent).set(payload).where(eq(homeContent.id, 1))
    return getHome()
  }
  memoryHome = { ...memoryHome, ...data }
  return memoryHome
}

export async function getBranding(): Promise<SiteBrandingData> {
  if (db) {
    const [row] = await db.select().from(siteBranding).where(eq(siteBranding.id, 1))
    if (row)
      return {
        faviconBase64: row.faviconBase64 ?? '',
        logoBase64: row.logoBase64 ?? '',
      }
  }
  return { ...memoryBranding }
}

export async function updateBranding(data: Partial<SiteBrandingData>): Promise<SiteBrandingData> {
  const current = await getBranding()
  const next: SiteBrandingData = {
    faviconBase64: data.faviconBase64 !== undefined ? data.faviconBase64 : current.faviconBase64,
    logoBase64: data.logoBase64 !== undefined ? data.logoBase64 : current.logoBase64,
  }
  if (db) {
    await db
      .insert(siteBranding)
      .values({ id: 1, faviconBase64: next.faviconBase64, logoBase64: next.logoBase64 })
      .onConflictDoUpdate({
        target: siteBranding.id,
        set: { faviconBase64: next.faviconBase64, logoBase64: next.logoBase64 },
      })
    return getBranding()
  }
  memoryBranding = next
  return memoryBranding
}

export async function getSettings(): Promise<SiteSettingsData> {
  if (db) {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1))
    if (row)
      return {
        currencySymbol: row.currencySymbol ?? '$',
        currencyCode: row.currencyCode ?? 'USD',
      }
  }
  return { ...memorySettings }
}

export async function updateSettings(data: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  const current = await getSettings()
  const next: SiteSettingsData = {
    currencySymbol: data.currencySymbol !== undefined ? data.currencySymbol : current.currencySymbol,
    currencyCode: data.currencyCode !== undefined ? data.currencyCode : current.currencyCode,
  }
  if (db) {
    await db
      .insert(siteSettings)
      .values({ id: 1, currencySymbol: next.currencySymbol, currencyCode: next.currencyCode })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { currencySymbol: next.currencySymbol, currencyCode: next.currencyCode },
      })
    return getSettings()
  }
  memorySettings = next
  return memorySettings
}

function rowToReservation(r: {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  specialRequests: string
  status: string | null
  respondedAt: Date | null
  createdAt: Date
}): Reservation {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date,
    time: r.time,
    guests: r.guests,
    specialRequests: r.specialRequests,
    status: (r.status as Reservation['status']) || 'pending',
    respondedAt: r.respondedAt ? r.respondedAt.toISOString() : undefined,
    createdAt: r.createdAt.toISOString(),
  }
}

export async function getReservations(): Promise<Reservation[]> {
  if (db) {
    const rows = await db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt))
    return rows.map(rowToReservation)
  }
  return [...memoryReservations]
    .map((r) => ({ ...r, status: (r.status || 'pending') as Reservation['status'] }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  if (db) {
    const [row] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id))
    return row ? rowToReservation(row) : null
  }
  const r = memoryReservations.find((r) => r.id === id)
  return r ? { ...r, status: (r.status || 'pending') as Reservation['status'] } : null
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['status']
): Promise<Reservation | null> {
  const respondedAt = new Date()
  if (db) {
    await db
      .update(reservationsTable)
      .set({ status, respondedAt })
      .where(eq(reservationsTable.id, id))
    return getReservationById(id)
  }
  const i = memoryReservations.findIndex((r) => r.id === id)
  if (i === -1) return null
  memoryReservations[i].status = status
  memoryReservations[i].respondedAt = respondedAt.toISOString()
  return memoryReservations[i]
}

export async function addReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'respondedAt'>): Promise<{ id: string; createdAt: string }> {
  const id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const createdAt = new Date().toISOString()
  if (db) {
    await db.insert(reservationsTable).values({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      specialRequests: data.specialRequests,
    })
    return { id, createdAt }
  }
  memoryReservations.push({ ...data, id, createdAt, status: 'pending' })
  return { id, createdAt }
}
