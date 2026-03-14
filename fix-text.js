import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
files.push('../index.html'); // include index

const replacements = [
    { from: />Expertise<\/a>/g, to: '>Especialidad</a>' },
    { from: />Work<\/a>/g, to: '>Proyectos</a>' },
    { from: />Partners<\/a>/g, to: '>Aliados</a>' },
    { from: />Featured Work<\/a>/g, to: '>Proyectos Destacados</a>' },
    { from: />Nuestros Partners<\/a>/g, to: '>Nuestros Aliados</a>' }
];

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
