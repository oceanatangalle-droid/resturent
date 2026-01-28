import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

// GET: public hero content
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM hero_content ORDER BY id ASC LIMIT 1'
    );

    if (result.rows.length === 0) {
      // Default content
      return NextResponse.json({
        badge_text: 'Great Moments with Great Tastes',
        title_line1: 'Great moments begin',
        title_line2: 'with',
        title_highlight: 'unforgettable tastes.',
        description: 'Step into Veloria, a warm corner of New York where refined flavors, candlelight, and curated playlists set the stage for evenings you will want to linger in.',
        button_text: 'Book A Table',
        find_us_text: '70 Washington Square South, New York, NY 10012, United States',
        opening_hours_text: 'Breakfast 7 – 11 AM • Lunch 12 – 3 PM • Dinner 6 – 11 PM',
        since_year: '1980',
        since_description: 'A New York classic for over 40 years.',
        badge_title: 'Michelin-level',
        badge_subtitle: 'Dining without the formality.',
        highlights_title: "Tonight's Highlights",
        highlight_items: JSON.stringify([
          { name: 'Black Truffle Risotto', price: '$29' },
          { name: 'Herb-Crusted Salmon', price: '$20' },
          { name: 'Wagyu Beef Burger', price: '$18' },
        ]),
        footer_text: 'Walk-ins welcome • Limited terrace seating',
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

// PUT: update hero content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      badge_text,
      title_line1,
      title_line2,
      title_highlight,
      description,
      button_text,
      find_us_text,
      opening_hours_text,
      since_year,
      since_description,
      badge_title,
      badge_subtitle,
      highlights_title,
      highlight_items,
      footer_text,
    } = body;

    const result = await pool.query(
      `INSERT INTO hero_content
        (id, badge_text, title_line1, title_line2, title_highlight, description, button_text, find_us_text, opening_hours_text, since_year, since_description, badge_title, badge_subtitle, highlights_title, highlight_items, footer_text)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (id) DO UPDATE SET
         badge_text = EXCLUDED.badge_text,
         title_line1 = EXCLUDED.title_line1,
         title_line2 = EXCLUDED.title_line2,
         title_highlight = EXCLUDED.title_highlight,
         description = EXCLUDED.description,
         button_text = EXCLUDED.button_text,
         find_us_text = EXCLUDED.find_us_text,
         opening_hours_text = EXCLUDED.opening_hours_text,
         since_year = EXCLUDED.since_year,
         since_description = EXCLUDED.since_description,
         badge_title = EXCLUDED.badge_title,
         badge_subtitle = EXCLUDED.badge_subtitle,
         highlights_title = EXCLUDED.highlights_title,
         highlight_items = EXCLUDED.highlight_items,
         footer_text = EXCLUDED.footer_text
       RETURNING *`,
      [
        badge_text,
        title_line1,
        title_line2,
        title_highlight,
        description,
        button_text,
        find_us_text,
        opening_hours_text,
        since_year,
        since_description,
        badge_title,
        badge_subtitle,
        highlights_title,
        typeof highlight_items === 'string' ? highlight_items : JSON.stringify(highlight_items),
        footer_text,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}
