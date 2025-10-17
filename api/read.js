import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { limit = 50, device_id } = req.query;

    let query = supabase
      .from('device_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(Math.min(200, Number(limit)));

    if (device_id) {
      query = query.eq('device_id', device_id);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
