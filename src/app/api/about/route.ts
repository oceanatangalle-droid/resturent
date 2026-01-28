import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

// GET: public about content
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM about_content ORDER BY id ASC LIMIT 1'
    );

    if (result.rows.length === 0) {
      // Default content
      return NextResponse.json({
        section_title: 'About Veloria',
        main_title: 'A neighborhood classic with a cinematic glow.',
        paragraph1: 'Veloria is imagined as a warm, modern restaurant tucked beside Washington Square, inspired by the atmosphere of the Veloria – Premium Framer Restaurant Template. We translated its visual identity into this Next.js experience: deep blacks, soft golden highlights, and minimal typography that lets the food do the talking.',
        paragraph2: 'From breakfast to late-night mocktails, the menu is designed around shared plates, bright flavors, and a laid-back rhythm. The energy is relaxed yet intentional—perfect for unhurried conversations, anniversaries, and everything in between.',
        since_year: '1980',
        since_description: 'Four decades of hospitality in the heart of New York.',
        seats_number: '64',
        seats_description: 'Intimate booths, window tables, and bar seating.',
        style_name: 'Modern European',
        style_description: 'Seasonal produce and classic techniques with a twist.',
        room_title: 'The Room',
        room_paragraph1: 'Low lighting, brass details, and soft playlists shape the atmosphere. The palette is dark and cinematic, echoing the original template\'s mood while remaining timeless.',
        room_paragraph2: 'We designed this clone to be a starting point for real restaurants: fully built in Next.js and animated with Framer Motion, ready for your own brand, photography, and content.',
        room_footer_text: 'Built as a faithful, code-based interpretation of the Veloria Framer template.',
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

// PUT: update about content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      section_title,
      main_title,
      paragraph1,
      paragraph2,
      since_year,
      since_description,
      seats_number,
      seats_description,
      style_name,
      style_description,
      room_title,
      room_paragraph1,
      room_paragraph2,
      room_footer_text,
    } = body;

    const result = await pool.query(
      `INSERT INTO about_content
        (id, section_title, main_title, paragraph1, paragraph2, since_year, since_description, seats_number, seats_description, style_name, style_description, room_title, room_paragraph1, room_paragraph2, room_footer_text)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (id) DO UPDATE SET
         section_title = EXCLUDED.section_title,
         main_title = EXCLUDED.main_title,
         paragraph1 = EXCLUDED.paragraph1,
         paragraph2 = EXCLUDED.paragraph2,
         since_year = EXCLUDED.since_year,
         since_description = EXCLUDED.since_description,
         seats_number = EXCLUDED.seats_number,
         seats_description = EXCLUDED.seats_description,
         style_name = EXCLUDED.style_name,
         style_description = EXCLUDED.style_description,
         room_title = EXCLUDED.room_title,
         room_paragraph1 = EXCLUDED.room_paragraph1,
         room_paragraph2 = EXCLUDED.room_paragraph2,
         room_footer_text = EXCLUDED.room_footer_text
       RETURNING *`,
      [
        section_title,
        main_title,
        paragraph1,
        paragraph2,
        since_year,
        since_description,
        seats_number,
        seats_description,
        style_name,
        style_description,
        room_title,
        room_paragraph1,
        room_paragraph2,
        room_footer_text,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}
