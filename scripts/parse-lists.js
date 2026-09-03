'use strict';
/**
 * parse-lists.js — превращает отобранные списки вопросов в data/core.json и data/second.json.
 *
 * Формат источника: «# Блок N. Тема», проза, затем таблица
 * «| 1.1 | Вопрос | ⭐⭐ |» (ядро) или «| 1.1 | Вопрос | A |» (вторая волна).
 *
 * Выход совместим по форме с data/program.json: блок → «неделя» с одним днём,
 * все вопросы лежат в первом блоке дня. Разбивку по дням делает уже приложение
 * (настройка «сколько пунктов в одном дне»), поэтому здесь её нет.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SOURCES = [
  { file: 'tier1-core.md', out: 'core.json', id: 'core', title: 'Ядро', kind: 'stars' },
  { file: 'tier2-second-wave.md', out: 'second.json', id: 'second', title: 'Вторая волна', kind: 'letters' },
];

/** ⭐⭐ / ⭐ / A / B / C → короткий код приоритета. */
function priorityOf(raw, kind) {
  const s = String(raw).trim();
  if (kind === 'stars') {
    if (s.indexOf('⭐⭐') >= 0) return 'kill';
    if (s.indexOf('⭐') >= 0) return 'high';
    return null;
  }
  const m = s.match(/^([ABC])$/) || s.match(/\*\*([ABC])\*\*/);
  if (m) return m[1];
  // блок «Вопросы интервьюеру»: в третьей колонке не A/B/C, а адресат («инженеру», «EM»)
  return s ? 'B' : null;
}

function parse(md, cfg) {
  const lines = md.split(/\r?\n/);
  const program = { id: cfg.id, title: cfg.title, start: '2026-08-01', weeks: [] };

  let week = null, day = null, seq = 0;
  let inIntro = true;          // до первого «# Блок» — легенда и правила, они не вопросы
  let framework = null;        // «Каркас ответа» в блоке 6 ядра

  const openWeek = (number, title) => {
    week = {
      id: 'b' + number, number: number, title: title,
      dateRange: '', days: [],
    };
    day = {
      id: 'b' + number + '-d1', date: null, index: 0,
      weekday: '', title: title, hot: false, timed: false,
      topic: title, tiers: [{ level: 20, items: [] }, { level: 40, items: [] }, { level: 60, items: [] }],
    };
    week.days.push(day);
    program.weeks.push(week);
    seq = 0;
  };

  for (const raw of lines) {
    const line = raw.trim();

    const bh = line.match(/^#\s+Блок\s+(\d+)\.\s*(.+)$/);
    if (bh) { inIntro = false; framework = null; openWeek(Number(bh[1]), bh[2].trim()); continue; }

    if (/^#\s/.test(line) && !bh) {
      // «# На чём основан отбор», «# Приложение…» — справочные хвосты, не вопросы
      if (!inIntro) { week = null; day = null; }
      continue;
    }
    if (!line || /^---+$/.test(line)) continue;
    if (!week || !day) continue;

    // «## Каркас ответа» в блоке 6 — памятка, а не вопросы
    if (/^##\s+Каркас ответа/i.test(line)) { framework = []; week.framework = framework; week.frameworkTitle = 'Каркас ответа'; continue; }
    if (/^##\s/.test(line)) { framework = null; continue; }
    if (framework) {
      const step = line.match(/^(\d+)\.\s+(.*)$/);
      if (step) { framework.push(step[2].trim()); continue; }
    }

    // строка таблицы вопросов
    const row = line.match(/^\|\s*(\d+\.\d+)\s*\|\s*(.+?)\s*\|\s*([^|]*?)\s*\|\s*$/);
    if (row) {
      const priority = priorityOf(row[3], cfg.kind);
      if (!priority) continue;                       // шапка таблицы и разделители
      seq++;
      const item = {
        id: week.id + '-q' + String(seq).padStart(3, '0'),
        type: 'question',
        text: row[2].trim(),
        number: row[1],
        priority: priority,
      };
      if (cfg.kind === 'letters' && !/^[ABC]$/.test(String(row[3]).replace(/\*/g, '').trim())) {
        item.note = 'кому задавать: ' + row[3].trim();
      }
      day.tiers[0].items.push(item);
      continue;
    }
    if (/^\|/.test(line)) continue;                  // прочие таблицы (сводки, легенды)

    // проза блока — контекст «почему этот блок важен»
    if (!day.tiers[0].items.length) {
      day.prose = (day.prose ? day.prose + '\n' : '') + line.replace(/^>\s?/, '');
    } else {
      week.note = (week.note ? week.note + ' ' : '') + line.replace(/^>\s?/, '');
    }
  }

  return program;
}

/**
 * Kill-вопросы ⭐⭐ — вперёд, внутри каждого блока.
 *
 * В исходнике порядок номерной (1.1, 1.2, …), и в большинстве блоков ⭐⭐ и так идут
 * первыми — но не в блоке 3, где 21 kill-вопрос размазан по всем 42. При одной теме
 * в день это значит, что до части «вопросов, на которых режут», очередь дойдёт через
 * полтора месяца. Сортировка устойчивая: внутри одного приоритета номерной порядок
 * исходника сохраняется. Id приклеены к тексту вопроса, поэтому отметки не съезжают.
 */
const PRIORITY_RANK = { kill: 0, high: 1, A: 0, B: 1, C: 2 };

function sortByPriority(program) {
  for (const w of program.weeks) {
    for (const d of w.days) {
      for (const t of d.tiers) {
        t.items = t.items
          .map((it, i) => [it, i])
          .sort((a, b) => {
            const ra = PRIORITY_RANK[a[0].priority], rb = PRIORITY_RANK[b[0].priority];
            const pa = ra === undefined ? 9 : ra, pb = rb === undefined ? 9 : rb;
            return pa - pb || a[1] - b[1];
          })
          .map((x) => x[0]);
      }
    }
  }
}

/**
 * Ручной порядок первых вопросов.
 *
 * Id присваиваются по порядку исходного списка и остаются приклеенными к своему тексту —
 * переставляем уже готовые пункты, поэтому отметки и оценки не съезжают на соседний вопрос.
 * b1-q005 («synchronized vs ReentrantLock vs Mutex») поднят первым по просьбе владельца
 * программы: он начал заниматься именно с него.
 */
const PINNED = { 'core.json': ['b1-q005'] };

function applyPins(program, out) {
  const pins = PINNED[out];
  if (!pins || !pins.length) return;
  for (const w of program.weeks) {
    for (const d of w.days) {
      for (const t of d.tiers) {
        const head = [];
        for (const id of pins) {
          const i = t.items.findIndex((x) => x.id === id);
          if (i >= 0) head.push(t.items.splice(i, 1)[0]);
        }
        if (head.length) t.items.unshift(...head);
      }
    }
  }
}

function main() {
  for (const cfg of SOURCES) {
    const md = fs.readFileSync(path.join(ROOT, 'source', cfg.file), 'utf8');
    const program = parse(md, cfg);
    sortByPriority(program);
    applyPins(program, cfg.out);

    const counts = {};
    let total = 0;
    for (const w of program.weeks) {
      for (const d of w.days) {
        for (const t of d.tiers) {
          for (const it of t.items) { total++; counts[it.priority] = (counts[it.priority] || 0) + 1; }
        }
      }
    }
    program.stats = { blocks: program.weeks.length, questions: total, byPriority: counts };

    fs.writeFileSync(path.join(ROOT, 'data', cfg.out), JSON.stringify(program, null, 2) + '\n', 'utf8');
    console.log(cfg.out + ': блоков ' + program.weeks.length + ', вопросов ' + total +
      ', по приоритету ' + JSON.stringify(counts));
  }
}

if (require.main === module) main();
module.exports = { parse };
