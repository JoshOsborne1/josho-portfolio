const fs = require('fs');
const IMPORT = 'import GameShell from "../components/GameShell";';
['flagle','travle','worldle'].forEach(slug => {
  const f = `src/app/games/${slug}/page.tsx`;
  let c = fs.readFileSync(f,'utf8');
  // Remove the misplaced import wherever it is
  c = c.split('\n').filter(l => l.trim() !== IMPORT).join('\n');
  // Find last import line
  const lines = c.split('\n');
  let lastImport = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if ((l.startsWith('import ') && l.endsWith(';')) || /^} from ['"].*['"];$/.test(l)) {
      lastImport = i;
    }
  }
  lines.splice(lastImport + 1, 0, IMPORT);
  fs.writeFileSync(f, lines.join('\n'), 'utf8');
  console.log('Fixed:', slug, '- import at line', lastImport + 2);
});
