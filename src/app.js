/* Interview Prep Tracker — vanilla JS, один файл, работает по file://
   Данные лежат в глобальной PROGRAM (встроена сборщиком выше). */
(function () {
  'use strict';

  var STORAGE_KEY = 'interview-prep-v1';
  var STATE_VERSION = 2;
  var PLANNED_START = PROGRAM.start || '2026-08-01';

  /**
   * Дата старта при первом запуске. Плановая дата зашита в программу и к моменту, когда
   * приложение реально открыли, обычно уже в прошлом — стартовать с неё значит встретить
   * пользователя отставанием за дни, которых он не видел. Поэтому берём сегодняшний день.
   */
  var WD_FULL = { 'Пн': 'понедельника', 'Вт': 'вторника', 'Ср': 'среды', 'Чт': 'четверга',
    'Пт': 'пятницы', 'Сб': 'субботы', 'Вс': 'воскресенья' };
  var WD_NOM = { 'Пн': 'понедельник', 'Вт': 'вторник', 'Ср': 'среда', 'Чт': 'четверг',
    'Пт': 'пятница', 'Сб': 'суббота', 'Вс': 'воскресенье' };
  function rhythmWeekdayName() { return WD_FULL[DAYS()[0].day.weekday] || DAYS()[0].day.weekday; }
  function weekdayFull(wd) { return WD_NOM[wd] || wd; }
  /** Ближайшая дата (сегодня или позже) с тем же днём недели, что у первого дня программы. */
  function nextRhythmStart() {
    var t = todayISO();
    for (var i = 0; i < 7; i++) {
      var d = isoAdd(t, i);
      if (weekdayOf(d) === DAYS()[0].day.weekday) return d;
    }
    return t;
  }

  function defaultStart() {
    var t = todayISO();
    return PLANNED_START > t ? PLANNED_START : t;
  }

  var TYPE_ICON = {
    question: '', practice: '🛠', timed: '⏱', speak: '🎤',
    write: '✍️', design: '📐', subtask: '', task: '·'
  };
  var TYPE_LABEL = {
    question: 'вопрос', practice: 'практика', timed: 'задача под таймер', speak: 'вслух',
    write: 'письменно', design: 'дизайн-задача', subtask: 'подпункт', task: 'работа'
  };
  var CONF_LABEL = { red: 'не могу объяснить', yellow: 'плаваю', green: 'уверенно' };

  // ── мелкие помощники ────────────────────────────────────────────────────

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /** Инлайновый markdown: `код`, **жирный**, *курсив*. Сырые звёздочки наружу не выводим. */
  function md(s) {
    var out = esc(s);
    out = out.replace(/`([^`]+)`/g, function (m, c) { return '<code>' + c + '</code>'; });
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return out;
  }
  /** Тот же текст без разметки — для поиска. */
  function plain(s) { return String(s).replace(/[`*_]/g, ''); }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function isoAdd(iso, days) {
    var p = iso.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    d.setUTCDate(d.getUTCDate() + days);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
  }
  function isoDiff(a, b) {
    var pa = a.split('-'), pb = b.split('-');
    var da = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]), db = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  var WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  /** День недели показанной даты. Из markdown брать нельзя: при сдвиге старта он врёт. */
  function weekdayOf(iso) {
    var p = iso.split('-');
    return WEEKDAYS[new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay()];
  }

  var MONTH_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  function humanDate(iso) {
    var p = iso.split('-');
    return (+p[2]) + ' ' + MONTH_GEN[+p[1] - 1] + ' ' + p[0];
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  // ── индексы по программе ────────────────────────────────────────────────

  var TRACKS = {
    core:   { id: 'core',   title: 'Ядро',          data: (typeof TRACK_DATA !== 'undefined' ? TRACK_DATA.core : null) },
    second: { id: 'second', title: 'Вторая волна',  data: (typeof TRACK_DATA !== 'undefined' ? TRACK_DATA.second : null) },
    full:   { id: 'full',   title: 'Полная программа', data: PROGRAM }
  };
  var SRC = PROGRAM;    // активный трек, переключается в «Настройках»

  var ALL_DAYS = [];    // дни активного трека, [{week, day}]
  var DAY_BY_ID = {};
  var ITEM_INDEX = {};  // itemId → {item, day, week, tierIdx}
  var ALL_ITEMS = [];
  var TOPICS = [];

  function buildIndex() {
    ALL_DAYS = []; DAY_BY_ID = {}; ITEM_INDEX = {}; ALL_ITEMS = []; TOPICS = [];
    SRC.weeks.forEach(function (w) {
      w.days.forEach(function (d) {
        // одна и та же ссылка в обоих индексах — на ней держится DAYS().indexOf()
        var entry = { week: w, day: d };
        ALL_DAYS.push(entry);
        DAY_BY_ID[d.id] = entry;
        if (TOPICS.indexOf(d.topic) < 0) TOPICS.push(d.topic);
        d.tiers.forEach(function (t, ti) {
          t.items.forEach(function (it) {
            register(it, d, w, ti);
            (it.children || []).forEach(function (c) { register(c, d, w, ti); });
          });
        });
      });
    });
    function register(it, d, w, ti) {
      ITEM_INDEX[it.id] = { item: it, day: d, week: w, tierIdx: ti };
      ALL_ITEMS.push(it);
      it._plain = plain(it.text) + (it.note ? ' ' + plain(it.note) : '');
      it._lc = it._plain.toLowerCase();
    }
    _days = null; _daysKey = '';
  }

  /**
   * Дни программы пользователя. Две настройки меняют этот список:
   *   startWeek — недели до неё скрыты целиком и не занимают дат;
   *   splitSize — крупные дни режутся на части по N верхнеуровневых пунктов (N/3 в блок).
   * Пункты и их id не меняются никогда — прогресс переживает любую перенарезку.
   */
  var _days = null, _daysKey = '', _itemDay = {};

  function DAYS() {
    var key = STATE.track + ':' + (STATE.minPriority || 'all') + ':' + (STATE.startWeek || 0) + ':' + (STATE.splitSize || 0);
    if (_daysKey !== key || !_days) { rebuildDays(); _daysKey = key; }
    return _days;
  }

  function rebuildDays() {
    var from = STATE.startWeek || 0;
    var size = STATE.splitSize || 0;
    var out = [];
    _itemDay = {};
    ALL_DAYS.forEach(function (e) {
      if (e.week.number < from) return;
      sliceDay(e, size).forEach(function (v) { out.push(v); });
    });
    out.forEach(function (v, i) {
      v.day.index = i;
      itemIdsOfDay(v.day, null).forEach(function (id) { _itemDay[id] = v; });
    });
    _days = out;
  }

  /** Режет день на части по `size` верхнеуровневых пунктов: size/3 в каждый из трёх блоков. */
  function sliceDay(entry, size) {
    var src = entry.day;
    if (!src.tiers.length) return [virtualDay(entry, src.tiers, 1, 1)];
    if (!size) {
      var all = [];
      src.tiers.forEach(function (t) {
        all.push({ level: t.level, items: t.items.filter(passesPriority) });
      });
      return all.some(function (t) { return t.items.length; }) ? [virtualDay(entry, all, 1, 1)] : [];
    }
    var flat = [];
    src.tiers.forEach(function (t) { t.items.forEach(function (it) { if (passesPriority(it)) flat.push(it); }); });
    if (!flat.length) return [];
    if (flat.length <= size) {
      return [virtualDay(entry, [{ level: 20, items: flat }, { level: 40, items: [] }, { level: 60, items: [] }], 1, 1)];
    }

    var per = Math.max(1, Math.round(size / 3));
    var parts = [], i = 0;
    while (i < flat.length) parts.push(flat.slice(i, i += size));
    return parts.map(function (chunk, k) {
      var tiers = [
        { level: 20, items: chunk.slice(0, per) },
        { level: 40, items: chunk.slice(per, per * 2) },
        { level: 60, items: chunk.slice(per * 2) }
      ];
      return virtualDay(entry, tiers, k + 1, parts.length);
    });
  }

  function virtualDay(entry, tiers, part, parts) {
    var src = entry.day;
    var day = {
      id: parts > 1 ? src.id + 'p' + part : src.id,
      srcId: src.id,
      part: part, parts: parts,
      date: null, index: 0,
      weekday: src.weekday, title: src.title, hot: src.hot, timed: src.timed,
      topic: src.topic, prose: src.prose,
      tiers: tiers
    };
    return { week: entry.week, day: day };
  }

  /** Индекс первого активного дня — от него отсчитываются все даты. */
  function dayOffset() { return 0; }

  function activeWeeks() {
    var from = STATE.startWeek || 0;
    var ids = {};
    DAYS().forEach(function (e) { ids[e.week.id] = true; });
    return SRC.weeks.filter(function (w) { return w.number >= from && ids[w.id]; });
  }
  function isActiveDay(day) {
    var from = STATE.startWeek || 0;
    if (!from) return true;
    var ref = DAY_BY_ID[day.srcId || day.id];
    return !ref || ref.week.number >= from;
  }
  /** Виртуальный день, в который попал пункт (после возможной перенарезки). */
  function dayOfItem(id) { DAYS(); return _itemDay[id] || null; }

  /** Фильтр приоритета: пропускать ли пункт в программу. */
  function passesPriority(it) {
    var p = STATE.minPriority || 'all';
    if (p === 'all' || !it.priority) return true;
    if (p === 'kill') return it.priority === 'kill';
    if (p === 'A') return it.priority === 'A';
    if (p === 'AB') return it.priority === 'A' || it.priority === 'B';
    return true;
  }

  function applyTrack() {
    var t = TRACKS[STATE.track];
    SRC = (t && t.data) ? t.data : PROGRAM;
    if (STATE.track !== 'full' && STATE.startWeek > 1) STATE.startWeek = 1;
    buildIndex();
  }

  /** Все id пунктов дня в первых `n` блоках (n = null — все блоки). */
  function itemIdsOfDay(day, n) {
    var ids = [];
    var limit = (n == null) ? day.tiers.length : Math.min(n, day.tiers.length);
    for (var i = 0; i < limit; i++) {
      day.tiers[i].items.forEach(function (it) {
        ids.push(it.id);
        (it.children || []).forEach(function (c) { ids.push(c.id); });
      });
    }
    return ids;
  }
  function tiersForMode(mode) { return mode === 20 ? 1 : mode === 60 ? 2 : 3; }

  // ── состояние пользователя ──────────────────────────────────────────────

  var STATE = load();

  function emptyState() {
    return {
      version: STATE_VERSION,
      startDate: defaultStart(),
      track: 'core',   // какой список вопросов проходим: ядро / вторая волна / полная программа
      minPriority: 'all', // фильтр приоритета внутри трека
      startWeek: 1,    // с какой недели/блока начинается программа
      splitSize: 3,    // резать дни по 3 пункта (1+1+1); 0 — не резать
      norm: 60,        // норма дня: сколько блоков нужно закрыть, чтобы день считался пройденным
      flowMode: true,  // плавающий календарь: «Сегодня» = первый незакрытый день
      items: {},
      days: {},
      settings: { theme: 'dark' }
    };
  }

  /** Мягкая миграция: неизвестные поля и itemId не роняют приложение и не стираются. */
  function migrate(raw) {
    var s = emptyState();
    if (!raw || typeof raw !== 'object') return s;
    if (typeof raw.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.startDate)) s.startDate = raw.startDate;
    if (raw.track === 'core' || raw.track === 'second' || raw.track === 'full') s.track = raw.track;
    if (['all', 'kill', 'A', 'AB'].indexOf(raw.minPriority) >= 0) s.minPriority = raw.minPriority;
    if (typeof raw.startWeek === 'number' && raw.startWeek >= 0 && raw.startWeek <= 20) s.startWeek = raw.startWeek | 0;
    if ([0, 3, 6, 9].indexOf(raw.splitSize) >= 0) s.splitSize = raw.splitSize;
    if (raw.norm === 20 || raw.norm === 60 || raw.norm === 120) s.norm = raw.norm;
    if (typeof raw.flowMode === 'boolean') s.flowMode = raw.flowMode;
    if (raw.items && typeof raw.items === 'object') {
      Object.keys(raw.items).forEach(function (k) {
        var v = raw.items[k];
        if (!v || typeof v !== 'object') return;
        var conf = (v.conf === 'red' || v.conf === 'yellow' || v.conf === 'green') ? v.conf : null;
        s.items[k] = { done: !!v.done, conf: conf };
      });
    }
    if (raw.days && typeof raw.days === 'object') {
      Object.keys(raw.days).forEach(function (k) {
        var v = raw.days[k];
        if (!v || typeof v !== 'object') return;
        var mode = (v.mode === 20 || v.mode === 60 || v.mode === 120) ? v.mode : null;
        s.days[k] = { mode: mode, completedAt: typeof v.completedAt === 'string' ? v.completedAt : null };
      });
    }
    if (raw.settings && (raw.settings.theme === 'light' || raw.settings.theme === 'dark')) {
      s.settings.theme = raw.settings.theme;
    }
    s.version = STATE_VERSION;
    return s;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      return migrate(JSON.parse(raw));
    } catch (e) {
      console.warn('Не удалось прочитать сохранённый прогресс, начинаем с чистого:', e);
      return emptyState();
    }
  }

  var saveTimer = null;
  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }
      catch (e) { toast('Не удалось сохранить прогресс: ' + e.message); }
    }, 300);
  }
  function saveNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch (e) { /* ignore */ }
  }

  function st(id) {
    var v = STATE.items[id];
    if (!v) { v = STATE.items[id] = { done: false, conf: null }; }
    return v;
  }
  function dst(id) {
    var v = STATE.days[id];
    if (!v) { v = STATE.days[id] = { mode: null, completedAt: null }; }
    return v;
  }
  function dayDate(day) { return isoAdd(STATE.startDate, day.index); }
  /** Виртуальный день по id — работает и для id вида «w1-d1p2». */
  function findDay(id) {
    if (!id) return null;
    var d = DAYS();
    for (var i = 0; i < d.length; i++) if (d[i].day.id === id) return d[i];
    return null;
  }

  /** Норма конкретного дня: разовое переопределение либо глобальная норма. */
  function dayMode(day) {
    var v = STATE.days[day.id];
    return (v && v.mode) ? v.mode : STATE.norm;
  }
  function isClosed(day) {
    var v = STATE.days[day.id];
    if (v && v.completedAt) return true;
    // при смене нарезки id частей меняются, а отметки пунктов — нет: считаем по ним
    return normDone(day);
  }
  /** Норма дня выполнена — все пункты в её пределах отмечены. */
  function normDone(day) {
    var ids = itemIdsOfDay(day, tiersForMode(dayMode(day)));
    // день без пунктов («Вс 4 окт · Пауза») закрывается только кнопкой, сам собой — никогда
    if (!ids.length) return false;
    return ids.every(function (id) { return st(id).done; });
  }
  /**
   * Отложенные пункты: из закрытых дней, но не отмеченные. Сюда попадает блок сверх
   * нормы и всё, что осталось при досрочном закрытии. Это витрина — пункт остаётся в дне.
   */
  function collectSkipped() {
    var out = [];
    DAYS().forEach(function (e) {
      if (!isClosed(e.day)) return;
      itemIdsOfDay(e.day, null).forEach(function (id) {
        if (!st(id).done) out.push({ id: id, ref: { item: ITEM_INDEX[id].item, day: e.day, week: e.week } });
      });
    });
    return out;
  }
  function closedDaysCount() {
    var n = 0;
    DAYS().forEach(function (e) { if (isClosed(e.day)) n++; });
    return n;
  }
  function skippedCount() {
    var n = 0;
    DAYS().forEach(function (e) {
      if (!isClosed(e.day)) return;
      itemIdsOfDay(e.day, null).forEach(function (id) { if (!st(id).done) n++; });
    });
    return n;
  }

  // ── экранное состояние ──────────────────────────────────────────────────

  var V = {
    name: 'today',
    dayId: null,
    q: '',
    topic: '*',
    redTab: 'conf',   // 'conf' — не даётся (🔴), 'skipped' — отложено
    showYellow: false,
    random: null,
    focus: null,
    openWeeks: {},
    openTiers: {}
  };

  var NAV = [
    { id: 'today', label: 'Сегодня', icon: '▶' },
    { id: 'program', label: 'Программа', icon: '☰' },
    { id: 'red', label: 'Красная зона', icon: '🔴' },
    { id: 'search', label: 'Поиск', icon: '🔍' },
    { id: 'stats', label: 'Статистика', icon: '▧' },
    { id: 'settings', label: 'Настройки', icon: '⚙' }
  ];

  function activeItemCount() {
    var n = 0;
    DAYS().forEach(function (e) { n += itemIdsOfDay(e.day, null).length; });
    return n;
  }

  function redCount() {
    var n = 0;
    for (var k in STATE.items) {
      if (STATE.items[k] && STATE.items[k].conf === 'red' && dayOfItem(k)) n++;
    }
    return n;
  }

  function renderFooter() {
    var el = document.querySelector('.sidefoot');
    if (!el) return;
    var d = DAYS();
    el.innerHTML = humanDate(STATE.startDate).replace(/ \d{4}$/, '') + ' — ' +
      humanDate(isoAdd(STATE.startDate, d.length - 1)) + '<br>' +
      d.length + ' ' + plural(d.length, 'день', 'дня', 'дней') + ' · прогресс хранится в этом браузере.';
  }

  function renderNav() {
    var red = redCount();
    var html = NAV.map(function (n) {
      var badge = (n.id === 'red' && red) ? '<span class="badge">' + red + '</span>' : '';
      return '<button class="navbtn" type="button" data-act="nav" data-view="' + n.id + '"' +
        ' aria-current="' + (V.name === n.id) + '">' +
        '<span class="ic" aria-hidden="true">' + n.icon + '</span>' +
        '<span class="lb">' + n.label + '</span>' + badge + '</button>';
    }).join('');
    $('#nav-side').innerHTML = html;
    $('#nav-bottom').innerHTML = html;
  }

  // ── общие куски разметки ────────────────────────────────────────────────

  function bar(done, total, extraClass) {
    var pct = total ? Math.round(done / total * 100) : 0;
    return '<div class="bar ' + (extraClass || '') + (pct === 100 ? ' done' : '') +
      '" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
      '<i style="width:' + pct + '%"></i></div>';
  }

  function ring(done, total) {
    var pct = total ? done / total : 0;
    var r = 15, c = 2 * Math.PI * r;
    var s = '<svg class="ring" viewBox="0 0 38 38" aria-hidden="true">' +
      '<circle cx="19" cy="19" r="' + r + '" fill="none" stroke="var(--border-str)" stroke-width="3.5"/>';
    // при нуле дугу не рисуем вовсе: round-cap оставляет точку и создаёт ложный прогресс
    if (pct > 0) {
      s += '<circle cx="19" cy="19" r="' + r + '" fill="none" stroke="' + (pct >= 1 ? 'var(--green)' : 'var(--accent)') +
        '" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="' + (c * pct).toFixed(2) + ' ' + c.toFixed(2) +
        '" transform="rotate(-90 19 19)"/>';
    }
    return s + '<text x="19" y="22.5" text-anchor="middle">' + Math.round(pct * 100) + '</text></svg>';
  }

  function dayProgress(day, mode) {
    var ids = itemIdsOfDay(day, tiersForMode(mode));
    var done = 0;
    ids.forEach(function (id) { if (st(id).done) done++; });
    return { done: done, total: ids.length };
  }
  function dayProgressAll(day) {
    var ids = itemIdsOfDay(day, null);
    var done = 0;
    ids.forEach(function (id) { if (st(id).done) done++; });
    return { done: done, total: ids.length };
  }

  /** Текст пункта без ведущего эмодзи типа — его уже показывает иконка слева. */
  function bodyText(it) {
    var ic = TYPE_ICON[it.type];
    var t = it.text;
    if (ic && t.indexOf(ic) === 0) t = t.slice(ic.length).replace(/^\s+/, '');
    return t;
  }

  /** Строка пункта: чекбокс, иконка типа, текст, оценки уверенности, таймер. */
  function itemRow(it, opts) {
    opts = opts || {};
    var s = st(it.id);
    var icon = TYPE_ICON[it.type] || '';
    var h = '<div class="item' + (s.done ? ' is-done' : '') + '" data-item="' + it.id + '">';
    h += '<button class="chk" type="button" data-act="done" data-id="' + it.id + '"' +
      ' aria-pressed="' + s.done + '" title="Сделано" aria-label="Сделано">✓</button>';
    if (it.priority === 'kill') {
      h += '<span class="ic-type" title="kill-вопрос: на нём режут">⭐⭐</span>';
    } else if (it.priority && it.priority !== 'high') {
      h += '<span class="ic-type faint" title="приоритет ' + it.priority + '">' + it.priority + '</span>';
    } else {
      h += '<span class="ic-type" aria-hidden="true" title="' + esc(TYPE_LABEL[it.type] || '') + '">' + icon + '</span>';
    }
    h += '<span class="itext">';
    if (opts.showNumber && it.number != null) {
      // в отобранных списках номер уже вида «1.1» — вторая точка лишняя
      h += '<span class="qnum">' + it.number + (String(it.number).indexOf('.') < 0 ? '.' : '') + '</span>';
    }
    h += md(bodyText(it));
    if (it.note) h += '<span class="inote">' + md(it.note) + '</span>';
    if (it.children && it.children.length) {
      h += '<ul class="subs">' + it.children.map(function (c) {
        var cs = st(c.id);
        return '<li><button class="chk" type="button" data-act="done" data-id="' + c.id + '" aria-pressed="' +
          cs.done + '" aria-label="Сделано">✓</button><span>' + md(c.text) +
          (c.note ? '<span class="inote">' + md(c.note) + '</span>' : '') + '</span></li>';
      }).join('') + '</ul>';
    }
    h += '</span>';

    if (it.type === 'timed' || it.timerMinutes) {
      var mins = it.timerMinutes || 45;
      h += '<button class="tbtn" type="button" data-act="timer" data-min="' + mins +
        '" data-label="' + esc(plain(it.text).slice(0, 40)) + '">▶ ' + mins + ' мин</button>';
    }
    if (it.type === 'question') {
      h += '<span class="confs">' +
        confBtn(it.id, 'red', 'r', '🔴') + confBtn(it.id, 'yellow', 'y', '🟡') + confBtn(it.id, 'green', 'g', '🟢') +
        '</span>';
    }
    h += '</div>';
    return h;
  }

  function confBtn(id, conf, cls, glyph) {
    var s = st(id);
    return '<button class="conf ' + cls + '" type="button" data-act="conf" data-id="' + id + '" data-conf="' + conf +
      '" aria-pressed="' + (s.conf === conf) + '" title="' + CONF_LABEL[conf] + '" aria-label="' + CONF_LABEL[conf] + '">' +
      glyph + '</button>';
  }

  // ── экран «Сегодня» ─────────────────────────────────────────────────────

  function resolveTodayDay() {
    var t = todayISO();
    // плавающий календарь: день не сгорает — работаем с первым незакрытым
    if (STATE.flowMode) {
      for (var f = 0; f < DAYS().length; f++) {
        if (!isClosed(DAYS()[f].day)) return { entry: DAYS()[f], exact: dayDate(DAYS()[f].day) === t };
      }
      return { entry: DAYS()[DAYS().length - 1], exact: false, allDone: true };
    }
    for (var i = 0; i < DAYS().length; i++) {
      if (dayDate(DAYS()[i].day) === t) return { entry: DAYS()[i], exact: true };
    }
    // вне программы — ближайший незавершённый
    for (var j = 0; j < DAYS().length; j++) {
      if (!isClosed(DAYS()[j].day)) return { entry: DAYS()[j], exact: false };
    }
    return { entry: DAYS()[DAYS().length - 1], exact: false, allDone: true };
  }

  function currentDayEntry() {
    var pinned = findDay(V.dayId);
    if (pinned) return { entry: pinned, exact: dayDate(pinned.day) === todayISO(), pinned: true };
    return resolveTodayDay();
  }

  function viewToday() {
    var r = currentDayEntry();
    var week = r.entry.week, day = r.entry.day;
    var ds = dst(day.id);
    var mode = dayMode(day);
    var idx = DAYS().indexOf(r.entry);
    var h = '';

    if (r.allDone) {
      h += '<div class="card tight small warn muted">Все 65 дней закрыты. Дальше — «Красная зона» и «Отложено».</div>';
    } else if (!r.exact && !r.pinned) {
      var t = todayISO(), first = dayDate(DAYS()[0].day), last = dayDate(DAYS()[DAYS().length - 1].day);
      var msg;
      if (STATE.flowMode) msg = 'Плавающий календарь: показан первый незакрытый день программы. Ничего не сгорает.';
      else if (t < first) msg = 'Программа стартует ' + humanDate(first) + '. Пока показан ближайший незавершённый день — можно начать раньше или сдвинуть старт в настройках.';
      else if (t > last) msg = 'Программа закончилась ' + humanDate(last) + '. Показан ближайший незавершённый день.';
      else msg = 'Сегодня — ' + humanDate(t) + '. Показан ближайший незавершённый день.';
      h += '<div class="card tight small warn muted">' + esc(msg) + '</div>';
    }

    h += '<div class="card">';
    h += '<div class="dayhead">';
    h += '<div style="flex:1 1 auto;min-width:0">';
    h += '<div class="daymeta">';
    h += '<span class="pill">' + (STATE.track === 'full' ? 'Неделя ' : 'Блок ') + week.number + '</span>';
    // Дата — всегда сегодняшняя: работа идёт сегодня. Отставание не показываем сознательно:
    // оно демотивирует, а темп всё равно виден в «Статистике».
    var shown = STATE.flowMode ? todayISO() : dayDate(day);
    h += '<span>' + weekdayOf(shown) + ', ' + humanDate(shown) + '</span>';
    h += '<span class="faint">·</span><span>' + esc(week.title) + '</span>';
    if (day.hot) h += '<span class="pill hot">🔥 критический</span>';
    if (day.timed) h += '<span class="pill">⏱ под таймер</span>';
    if (ds.completedAt) h += '<span class="pill green">завершён</span>';
    h += '</div>';
    h += '<h2>' + esc(day.title) +
      (day.parts > 1 ? ' <span class="faint" style="font-weight:500;font-size:14px">· часть ' +
        day.part + ' из ' + day.parts + '</span>' : '') + '</h2>';
    h += '</div>';
    h += '<div class="navday">' +
      '<button class="btn" type="button" data-act="prevday" ' + (idx === 0 ? 'disabled' : '') + ' aria-label="Предыдущий день">←</button>' +
      '<button class="btn" type="button" data-act="nextday" ' + (idx === DAYS().length - 1 ? 'disabled' : '') + ' aria-label="Следующий день">→</button>' +
      '</div>';
    h += '</div>';

    if (day.prose) h += '<div class="prose">' + md(day.prose) + '</div>';

    var p = dayProgress(day, mode);
    h += '<div class="row" style="margin-top:14px">';
    h += '<div class="seg" role="group" aria-label="Норма дня">' +
      [20, 60, 120].map(function (m) {
        return '<button type="button" data-act="mode" data-mode="' + m + '" aria-pressed="' + (mode === m) + '">' + m + ' мин</button>';
      }).join('') + '</div>';
    h += '<div class="spacer"></div>';
    h += '<div class="small muted nums">' + p.done + ' / ' + p.total + ' по норме</div>';
    h += '</div>';
    h += '<div style="margin-top:8px">' + bar(p.done, p.total) + '</div>';
    h += '</div>';

    // памятка каркаса на все дни Недели 6
    if (week.framework && week.framework.length) {
      h += '<div class="card framework">';
      h += '<div class="row"><strong style="font-size:13.5px">' + esc(week.frameworkTitle || 'Каркас ответа') + '</strong></div>';
      h += '<ol>' + week.framework.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ol>';
      if (week.frameworkNote) h += '<div class="hint">' + md(week.frameworkNote) + '</div>';
      if (week.frameworkExtra) h += '<div class="hint">' + md(week.frameworkExtra) + '</div>';
      h += '</div>';
    }

    var openCount = tiersForMode(mode);
    day.tiers.forEach(function (t, i) {
      var key = day.id + ':' + i;
      var manual = V.openTiers[key];
      var open = (manual === undefined) ? (i < openCount) : manual;
      var dim = i >= openCount;
      var tp = { done: 0, total: 0 };
      t.items.forEach(function (it) {
        tp.total++; if (st(it.id).done) tp.done++;
        (it.children || []).forEach(function (c) { tp.total++; if (st(c.id).done) tp.done++; });
      });
      h += '<section class="tier' + (open ? ' open' : '') + (dim ? ' dim' : '') + '">';
      h += '<button class="tierhead" type="button" data-act="tier" data-key="' + key + '" aria-expanded="' + open + '">' +
        '<span class="caret" aria-hidden="true">▶</span>' +
        '<span class="lvl">' + (i === 0 ? '20 мин' : '+' + t.level + ' мин') + '</span>' +
        (dim ? '<span class="faint small">сверх нормы — уйдёт в «Отложено»</span>' : '') +
        '<span class="cnt">' + tp.done + '/' + tp.total + '</span></button>';
      h += '<div class="tierbody">' + t.items.map(function (it) {
        return itemRow(it, { showNumber: true });
      }).join('') + '</div>';
      h += '</section>';
    });

    // итог дня
    if (ds.completedAt) {
      var sum = daySummary(day, mode);
      var skipped = itemIdsOfDay(day, null).filter(function (id) { return !st(id).done; }).length;
      h += '<div class="card summary"><strong>День завершён</strong> · ' + humanDate(ds.completedAt.slice(0, 10)) +
        '<div class="small" style="margin-top:6px">🟢 ' + sum.green + ' · 🟡 ' + sum.yellow +
        ' · 🔴 ' + sum.red + ' ' + plural(sum.red, 'вопрос ушёл', 'вопроса ушло', 'вопросов ушло') + ' в красную зону' +
        (skipped ? ' · ' + skipped + ' ' + plural(skipped, 'пункт', 'пункта', 'пунктов') + ' в «Отложено»' : '') +
        '</div>' +
        '<div style="margin-top:10px"><button class="btn sm" type="button" data-act="unfinish">Отменить завершение</button></div></div>';
    } else {
      var left = itemIdsOfDay(day, null).filter(function (id) { return !st(id).done; }).length;
      var normLeft = itemIdsOfDay(day, tiersForMode(mode)).filter(function (id) { return !st(id).done; }).length;
      h += '<div class="card tight"><div class="row">' +
        '<button class="btn primary" type="button" data-act="finish">' +
        (normLeft ? 'Завершить досрочно' : 'Завершить день') + '</button>' +
        '<span class="small faint">' + (normLeft
          ? 'Норма не выполнена: ' + normLeft + ' ' + plural(normLeft, 'пункт', 'пункта', 'пунктов') + ' останется. ' +
            'В «Отложено» уйдёт ' + left + '.'
          : left ? 'В «Отложено» уйдёт ' + left + ' ' + plural(left, 'пункт', 'пункта', 'пунктов') + ' сверх нормы'
                 : 'Всё пройдено полностью') + '</span>' +
        '</div></div>';
    }
    return h;
  }

  function daySummary(day, mode) {
    var ids = itemIdsOfDay(day, tiersForMode(mode));
    var s = { green: 0, yellow: 0, red: 0, done: 0, total: ids.length };
    ids.forEach(function (id) {
      var v = st(id);
      if (v.done) s.done++;
      if (v.conf === 'green') s.green++;
      else if (v.conf === 'yellow') s.yellow++;
      else if (v.conf === 'red') s.red++;
    });
    return s;
  }

  // ── экран «Программа» ───────────────────────────────────────────────────

  function viewProgram() {
    var t = todayISO();
    var currentWeekId = null;
    DAYS().forEach(function (e) { if (dayDate(e.day) === t) currentWeekId = e.week.id; });
    if (!currentWeekId) {
      for (var i = 0; i < DAYS().length; i++) {
        if (!(STATE.days[DAYS()[i].day.id] && STATE.days[DAYS()[i].day.id].completedAt)) { currentWeekId = DAYS()[i].week.id; break; }
      }
    }

    var h = '<h1 class="page">Программа</h1><p class="sub">10 недель, 65 дней. Клик по дню открывает его на экране «Сегодня».</p>';

    activeWeeks().forEach(function (w) {
      var open = V.openWeeks[w.id];
      if (open === undefined) open = (w.id === currentWeekId);
      var done = 0, total = 0;
      w.days.forEach(function (d) { var p = dayProgressAll(d); done += p.done; total += p.total; });
      h += '<section class="week' + (open ? ' open' : '') + (w.id === currentWeekId ? ' current' : '') + '">';
      h += '<button class="weekhead" type="button" data-act="week" data-week="' + w.id + '" aria-expanded="' + open + '">';
      h += ring(done, total);
      h += '<span style="flex:1 1 auto;min-width:0">' +
        '<span class="wtitle">' + (STATE.track === 'full' ? 'Неделя ' : 'Блок ') + w.number + ' · ' + esc(w.title) + '</span>' +
        '<div class="wmeta">' + esc(w.dateRange) + ' · ' + done + ' / ' + total + ' пунктов</div>' +
        (w.risk ? '<div class="wrisk">Риск: ' + md(w.risk) + '</div>' : '') +
        '</span>';
      h += '<span class="caret faint" aria-hidden="true">' + (open ? '▾' : '▸') + '</span>';
      h += '</button>';
      h += '<div class="weekbody">';
      DAYS().filter(function (e) { return e.week.id === w.id; }).map(function (e) { return e.day; }).forEach(function (d) {
        var p = dayProgressAll(d);
        var pct = p.total ? Math.round(p.done / p.total * 100) : 0;
        var isToday = dayDate(d) === t;
        h += '<button class="dayrow' + (isToday ? ' today' : '') + '" type="button" data-act="day" data-id="' + d.id + '">' +
          '<span class="wd">' + weekdayOf(dayDate(d)) + ' ' + dayDate(d).slice(8) + '.' + dayDate(d).slice(5, 7) + '</span>' +
          '<span class="dt">' + esc(d.title) + (d.parts > 1 ? ' <span class="faint">· ' + d.part + '/' + d.parts + '</span>' : '') +
          (d.hot ? ' <span class="pill hot">🔥</span>' : '') +
          ((STATE.days[d.id] && STATE.days[d.id].completedAt) ? ' <span class="pill green">✓</span>' : '') + '</span>' +
          bar(p.done, p.total) +
          '<span class="pc">' + pct + '%</span></button>';
      });
      if (w.note) h += '<div class="prose small" style="margin:10px 4px 2px">' + md(w.note) + '</div>';
      h += '</div></section>';
    });
    return h;
  }

  // ── экран «Красная зона» ────────────────────────────────────────────────

  function collectFlagged() {
    var out = [];
    Object.keys(STATE.items).forEach(function (id) {
      var v = STATE.items[id];
      if (!v || !v.conf) return;
      if (v.conf !== 'red' && !(V.showYellow && v.conf === 'yellow')) return;
      var ref = ITEM_INDEX[id];
      if (!ref) return; // неизвестный itemId из старого состояния — молча игнорируем
      var vd = dayOfItem(id);
      if (!vd) return; // неделя скрыта из программы
      out.push({ id: id, conf: v.conf, ref: { item: ref.item, day: vd.day, week: vd.week } });
    });
    out.sort(function (a, b) { return a.ref.day.index - b.ref.day.index; });
    return out;
  }

  function viewRed() {
    var isSkipped = V.redTab === 'skipped';
    var all = isSkipped ? collectSkipped() : collectFlagged();
    var reds = isSkipped ? all.length : all.filter(function (x) { return x.conf === 'red'; }).length;
    var topics = [];
    all.forEach(function (x) { if (topics.indexOf(x.ref.day.topic) < 0) topics.push(x.ref.day.topic); });

    var shown = all;
    if (V.random && V.random.length) {
      shown = all.filter(function (x) { return V.random.indexOf(x.id) >= 0; });
    } else if (V.topic !== '*') {
      shown = all.filter(function (x) { return x.ref.day.topic === V.topic; });
    }

    var h = '<h1 class="page">Красная зона</h1>';

    // вкладки: охват и уверенность — разные оси, счётчики раздельные
    h += '<div class="seg" role="group" aria-label="Что показывать" style="margin-bottom:12px">' +
      '<button type="button" data-act="redtab" data-tab="conf" aria-pressed="' + (!isSkipped) + '">🔴 Не даётся · ' + redCount() + '</button>' +
      '<button type="button" data-act="redtab" data-tab="skipped" aria-pressed="' + isSkipped + '">Отложено · ' + skippedCount() + '</button>' +
      '</div>';

    h += '<p class="sub nums">' + (isSkipped
      ? reds + ' ' + plural(reds, 'пункт', 'пункта', 'пунктов') + ' из закрытых дней осталось непройденными'
      : reds + ' ' + plural(reds, 'вопрос', 'вопроса', 'вопросов') + ' в красной зоне' + (V.showYellow ? ', плюс жёлтые' : '')) + '</p>';

    h += '<div class="card tight"><div class="row">';
    h += '<button class="btn sm" type="button" data-act="random5">Случайные 5</button>';
    if (V.random) h += '<button class="btn sm" type="button" data-act="clearrandom">Показать все</button>';
    h += '<span class="spacer"></span>';
    if (!isSkipped) {
      h += '<button class="chip" type="button" data-act="showyellow" aria-pressed="' + V.showYellow + '">показывать также 🟡</button>';
    }
    h += '</div>';
    if (topics.length > 1 && !V.random) {
      h += '<div class="chips">';
      h += '<button class="chip" type="button" data-act="topic" data-topic="*" aria-pressed="' + (V.topic === '*') + '">все темы</button>';
      topics.forEach(function (tp) {
        var n = all.filter(function (x) { return x.ref.day.topic === tp; }).length;
        h += '<button class="chip" type="button" data-act="topic" data-topic="' + esc(tp) + '" aria-pressed="' +
          (V.topic === tp) + '">' + esc(tp) + ' · ' + n + '</button>';
      });
      h += '</div>';
    }
    h += '</div>';

    if (!shown.length) {
      h += '<div class="card muted small">' + (all.length
        ? 'В этой выборке пусто.'
        : isSkipped
          ? 'Пока пусто. Сюда попадут пункты сверх нормы из дней, которые вы закроете — чтобы прогнать их в конце.'
          : 'Пока пусто. Отмечайте 🔴 те вопросы, которые не смогли объяснить вслух — они соберутся здесь по темам.') + '</div>';
      return h;
    }

    var groups = {}, order = [];
    shown.forEach(function (x) {
      var tp = x.ref.day.topic;
      if (!groups[tp]) { groups[tp] = []; order.push(tp); }
      groups[tp].push(x);
    });

    order.forEach(function (tp) {
      h += '<div class="topicgroup"><h3>' + esc(tp) + ' · ' + groups[tp].length + '</h3>';
      groups[tp].forEach(function (x) {
        var it = x.ref.item, d = x.ref.day, w = x.ref.week;
        h += '<div class="rzitem' + (isSkipped ? ' sk' : (x.conf === 'yellow' ? ' y' : '')) + '" data-item="' + it.id + '">';
        h += '<div class="row" style="align-items:flex-start;gap:9px;flex-wrap:nowrap">';
        if (isSkipped) {
          h += '<button class="chk" type="button" data-act="done" data-id="' + it.id +
            '" aria-pressed="false" title="Сделано" aria-label="Сделано">✓</button>';
        }
        h += '<span style="flex:1 1 auto;min-width:0">' + md(it.text) +
          (it.note ? '<span class="inote">' + md(it.note) + '</span>' : '') + '</span>';
        h += '</div>';
        h += '<div class="src">';
        if (isSkipped) {
          h += '<span class="pill">' + esc(TYPE_LABEL[it.type] || it.type) + '</span>';
          if (st(it.id).conf === 'red') h += '<span title="ещё и в красной зоне">🔴</span>';
        } else {
          h += '<span class="confs">' + confBtn(it.id, 'red', 'r', '🔴') + confBtn(it.id, 'yellow', 'y', '🟡') +
            confBtn(it.id, 'green', 'g', '🟢') + '</span>';
        }
        h += '<button class="link" type="button" data-act="goto" data-id="' + it.id + '">' + (STATE.track === 'full' ? 'Неделя ' : 'Блок ') + w.number +
          ' · ' + weekdayOf(dayDate(d)) + ' ' + esc(d.title) + '</button>';
        h += '</div></div>';
      });
      h += '</div>';
    });
    return h;
  }

  // ── экран «Поиск» ───────────────────────────────────────────────────────

  function viewSearch() {
    var h = '<h1 class="page">Поиск</h1><p class="sub">По всем ' + activeItemCount() + ' пунктам программы. Результаты обновляются на лету.</p>';
    h += '<input class="searchbox" id="q" type="search" placeholder="например: StateFlow, idempotency, Compose…" ' +
      'value="' + esc(V.q) + '" autocomplete="off" spellcheck="false">';
    h += '<div id="results"></div>';
    return h;
  }

  function searchResults(q) {
    var needle = q.trim().toLowerCase();
    if (needle.length < 2) {
      return '<div class="card muted small" style="margin-top:14px">Введите хотя бы два символа.</div>';
    }
    var hits = [];
    for (var i = 0; i < ALL_ITEMS.length && hits.length < 300; i++) {
      if (ALL_ITEMS[i]._lc.indexOf(needle) < 0) continue;
      if (!dayOfItem(ALL_ITEMS[i].id)) continue;
      hits.push(ALL_ITEMS[i]);
    }
    if (!hits.length) return '<div class="card muted small" style="margin-top:14px">Ничего не найдено.</div>';

    var h = '<p class="sub nums" style="margin:14px 0 8px">' + hits.length +
      (hits.length >= 300 ? '+' : '') + ' ' + plural(hits.length, 'совпадение', 'совпадения', 'совпадений') + '</p>';
    hits.forEach(function (it) {
      var vd = dayOfItem(it.id);
      var ref = { week: vd.week, day: vd.day };
      var s = st(it.id);
      var dot = s.conf ? ({ red: '🔴', yellow: '🟡', green: '🟢' })[s.conf] : (s.done ? '✓' : '');
      h += '<div class="rzitem" style="border-left-color:var(--border-str)">';
      h += '<div class="hl">' + md(it.text) + '</div>';
      h += '<div class="src">' +
        '<span class="pill">' + esc(TYPE_LABEL[it.type] || it.type) + '</span>' +
        (dot ? '<span>' + dot + '</span>' : '') +
        '<button class="link" type="button" data-act="goto" data-id="' + it.id + '">Неделя ' + ref.week.number +
        ' · ' + weekdayOf(dayDate(ref.day)) + ' ' + humanDate(dayDate(ref.day)).replace(/ \d{4}$/, '') + ' · ' + esc(ref.day.title) +
        '</button></div></div>';
    });
    return h;
  }

  /** Подсветка совпадений в уже отрендеренном HTML — по текстовым узлам, теги не ломаются. */
  function highlight(root, q) {
    var needle = q.trim().toLowerCase();
    if (needle.length < 2) return;
    var nodes = root.querySelectorAll('.hl');
    Array.prototype.forEach.call(nodes, function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var texts = [], n;
      while ((n = walker.nextNode())) texts.push(n);
      texts.forEach(function (node) {
        var lc = node.nodeValue.toLowerCase();
        var pos = lc.indexOf(needle);
        if (pos < 0) return;
        var frag = document.createDocumentFragment();
        var rest = node.nodeValue, off = 0;
        while (pos >= 0) {
          frag.appendChild(document.createTextNode(rest.slice(off, pos)));
          var mk = document.createElement('mark');
          mk.textContent = rest.slice(pos, pos + needle.length);
          frag.appendChild(mk);
          off = pos + needle.length;
          pos = rest.toLowerCase().indexOf(needle, off);
        }
        frag.appendChild(document.createTextNode(rest.slice(off)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  // ── экран «Статистика» ──────────────────────────────────────────────────

  function viewStats() {
    var totals = { done: 0, total: 0 };
    var conf = { red: 0, yellow: 0, green: 0, none: 0 };
    var byType = {};
    var qTotal = 0;

    activeWeeks().forEach(function (w) {
      w.days.forEach(function (d) {
        d.tiers.forEach(function (t) {
          t.items.forEach(function (it) { tally(it); (it.children || []).forEach(tally); });
        });
      });
    });
    function tally(it) {
      totals.total++;
      var s = st(it.id);
      if (s.done) totals.done++;
      var b = byType[it.type] || (byType[it.type] = { done: 0, total: 0 });
      b.total++; if (s.done) b.done++;
      if (it.type === 'question') {
        qTotal++;
        if (s.conf) conf[s.conf]++; else conf.none++;
      }
    }

    var end = isoAdd(STATE.startDate, DAYS().length);
    var left = isoDiff(todayISO(), end);
    var streak = calcStreak();

    var h = '<h1 class="page">Статистика</h1><p class="sub">Только цифры. Никаких оценок и подсказок.</p>';

    h += '<div class="grid">';
    h += stat(totals.done + ' / ' + totals.total, 'пунктов отмечено');
    h += stat(Math.round(totals.done / totals.total * 100) + '%', 'общий прогресс');
    h += stat(streak, plural(streak, 'день подряд', 'дня подряд', 'дней подряд') + ' (режим 20+)');
    h += stat(left > 0 ? left : 0, left > 0
      ? plural(left, 'день', 'дня', 'дней') + ' до ' + humanDate(end).replace(/ \d{4}$/, '')
      : 'программа пройдена');
    h += '</div>';

    var fc = forecast();
    h += '<div class="card" style="margin-top:14px"><strong style="font-size:13.5px">Прогноз</strong>';
    h += '<div class="scrollx"><table class="tbl" style="margin-top:6px"><tbody>';
    h += '<tr><td>дней программы закрыто</td><td class="n">' + fc.closed + ' / ' + DAYS().length + '</td></tr>';
    h += '<tr><td>темп за последние 14 дней</td><td class="n">' +
      (fc.rate > 0 ? fc.rate.toFixed(2) + ' дня программы в день' : '—') + '</td></tr>';
    h += '<tr><td>финиш при этом темпе</td><td class="n">' +
      (fc.finish ? humanDate(fc.finish) : '—') + '</td></tr>';
    h += '<tr><td>плановый финиш</td><td class="n">' + humanDate(isoAdd(STATE.startDate, DAYS().length - 1)) + '</td></tr>';
    h += '<tr><td>отложено на потом</td><td class="n">' + skippedCount() + ' ' +
      plural(skippedCount(), 'пункт', 'пункта', 'пунктов') + '</td></tr>';
    h += '</tbody></table></div></div>';

    h += '<div class="card"><strong style="font-size:13.5px">Прогресс по неделям</strong><div style="margin-top:8px">';
    activeWeeks().forEach(function (w) {
      var done = 0, total = 0;
      w.days.forEach(function (d) { var p = dayProgressAll(d); done += p.done; total += p.total; });
      var pct = total ? Math.round(done / total * 100) : 0;
      h += '<div class="wkbar"><span class="lbl">' + (STATE.track === 'full' ? 'Неделя ' : 'Блок ') + w.number + '</span>' + bar(done, total) +
        '<span class="pc">' + pct + '% · ' + done + '</span></div>';
    });
    h += '</div></div>';

    h += '<div class="card"><strong style="font-size:13.5px">Уверенность по вопросам</strong>';
    h += '<div class="donutwrap" style="margin-top:10px">' + donut(conf, qTotal) + '<div class="legend">' +
      legend('var(--red)', '🔴 не могу объяснить', conf.red) +
      legend('var(--yellow)', '🟡 плаваю', conf.yellow) +
      legend('var(--green)', '🟢 уверенно', conf.green) +
      legend('var(--border-str)', 'без оценки', conf.none) +
      '</div></div></div>';

    h += '<div class="card"><strong style="font-size:13.5px">По типам пунктов</strong><div class="scrollx">' +
      '<table class="tbl"><thead><tr><th>тип</th><th class="n">пройдено</th><th class="n">всего</th><th class="n">%</th></tr></thead><tbody>';
    Object.keys(byType).sort(function (a, b) { return byType[b].total - byType[a].total; }).forEach(function (k) {
      var b = byType[k];
      h += '<tr><td>' + (TYPE_ICON[k] ? TYPE_ICON[k] + ' ' : '') + esc(TYPE_LABEL[k] || k) + '</td>' +
        '<td class="n">' + b.done + '</td><td class="n">' + b.total + '</td>' +
        '<td class="n">' + Math.round(b.done / b.total * 100) + '</td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  }

  function stat(n, l) { return '<div class="stat"><div class="n nums">' + n + '</div><div class="l">' + l + '</div></div>'; }
  function legend(color, label, n) {
    return '<div><i style="background:' + color + '"></i><span>' + label + '</span>' +
      '<span class="spacer"></span><span class="nums muted">' + n + '</span></div>';
  }

  function donut(conf, total) {
    var segs = [
      { v: conf.red, c: 'var(--red)' }, { v: conf.yellow, c: 'var(--yellow)' },
      { v: conf.green, c: 'var(--green)' }, { v: conf.none, c: 'var(--border-str)' }
    ];
    var r = 52, c = 2 * Math.PI * r, off = 0;
    var s = '<svg width="130" height="130" viewBox="0 0 130 130" role="img" aria-label="Распределение оценок">';
    segs.forEach(function (g) {
      if (!g.v || !total) return;
      var len = c * (g.v / total);
      s += '<circle cx="65" cy="65" r="' + r + '" fill="none" stroke="' + g.c + '" stroke-width="16" ' +
        'stroke-dasharray="' + len.toFixed(2) + ' ' + (c - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) +
        '" transform="rotate(-90 65 65)"/>';
      off += len;
    });
    var rated = total - conf.none;
    s += '<text x="65" y="62" text-anchor="middle" fill="var(--text)" font-size="20" font-family="var(--sans)">' + rated + '</text>';
    s += '<text x="65" y="79" text-anchor="middle" fill="var(--text-faint)" font-size="11" font-family="var(--sans)">из ' + total + '</text>';
    s += '</svg>';
    return s;
  }

  /**
   * Прогноз. Темп считаем по completedAt закрытых дней — отдельная история отметок не нужна.
   * Только факты: сколько дней программы закрывается за календарный день и когда это кончится.
   */
  function forecast() {
    var closed = 0, recent = 0;
    var t = todayISO();
    DAYS().forEach(function (e) {
      var v = STATE.days[e.day.id];
      if (!v || !v.completedAt) return;
      closed++;
      var d = String(v.completedAt).slice(0, 10);
      if (isoDiff(d, t) >= 0 && isoDiff(d, t) < 14) recent++;
    });
    var remaining = DAYS().length - closed;
    var rate = recent / 14;                       // дней программы за календарный день
    var out = { closed: closed, remaining: remaining, rate: rate, eta: null, finish: null, lag: null };
    if (rate > 0 && remaining > 0) {
      out.eta = Math.ceil(remaining / rate);
      out.finish = isoAdd(t, out.eta);
    } else if (remaining === 0) {
      out.finish = t;
      out.eta = 0;
    }
    // отставание: сколько дней программы должно было быть закрыто к сегодня по плану
    // Пока не закрыт ни один день, говорить об отставании нечестно — программа не начата.
    // сколько дней должно было быть закрыто: считаем ПОЛНОСТЬЮ прошедшие дни,
    // иначе в день старта приложение рапортует об отставании на день, который ещё идёт
    var planned = Math.max(0, Math.min(DAYS().length, isoDiff(STATE.startDate, t)));
    out.lag = planned > 0 ? planned - closed : null;
    return out;
  }

  /** Серия: сколько дней подряд закрыт хотя бы блок «20 мин». */
  function calcStreak() {
    var t = todayISO();
    var i = DAYS().length - 1;
    for (var k = 0; k < DAYS().length; k++) { if (dayDate(DAYS()[k].day) > t) { i = k - 1; break; } }
    if (i < 0) return 0;
    var n = 0;
    // если сегодняшний день ещё не закрыт — считаем серию до вчерашнего
    if (!minDone(DAYS()[i].day)) i--;
    while (i >= 0 && minDone(DAYS()[i].day)) { n++; i--; }
    return n;
  }
  function minDone(day) {
    if (STATE.days[day.id] && STATE.days[day.id].completedAt) return true;
    if (!day.tiers.length) return false;
    var ids = itemIdsOfDay(day, 1);
    if (!ids.length) return false;
    return ids.every(function (id) { return st(id).done; });
  }

  // ── экран «Настройки» ───────────────────────────────────────────────────

  function viewSettings() {
    var h = '<h1 class="page">Настройки</h1><p class="sub">Всё хранится локально, в этом браузере.</p>';

    h += '<div class="card"><div class="field">' +
      '<label for="startdate">Дата старта программы</label>' +
      '<input type="date" id="startdate" value="' + STATE.startDate + '">' +
      '<button class="btn sm" type="button" data-act="startdate" style="margin-left:8px">Применить</button>' +
      '<div class="row" style="margin-top:8px">' +
      '<button class="btn sm" type="button" data-act="startquick" data-when="0">Начать сегодня</button>' +
      '<button class="btn sm" type="button" data-act="startquick" data-when="1">Начать завтра</button>' +
      '<button class="btn sm" type="button" data-act="startrhythm">Начать с ' + rhythmWeekdayName() + ' — сохранить ритм</button>' +
      '</div>' +
      '<div class="hint">Программа построена на ритме недели: <strong>Пн–Чт</strong> теория, ' +
      '<strong>Пт</strong> код, <strong>Сб</strong> большой блок, <strong>Вс</strong> behavioral и английский. ' +
      'Плановый старт — ' + rhythmWeekdayName() + '. Если начать в другой день недели, ритм сместится: ' +
      '«большой блок» и behavioral попадут на будни. ' +
      (weekdayOf(STATE.startDate) === DAYS()[0].day.weekday
        ? 'Сейчас ритм совпадает с исходным.'
        : 'Сейчас ритм смещён: первый день приходится на ' + weekdayFull(weekdayOf(STATE.startDate)) + '.') +
      '</div>' +
      '<div class="hint">Все 65 дней пересчитываются от этой даты, структура недель сохраняется. ' +
      'Сейчас программа идёт с ' + humanDate(STATE.startDate) + ' по ' + humanDate(isoAdd(STATE.startDate, DAYS().length - 1)) + '. ' +
      'Прогресс привязан к пунктам, а не к датам, и не теряется.</div>' +
      '</div></div>';

    var trackInfo = { core: 'Отобранное ядро: 216 вопросов, из них 68 kill-вопросов ⭐⭐. Закрыть к концу октября.',
      second: 'Вторая волна: 233 вопроса. Открывать, когда в ядре не осталось 🔴.',
      full: 'Исходная девятинедельная программа: 65 дней, 445 вопросов, задачи и behavioral.' };
    h += '<div class="card"><div class="field">' +
      '<label>Какой список проходим</label>' +
      '<div class="seg" role="group">' +
      ['core', 'second', 'full'].map(function (k) {
        return '<button type="button" data-act="track" data-track="' + k + '" aria-pressed="' +
          (STATE.track === k) + '">' + TRACKS[k].title + '</button>';
      }).join('') + '</div>' +
      '<div class="hint">' + trackInfo[STATE.track] + '</div></div>';

    if (STATE.track !== 'full') {
      var opts = STATE.track === 'core'
        ? [['all', 'все ⭐⭐ и ⭐'], ['kill', 'только ⭐⭐']]
        : [['all', 'все A · B · C'], ['AB', 'A и B'], ['A', 'только A']];
      h += '<div class="field" style="margin-bottom:0">' +
        '<label>Приоритет вопросов</label>' +
        '<div class="seg" role="group">' + opts.map(function (o) {
          return '<button type="button" data-act="prio" data-prio="' + o[0] + '" aria-pressed="' +
            (STATE.minPriority === o[0]) + '">' + o[1] + '</button>';
        }).join('') + '</div>' +
        '<div class="hint">Сейчас в программе <strong>' + activeItemCount() + '</strong> ' +
        plural(activeItemCount(), 'вопрос', 'вопроса', 'вопросов') + '.' +
        (STATE.track === 'core' ? ' Kill-вопросы ⭐⭐ — те, на которых режут: их держат первыми в очереди.' : '') +
        '</div></div>';
    }
    h += '</div>';

    h += '<div class="card"><div class="field" style="margin-bottom:0">' +
      '<label>' + (STATE.track === 'full' ? 'Программа начинается с недели' : 'Программа начинается с блока') + '</label>' +
      '<div class="chips" style="margin:0 0 4px">' +
      SRC.weeks.map(function (w) {
        return '<button class="chip" type="button" data-act="startweek" data-week="' + w.number +
          '" aria-pressed="' + (STATE.startWeek === w.number) + '" title="' + esc(w.title) + '">' +
          w.number + '</button>';
      }).join('') + '</div>' +
      '<div class="hint">' + (STATE.startWeek > 0
        ? (STATE.startWeek === 1 ? 'Неделя 0 скрыта' : 'Недели 0–' + (STATE.startWeek - 1) + ' скрыты') +
          ': их нет ни в «Сегодня», ни в «Программе», ' +
          'ни в поиске, ни в статистике, и не занимают дат. ' +
          'Отметки по ним сохранены — вернуть можно в любой момент, нажав «0».'
        : 'Показана вся программа, все 10 недель.') +
      ' Сейчас первый день — <strong>' + esc(DAYS()[0].week.title) + ' · ' + esc(DAYS()[0].day.title) + '</strong>.' +
      '</div></div></div>';

    var sizes = [[0, 'весь день'], [3, '3 · 1+1+1'], [6, '6 · 2+2+2'], [9, '9 · 3+3+3']];
    var d = DAYS();
    h += '<div class="card"><div class="field" style="margin-bottom:0">' +
      '<label>Сколько пунктов в одном дне</label>' +
      '<div class="seg" role="group">' + sizes.map(function (x) {
        return '<button type="button" data-act="split" data-size="' + x[0] + '" aria-pressed="' +
          ((STATE.splitSize || 0) === x[0]) + '">' + x[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="hint">Большие дни режутся на части: тема остаётся той же, но растягивается на ' +
      'несколько дней, а вся программа сдвигается. Пункты и отметки не меняются — режьте и ' +
      'склеивайте сколько угодно, прогресс переживает это. ' +
      '<strong>Сейчас: ' + d.length + ' ' + plural(d.length, 'день', 'дня', 'дней') + '</strong>, ' +
      'с ' + humanDate(STATE.startDate).replace(/ \d{4}$/, '') + ' по ' +
      humanDate(isoAdd(STATE.startDate, d.length - 1)) + '.</div>' +
      '</div></div>';

    h += '<div class="card"><div class="field">' +
      '<label>Норма дня — сколько нужно закрыть, чтобы день считался пройденным</label>' +
      '<div class="seg" role="group">' +
      [20, 60, 120].map(function (m) {
        return '<button type="button" data-act="norm" data-norm="' + m + '" aria-pressed="' + (STATE.norm === m) + '">' + m + ' мин</button>';
      }).join('') + '</div>' +
      '<div class="hint">При норме 60 минут программа проходится за 64 дня — ровно в срок — и покрывает 64% материала. ' +
      'Блок «+60 мин» остаётся сверх нормы и попадает в «Отложено».</div>' +
      '</div>' +
      '<div class="field" style="margin-bottom:0">' +
      '<label>Не терять непройденное</label>' +
      '<div class="seg" role="group">' +
      '<button type="button" data-act="flow" data-flow="1" aria-pressed="' + (STATE.flowMode === true) + '">Плавающий календарь</button>' +
      '<button type="button" data-act="flow" data-flow="0" aria-pressed="' + (STATE.flowMode === false) + '">Строго по датам</button>' +
      '</div>' +
      '<div class="hint">Плавающий календарь: «Сегодня» показывает первый незакрытый день. ' +
      'Не успели — программа сдвигается, день не сгорает. Плановые даты в разделе «Программа» не меняются.</div>' +
      '</div></div>';

    h += '<div class="card"><div class="field">' +
      '<label>Тема оформления</label>' +
      '<div class="seg" role="group">' +
      '<button type="button" data-act="theme" data-theme="dark" aria-pressed="' + (STATE.settings.theme === 'dark') + '">Тёмная</button>' +
      '<button type="button" data-act="theme" data-theme="light" aria-pressed="' + (STATE.settings.theme === 'light') + '">Светлая</button>' +
      '</div></div></div>';

    h += '<div class="card"><strong style="font-size:13.5px">Перенос прогресса</strong>' +
      '<div class="row" style="margin-top:10px">' +
      '<button class="btn" type="button" data-act="export">Экспорт в JSON</button>' +
      '<button class="btn" type="button" data-act="import">Импорт из JSON</button>' +
      '<input type="file" id="importfile" accept="application/json,.json" hidden>' +
      '</div>' +
      '<div class="hint warn" style="margin-top:12px">Прогресс хранится отдельно для каждого адреса. ' +
      'Если откроете приложение по другому адресу — перенесите прогресс через экспорт и импорт.</div>' +
      '</div>';

    h += '<div class="card"><strong style="font-size:13.5px">Сброс</strong>' +
      '<div class="row" style="margin-top:10px">' +
      '<button class="btn danger" type="button" data-act="reset">Стереть весь прогресс</button>' +
      '<span class="small faint">Потребуется подтверждение</span></div></div>';

    if (PROGRAM.rules && PROGRAM.rules.length) {
      h += '<div class="card"><strong style="font-size:13.5px">Правила программы</strong><ol style="margin:8px 0 0;padding-left:20px;font-size:13.5px;color:var(--text-dim)">' +
        PROGRAM.rules.map(function (r) { return '<li style="margin-bottom:3px">' + md(r) + '</li>'; }).join('') + '</ol>' +
        (PROGRAM.rhythm ? '<div class="hint">' + md(PROGRAM.rhythm) + '</div>' : '') +
        (PROGRAM.outro ? '<div class="hint">' + md(PROGRAM.outro) + '</div>' : '') +
        '</div>';
    }

    if (PROGRAM.composition && PROGRAM.composition.length) {
      h += '<div class="card"><strong style="font-size:13.5px">Состав программы</strong><div class="scrollx">' +
        '<table class="tbl"><thead><tr><th>что</th><th class="n">сколько</th><th>где</th></tr></thead><tbody>' +
        PROGRAM.composition.map(function (c) {
          return '<tr><td>' + md(c.what) + '</td><td class="n">' + md(c.count) + '</td><td>' + md(c.where) + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }
    return h;
  }

  // ── рендер ──────────────────────────────────────────────────────────────

  function render() {
    document.documentElement.setAttribute('data-theme', STATE.settings.theme);
    renderNav();
    renderFooter();
    var main = $('#main');
    var html;
    switch (V.name) {
      case 'program': html = viewProgram(); break;
      case 'red': html = viewRed(); break;
      case 'search': html = viewSearch(); break;
      case 'stats': html = viewStats(); break;
      case 'settings': html = viewSettings(); break;
      default: html = viewToday();
    }
    main.innerHTML = html;

    if (V.name === 'search') {
      var input = $('#q');
      renderResults();
      input.focus();
      var pos = input.value.length;
      try { input.setSelectionRange(pos, pos); } catch (e) { /* type=search may refuse */ }
    }

    if (V.focus) {
      var el = main.querySelector('[data-item="' + V.focus + '"]');
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.classList.add('flash');
        setTimeout(function () { el.classList.remove('flash'); }, 900);
      }
      V.focus = null;
    }
  }

  function renderResults() {
    var box = $('#results');
    if (!box) return;
    box.innerHTML = searchResults(V.q);
    highlight(box, V.q);
  }

  /** Точечное обновление строки пункта — без перерисовки всего экрана. */
  function refreshItem(id) {
    var ref = ITEM_INDEX[id];
    if (!ref) return;
    var s = st(id);
    Array.prototype.forEach.call(document.querySelectorAll('[data-act="done"][data-id="' + id + '"]'), function (b) {
      b.setAttribute('aria-pressed', String(s.done));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-act="conf"][data-id="' + id + '"]'), function (b) {
      b.setAttribute('aria-pressed', String(s.conf === b.getAttribute('data-conf')));
    });
    var row = document.querySelector('.item[data-item="' + id + '"]');
    if (row) row.classList.toggle('is-done', s.done);
  }

  // ── таймер ──────────────────────────────────────────────────────────────

  var T = { total: 20 * 60, remain: 20 * 60, running: false, endAt: 0, label: '', tick: null, done: false };
  var audioCtx = null;
  var baseTitle = 'Interview Prep Tracker';

  function fmt(sec) {
    var neg = sec < 0; sec = Math.abs(sec);
    return (neg ? '+' : '') + pad2(Math.floor(sec / 60)) + ':' + pad2(sec % 60);
  }
  function timerPaint() {
    var txt = fmt(T.remain);
    $('#t-display').textContent = txt;
    $('#fab-time').textContent = txt;
    $('#t-label').textContent = T.label || (T.running ? 'идёт' : 'пауза');
    $('#t-toggle').textContent = T.running ? 'Пауза' : (T.remain === T.total ? 'Старт' : 'Продолжить');
    var fab = $('#fab');
    fab.classList.toggle('running', T.running && !T.done);
    fab.classList.toggle('over', T.done);
    document.title = T.running ? txt + ' · ' + baseTitle : (T.done ? '⏰ Время вышло · ' + baseTitle : baseTitle);
  }
  function timerSet(min, label) {
    timerStop();
    T.total = Math.max(1, Math.round(min * 60));
    T.remain = T.total;
    T.label = label || '';
    T.done = false;
    timerPaint();
  }
  function timerStart() {
    if (T.running) return;
    T.running = true;
    T.done = false;
    T.endAt = Date.now() + T.remain * 1000;
    T.tick = setInterval(function () {
      var left = Math.round((T.endAt - Date.now()) / 1000);
      if (left <= 0 && !T.done) {
        T.done = true;
        beep();
        toast('Время вышло' + (T.label ? ': ' + T.label : ''));
      }
      T.remain = left;
      timerPaint();
    }, 250);
    timerPaint();
  }
  function timerStop() {
    if (T.tick) { clearInterval(T.tick); T.tick = null; }
    T.running = false;
    timerPaint();
  }
  function beep() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var t0 = audioCtx.currentTime;
      [0, 0.32, 0.64].forEach(function (off) {
        var osc = audioCtx.createOscillator(), g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t0 + off);
        g.gain.setValueAtTime(0.0001, t0 + off);
        g.gain.exponentialRampToValueAtTime(0.22, t0 + off + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + off + 0.26);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t0 + off); osc.stop(t0 + off + 0.3);
      });
    } catch (e) { /* звук не критичен */ }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  // ── действия ────────────────────────────────────────────────────────────

  function go(view) {
    V.name = view;
    if (view !== 'red') V.random = null;
    window.scrollTo(0, 0);
    render();
  }

  function gotoItem(id) {
    var ref = ITEM_INDEX[id];
    var vd = dayOfItem(id);
    if (!ref || !vd) return;
    // раскрываем именно тот блок нужной части дня, где пункт лежит после перенарезки
    vd.day.tiers.forEach(function (t, i) {
      if (t.items.some(function (it) {
        return it.id === id || (it.children || []).some(function (c) { return c.id === id; });
      })) V.openTiers[vd.day.id + ':' + i] = true;
    });
    V.dayId = vd.day.id;
    V.focus = id;
    V.name = 'today';
    window.scrollTo(0, 0);
    render();
  }

  var ACTIONS = {
    nav: function (el) {
      var v = el.getAttribute('data-view');
      // «Сегодня» всегда возвращает к актуальному дню, а не к открытому ранее из «Программы»
      if (v === 'today') V.dayId = null;
      go(v);
    },

    done: function (el) {
      var id = el.getAttribute('data-id');
      var s = st(id);
      s.done = !s.done;
      var vd = dayOfItem(id);
      var ref = vd ? { day: vd.day } : null;
      var rec = ref ? STATE.days[ref.day.id] : null;
      // норма выполнена — день закрывается сам. Проверяем именно completedAt, а не isClosed():
      // isClosed() сам опирается на normDone(), иначе условие гасит себя же.
      if (s.done && ref && !(rec && rec.completedAt) && normDone(ref.day)) {
        dst(ref.day.id).completedAt = new Date().toISOString();
        save();
        var sm = daySummary(ref.day, dayMode(ref.day));
        var sk = itemIdsOfDay(ref.day, null).filter(function (x) { return !st(x).done; }).length;
        render();
        toast('Норма выполнена, день закрыт· 🟢 ' + sm.green + ' · 🔴 ' + sm.red +
          (sk ? ' · ' + sk + ' в «Отложено»' : ''));
        return;
      }
      save();
      if (V.name === 'red' && V.redTab === 'skipped') { render(); return; }
      refreshItem(id);
      updateDayChrome();
    },

    conf: function (el) {
      var id = el.getAttribute('data-id'), c = el.getAttribute('data-conf');
      var s = st(id);
      s.conf = (s.conf === c) ? null : c;
      save();
      if (V.name === 'red') render();
      else { refreshItem(id); renderNav(); }
    },

    mode: function (el) {
      var r = currentDayEntry();
      // разовое переопределение нормы для этого дня; глобальная норма — в «Настройках»
      dst(r.entry.day.id).mode = +el.getAttribute('data-mode');
      // ручные раскрытия сбрасываем — режим снова главный
      Object.keys(V.openTiers).forEach(function (k) {
        if (k.indexOf(r.entry.day.id + ':') === 0) delete V.openTiers[k];
      });
      save();
      render();
    },

    tier: function (el) {
      var key = el.getAttribute('data-key');
      var sec = el.parentNode;
      var open = !sec.classList.contains('open');
      V.openTiers[key] = open;
      sec.classList.toggle('open', open);
      el.setAttribute('aria-expanded', String(open));
    },

    week: function (el) {
      var id = el.getAttribute('data-week');
      var sec = el.parentNode;
      var open = !sec.classList.contains('open');
      V.openWeeks[id] = open;
      sec.classList.toggle('open', open);
      el.setAttribute('aria-expanded', String(open));
      var caret = el.querySelector('.caret');
      if (caret) caret.textContent = open ? '▾' : '▸';
    },

    day: function (el) { V.dayId = el.getAttribute('data-id'); go('today'); },

    prevday: function () {
      var i = DAYS().indexOf(currentDayEntry().entry);
      if (i > 0) { V.dayId = DAYS()[i - 1].day.id; window.scrollTo(0, 0); render(); }
    },
    nextday: function () {
      var i = DAYS().indexOf(currentDayEntry().entry);
      if (i < DAYS().length - 1) { V.dayId = DAYS()[i + 1].day.id; window.scrollTo(0, 0); render(); }
    },

    finish: function () {
      var r = currentDayEntry();
      var day = r.entry.day;
      var ds = dst(day.id);
      var mode = dayMode(day);
      var normLeft = itemIdsOfDay(day, tiersForMode(mode)).filter(function (id) { return !st(id).done; }).length;
      var left = itemIdsOfDay(day, null).filter(function (id) { return !st(id).done; }).length;
      if (normLeft && !window.confirm('Норма дня не выполнена: не отмечено ' + normLeft +
        '. Закрыть день досрочно? В «Отложено» уйдёт ' + left + ' ' +
        plural(left, 'пункт', 'пункта', 'пунктов') + ' — ничего не потеряется.')) return;
      ds.completedAt = new Date().toISOString();
      save();
      render();
      var s = daySummary(day, mode);
      toast('День закрыт: 🟢 ' + s.green + ' · 🟡 ' + s.yellow + ' · 🔴 ' + s.red +
        (left ? ' · ' + left + ' в «Отложено»' : ''));
    },
    unfinish: function () {
      var r = currentDayEntry();
      dst(r.entry.day.id).completedAt = null;
      save(); render();
    },

    timer: function (el) {
      timerSet(+el.getAttribute('data-min'), el.getAttribute('data-label') || '');
      $('#tpanel').hidden = false;
      timerStart();
    },

    topic: function (el) { V.topic = el.getAttribute('data-topic'); V.random = null; render(); },
    redtab: function (el) { V.redTab = el.getAttribute('data-tab'); V.topic = '*'; V.random = null; render(); },
    showyellow: function () { V.showYellow = !V.showYellow; V.random = null; render(); },
    random5: function () {
      var pool = (V.redTab === 'skipped' ? collectSkipped() : collectFlagged()).map(function (x) { return x.id; });
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
      }
      V.random = pool.slice(0, 5);
      V.topic = '*';
      render();
    },
    clearrandom: function () { V.random = null; render(); },

    goto: function (el) { gotoItem(el.getAttribute('data-id')); },

    theme: function (el) {
      STATE.settings.theme = el.getAttribute('data-theme');
      save(); render();
    },

    startweek: function (el) {
      var n = +el.getAttribute('data-week');
      if (n === STATE.startWeek) return;
      STATE.startWeek = n;
      V.dayId = null; V.openWeeks = {}; V.openTiers = {}; V.random = null;
      save(); render();
      toast(n === 0 ? 'Показана вся программа с Недели 0'
        : n === 1 ? 'Программа начинается с Недели 1; Неделя 0 скрыта'
        : 'Программа начинается с Недели ' + n + '; недели 0–' + (n - 1) + ' скрыты');
    },

    split: function (el) {
      var n = +el.getAttribute('data-size');
      if (n === (STATE.splitSize || 0)) return;
      STATE.splitSize = n;
      V.dayId = null; V.openWeeks = {}; V.openTiers = {}; V.random = null;
      save(); render();
      var d = DAYS();
      toast(n ? 'По ' + n + ' пунктов в день · программа заняла ' + d.length + ' ' +
        plural(d.length, 'день', 'дня', 'дней')
        : 'Дни не режутся · программа заняла ' + d.length + ' ' + plural(d.length, 'день', 'дня', 'дней'));
    },

    track: function (el) {
      var t = el.getAttribute('data-track');
      if (t === STATE.track) return;
      STATE.track = t;
      STATE.minPriority = 'all';
      STATE.startWeek = t === 'full' ? 1 : 0;
      V.dayId = null; V.openWeeks = {}; V.openTiers = {}; V.random = null;
      applyTrack();
      save(); render();
      toast(TRACKS[t].title + ': ' + activeItemCount() + ' ' +
        plural(activeItemCount(), 'вопрос', 'вопроса', 'вопросов') + ' · ' +
        DAYS().length + ' ' + plural(DAYS().length, 'день', 'дня', 'дней'));
    },

    prio: function (el) {
      STATE.minPriority = el.getAttribute('data-prio');
      V.dayId = null; V.openTiers = {}; V.random = null;
      _daysKey = '';
      save(); render();
      toast('В программе ' + activeItemCount() + ' ' +
        plural(activeItemCount(), 'вопрос', 'вопроса', 'вопросов') + ' · ' +
        DAYS().length + ' ' + plural(DAYS().length, 'день', 'дня', 'дней'));
    },

    norm: function (el) {
      STATE.norm = +el.getAttribute('data-norm');
      save(); render();
      toast('Норма дня: ' + STATE.norm + ' минут');
    },

    flow: function (el) {
      STATE.flowMode = el.getAttribute('data-flow') === '1';
      V.dayId = null;
      save(); render();
      toast(STATE.flowMode ? 'Плавающий календарь включён' : 'Дни идут строго по датам');
    },

    startdate: function () {
      var input = $('#startdate');
      if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input.value)) { toast('Укажите корректную дату'); return; }
      STATE.startDate = input.value;
      save(); render();
      toast('Даты пересчитаны: ' + humanDate(STATE.startDate) + ' — ' + humanDate(isoAdd(STATE.startDate, DAYS().length - 1)));
    },

    startrhythm: function () {
      STATE.startDate = nextRhythmStart();
      save(); render();
      toast('Старт: ' + humanDate(STATE.startDate) + ' — ритм недели программы сохранён');
    },

    startquick: function (el) {
      var when = +el.getAttribute('data-when');
      STATE.startDate = isoAdd(todayISO(), when);
      save(); render();
      toast('Старт программы: ' + humanDate(STATE.startDate) +
        ' · финиш ' + humanDate(isoAdd(STATE.startDate, DAYS().length - 1)));
    },

    export: function () {
      var payload = JSON.stringify(STATE, null, 2);
      var blob = new Blob([payload], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'interview-prep-' + todayISO() + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      toast('Файл сохранён');
    },

    import: function () { $('#importfile').click(); },

    reset: function () {
      if (!window.confirm('Стереть весь прогресс? Отметки, оценки и завершённые дни будут удалены безвозвратно.')) return;
      STATE = emptyState();
      saveNow();
      V.dayId = null; V.openTiers = {}; V.openWeeks = {}; V.random = null;
      render();
      toast('Прогресс стёрт');
    }
  };

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el) return;
    var fn = ACTIONS[el.getAttribute('data-act')];
    if (!fn) return;
    ev.preventDefault();
    fn(el);
  });

  /** После отметки обновляем счётчики блока и полосу дня, не перерисовывая экран. */
  function updateDayChrome() {
    if (V.name !== 'today') { renderNav(); return; }
    var r = currentDayEntry();
    var day = r.entry.day, mode = dst(day.id).mode;
    var p = dayProgress(day, mode);
    var main = $('#main');
    var barEl = main.querySelector('.card .bar > i');
    if (barEl) {
      var pct = p.total ? Math.round(p.done / p.total * 100) : 0;
      barEl.style.width = pct + '%';
      barEl.parentNode.classList.toggle('done', pct === 100);
      barEl.parentNode.setAttribute('aria-valuenow', String(pct));
    }
    var counter = main.querySelector('.card .row .small.muted.nums');
    if (counter) counter.textContent = p.done + ' / ' + p.total;
    Array.prototype.forEach.call(main.querySelectorAll('.tier'), function (sec, i) {
      var t = day.tiers[i];
      if (!t) return;
      var d = 0, tot = 0;
      t.items.forEach(function (it) {
        tot++; if (st(it.id).done) d++;
        (it.children || []).forEach(function (c) { tot++; if (st(c.id).done) d++; });
      });
      var cnt = sec.querySelector('.cnt');
      if (cnt) cnt.textContent = d + '/' + tot;
    });
  }

  // поиск — мгновенный, без кнопки
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'q') { V.q = ev.target.value; renderResults(); }
  });

  // импорт файла
  document.addEventListener('change', function (ev) {
    if (ev.target.id !== 'importfile') return;
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        STATE = migrate(parsed);
        saveNow();
        V.dayId = null; V.openTiers = {}; V.openWeeks = {}; V.random = null;
        render();
        var n = Object.keys(STATE.items).length;
        toast('Импортировано: ' + n + ' ' + plural(n, 'отметка', 'отметки', 'отметок'));
      } catch (e) {
        toast('Не удалось прочитать файл: ' + e.message);
      }
    };
    reader.readAsText(file);
    ev.target.value = '';
  });

  // ── таймер: панель ──────────────────────────────────────────────────────

  $('#fab').addEventListener('click', function () {
    var p = $('#tpanel');
    p.hidden = !p.hidden;
    if (T.done && !T.running) { T.done = false; timerPaint(); }
  });
  $('#t-toggle').addEventListener('click', function () {
    if (T.running) timerStop();
    else { if (T.remain <= 0) { T.remain = T.total; T.done = false; } timerStart(); }
  });
  $('#t-reset').addEventListener('click', function () { timerStop(); T.remain = T.total; T.done = false; timerPaint(); });
  $('#t-presets').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-min]');
    if (b) { timerSet(+b.getAttribute('data-min'), ''); timerStart(); }
  });
  $('#t-set').addEventListener('click', function () {
    var v = parseInt($('#t-custom').value, 10);
    if (!v || v < 1 || v > 240) { toast('Введите от 1 до 240 минут'); return; }
    timerSet(v, ''); timerStart();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') $('#tpanel').hidden = true;
  });
  // клик мимо панели закрывает её — иначе она перекрывает нижний правый угол списка
  document.addEventListener('mousedown', function (ev) {
    var p = $('#tpanel');
    if (p.hidden) return;
    if (ev.target.closest('#tpanel') || ev.target.closest('#fab')) return;
    p.hidden = true;
  });

  // ── старт ───────────────────────────────────────────────────────────────

  window.addEventListener('beforeunload', saveNow);
  applyTrack();
  timerPaint();
  render();

  console.log('Interview Prep Tracker · недель: ' + PROGRAM.weeks.length +
    ', дней: ' + DAYS().length + ', пунктов: ' + ALL_ITEMS.length);
})();
