const fs = require('fs');
const path = require('path');

const dirs = [
    './components',
    '.',
    '../Cuidapp-Assistant-App/components',
    '../Cuidapp-Assistant-App'
];

let report = [];

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            // no deep recurse
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) results.push(fullPath);
        }
    });
    return results;
}

let allFiles = [];
dirs.forEach(d => {
    allFiles = allFiles.concat(walk(d));
});

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    let improvements = [];

    // 1. VISUAL COHERENCE (Remove black, adjust to primary/secondary colors)
    if (content.match(/#000000|text-black|text-slate-900|bg-black/gi)) {
        content = content.replace(/#000000/gi, '#6C5CE7');
        content = content.replace(/text-black/gi, 'text-primary');
        content = content.replace(/text-slate-900/gi, 'text-primary');
        content = content.replace(/bg-black/gi, 'bg-primary');
        improvements.push('Eliminado color negro y reemplazado por paleta oficial (#6C5CE7 / primary)');
    }

    // 2. Remove uppercase from tailwind classes
    if (content.match(/uppercase/g)) {
        content = content.replace(/\buppercase\b/g, '');
        improvements.push('Eliminadas clases uppercase para asegurar Sentence case en UI');
    }

    // 3. NAVEGACIÓN: Asegúrate de que el 'padding-bottom: 160px' esté aplicado en todas las pantallas
    let changedPadding = false;
    content = content.replace(/<(div|main)[^>]*className="([^"]*(h-screen|min-h-screen)[^"]*)"/g, (match, tag, cls) => {
        if (!cls.includes('pb-[160px]')) {
            changedPadding = true;
            cls = cls.replace(/pb-\[?\d+px\]?|pb-\d+/g, '').trim();
            cls = cls + ' pb-[160px]';
            return match.replace(/className="[^"]+"/, `className="${cls.replace(/\s+/g, ' ')}"`);
        }
        return match;
    });
    if (changedPadding) {
        improvements.push('Añadido pb-[160px] en el contenedor principal de la vista (Evita bloqueos de scroll)');
    }

    // 4. LIMPIEZA DE CÓDIGO (Hardcoded vars)
    // Only target states so we don't break mock lists or placeholders if not needed, but rule says "como Ramón o Carlos por defecto"
    if (content.match(/useState\(['"](Carlos|Elena|Ramón|Ramon).*?['"]\)/gi)) {
        content = content.replace(/useState\(['"](Carlos|Elena|Ramón|Ramon).*?['"]\)/gi, 'useState("")');
        improvements.push('Eliminadas variables default hardcoded (Carlos, Elena)');
    }

    // 5. TIPOGRAFÍA (Asegura font-italic elegante)
    let changedTypo = false;
    content = content.replace(/<(button|h[1-3])[^>]*className="([^"]+)"/g, (match, tag, cls) => {
        if (!cls.includes('italic')) {
            changedTypo = true;
            cls = cls + ' italic font-bold';
            return match.replace(/className="[^"]+"/, `className="${cls}"`);
        }
        return match;
    });
    if (changedTypo) {
        improvements.push('Añadida clase italic y font-bold a títulos y botones.');
    }

    if (content !== original) {
        content = content.replace(/ {2,}/g, ' ');
        fs.writeFileSync(file, content, 'utf8');
        report.push({
            file: file,
            improvements: [...new Set(improvements)]
        });
    }
});

fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2));
console.log("Audit complete. Affected files: " + report.length);
