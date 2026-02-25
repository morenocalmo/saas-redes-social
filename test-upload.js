const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const filename = 'test-' + Date.now() + '.txt';
const bucketName = 'materials';
const uploadUrl = supabaseUrl + '/storage/v1/object/' + bucketName + '/' + filename;

console.log('Using URL:', uploadUrl);

fetch(uploadUrl, {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'text/plain',
    },
    body: Buffer.from('test content')
}).then(async r => {
    console.log('Status:', r.status);
    console.log('Response:', await r.text());
}).catch(console.error);
