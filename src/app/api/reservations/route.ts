import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';

// GET: list reservations (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (date) {
      paramCount++;
      query += ` AND reservation_date = $${paramCount}`;
      params.push(date);
    }

    query += ' ORDER BY reservation_date DESC, reservation_time DESC, created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// POST: create new reservation (public)
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, reservation_date, reservation_time, guests, notes } = await request.json();

    if (!name || !email || !reservation_date || !reservation_time || !guests) {
      return NextResponse.json(
        { error: 'Name, email, date, time, and guests are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, guests, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone || null, reservation_date, reservation_time, parseInt(guests), notes || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
