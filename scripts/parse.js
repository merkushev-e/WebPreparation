'use strict';
/**
 * parse.js — превращает source/android-interview-program-full.md в data/program.json
 *
 * Единственный источник данных — markdown. Ничего не додумываем, тексты переносим дословно.
 * Запуск: npm run parse
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'source', 'android-interview-program-full.md');
const OUT = path.join(ROOT, 'data', 'program.json');

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = { 'янв': 1, 'фев': 2, 'мар': 3, 'апр': 4, 'мая': 5, 'июн': 6, 'июл': 7, 'авг': 8, 'сен': 9, 'окт': 10, 'ноя': 11, 'дек': 12 };

const PROGRAM_START = '2026-08-01';

// ─────────────────────────────────────────────────────────────────────────────
// вспомогательное

function pad2(n) { return String(n).padStart(2, '0'); }

function isoAddDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

/** Заголовок дня? День всегда начинается с сокращения дня недели. */
function parseDayHeading(line) {
  const m = line.match(/^###\s+(Пн|Вт|Ср|Чт|Пт|Сб|Вс)\s+(\d{1,2})\s+([а-я]{3})\s*·\s*(.+)$/);
  if (!m) return null;
  const [, weekday, dayNum, monthAbbr, rawTitle] = m;
  if (!MONTHS[monthAbbr]) return null;
  let title = rawTitle.trim();
  const hot = title.includes('🔥');
  const timed = title.includes('⏱');
  title = title.split('🔥').join('').split('⏱').join('').replace(/\s+/g, ' ').trim();
  return { weekday, dayNum: Number(dayNum), month: MONTHS[monthAbbr], title, hot, timed };
}

function parseWeekHeading(line) {
  const m = line.match(/^#\s+НЕДЕЛЯ\s+(\d+)\s*·\s*(.+?)\s*\(([^)]*)\)\s*$/);
  if (!m) return null;
  return { number: Number(m[1]), title: m[2].trim(), dateRange: m[3].trim() };
}

function parseTierHeading(line) {
  const m = line.match(/^\*\*(\+?)(\d+)\s+мин\*\*(.*)$/);
  if (!m) return null;
  const level = Number(m[2]);
  if (level !== 20 && level !== 40 && level !== 60) return null;
  // хвост вида " — текст" или " -- текст": отрезаем только разделитель
  let rest = m[3];
  rest = rest.replace(/^\s*[—–-]\s*/, '').trim();
  return { level, inline: rest };
}

/**
 * Тип пункта. Порядок проверок соответствует таблице разбора из спецификации:
 * question → practice (🛠) → timed (⏱ / **Задача.**) → speak (🎤) → write (✍️) → design.
 * Всё остальное — task: прозаическая инструкция дня («Реализовать через стек изменений»).
 */
function detectType(text, { numbered = false } = {}) {
  if (numbered) return 'question';
  if (text.includes('🛠')) return 'practice';
  if (text.includes('⏱') || /^\*\*Задача/.test(text)) return 'timed';
  if (text.includes('🎤')) return 'speak';
  if (text.includes('✍️')) return 'write';
  if (/\*\*Design\s/.test(text)) return 'design';
  return 'task';
}

/**
 * Тема пункта для группировки в «Красной зоне». Выводится из недели и заголовка дня —
 * правила упорядочены, первое совпавшее выигрывает.
 */
const TOPIC_RULES = [
  [/История|Behavioral|Конфликты|вопросы им|самопредставление|закрыть всё/i, 'Behavioral'],
  [/Gotchas: Flow|Хвост Flow/i, 'Flow'],
  [/Gotchas: корутины/i, 'Корутины'],
  [/Gotchas: Compose/i, 'Compose'],
  [/Gotchas: Kotlin|OOP/i, 'Kotlin и JVM'],
  [/Безопасность/i, 'Безопасность'],
  [/КОД: тесты|Тестируемость/i, 'Тестирование'],
  [/Корутин|Отмена и исключения/i, 'Корутины'],
  [/Гонки|синхронизации/i, 'Конкурентность'],
  [/Flow|потоки/i, 'Flow'],
  [/Compose|ViewModel, Context|Навигация|Layout и производительность|Состояние и эффекты/i, 'Compose'],
  [/Модуляризация|Паттерны и слои|Эволюция и миграции/i, 'Архитектура'],
  [/Данные и сеть|Финтех-специфика|token refresh/i, 'Данные и сеть'],
  [/Производительность|ANR, релизы|Жизненный цикл|Фон, разрешения|Остаток платформы/i, 'Платформа и perf'],
  [/Kotlin/i, 'Kotlin и JVM'],
  [/Красная зона/i, 'Повторение'],
  [/Мок|мок-интервью|Полный прогон|прогон/i, 'Моки и прогоны'],
  [/^КОД:|Rapid-fire|алгоритм/i, 'Live coding'],
];

const TOPIC_BY_WEEK = {
  0: 'Калибровка',
  1: 'Конкурентность',
  2: 'Flow',
  3: 'Live coding',
  4: 'Compose',
  5: 'Архитектура',
  6: 'System design',
  7: 'Платформа и perf',
  8: 'Kotlin и JVM',
  9: 'Моки и прогоны',
};

function detectTopic(week, day) {
  if (week.number === 0) return 'Калибровка';
  if (week.number === 6) return 'System design';
  for (const [re, topic] of TOPIC_RULES) {
    if (re.test(day.title)) return topic;
  }
  if (week.number === 3) return 'Live coding';
  return TOPIC_BY_WEEK[week.number] || week.title;
}

/** Выносит хвостовой курсив в скобках в отдельное поле note. */
function splitNote(text) {
  const m = text.match(/^(.*?)\s*\*\(([^)]*)\)\*\s*$/);
  if (!m || !m[1].trim()) return { text: text.trim(), note: undefined };
  return { text: m[1].trim(), note: m[2].trim() };
}

/** Длительность таймера, если она названа в тексте задачи («Таймер 45 минут»). */
function detectTimerMinutes(text) {
  const m = text.match(/(?:Таймер|таймер)\s+(\d{1,3})\s*мин/);
  if (m) return Number(m[1]);
  const m2 = text.match(/(\d{1,3})\s*минут[а-я]*\s+(?:live coding|system design)/i);
  if (m2) return Number(m2[1]);
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// разбор

function parse(markdown) {
  const lines = markdown.split(/\r?\n/);

  const program = { start: PROGRAM_START, rules: [], composition: [], weeks: [] };
  const risks = {};

  let week = null;
  let day = null;
  let tier = null;
  let lastItem = null;
  /** Строки дня до первого блока «20 мин»: условие задачи, пометки 🛠 и вводная проза. */
  let pending = [];

  // куда мы попали: 'preamble' | 'rules' | 'week' | 'day' | 'framework' | 'summary'
  let region = 'preamble';
  let summaryTable = 0;
  let frameworkTarget = null;

  const flushDay = () => {
    if (day) {
      // день без блоков (Вс 4 окт · Пауза): всё накопленное остаётся прозой
      for (const p of pending) addProse(p.text);
      if (day.prose) day.prose = day.prose.trim();
    }
    pending = [];
    day = null;
    tier = null;
    lastItem = null;
  };

  const addProse = (text) => {
    day.prose = (day.prose || '') + (day.prose ? '\n' : '') + text;
  };

  const pushItem = (rawText, opts = {}) => {
    if (!day) return null;
    if (!tier) {
      // до первого блока: решаем при открытии блока — условие задачи это или проза
      pending.push({ text: rawText, opts });
      return null;
    }
    const { text, note } = splitNote(rawText);
    if (!text) return null;
    const item = {
      id: `${day.id}-t${tier.tierIndex}-${pad2(tier.items.length + 1)}`,
      type: detectType(text, opts),
      text,
    };
    if (note) item.note = note;
    if (opts.number != null) item.number = opts.number;
    const minutes = detectTimerMinutes(rawText);
    if (minutes) item.timerMinutes = minutes;
    tier.items.push(item);
    lastItem = item;
    return item;
  };

  /**
   * Разбирает то, что стояло до «20 мин». Условие задачи («**Задача.** …», «⏱ …», «🛠 …»)
   * — полноценный пункт: работа над ним начинается уже в первом блоке. Остальное — проза.
   */
  const flushPending = () => {
    const buffered = pending;
    pending = [];
    for (const p of buffered) {
      // .includes, а не класс символов: эмодзи — суррогатные пары, и [🛠🎤] ловит
      // высокий суррогат \uD83D, из-за чего под правило попадали 🔴 и 🔥
      const marked = ['🛠', '⏱', '🎤', '✍️'].some((m) => p.text.includes(m));
      if (p.opts.numbered || marked || /^\*\*Задача/.test(p.text)) {
        pushItem(p.text, p.opts);
      } else {
        addProse(splitNote(p.text).text);
      }
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // ── заголовок недели
    const wh = parseWeekHeading(line);
    if (wh) {
      flushDay();
      week = {
        id: `w${wh.number}`,
        number: wh.number,
        title: wh.title,
        dateRange: wh.dateRange,
        days: [],
      };
      program.weeks.push(week);
      region = 'week';
      continue;
    }

    if (/^##\s+Правила\s*$/.test(line)) { flushDay(); region = 'rules'; continue; }
    if (/^##\s+Сводка\s*$/.test(line)) { flushDay(); region = 'summary'; week = null; continue; }

    // ── заголовок дня либо «Каркас ответа» (единственный ### не-день)
    if (/^###\s/.test(line)) {
      const dh = parseDayHeading(line);
      if (dh) {
        flushDay();
        const dayIndex = week.days.length + 1;
        day = {
          id: `${week.id}-d${dayIndex}`,
          date: null, // проставим сквозной нумерацией ниже
          srcMonth: dh.month,
          srcDay: dh.dayNum,
          weekday: dh.weekday,
          title: dh.title,
          hot: dh.hot,
          timed: dh.timed,
          tiers: [],
        };
        week.days.push(day);
        region = 'day';
        tier = null;
        lastItem = null;
      } else {
        // «### Каркас ответа — выучить наизусть…» — это НЕ день
        flushDay();
        region = 'framework';
        week.framework = [];
        week.frameworkTitle = line.replace(/^###\s+/, '').trim();
        frameworkTarget = week;
      }
      continue;
    }

    if (!line) continue;
    if (/^---+$/.test(line)) continue;

    // ── вводная часть документа
    if (region === 'preamble') {
      program.intro = (program.intro ? program.intro + '\n' : '') + line;
      continue;
    }

    // ── «Сводка»: таблица рисков по неделям, затем таблица состава программы
    if (region === 'summary') {
      if (/^\|[\s|:-]+\|$/.test(line)) { summaryTable++; continue; } // строка-разделитель
      if (/^\|/.test(line)) {
        const cells = line.split('|').slice(1, -1).map((s) => s.trim());
        if (cells.length === 3) {
          if (summaryTable === 1 && /^\d+$/.test(cells[0])) { risks[Number(cells[0])] = cells[2]; continue; }
          if (summaryTable === 2) { program.composition.push({ what: cells[0], count: cells[1], where: cells[2] }); continue; }
        }
        continue; // шапки таблиц
      }
      program.outro = (program.outro ? program.outro + '\n' : '') + line;
      continue;
    }

    // ── глобальные правила программы
    if (region === 'rules') {
      const m = line.match(/^(\d+)\.\s+(.*)$/);
      if (m) program.rules.push(m[2].trim());
      else if (/^\*\*Ритм недели:\*\*/.test(line)) program.rhythm = line;
      continue;
    }

    // ── каркас ответа Недели 6
    if (region === 'framework') {
      const m = line.match(/^(\d+)\.\s+(.*)$/);
      if (m) { frameworkTarget.framework.push(m[2].trim()); continue; }
      if (/^>/.test(line)) {
        frameworkTarget.frameworkNote = line.replace(/^>\s?/, '').trim();
        continue;
      }
      frameworkTarget.frameworkExtra = (frameworkTarget.frameworkExtra ? frameworkTarget.frameworkExtra + '\n' : '') + line;
      continue;
    }

    // ── заметка недели (блокквот сразу под заголовком недели)
    if (region === 'week') {
      if (/^>/.test(line)) {
        const note = line.replace(/^>\s?/, '').trim();
        week.note = week.note ? week.note + ' ' + note : note;
        continue;
      }
      continue;
    }

    if (region !== 'day' || !day) continue;

    // ── блок 20 / +40 / +60
    const th = parseTierHeading(line);
    if (th) {
      const first = day.tiers.length === 0;
      tier = { level: th.level, tierIndex: day.tiers.length + 1, items: [] };
      day.tiers.push(tier);
      lastItem = null;
      if (first) flushPending();
      if (th.inline) pushItem(th.inline);
      continue;
    }

    // ── подзадача, принадлежит предыдущему пункту
    const sub = line.match(/^-\s+(.*)$/);
    if (sub) {
      const { text, note } = splitNote(sub[1].trim());
      if (lastItem) {
        lastItem.children = lastItem.children || [];
        const child = {
          id: `${lastItem.id}-s${pad2(lastItem.children.length + 1)}`,
          type: 'subtask',
          text,
        };
        if (note) child.note = note;
        lastItem.children.push(child);
      } else {
        pushItem(sub[1].trim());
      }
      continue;
    }

    // ── пронумерованный вопрос
    const q = line.match(/^(\d+)\.\s+(.*)$/);
    if (q) { pushItem(q[2].trim(), { numbered: true, number: Number(q[1]) }); continue; }

    // ── всё остальное: практика / таймер / речь / письмо / дизайн / инструкция
    pushItem(line);
  }

  flushDay();

  // ── риски по неделям
  for (const w of program.weeks) {
    if (risks[w.number]) w.risk = risks[w.number];
  }

  // ── сквозные даты: 65 дней подряд, начиная с 2026-08-01
  let idx = 0;
  for (const w of program.weeks) {
    for (const d of w.days) {
      d.index = idx;
      d.date = isoAddDays(PROGRAM_START, idx);
      idx++;
    }
  }

  // ── темы для группировки в «Красной зоне» + очистка служебных полей
  for (const w of program.weeks) {
    for (const d of w.days) {
      d.topic = detectTopic(w, d);
      for (const t of d.tiers) delete t.tierIndex;
      if (d.prose === '') delete d.prose;
    }
  }

  return program;
}

// ─────────────────────────────────────────────────────────────────────────────

function collectStats(program) {
  const s = { weeks: program.weeks.length, days: 0, daysWithThreeTiers: 0, items: 0, byType: {}, subtasks: 0 };
  for (const w of program.weeks) {
    for (const d of w.days) {
      s.days++;
      if (d.tiers.length === 3) s.daysWithThreeTiers++;
      for (const t of d.tiers) {
        for (const it of t.items) {
          s.items++;
          s.byType[it.type] = (s.byType[it.type] || 0) + 1;
          for (const c of it.children || []) { s.subtasks++; s.byType.subtask = (s.byType.subtask || 0) + 1; }
        }
      }
    }
  }
  return s;
}

function main() {
  const md = fs.readFileSync(SRC, 'utf8');
  const program = parse(md);
  const stats = collectStats(program);
  program.stats = stats;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(program, null, 2) + '\n', 'utf8');

  console.log('parse: source/android-interview-program-full.md → data/program.json');
  console.log(JSON.stringify(stats, null, 2));
  console.log(`размер: ${(fs.statSync(OUT).size / 1024).toFixed(1)} КБ`);
}

if (require.main === module) main();

module.exports = { parse, collectStats, isoAddDays, PROGRAM_START };
