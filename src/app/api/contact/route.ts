import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

// GET: public contact details
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_details ORDER BY id ASC LIMIT 1'
    );

    if (result.rows.length === 0) {
      // Sensible default if not configured yet
      return NextResponse.json(
        {
          restaurant_name: 'Veloria Restaurant',
          address: '70 Washington Square South,\nNew York, NY 10012, United States',
          phone: '+1 (123) 456-7890',
          email: 'hello@veloria.nyc',
          hours: 'Breakfast 7 – 11 AM\nLunch 12 – 3 PM\nDinner 6 – 11 PM',
          map_embed_url: '',
          notes: 'For last-minute availability, please call the restaurant directly.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact details' },
      { status: 500 }
    );
  }
}

// PUT: update contact details (admin only, upsert single row)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      restaurant_name,
      address,
      phone,
      email,
      hours,
      map_embed_url,
      notes,
    } = await request.json();

    const result = await pool.query(
      `INSERT INTO contact_details
        (id, restaurant_name, address, phone, email, hours, map_embed_url, notes)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         restaurant_name = EXCLUDED.restaurant_name,
         address = EXCLUDED.address,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         hours = EXCLUDED.hours,
         map_embed_url = EXCLUDED.map_embed_url,
         notes = EXCLUDED.notes
       RETURNING *`,
      [restaurant_name, address, phone, email, hours, map_embed_url, notes]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact details:', error);
    return NextResponse.json(
      { error: 'Failed to update contact details' },
      { status: 500 }
    );
  }
}

