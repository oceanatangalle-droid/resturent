import bcrypt from 'bcryptjs';
import pool from './db';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function findUserByUsername(username: string): Promise<AdminUser | null> {
  const result = await pool.query(
    'SELECT * FROM admin_users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function findUserByEmail(email: string): Promise<AdminUser | null> {
  const result = await pool.query(
    'SELECT * FROM admin_users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function createAdminUser(
  username: string,
  email: string,
  password: string
): Promise<AdminUser> {
  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    'INSERT INTO admin_users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [username, email, passwordHash]
  );
  return result.rows[0];
}
