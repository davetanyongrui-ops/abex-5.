require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProducts() {
  const { data: products, error } = await supabase.from('products').select('id, name, specs_json');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const product of products) {
    let updated = false;
    let newName = product.name;
    let newSpecs = product.specs_json;

    if (newName && newName.includes("Abex Engineering") && !newName.includes("Abex Engineering Pte Ltd")) {
        newName = newName.replace(/Abex Engineering(?! Pte Ltd)/gi, "Abex Engineering Pte Ltd");
        updated = true;
    }

    if (newSpecs) {
        let str = JSON.stringify(newSpecs);
        let nextStr = str.replace(/Abex Engineering(?! Pte Ltd)/gi, "Abex Engineering Pte Ltd");
        if (str !== nextStr) {
            newSpecs = JSON.parse(nextStr);
            updated = true;
        }
    }

    if (updated) {
        console.log(`Updating product: ${product.name}`);
        const { error: updateError } = await supabase
            .from('products')
            .update({
                name: newName,
                specs_json: newSpecs
            })
            .eq('id', product.id);
        
        if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
        } else {
            console.log(`Successfully updated product ${product.id}`);
        }
    }
  }
}

updateProducts();
