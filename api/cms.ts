
import { db } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let client;
  try {
    client = await db.connect();

    // Inisialisasi tabel jika belum ada dengan penanganan error yang lebih baik
    await client.sql`
      CREATE TABLE IF NOT EXISTS chef_branding_cms (
        id SERIAL PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (req.method === 'GET') {
      const { rows } = await client.sql`SELECT config FROM chef_branding_cms ORDER BY id DESC LIMIT 1;`;
      return res.status(200).json(rows[0]?.config || null);
    }

    if (req.method === 'POST') {
      const config = req.body;
      if (!config) {
        return res.status(400).json({ error: 'Payload data is missing' });
      }

      // Gunakan parameterisasi objek secara langsung, @vercel/postgres sql helper 
      // akan menangani konversi objek JS ke JSON string untuk kolom JSONB.
      await client.sql`
        INSERT INTO chef_branding_cms (config)
        VALUES (${JSON.stringify(config)});
      `;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      await client.sql`DELETE FROM chef_branding_cms;`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Server DB Error:', error);
    // Berikan detail error yang lebih spesifik jika memungkinkan untuk debugging
    return res.status(500).json({ 
      error: 'Vercel Postgres Error', 
      message: error.message,
      detail: error.detail || 'Check database connection and permissions'
    });
  } finally {
    if (client) client.release();
  }
}
