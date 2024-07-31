import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const rows = await sql("SELECT * FROM users");

  return Response.json({ rows })
}