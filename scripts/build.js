'use strict';
/**
 * build.js — собирает dist/index.html: один самодостаточный файл без сети и модулей.
 * Перед сборкой обязательно прогоняет verify.js; при расхождении dist не трогается.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const p = (...a) => path.join(ROOT, ...a);

function fail(msg) {
  console.error('\nСБОРКА ОСТАНОВЛЕНА: ' + msg + '\n');
  process.exit(1);
}

// ── 1. проверка данных ───────────────────────────────────────────────────────
if (process.env.SKIP_VERIFY !== '1') {
  const res = spawnSync(process.execPath, [p('scripts', 'verify.js')], { stdio: 'inherit' });
  if (res.status !== 0) fail('verify.js не прошёл — dist/index.html не пересобран.');
}

// ── 2. чтение исходников ─────────────────────────────────────────────────────
if (!fs.existsSync(p('data', 'program.json'))) fail('нет data/program.json — сначала `npm run parse`.');

const program = JSON.parse(fs.readFileSync(p('data', 'program.json'), 'utf8'));
delete program.stats; // статистика парсера в приложении не нужна

// отобранные списки вопросов — отдельные треки программы
const extraTracks = {};
for (const [key, file] of [['core', 'core.json'], ['second', 'second.json']]) {
  const fp = p('data', file);
  if (!fs.existsSync(fp)) fail(`нет data/${file} — сначала \`npm run parse\`.`);
  const t = JSON.parse(fs.readFileSync(fp, 'utf8'));
  delete t.stats;
  extraTracks[key] = t;
}

const template = fs.readFileSync(p('src', 'template.html'), 'utf8');
const styles = fs.readFileSync(p('src', 'styles.css'), 'utf8');
const app = fs.readFileSync(p('src', 'app.js'), 'utf8');

// ── 3. проверки ограничений раздела 1 спецификации ───────────────────────────
const banned = [
  [/\bfetch\s*\(/, 'fetch() — на file:// блокируется CORS'],
  [/XMLHttpRequest/, 'XMLHttpRequest — на file:// блокируется CORS'],
  [/<script[^>]+type\s*=\s*["']module["']/i, '<script type="module"> — ES-модули на file:// не работают'],
  [/import\s+.*\bfrom\s+['"]/, 'ES-импорт'],
  [/https?:\/\/(?!www\.w3\.org)/, 'ссылка на внешний ресурс'],
  [/<link[^>]+rel\s*=\s*["']stylesheet/i, 'внешняя таблица стилей'],
];
for (const [re, why] of [...banned]) {
  for (const [name, text] of [['template.html', template], ['styles.css', styles], ['app.js', app]]) {
    const m = text.match(re);
    if (m) fail(`в src/${name} найдено «${m[0]}» — ${why}.`);
  }
}

// ── 4. сборка ────────────────────────────────────────────────────────────────
// JSON встраивается как JS-литерал; экранируем последовательности, ломающие <script>
const dataLiteral = 'var PROGRAM = ' + JSON.stringify(program)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029') + ';\n' +
  'var TRACK_DATA = ' + JSON.stringify(extraTracks)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';';

let html = template
  .replace('/*__STYLES__*/', () => styles.trim())
  .replace('/*__DATA__*/', () => dataLiteral)
  .replace('/*__APP__*/', () => app.trim());

html = '<!doctype html>\n<html lang="ru" data-theme="dark">\n' + html.trim() + '\n</html>\n';

for (const marker of ['/*__STYLES__*/', '/*__DATA__*/', '/*__APP__*/']) {
  if (html.includes(marker)) fail(`плейсхолдер ${marker} не подставлен.`);
}

fs.mkdirSync(p('dist'), { recursive: true });
fs.writeFileSync(p('dist', 'index.html'), html, 'utf8');

// Байт-в-байт копия для GitHub Pages: Pages умеет отдавать только корень репозитория
// или папку /docs — папку /dist выбрать нельзя. Локально нужен только dist/index.html.
fs.mkdirSync(p('docs'), { recursive: true });
fs.writeFileSync(p('docs', 'index.html'), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log(`\nbuild: dist/index.html — ${kb} КБ, один файл, без внешних ресурсов.`);
console.log('       docs/index.html — та же копия для GitHub Pages.');
if (kb > 3072) fail('файл больше 3 МБ.');
console.log('Открывается двойным кликом: dist/index.html\n');
