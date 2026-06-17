const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Simple .env.local parser
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        value = value.replace(/^['"](.*)['"]$/, '$1');
        process.env[key] = value;
      }
    });
  } catch (e) {
    console.log('No .env.local found or error parsing it. Using existing environment variables.');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdminPassword() {
  const email = 'admin@mtu.ng';
  const plainTextPassword = 'password123'; // The password you will use to log in
  
  // Generate a salt and hash the password
  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(plainTextPassword, salt);

  console.log(`Updating password for ${email}...`);

  const { data, error } = await supabase
    .from('admins')
    .update({ password_hash: newHash })
    .eq('email', email)
    .select('email');

  if (error) {
    console.error('Error updating password:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(`Admin ${email} not found. Creating a new admin record...`);
    const { data: insertData, error: insertError } = await supabase
      .from('admins')
      .insert({ email: email, password_hash: newHash })
      .select('email');
      
    if (insertError) {
      console.error('Error inserting admin:', insertError.message);
      process.exit(1);
    }
    console.log('Insert successful:', insertData);
  } else {
    console.log('Update successful:', data);
  }
  
  console.log(`\nYou can now log in with:\nEmail: ${email}\nPassword: ${plainTextPassword}`);
}

updateAdminPassword();
