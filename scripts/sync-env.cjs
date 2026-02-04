const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

const envs = ['production', 'preview', 'development'];

lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const firstEqual = trimmed.indexOf('=');
    if (firstEqual === -1) return;

    const key = trimmed.substring(0, firstEqual);
    const value = trimmed.substring(firstEqual + 1);

    console.log(`Syncing ${key}...`);

    envs.forEach(env => {
        try {
            // Use printf to handle special characters slightly better, but simple pipe is usually okay for simple keys.
            // We use spawnSync or execSync. execSync with input option is easier in modern node.
            // But simple pipe in command line string:
            // echo "value" | npx vercel env add KEY env
            // Caution: If value has quotes or special shell chars, this might break.
            // Better to use input option of execSync if possible or just careful quoting.
            // Let's try passing via input option to avoid shell escaping issues.

            execSync(`npx vercel env add ${key} ${env} --force -y`, {
                input: value,
                stdio: ['pipe', 'pipe', 'pipe'], // pipe stdin, pipe stdout/stderr to avoid noise
                encoding: 'utf-8'
            });
            console.log(`  ✅ Added to ${env}`);
        } catch (e) {
            console.error(`  ❌ Failed to add to ${env}: ${e.message}`);
            // Don't exit, keep trying other vars
        }
    });
});

console.log('Done!');
