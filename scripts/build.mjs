import { readdir, readFile, mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
let currentFile = '';

// Actions の注釈で特殊文字が制御文字として解釈されないようにする。
function escapeAnnotation(value) {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

try {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const outputArgs = args.filter(arg => arg !== '--check');
  if (outputArgs.length > 1 || outputArgs.some(arg => arg.startsWith('--'))) {
    throw new Error('使い方: node scripts/build.mjs [--check] [出力先]');
  }
  const out = resolve(root, outputArgs[0] || '_site');
  // ソースやその親ディレクトリを誤って消さない。
  if (out === root || root.startsWith(out + sep) ||
      ['questions', 'scripts', 'css', 'js', 'docs', '.github', '.git'].some(dir => {
        const source = resolve(root, dir);
        return out === source || out.startsWith(source + sep);
      })) {
    throw new Error('出力先にソースフォルダやその親を指定できません');
  }

  const entries = await readdir(resolve(root, 'questions'), { withFileTypes: true });
  const names = [];
  for (const entry of entries) {
    // OS が作る隠しファイルは問題として扱わない。
    if (entry.isFile() && entry.name.startsWith('.')) continue;
    currentFile = `questions/${entry.name}`;
    if (!entry.isFile() || (entry.name !== '_template.json' && !/^[a-z0-9-]+\.json$/.test(entry.name))) {
      throw new Error('ファイル名は半角英小文字・数字・ハイフンと .json にしてください。サブフォルダは置けません');
    }
    if (entry.name !== '_template.json') names.push(entry.name);
  }
  names.sort((a, b) => a === 'sample-sensei.json' ? -1 : b === 'sample-sensei.json' ? 1 : a.localeCompare(b, 'en'));
  currentFile = 'questions/_template.json';
  const template = JSON.parse((await readFile(resolve(root, currentFile), 'utf8')).replace(/^\uFEFF/, ''));
  const questions = [];
  for (const name of names) {
    currentFile = `questions/${name}`;
    let q;
    try {
      const content = await readFile(resolve(root, currentFile), 'utf8');
      q = JSON.parse(content.replace(/^\uFEFF/, ''));
    } catch (error) {
      throw new Error(`JSON の構文が正しくありません: ${error.message}`);
    }
    if (!q || typeof q !== 'object' || Array.isArray(q)) throw new Error('問題はオブジェクトで書いてください');
    for (const field of ['author', 'question', 'explanation']) {
      if (typeof q[field] !== 'string' || !q[field].trim()) throw new Error(`${field} は空でない文字列にしてください`);
      if (q[field].trim() === template[field]) throw new Error(`${field} をテンプレートから書き換えてください`);
    }
    if (!Array.isArray(q.choices) || q.choices.length !== 4 || q.choices.some(c => typeof c !== 'string' || !c.trim())) {
      throw new Error('choices は空でない文字列をちょうど4つ指定してください');
    }
    if (q.choices.some(choice => template.choices.includes(choice.trim()))) throw new Error('choices をテンプレートから書き換えてください');
    if (new Set(q.choices.map(choice => choice.trim())).size !== 4) throw new Error('choices に重複があります');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw new Error('answer は 0 から 3 の整数にしてください');
    questions.push(q);
  }
  currentFile = '';
  if (!checkOnly) {
    await rm(out, { recursive: true, force: true });
    await mkdir(out, { recursive: true });
    for (const item of ['index.html', 'css', 'js']) {
      await cp(resolve(root, item), resolve(out, item), { recursive: true });
    }
    await writeFile(resolve(out, 'questions.json'), JSON.stringify(questions, null, 2) + '\n');
    for (const name of ['handout.html', 'slides.html']) {
      try {
        const source = resolve(root, 'docs', name);
        await mkdir(dirname(resolve(out, 'docs', name)), { recursive: true });
        await cp(source, resolve(out, 'docs', name));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
  console.log(`${questions.length}件の問題を確認しました`);
} catch (error) {
  const message = `${currentFile ? currentFile + ': ' : ''}${error.message}`;
  console.error(`エラー: ${message}`);
  const file = currentFile ? ` file=${escapeAnnotation(currentFile).replaceAll(',', '%2C').replaceAll(':', '%3A')}` : '';
  if (process.env.GITHUB_ACTIONS) {
    console.error(`::error${file}::${escapeAnnotation(error.message)}`);
  }
  process.exitCode = 1;
}
