
import { put } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, contentType, content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid content data' });
    }

    // Validasi apakah content adalah data URL base64
    const parts = content.split(',');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Pastikan folder atau prefix unik untuk meminimalisir konflik
    const blob = await put(`chef-anton/${Date.now()}-${filename.replace(/[^a-zA-Z0-0.]/g, '_')}`, buffer, {
      access: 'public',
      contentType: contentType || 'image/jpeg',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json(blob);
  } catch (error: any) {
    console.error('Server Upload Error:', error);
    return res.status(500).json({ 
      error: 'Upload Failed', 
      message: error.message 
    });
  }
}
