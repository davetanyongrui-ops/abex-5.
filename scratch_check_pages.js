require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: pages, error } = await supabase.from('pages').select('slug, content_json, content_zh_json');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const page of pages) {
    console.log(`Checking page: ${page.slug}`);
    let jsonStr = JSON.stringify(page.content_json);
    if (jsonStr.includes("Abex Engineering") && !jsonStr.includes("Abex Engineering Pte Ltd")) {
        console.log(`Found missing Pte Ltd in ${page.slug} (English)`);
    }
    
    let jsonZhStr = JSON.stringify(page.content_zh_json);
    if (jsonZhStr.includes("Abex Engineering") && !jsonZhStr.includes("Abex Engineering Pte Ltd")) {
        console.log(`Found missing Pte Ltd in ${page.slug} (Chinese)`);
    }
  }
}

check();
