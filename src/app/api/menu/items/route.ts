import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section_id');

    let query = 'SELECT * FROM menu_items';
    let params: any[] = [];

    if (sectionId) {
      query += ' WHERE section_id = $1';
      params.push(sectionId);
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      section_id,
      name,
      description,
      price,
      image_src,
      image_data,
      image_mime_type,
      display_order,
    } = await request.json();

    if (!section_id || !name || !price) {
      return NextResponse.json(
        { error: 'Section ID, name, and price are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO menu_items (section_id, name, description, price, image_src, image_data, image_mime_type, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        section_id,
        name,
        description || null,
        price,
        image_src || null,
        image_data || null,
        image_mime_type || null,
        display_order || 0,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
