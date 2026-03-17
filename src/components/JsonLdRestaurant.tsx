import { getContact, getSettings } from '@/lib/store'

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  ''

export async function JsonLdRestaurant() {
  const [contact, settings] = await Promise.all([getContact(), getSettings()])
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  const sameAs: string[] = []
  if (settings?.facebookUrl) sameAs.push(settings.facebookUrl)
  if (settings?.instagramUrl) sameAs.push(settings.instagramUrl)
  if (settings?.googleBusinessUrl) sameAs.push(settings.googleBusinessUrl)
  if (settings?.tripadvisorUrl) sameAs.push(settings.tripadvisorUrl)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteName,
    description: 'Experience exceptional cuisine in an elegant atmosphere. Reserve your table and explore our menu.',
    url: baseUrl || undefined,
    telephone: contact?.phone || undefined,
    email: contact?.email || undefined,
    address:
      contact?.address || contact?.addressLine2
        ? {
            '@type': 'PostalAddress',
            streetAddress: [contact.address, contact.addressLine2].filter(Boolean).join(', '),
          }
        : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        url: `${baseUrl}/book-a-table`,
      },
    },
  }

  if (contact?.hours) {
    schema.openingHours = contact.hours
  }

  const ratingVal = settings?.ratingValue
  const reviewCnt = settings?.reviewCount
  if (ratingVal != null && ratingVal !== '' && typeof reviewCnt === 'number' && reviewCnt > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(ratingVal),
      reviewCount: reviewCnt,
      bestRating: '5',
    }
  }

  if (settings?.priceRange?.trim()) {
    schema.priceRange = settings.priceRange.trim()
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
