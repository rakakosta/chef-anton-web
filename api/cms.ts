
import { db } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let client;
  try {
    client = await db.connect();

    // Pastikan tabel memiliki primary key tetap untuk logika UPSERT
    await client.sql`
      CREATE TABLE IF NOT EXISTS chef_branding_cms (
        id INTEGER PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (req.method === 'GET') {
      // Ambil data dari baris utama (ID 1)
      const { rows } = await client.sql`SELECT config FROM chef_branding_cms WHERE id = 1 LIMIT 1;`;
      if (rows.length === 0) {
        // Fallback untuk migrasi data dari format lama jika ada
        const fallback = await client.sql`SELECT config FROM chef_branding_cms ORDER BY updated_at DESC LIMIT 1;`;
        return res.status(200).json(fallback.rows[0]?.config || null);
      }
      return res.status(200).json(rows[0]?.config || null);
    }

    if (req.method === 'POST') {
      const config = req.body;
      if (!config) {
        return res.status(400).json({ error: 'Payload data is missing' });
      }

      const jsonStr = JSON.stringify(config);
      // Logika UPSERT: Jika baris ID 1 ada, timpa data config. Jika tidak, buat baru.
      await client.sql`
        INSERT INTO chef_branding_cms (id, config, updated_at)
        VALUES (1, ${jsonStr}, NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
          config = EXCLUDED.config,
          updated_at = NOW();
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
    return res.status(500).json({ 
      error: 'Vercel Postgres Error', 
      message: error.message,
      detail: error.detail || 'Gangguan pada sinkronisasi database'
    });
  } finally {
    if (client) client.release();
  }
}
