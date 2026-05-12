require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCertsText() {
  const { data: pages, error } = await supabase.from('pages').select('id, slug, content_json');
  if (error) {
    console.error(error);
    return;
  }
  
  const oldText = "ISO 9001, SGBC, Setso, UL Listed certified quality control ensures every unit meets extreme durability standards.";
  const newText = "ISO 9001, SGBC, Setsco, bizSAFE Level 3 certified quality control ensures every unit meets extreme durability standards.";

  for (const page of pages) {
    if (page.content_json) {
        let str = JSON.stringify(page.content_json);
        if (str.includes(oldText)) {
            console.log(`Updating certs text in page: ${page.slug}`);
            const nextStr = str.replace(oldText, newText);
            const { error: updateError } = await supabase
                .from('pages')
                .update({ content_json: JSON.parse(nextStr) })
                .eq('id', page.id);
            
            if (updateError) {
                console.error(`Error updating ${page.slug}:`, updateError);
            } else {
                console.log(`Successfully updated ${page.slug}`);
            }
        }
    }
  }
}

updateCertsText();
