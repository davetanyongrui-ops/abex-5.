require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePages() {
  const { data: pages, error } = await supabase.from('pages').select('id, slug, content_json, content_zh_json');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const page of pages) {
    let updated = false;
    let newContent = page.content_json;
    let newContentZh = page.content_zh_json;

    if (newContent) {
        let str = JSON.stringify(newContent);
        // Replace ABEX Engineering or Abex Engineering with Abex Engineering Pte Ltd
        // But only if it's not already followed by Pte Ltd
        let nextStr = str.replace(/Abex Engineering(?! Pte Ltd)/gi, "Abex Engineering Pte Ltd");
        if (str !== nextStr) {
            newContent = JSON.parse(nextStr);
            updated = true;
        }
    }

    if (newContentZh) {
        let strZh = JSON.stringify(newContentZh);
        let nextStrZh = strZh.replace(/Abex Engineering(?! Pte Ltd)/gi, "Abex Engineering Pte Ltd");
        if (strZh !== nextStrZh) {
            newContentZh = JSON.parse(nextStrZh);
            updated = true;
        }
    }

    if (updated) {
        console.log(`Updating page: ${page.slug}`);
        const { error: updateError } = await supabase
            .from('pages')
            .update({
                content_json: newContent,
                content_zh_json: newContentZh
            })
            .eq('id', page.id);
        
        if (updateError) {
            console.error(`Error updating ${page.slug}:`, updateError);
        } else {
            console.log(`Successfully updated ${page.slug}`);
        }
    }
  }
}

updatePages();
