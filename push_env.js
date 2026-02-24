const fs = require('fs');
const { execSync } = require('child_process');

const envFile = fs.readFileSync('.env', 'utf-8');
const lines = envFile.split('\n');

for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const firstEq = trimmed.indexOf('=');
        if (firstEq !== -1) {
            const key = trimmed.substring(0, firstEq);
            let value = trimmed.substring(firstEq + 1);

            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }

            if (key && value) {
                console.log(`Adding ${key} to Vercel...`);

                // Write value to a temp file because powershell piping with quotes can be tricky
                fs.writeFileSync('temp_env_val.txt', value);

                try {
                    // Push to production
                    execSync(`npx vercel env add ${key} production -y < temp_env_val.txt`, { stdio: 'inherit' });
                    // Push to preview and development as well to be safe
                    execSync(`npx vercel env add ${key} preview -y < temp_env_val.txt`, { stdio: 'inherit' });
                    execSync(`npx vercel env add ${key} development -y < temp_env_val.txt`, { stdio: 'inherit' });
                } catch (err) {
                    console.error(`Failed to add ${key}:`, err.message);
                }
            }
        }
    }
}

if (fs.existsSync('temp_env_val.txt')) {
    fs.unlinkSync('temp_env_val.txt');
}
console.log('All variables pushed successfully.');
