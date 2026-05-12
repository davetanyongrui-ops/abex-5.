require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'products' });
  if (error) {
    // try querying pg_attribute manually if rpc is not there
    const { data: cols, error: e2 } = await supabase.from('products').select('*').limit(1);
    console.log(cols);
    return;
  }
  console.log(data);
}

check();
