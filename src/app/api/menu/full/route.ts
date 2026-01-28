import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch all sections with their items
    const sectionsResult = await pool.query(
      'SELECT * FROM menu_sections ORDER BY display_order ASC, id ASC'
    );

    const sections = sectionsResult.rows;

    // Fetch all items grouped by section
    const itemsResult = await pool.query(
      'SELECT * FROM menu_items ORDER BY section_id, display_order ASC, id ASC'
    );

    const items = itemsResult.rows;

    // Group items by section
    const sectionsWithItems = sections.map((section) => ({
      ...section,
      items: items.filter((item) => item.section_id === section.id),
    }));

    return NextResponse.json(sectionsWithItems);
  } catch (error) {
    console.error('Error fetching full menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
