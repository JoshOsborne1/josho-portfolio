const fs = require('fs');
const path = require('path');

const GAMES_DIR = 'src/app/games';

// Mapping of slug -> display title
const TITLES = {
  '2048': '2048',
  crossword: 'Crossword',
  flagle: 'Flagle',
  math: 'Math',
  memory: 'Memory',
  trivia: 'Trivia',
  travle: 'Travle',
  wordchain: 'Word Chain',
  wordscramble: 'Word Scramble',
  worldle: 'Worldle',
};

// GameShell import line
const IMPORT = `import GameShell from "../components/GameShell";`;

for (const [slug, title] of Object.entries(TITLES)) {
  const filePath = path.join(GAMES_DIR, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has GameShell
  if (content.includes('GameShell')) {
    console.log(`SKIP (already has GameShell): ${slug}`);
    continue;
  }
  
  // 1. Add import after first "use client"; or after last existing import
  // Find the last import line
  const lines = content.split('\n');
  let lastImportIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith('"use client"') || lines[i].startsWith("'use client'")) {
      lastImportIdx = i;
    }
  }
  // Insert GameShell import after last import
  lines.splice(lastImportIdx + 1, 0, IMPORT);
  content = lines.join('\n');
  
  // 2. Find the export default function and its return statement
  // Strategy: find `  return (` inside the page function and wrap its content
  // We'll find the outermost JSX in the return and wrap it with GameShell
  
  // Find the return ( position
  const returnMatch = content.match(/(\s+return \(\s*\n\s*)((?:<>|\<div))/);
  if (!returnMatch) {
    console.log(`SKIP (can't find return pattern): ${slug}`);
    fs.writeFileSync(filePath, content, 'utf8');
    continue;
  }
  
  const outerTag = returnMatch[2]; // either <> or <div
  
  // Wrap: replace `return (\n    <div` or `return (\n    <>` with GameShell wrapper
  // We need to find the closing tag too
  // Simplest approach: add GameShell as outermost wrapper by replacing the opening return tag
  
  // Replace `return (` with `return (` + GameShell wrapper start
  // And find the closing ); of the return and add GameShell closing before it
  
  // Find position of `  return (`
  const returnIdx = content.indexOf('\n  return (\n');
  if (returnIdx === -1) {
    console.log(`SKIP (no return found): ${slug}`);
    fs.writeFileSync(filePath, content, 'utf8');
    continue;
  }
  
  // Find the matching closing `  );` - it's the last `  );` in the file (the function's return close)
  const lastCloseIdx = content.lastIndexOf('\n  );\n}');
  if (lastCloseIdx === -1) {
    console.log(`SKIP (no closing found): ${slug}`);
    fs.writeFileSync(filePath, content, 'utf8');
    continue;
  }
  
  // Insert GameShell open after `return (`  and before first JSX line
  // Insert GameShell close before `  );`
  const before = content.substring(0, returnIdx);
  const returnSection = content.substring(returnIdx, lastCloseIdx + '\n  );\n}'.length);
  const after = content.substring(lastCloseIdx + '\n  );\n}'.length);
  
  // Wrap the return content
  // returnSection looks like: \n  return (\n    <div ...>\n      ...\n    </div>\n  );\n}
  const innerReturn = returnSection
    .replace('\n  return (\n', `\n  return (\n    <GameShell gameSlug="${slug}" gameTitle="${title}">\n`)
    .replace('\n  );\n}', '\n    </GameShell>\n  );\n}');
  
  const newContent = before + innerReturn + after;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`DONE: ${slug}`);
}
