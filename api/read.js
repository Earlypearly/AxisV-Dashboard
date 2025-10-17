// api/read.js - GET endpoint returns latest rows
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { limit = 50 } = req.query;

  const { data, error } = await supabase
    .from('device_data')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(Math.min(200, Number(limit)));

  if (error) {
    console.error('Supabase read error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};
