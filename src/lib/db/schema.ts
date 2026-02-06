import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core'

export const menuCategories = pgTable('menu_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  price: varchar('price', { length: 64 }).notNull().default(''),
  category: varchar('category', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const contactInfo = pgTable('contact_info', {
  id: integer('id').primaryKey().default(1),
  heading: varchar('heading', { length: 255 }).notNull().default('Get in Touch'),
  intro: text('intro').notNull().default(''),
  address: varchar('address', { length: 512 }).notNull().default(''),
  addressLine2: varchar('address_line2', { length: 512 }).notNull().default(''),
  phone: varchar('phone', { length: 64 }).notNull().default(''),
  email: varchar('email', { length: 255 }).notNull().default(''),
  hours: text('hours').notNull().default(''),
})

export const homeContent = pgTable('home_content', {
  id: integer('id').primaryKey().default(1),
  heroWords: jsonb('hero_words').$type<string[]>().notNull().default(['Welcome', 'to', 'Veloria']),
  subtitle: text('subtitle').notNull().default(''),
  aboutTitle: varchar('about_title', { length: 255 }).notNull().default('About Veloria'),
  aboutText: text('about_text').notNull().default(''),
  feature1Title: varchar('feature1_title', { length: 255 }).notNull().default('Fine Dining'),
  feature1Text: text('feature1_text').notNull().default(''),
  feature2Title: varchar('feature2_title', { length: 255 }).notNull().default('Elegant Atmosphere'),
  feature2Text: text('feature2_text').notNull().default(''),
  feature3Title: varchar('feature3_title', { length: 255 }).notNull().default('Quality Service'),
  feature3Text: text('feature3_text').notNull().default(''),
  menuSectionTitle: varchar('menu_section_title', { length: 255 }).notNull().default('Featured from Our Menu'),
  menuSectionSubtitle: text('menu_section_subtitle').notNull().default(''),
  featuredMenuLimit: integer('featured_menu_limit').notNull().default(6),
  // Discount section (below hero on home page)
  discountVisible: integer('discount_visible').notNull().default(1),
  discountTitle: varchar('discount_title', { length: 255 }).notNull().default('Special Offer'),
  discountSubtitle: text('discount_subtitle').notNull().default('Enjoy 20% off your next dinner when you book online. Limited time only.'),
  discountCtaText: varchar('discount_cta_text', { length: 64 }).notNull().default('Book Now'),
  discountCtaLink: varchar('discount_cta_link', { length: 255 }).notNull().default('/book-a-table'),
  discountImageBase64: text('discount_image_base64').notNull().default(''),
})

// Site branding: favicon and logo stored as base64 (editable in Admin > Branding)
export const siteBranding = pgTable('site_branding', {
  id: integer('id').primaryKey().default(1),
  faviconBase64: text('favicon_base64').notNull().default(''),
  logoBase64: text('logo_base64').notNull().default(''),
})

// Site settings (currency, social links, site name, etc.) – editable in Admin > Settings
export const siteSettings = pgTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  siteName: varchar('site_name', { length: 128 }).notNull().default('Veloria Restaurant'),
  currencySymbol: varchar('currency_symbol', { length: 16 }).notNull().default('$'),
  currencyCode: varchar('currency_code', { length: 8 }).notNull().default('USD'),
  facebookUrl: varchar('facebook_url', { length: 512 }).notNull().default(''),
  whatsappUrl: varchar('whatsapp_url', { length: 512 }).notNull().default(''),
  instagramUrl: varchar('instagram_url', { length: 512 }).notNull().default(''),
  googleBusinessUrl: varchar('google_business_url', { length: 512 }).notNull().default(''),
  tripadvisorUrl: varchar('tripadvisor_url', { length: 512 }).notNull().default(''),
})

export const reservations = pgTable('reservations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 64 }).notNull(),
  date: varchar('date', { length: 32 }).notNull(),
  time: varchar('time', { length: 32 }).notNull(),
  guests: varchar('guests', { length: 8 }).notNull(),
  specialRequests: text('special_requests').notNull().default(''),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 64 }).notNull().default(''),
  message: text('message').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type SiteBrandingRow = typeof siteBranding.$inferSelect
export type SiteSettingsRow = typeof siteSettings.$inferSelect
export type MenuCategoryRow = typeof menuCategories.$inferSelect
export type MenuItemRow = typeof menuItems.$inferSelect
export type ContactInfoRow = typeof contactInfo.$inferSelect
export type HomeContentRow = typeof homeContent.$inferSelect
export type ReservationRow = typeof reservations.$inferSelect
export type ContactSubmissionRow = typeof contactSubmissions.$inferSelect