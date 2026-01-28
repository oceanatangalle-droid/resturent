-- Create menu_sections table
CREATE TABLE IF NOT EXISTS menu_sections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES menu_sections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(50) NOT NULL,
  image_src VARCHAR(500),
  -- Optional inline image data (Base64) and mime type
  image_data TEXT,
  image_mime_type VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact details (single row)
CREATE TABLE IF NOT EXISTS contact_details (
  id INTEGER PRIMARY KEY DEFAULT 1,
  restaurant_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(100),
  email VARCHAR(255),
  hours TEXT,
  map_embed_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero section content (single row)
CREATE TABLE IF NOT EXISTS hero_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  badge_text VARCHAR(255),
  title_line1 VARCHAR(255),
  title_line2 VARCHAR(255),
  title_highlight VARCHAR(255),
  description TEXT,
  button_text VARCHAR(100),
  find_us_text TEXT,
  opening_hours_text TEXT,
  since_year VARCHAR(50),
  since_description TEXT,
  badge_title VARCHAR(255),
  badge_subtitle TEXT,
  highlights_title VARCHAR(255),
  highlight_items TEXT, -- JSON array of {name, price}
  footer_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About section content (single row)
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  section_title VARCHAR(255),
  main_title TEXT,
  paragraph1 TEXT,
  paragraph2 TEXT,
  since_year VARCHAR(50),
  since_description TEXT,
  seats_number VARCHAR(50),
  seats_description TEXT,
  style_name VARCHAR(255),
  style_description TEXT,
  room_title VARCHAR(255),
  room_paragraph1 TEXT,
  room_paragraph2 TEXT,
  room_footer_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations/Bookings
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_menu_items_section_id ON menu_items(section_id);
CREATE INDEX IF NOT EXISTS idx_menu_sections_display_order ON menu_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_menu_sections_updated_at BEFORE UPDATE ON menu_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_details_updated_at BEFORE UPDATE ON contact_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for reservations
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
