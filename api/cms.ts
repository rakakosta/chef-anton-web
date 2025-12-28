
import { db } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await db.connect();

    // Inisialisasi tabel jika belum ada
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
    return res.status(500).json({ error: error.message });
  }
}
