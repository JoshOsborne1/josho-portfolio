const fs = require('fs');
const content = fs.readFileSync('src/app/games/page.tsx', 'utf8');
const lines = content.split('\n');

// Find the grid section boundaries
const gridStart = lines.findIndex(l => l.includes('Games Grid'));
// Find end: the closing </div> after the games.map closes
// It's line 581 (0-indexed) based on our check
const gridEnd = 581;

const newGrid = `          {/* Games Grid - by category */}
          <div className="pb-12 space-y-10">
            {Object.entries(CATEGORY_LABELS).map(([catId, { label, color, slugs }]) => {
              const catGames = games.filter(g => slugs.includes(g.slug));
              const catDone = catGames.filter(g => statuses[g.slug] != null).length;
              return (
                <div key={catId}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: \`linear-gradient(90deg, \${color}55, transparent)\` }} />
                    <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: \`\${color}18\`, color }}>
                      {label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>{catDone}/{catGames.length}</span>
                    <div className="h-px flex-1" style={{ background: \`linear-gradient(90deg, transparent, \${color}55)\` }} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {catGames.map((game, index) => {
                      const done = statuses[game.slug] != null;
                      const isLocked = !done && !isPro && completedCount >= DAILY_LIMIT;
                      return (
                        <motion.div
                          key={game.slug}
                          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.04 }}
                          onMouseEnter={() => setHoveredSlug(game.slug)}
                          onMouseLeave={() => setHoveredSlug(null)}
                        >
                          <Link
                            href={isLocked ? '#' : \`/games/\${game.slug}\`}
                            onClick={isLocked ? (e) => { e.preventDefault(); setShowProGate(true); } : undefined}
                            className="no-underline block h-full"
                          >
                            <motion.div
                              className="p-4 h-full flex flex-col gap-3 cursor-pointer relative overflow-hidden"
                              style={{
                                background: isLocked ? 'rgba(220,220,220,0.3)' : done ? 'rgba(240,255,244,0.75)' : 'rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(24px)',
                                borderRadius: 24,
                                boxShadow: done ? '0 8px 24px rgba(74,222,128,0.10), inset 0 2px 4px rgba(255,255,255,0.8)' : '0 8px 24px rgba(0,0,0,0.04), inset 0 2px 4px rgba(255,255,255,0.8)',
                                border: done ? '1px solid rgba(74,222,128,0.25)' : isLocked ? '1px solid rgba(200,200,200,0.3)' : '1px solid rgba(255,255,255,0.8)',
                              }}
                              whileHover={{ boxShadow: '0 12px 32px rgba(167,139,250,0.15)', y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {done && (
                                <div className="absolute top-3 right-3 rounded-full flex items-center justify-center font-black text-[10px]"
                                  style={{ width: 20, height: 20, background: 'linear-gradient(135deg,#86EFAC,#4ADE80)', color: '#166534' }}>✓</div>
                              )}
                              {isLocked && <div className="absolute top-3 right-3 text-sm opacity-60">🔒</div>}
                              <div className="rounded-2xl overflow-hidden flex items-center justify-center self-start"
                                style={{ width: 60, height: 60, background: \`linear-gradient(135deg, \${game.canvasColor[0]}22 0%, \${game.canvasColor[1]}22 100%)\` }}>
                                <GamePreviewCanvas draw={game.drawPreview} isHovered={hoveredSlug === game.slug} />
                              </div>
                              <div className="flex flex-col gap-1 flex-1">
                                <div className="font-black text-sm" style={{ color: '#1e1b4b' }}>{game.title}</div>
                                <div className="font-bold text-xs leading-snug" style={{ color: '#64748b' }}>{game.desc}</div>
                                {done && <div className="font-bold text-[10px] mt-0.5" style={{ color: '#4ADE80' }}>View result</div>}
                                {isLocked && <div className="font-bold text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>Limit reached</div>}
                              </div>
                              <div className="flex items-center justify-between">
                                <DifficultyDots level={game.difficulty} />
                                <motion.div className="px-3 py-1 rounded-xl font-black text-xs"
                                  style={{
                                    background: done ? 'linear-gradient(180deg,#86EFAC,#4ADE80)' : isLocked ? 'rgba(200,200,200,0.4)' : 'linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)',
                                    boxShadow: '0 4px 12px rgba(167,139,250,0.3)',
                                    color: done ? '#166534' : isLocked ? '#9ca3af' : '#fff',
                                  }}>
                                  {done ? 'Review' : isLocked ? 'Locked' : 'Play'}
                                </motion.div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>`;

const before = lines.slice(0, gridStart);
const after = lines.slice(gridEnd + 1);
const result = [...before, ...newGrid.split('\n'), ...after].join('\n');
fs.writeFileSync('src/app/games/page.tsx', result, 'utf8');
console.log('Done. Lines:', result.split('\n').length);
