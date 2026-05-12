require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const productData = {
      name: "Dummy Product",
      slug: "dummy-product-" + Date.now(),
      image_url: "",
      certifications: [],
      specs_json: {},
      price_sgd: 0
  };
  
  const { data, error } = await supabase.from('products').insert([productData]);
  console.log("Insert result:", error ? error.message : "Success");
  if (error) console.log(error);
}

check();
