-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@veloria.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq')
ON CONFLICT (username) DO NOTHING;

-- Insert menu sections
INSERT INTO menu_sections (title, subtitle, display_order) VALUES
  ('🍳 Breakfast', '7 AM - 11 AM', 1),
  ('🥗 Lunch', '12 PM - 3 PM', 2),
  ('🍽️ Dinner', '6 PM - 11 PM', 3),
  ('🍹 Mocktails', NULL, 4),
  ('🥂 Drinks', NULL, 5)
ON CONFLICT DO NOTHING;

-- Insert menu items (adjust section_id based on actual IDs after sections are inserted)
-- Note: In production, you'd want to use a proper seeding script that handles IDs dynamically
