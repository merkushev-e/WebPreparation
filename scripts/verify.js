'use strict';
/**
 * verify.js — сверяет data/program.json с эталонными числами из спецификации.
 * Падает с ненулевым кодом при любом расхождении. build.js без него не собирает dist.
 */

const fs = require('fs');
const path = require('path');
const { isoAddDays, PROGRAM_START } = require('./parse.js');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'source', 'android-interview-program-full.md');
const JSON_PATH = path.join(ROOT, 'data', 'program.json');

const failures = [];
const notes = [];

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures.push(`${label}: получено ${actual}, ожидалось ${expected}`);
  console.log(`  ${ok ? '✓' : '✗'} ${label.padEnd(46)} ${String(actual).padStart(5)}${ok ? '' : `  ≠ ${expected}`}`);
  return ok;
}

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error('data/program.json не найден — сначала `npm run parse`');
    process.exit(1);
  }
  const program = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const md = fs.readFileSync(SRC, 'utf8');
  const lines = md.split(/\r?\n/);

  // ── счётчики по разобранным данным
  const days = [];
  const items = [];
  const byType = {};
  for (const w of program.weeks) {
    for (const d of w.days) {
      days.push({ week: w, day: d });
      for (const t of d.tiers) {
        for (const it of t.items) {
          items.push(it);
          byType[it.type] = (byType[it.type] || 0) + 1;
          for (const c of it.children || []) {
            items.push(c);
            byType.subtask = (byType.subtask || 0) + 1;
          }
        }
      }
    }
  }
  const daysWithThreeTiers = days.filter(({ day }) => day.tiers.length === 3).length;

  // ── счётчики по исходному markdown (страховка от «тихой» потери материала)
  const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const src = { numbered: 0, dash: 0, tools: 0, timer: 0, mic: 0, pen: 0, dayHeadings: 0, tierLines: 0 };
  for (const raw of lines) {
    const l = raw.trim();
    if (/^###\s/.test(l) && WD.some((w) => l.startsWith('### ' + w + ' '))) src.dayHeadings++;
    if (/^\*\*\+?\d+ мин\*\*/.test(l)) src.tierLines++;
    if (/^\d+\.\s/.test(l)) src.numbered++;
    if (/^-\s/.test(l)) src.dash++;
    if (l.includes('🛠')) src.tools++;
    if (l.includes('⏱')) src.timer++;
    if (l.includes('🎤')) src.mic++;
    if (l.includes('✍️')) src.pen++;
  }

  console.log('\n1. Эталонные числа\n');
  check('недель', program.weeks.length, 10);
  check('дней', days.length, 65);
  check('дней с тремя блоками', daysWithThreeTiers, 64);
  check('вопросов (question)', byType.question || 0, 428);
  check('  + шагов каркаса Недели 6', (program.weeks.find((w) => w.number === 6).framework || []).length, 10);
  check('  + правил программы', (program.rules || []).length, 7);
  check('  = пронумерованных строк исходника', src.numbered, 445);
  check('practice (🛠)', byType.practice || 0, 22);
  check('  + 🛠 в правилах программы', src.tools - (byType.practice || 0), 1);
  check('timed (⏱ / **Задача.**)', byType.timed || 0, 7);
  check('  + ⏱ в заголовках дней', days.filter(({ day }) => day.timed).length, 16);
  check('speak (🎤)', byType.speak || 0, 18);
  check('write (✍️)', byType.write || 0, 3);
  check('subtask (- )', byType.subtask || 0, 18);
  check('строк «20/+40/+60 мин» в исходнике', src.tierLines, 192);
  check('заголовков дней в исходнике', src.dayHeadings, 65);

  console.log('\n2. Ни один день не пуст\n');
  const empty = days.filter(({ day }) => {
    const n = day.tiers.reduce((a, t) => a + t.items.length, 0);
    return n === 0 && !day.prose;
  });
  check('пустых дней', empty.length, 0);
  if (empty.length) failures.push('пустые дни: ' + empty.map(({ day }) => day.id).join(', '));

  console.log('\n3. Уникальность ID\n');
  const seen = new Map();
  const dupes = [];
  for (const it of items) {
    if (seen.has(it.id)) dupes.push(it.id);
    seen.set(it.id, true);
  }
  check('всего пунктов', items.length, items.length);
  check('дубликатов itemId', dupes.length, 0);
  if (dupes.length) failures.push('дубликаты id: ' + [...new Set(dupes)].slice(0, 10).join(', '));
  const badId = items.filter((it) => !/^w\d+-d\d+-t\d+-\d\d(-s\d\d)?$/.test(it.id));
  check('id неверного формата', badId.length, 0);
  if (badId.length) failures.push('плохие id: ' + badId.slice(0, 5).map((i) => i.id).join(', '));

  console.log('\n4. Даты: непрерывный ряд 2026-08-01 … 2026-10-04\n');
  const MONTHS = { 8: 'авг', 9: 'сен', 10: 'окт' };
  let dateProblems = 0;
  const dateSet = new Set();
  days.forEach(({ day }, i) => {
    const expected = isoAddDays(PROGRAM_START, i);
    if (day.date !== expected) { dateProblems++; failures.push(`${day.id}: дата ${day.date}, ожидалась ${expected}`); }
    if (dateSet.has(day.date)) { dateProblems++; failures.push(`дубль даты ${day.date}`); }
    dateSet.add(day.date);
    // сверка с заголовком в markdown
    const [, m, dd] = day.date.split('-').map(Number);
    if (day.srcMonth !== m || day.srcDay !== dd) {
      dateProblems++;
      failures.push(`${day.id}: заголовок «${day.srcDay} ${MONTHS[day.srcMonth] || day.srcMonth}» не совпал с ${day.date}`);
    }
  });
  check('дат всего', dateSet.size, 65);
  check('первая дата = 2026-08-01', days[0].day.date === '2026-08-01' ? 1 : 0, 1);
  check('последняя дата = 2026-10-04', days[days.length - 1].day.date === '2026-10-04' ? 1 : 0, 1);
  check('расхождений в датах', dateProblems, 0);

  console.log('\n5. Тексты перенесены дословно\n');
  // Нормализуем исходник и каждый пункт одинаково: текст пункта обязан встречаться в исходнике.
  const normalize = (s) => s.replace(/\s+/g, ' ').trim();
  const haystack = normalize(md);
  const drifted = [];
  for (const it of items) {
    const needle = normalize(it.text);
    if (needle && haystack.indexOf(needle) < 0) drifted.push(it.id + ': ' + it.text.slice(0, 60));
    if (it.note && haystack.indexOf(normalize(it.note)) < 0) drifted.push(it.id + ' (note): ' + it.note.slice(0, 60));
  }
  const fw = program.weeks.find((w) => w.number === 6).framework || [];
  for (const step of fw) {
    if (haystack.indexOf(normalize(step)) < 0) drifted.push('framework: ' + step.slice(0, 60));
  }
  check('пунктов с изменённым текстом', drifted.length, 0);
  if (drifted.length) failures.push('расхождение с исходником:\n    ' + drifted.slice(0, 10).join('\n    '));

  console.log('\n6. Неделя → дней → пунктов\n');
  console.log('  ┌──────────┬──────┬─────────┬──────────────────────────────────────────┐');
  console.log('  │ неделя   │ дней │ пунктов │ тема                                     │');
  console.log('  ├──────────┼──────┼─────────┼──────────────────────────────────────────┤');
  for (const w of program.weeks) {
    let n = 0;
    for (const d of w.days) for (const t of d.tiers) for (const it of t.items) n += 1 + (it.children || []).length;
    const title = w.title.length > 40 ? w.title.slice(0, 39) + '…' : w.title;
    console.log(`  │ Неделя ${String(w.number).padEnd(2)}│ ${String(w.days.length).padStart(4)} │ ${String(n).padStart(7)} │ ${title.padEnd(40)} │`);
  }
  console.log('  └──────────┴──────┴─────────┴──────────────────────────────────────────┘');

  console.log('');
  if (failures.length) {
    console.error(`ПРОВЕРКА НЕ ПРОЙДЕНА — расхождений: ${failures.length}\n`);
    for (const f of failures) console.error('  • ' + f);
    console.error('');
    process.exit(1);
  }
  notes.forEach((n) => console.log(n));
  console.log('Проверка пройдена: данные соответствуют эталону.\n');
}

main();
