const fs = require('fs');
const path = require('path');

const TITLES = {
  '2048': '2048',
  crossword: 'Crossword',
  math: 'Math',
  memory: 'Memory',
  trivia: 'Trivia',
  wordchain: 'Word Chain',
  wordscramble: 'Word Scramble',
};

const IMPORT = `import GameShell from "../components/GameShell";`;

for (const [slug, title] of Object.entries(TITLES)) {
  const filePath = path.join('src/app/games', slug, 'page.tsx');
  if (!fs.existsSync(filePath)) { console.log(`SKIP (not found): ${slug}`); continue; }
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('GameShell')) { console.log(`SKIP (already wired): ${slug}`); continue; }
  
  // Find the export default function name and its JSX return
  // Strategy: find `export default function` then find its final `return (` block
  const funcMatch = content.match(/export default function \w+\([^)]*\)/);
  if (!funcMatch) { console.log(`SKIP (no export default function): ${slug}`); continue; }
  
  const funcStart = content.indexOf(funcMatch[0]);
  const afterFunc = content.substring(funcStart);
  
  // Find the last `return (` in the function (the JSX return, not event cleanup returns)
  // The JSX return is the one that's followed by JSX tags (<div, <>, <motion, etc.)
  // We look for `return (` followed by newline + whitespace + '<'
  const jsxReturnRe = /return \(\s*\n\s*</g;
  let lastMatch = null;
  let m;
  while ((m = jsxReturnRe.exec(afterFunc)) !== null) {
    lastMatch = m;
  }
  
  if (!lastMatch) { console.log(`SKIP (no JSX return): ${slug}`); continue; }
  
  const returnPos = funcStart + lastMatch.index;
  const returnKeyword = 'return (';
  const afterReturn = content.substring(returnPos + returnKeyword.length);
  
  // Find the matching closing paren for this return (
  // Count parens/braces/JSX nesting - simpler: find last `);` followed by `}` at the end of file
  // The function's return closing is the last `  );` before the final `}`
  const lastFuncClose = content.lastIndexOf('\n}');
  // Find `);` just before last `}`
  const lastReturnClose = content.lastIndexOf('\n  );', lastFuncClose);
  const altReturnClose = content.lastIndexOf('\n);', lastFuncClose);
  
  let closePos = Math.max(lastReturnClose, altReturnClose);
  if (closePos < returnPos) { console.log(`SKIP (close before open): ${slug}`); continue; }
  
  // Add import
  const lines = content.split('\n');
  let lastImportIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) lastImportIdx = i;
  }
  lines.splice(lastImportIdx + 1, 0, IMPORT);
  content = lines.join('\n');
  
  // Recalculate positions after import insertion
  const importLineLen = IMPORT.length + 1; // +1 for \n
  const returnPosAdj = returnPos + importLineLen;
  const closePosAdj = closePos + importLineLen;
  
  // Wrap: insert GameShell open after `return (` and GameShell close before `);`
  const part1 = content.substring(0, returnPosAdj + returnKeyword.length);
  const inner = content.substring(returnPosAdj + returnKeyword.length, closePosAdj);
  const part3 = content.substring(closePosAdj);
  
  // Indent GameShell wrapper
  const wrapped = `\n    <GameShell gameSlug="${slug}" gameTitle="${title}">${inner}\n    </GameShell>`;
  content = part1 + wrapped + part3;
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`DONE: ${slug}`);
}
