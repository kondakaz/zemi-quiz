import { readdir, readFile, mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
try {
  const names = (await readdir(resolve(root, 'questions'))).filter(n => n.endsWith('.json') && !n.startsWith('_')).sort();
  const questions = [];
  for (const name of names) {
    const fail = message => { throw new Error(`${name}: ${message}`); };
    if (!/^[a-z0-9-]+\.json$/.test(name)) fail('ファイル名は半角英小文字・数字・ハイフンにしてください');
    let q;
    try { q = JSON.parse(await readFile(resolve(root, 'questions', name), 'utf8')); }
    catch { fail('JSON の構文が正しくありません'); }
    if (!q || typeof q !== 'object' || Array.isArray(q)) fail('問題はオブジェクトで書いてください');
    for (const field of ['author', 'question', 'explanation']) if (typeof q[field] !== 'string' || !q[field].trim()) fail(`${field} は空でない文字列にしてください`);
    if (!Array.isArray(q.choices) || q.choices.length !== 4 || q.choices.some(c => typeof c !== 'string' || !c.trim())) fail('choices は空でない文字列をちょうど4つ指定してください');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) fail('answer は 0 から 3 の整数にしてください');
    questions.push(q);
  }
  if (!process.argv.includes('--check')) {
    const out = resolve(root, '_site');
    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });
    for (const item of ['index.html', 'css', 'js']) await cp(resolve(root, item), resolve(out, item), { recursive: true });
    await writeFile(resolve(out, 'questions.json'), JSON.stringify(questions, null, 2) + '\n');
  }
  console.log(`${questions.length}件の問題を確認しました`);
} catch (error) { console.error(`エラー: ${error.message}`); process.exitCode = 1; }
