
import { put } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, contentType, content } = req.body;
    
    // Konversi base64 kembali ke Buffer jika data dikirim sebagai string base64
    const buffer = Buffer.from(content.split(',')[1], 'base64');

    const blob = await put(`chef-anton/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType: contentType || 'image/jpeg',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json(blob);
  } catch (error: any) {
    console.error('Server Upload Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
