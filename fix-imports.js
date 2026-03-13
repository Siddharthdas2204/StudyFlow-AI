import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, 'artifacts/api-server/src');

function fixImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixImports(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Match relative imports that don't already have an extension
            const fixedContent = content.replace(/from\s+['"](\.\.?\/[^'"]+)['"]/g, (match, p1) => {
                if (!p1.endsWith('.js') && !p1.endsWith('.json')) {
                    return `from "${p1}.js"`;
                }
                return match;
            });
            if (content !== fixedContent) {
                fs.writeFileSync(fullPath, fixedContent);
                console.log(`Fixed imports in ${fullPath}`);
            }
        }
    }
}

fixImports(root);
