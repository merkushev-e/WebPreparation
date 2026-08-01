# Программа подготовки к собеседованиям — 1 августа … 4 октября 2026

**Один документ. Все вопросы внутри. Больше ничего открывать не нужно.**

Основной трек — европейский финтех (Revolut, Monzo, N26, Wise). Алгоритмы идут фоном.

---

## Правила

1. **Пол — 20 минут.** В плохой день делаешь только блок «20 мин». Это выполнение плана, не провал.
2. **Норма — 60 минут.** Блоки «20 мин» + «+40 мин».
3. **Максимум — 120 минут.** Все три блока. Не чаще 2–3 раз в неделю.
4. **Всё вслух и на английском.** Отдельного времени на английский нет — он встроен сюда.
5. **🛠 — обязательно проверить в IDE.** Сначала предскажи ответ, потом запусти.
6. **Пропустил день — не догоняй.** Делаешь пол текущего дня.
7. **Не смог объяснить — ставь 🔴.** Недели 8–9 зарезервированы под добивание.

**Ритм недели:** Пн–Чт теория · Пт код · Сб большой блок · Вс behavioral + английский.

---
---

# НЕДЕЛЯ 0 · Калибровка (1–2 августа)

### Сб 1 авг · Rapid-fire: где ты сейчас

Отвечай по 30 секунд на вопрос, вслух. Что не смог — 🔴.

**20 мин**
1. What's the difference between a process and a thread on Android?
2. What is a sticky intent, and why is it discouraged?
3. `Service` vs `IntentService` vs `WorkManager` in one sentence each.
4. What is a `BroadcastReceiver` and what changed with implicit broadcasts?
5. What is the difference between `commit()` and `apply()`?
6. What is a `Fragment` back stack, and what is `addToBackStack(null)` doing?
7. What is `ViewHolder` and why does `RecyclerView` need it?

**+40 мин**
8. `View.GONE` vs `INVISIBLE` — what's the layout cost?
9. What is `dp` vs `sp` vs `px`?
10. What is an `AAB` and how does it differ from an `APK`?
11. What is `minSdk` vs `targetSdk` vs `compileSdk`?
12. What is a `ContentProvider` used for today?
13. What is `Parcelable` and why is it faster than `Serializable`?
14. What is a daemon thread?

**+60 мин**
15. What is `HashMap` vs `LinkedHashMap` vs `TreeMap`?
16. What is the difference between abstract class and interface in Kotlin?
17. What is a memory leak, in one sentence?
18. What does `@Synchronized` compile to?
19. What is the difference between `Iterable` and `Sequence`?
20. What is tail recursion and does Kotlin optimize it?

---

### Вс 2 авг · Настройка и установки

**20 мин** — Прочитать мета-правила и принять их как рабочие:
1. Скажи первому интервьюеру, где ты силён и где слаб — тебя будут меньше гонять по слабым темам.
2. Live coding — не спортивное программирование. Это про читаемость, тесты и объяснение решений.
3. Тесты в take-home не опциональны. Их отсутствие в Revolut — автоматический отказ.
4. Take-home не полируется бесконечно. Уложиться в таймбокс и показать осознанные компромиссы важнее идеала.
5. В behavioral держи цифры. Ответ без метрик читается как отсутствие ownership.
6. Говори «я», а не «мы». В блоке Action «мы» скрывает твой вклад.
7. Mobile в Big Tech — не лёгкий трек. LeetCode medium обязателен.
8. Готовь ответ на «зачем вам такая сложная архитектура». Это проверка на обоснование, а не троллинг.

**+40 мин** — 🛠 Создать пустой Kotlin-проект: JUnit5, `kotlinx-coroutines-test`, Turbine, MockK. Убедиться, что тест запускается. Завести файл заметок и таймер.

**+60 мин** — Прочитать список того, что должен уметь произнести к октябрю (тренируем по одному пункту каждое воскресенье):
1. A two-minute self-introduction, without filler.
2. A three-minute walkthrough of your app's architecture.
3. A three-minute bug-hunt story with a clear resolution.
4. Explaining a technical trade-off to a non-technical stakeholder.
5. Asking for clarification: *"Just to make sure I understand — are you asking about X or Y?"*
6. Buying time: *"Let me think about that for a second."*
7. Disagreeing politely: *"I see it differently, and here's why."*
8. Admitting a gap: *"I haven't worked with that directly, but based on how X works, I'd expect…"*
9. Narrating code while writing it during live coding.
10. Small talk at the start and a graceful close at the end.

---
---

# НЕДЕЛЯ 1 · Конкурентность и фундамент корутин (3–9 августа)

> Самый большой фильтр в Revolut. Эта неделя важнее остальных.

### Пн 3 авг · Гонки и блокировки

**20 мин**
1. Define race condition, data race, deadlock, livelock and starvation. Give an example of each.
2. What does `@Volatile` guarantee — and what does it explicitly NOT guarantee?
3. `synchronized` vs `ReentrantLock` vs `Mutex` — trade-offs and when each is appropriate.

**+40 мин**
4. Optimistic vs pessimistic locking — model an account transfer with both.
5. How do you prevent deadlock in `transfer(from, to, amount)` between two accounts?

🛠 Воспроизвести гонку на счётчике и починить тремя способами: `synchronized`, `AtomicInteger`, `Mutex`.

**+60 мин**
6. What is CAS? How do `AtomicInteger` and `AtomicReference` use it, and when does CAS perform badly?
7. `ConcurrentHashMap` vs `Collections.synchronizedMap` — what is actually different?

---

### Вт 4 авг · Примитивы синхронизации

**20 мин**
8. What is thread confinement, and how does it simplify concurrent state?
9. Why are unbounded thread pools dangerous? How do you size a pool?
10. What is `ThreadLocal` and when have you legitimately needed one?

**+40 мин**
11. Explain double-checked locking and why `volatile` is required for it to be correct.
12. `CountDownLatch`, `Semaphore`, `CyclicBarrier` — one real use case each.
13. Explain the Android main thread machinery: `Looper`, `MessageQueue`, `Handler`, `Choreographer`.

**+60 мин**
14. How does `ReadWriteLock` help, and when does it make things worse?
15. What is false sharing, and does it matter on mobile?

🛠 Написать демо дедлока на двух блокировках и починить его lock ordering.

---

### Ср 5 авг · Корутины: как это устроено

**20 мин**
1. What is a coroutine at the bytecode level? Explain the CPS transformation and `Continuation`.
2. What is a suspension point, and what happens to the call stack when a coroutine suspends?
3. `launch` vs `async` vs `withContext` — return type, exception behaviour, and dispatch differences.

**+40 мин**
4. What is structured concurrency and what concrete problems does it eliminate?
5. What are the elements of a `CoroutineContext` and how does `+` combine them?
6. `Job` vs `SupervisorJob` — how does exception propagation differ?

**+60 мин**
7. `coroutineScope {}` vs `supervisorScope {}` — when do you reach for each?
8. Why is cancellation cooperative, and what does that mean for your code?

✍️ Нарисовать от руки дерево Job'ов для экрана с тремя параллельными запросами.

---

### Чт 6 авг · Отмена и исключения

**20 мин**
9. What happens if you catch and swallow a `CancellationException`?
10. How do you make a blocking third-party call cancellable?
11. `ensureActive()`, `isActive`, `yield()` — what does each actually do?

**+40 мин**
12. When is `withContext(NonCancellable)` correct, and what is the risk?
13. How does `CoroutineExceptionHandler` work, and why doesn't it catch exceptions from `async`?
14. What happens when an exception is thrown inside `launch` in a `viewModelScope`?

**+60 мин**
15. `Main` vs `Main.immediate` vs `Default` vs `IO` vs `Unconfined` — thread pools, sizing, and use cases.
16. What problem does `limitedParallelism` solve?
17. What does "main-safe suspend function" mean, and whose responsibility is main-safety?

---

### Пт 7 авг · КОД: thread-safe ledger ⏱

**Задача.** Thread-safe in-memory account ledger: `deposit`, `withdraw`, `transfer`. No deadlocks. With tests.

**20 мин** — Прочитать условие. Написать сигнатуры классов и список из 8 тест-кейсов. Не реализовывать.

**+40 мин** — Реализовать с блокировками, без дедлоков. Таймер 45 минут, как на интервью. Вслух.

**+60 мин** — Написать юнит-тесты, включая конкурентный: 100 потоков, проверка инварианта общей суммы.

---

### Сб 8 авг · Тестируемость + переписать ledger

**20 мин**
18. How do you inject dispatchers so the code stays testable?
19. `runBlocking` vs `runTest` — where do you use each, and why is `runBlocking` dangerous in production code?
20. How does `runTest` handle virtual time and delay skipping?

**+40 мин** — 🛠 Переписать вчерашний ledger на `Mutex` и корутины. Проговорить вслух: где какое решение уместнее и почему.

**+60 мин** — Прогнать все 15 вопросов по конкурентности (Пн–Вт) подряд вслух, засекая время. Цель — 15 минут на все.

🛠 **Задача:** Convert a callback-based repository to coroutines without breaking existing callers. Взять реальный колбэчный API и обернуть его.

---

### Вс 9 авг · История №1 + самопредставление

**20 мин**
1. Tell me about yourself. *(набросать тезисы, 2 минуты)*
2. Walk me through the most complex feature you shipped end to end. *(тезисы по ABM)*

**+40 мин** — Написать историю №2 полностью по STAR, на английском, с цифрами. 250–300 слов.

**+60 мин** — 🎤 English п.1: проговорить самопредставление 3 раза, записать на диктофон, послушать. Убрать «мы» → «я», убрать филлеры.

---
---

# НЕДЕЛЯ 2 · Flow и gotchas (10–16 августа)

### Пн 10 авг · Холодные и горячие потоки

**20 мин**
21. Cold vs hot streams: `Flow`, `SharedFlow`, `StateFlow`, `Channel` — compare semantics.
22. How does `StateFlow` conflate, and what bug does that cause with rapid emissions?
23. `SharedFlow` parameters `replay`, `extraBufferCapacity`, `onBufferOverflow` — how do you configure a one-shot event stream?

**+40 мин**
24. Why is `StateFlow` a poor fit for one-off events (navigation, snackbar)? What are the alternatives and their trade-offs?
25. What exactly does `SharingStarted.WhileSubscribed(5_000)` do, and why 5 seconds?

**+60 мин**
26. `map` vs `flatMapLatest` vs `flatMapMerge` vs `flatMapConcat` — a real use case for each.
27. `combine` vs `zip` — how do they behave with different emission rates?

🛠 Проверить каждый оператор на живом примере с логами.

---

### Вт 11 авг · Операторы и границы

**20 мин**
28. `collect` vs `collectLatest` — what exactly gets cancelled?
29. `buffer`, `conflate`, `debounce`, `sample`, `distinctUntilChanged` — semantics and pitfalls.
30. What does `flowOn` change, and why does it only affect upstream operators?

**+40 мин**
31. How does backpressure in Flow differ from RxJava's model?
32. How do `callbackFlow` and `channelFlow` work, and why is `awaitClose` mandatory?
33. Wrap a callback-based API in `suspendCancellableCoroutine`. What must you handle?
34. `Mutex` vs `synchronized` — why can't you use `synchronized` around a suspend call?

**+60 мин**
35. How would you deduplicate in-flight requests so five simultaneous callers trigger one network call?
36. `repeatOnLifecycle` vs `flowWithLifecycle` vs `launchWhenStarted` — what is deprecated and why?
37. How do you test a Flow? Show the Turbine approach for a `SharedFlow`.

---

### Ср 12 авг · Хвост Flow + первые gotchas 🔥

**20 мин**
38. Fan-out semantics: how do multiple collectors behave on `SharedFlow` vs `Channel`?
39. What goes wrong if you call `stateIn(GlobalScope)`?
40. Implement retry with exponential backoff and jitter over a Flow.

**+40 мин** — 🛠 Gotchas. Сначала предскажи вывод, потом запусти.
41. What does a `CoroutineScope` do if you pass `Job() + Job() + Job()` to it? The code compiles — what actually happens?
42. `runBlocking { launch { println("A") }; println("B") }` — what's the output order and why?
43. You're already on `Dispatchers.IO` and call `withContext(Dispatchers.IO)`. Does a thread switch happen?

**+60 мин**
44. A network call is in flight when `onCleared()` is called on the ViewModel. What happens to the HTTP request? To the coroutine? To the OkHttp thread?
45. Why doesn't `try { launch { throw ... } } catch (e: Exception) { }` catch anything?
46. `async {}` throws and you never call `await()`. Where does the exception go?

---

### Чт 13 авг · Gotchas: корутины 🔥

🛠 Каждый вопрос — предсказать, потом запустить.

**20 мин**
47. Compare: `coroutineScope { launch { throw E } }` vs `supervisorScope { launch { throw E } }` — what does the caller observe?
48. A parent is cancelled while a child is inside a `finally` block that calls a suspend function. What happens?
49. Does `withContext(NonCancellable)` protect nested `launch` calls from cancellation?
50. Name three concrete production failures caused by `GlobalScope.launch` inside a ViewModel.

**+40 мин**
51. Two coroutines are launched in the same scope. The first throws. What happens to the second, and to the scope?
52. `Dispatchers.IO` and `Dispatchers.Default` share threads. What does that imply for a CPU-heavy task on IO?
53. Does marking a function `suspend` guarantee it won't block the main thread?
54. What happens if you launch a coroutine in a ViewModel's `init {}` block and the screen is closed immediately?

**+60 мин**
55. `delay(1000)` inside `runTest` — how long does the test take, and why?
56. What is the difference between cancelling a `Job` and cancelling its `CoroutineScope`? Can you reuse the scope after?
57. `job.cancel()` followed immediately by reading a result — what's the race?
58. `while (true) { doWork() }` inside a coroutine — is it cancellable? How do you fix it?

📝 Выписать все, где ошибся. Это твои слепые зоны.

---

### Пт 14 авг · КОД: rate limiter + retry ⏱

**20 мин** — Задача: rate limiter. Набросать интерфейс и три стратегии (fixed window, sliding window, token bucket) на бумаге.

**+40 мин** — Реализовать token bucket, thread-safe, с тестами. Таймер 45 минут.

**+60 мин** — Задача: retry executor с экспоненциальным backoff, jitter и отменой. Реализовать.

🛠 **Задача:** Add search with debounce to an existing screen without breaking rotation behaviour.

---

### Сб 15 авг · Gotchas: Flow + алгоритмы 🔥

🛠 Проверять в IDE.

**20 мин**
59. `MutableStateFlow` is assigned an equal value twice. How many emissions do collectors see? Why?
60. `_state.value.items.add(newItem)` where `items` is a `MutableList` — does the UI update? Why not?
61. A navigation event is emitted into a `SharedFlow(replay = 0)` before the screen subscribes. What happens, and how do you fix it properly?
62. `WhileSubscribed(5000)` vs `Eagerly` vs `Lazily` — what does the user see on rotation for each?
63. Two collectors subscribe to the same cold `Flow` from a Retrofit call. How many network requests fire?

**+40 мин**
64. `.flowOn(Dispatchers.IO)` placed after `.collect {}` — does it do anything?
65. `combine(a, b)` where `b` hasn't emitted yet — does downstream receive anything?
66. `distinctUntilChanged()` on a data class holding a `List` — does it reliably deduplicate?
67. An exception is thrown inside `collect {}`. Is upstream cancelled? Does `catch {}` intercept it?
68. `catch {}` placed before vs after `map {}` — what does each catch?
69. `stateIn` requires an initial value. What are the two standard ways to model "nothing loaded yet", and what's wrong with using `null`?
70. `lifecycleScope.launch { flow.collect {} }` in `onCreate` — what exactly leaks and when?
71. `SharedFlow` with `extraBufferCapacity = 0` and a slow collector — does `tryEmit` succeed?
72. How do you guarantee ordering when merging two flows that emit at different rates?

**+60 мин** — Алгоритмы, по 20 минут каждая:
- Two Sum / Three Sum
- Group Anagrams
- Longest Substring Without Repeating Characters

---

### Вс 16 авг · История №2: инцидент

**20 мин**
6. Tell me about a production incident you caused or fixed. What changed afterwards? *(тезисы по ABM)*
21. What's the most interesting bug you've ever debugged?
22. Tell me about working in a legacy codebase you didn't write.

**+40 мин** — Написать историю по STAR: что сломалось, как расследовал, что изменил в процессе после.

**+60 мин** — 🎤 English п.3: проговорить bug-hunt story на английском ровно за 3 минуты. Запись.

---
---

# НЕДЕЛЯ 3 · Live coding под таймер (17–23 августа)

> Теории почти нет. Формат каждого дня: условие → тесты → реализация → рефакторинг. Под таймер, вслух.

### Пн 17 авг · Load balancer + алгоритмы ⏱

**Задача.** In-memory load balancer with pluggable strategies (round-robin, weighted, least-connections) plus register/unregister.

**20 мин** — Интерфейс, стратегии, список тестов. Не реализовывать.

**+40 мин** — Реализовать round-robin + register/unregister, thread-safe. Таймер 45 мин.

**+60 мин** — Добавить weighted и least-connections. Плюс алгоритмы: Product of Array Except Self, Merge Intervals.

⏱ **Задача (реально давали в Lyft):** Implement a List — dynamic array from scratch: growth strategy, amortized complexity, iterator, `equals`. 25 минут.

---

### Вт 18 авг · LRU с TTL ⏱

**Задача.** LRU cache with TTL, O(1), thread-safe.

**20 мин** — Структура (`HashMap` + двусвязный список), объяснить вслух, почему O(1).

**+40 мин** — Реализовать без блокировок, потом добавить thread safety. Таймер 45 мин.

**+60 мин** — Добавить TTL и вытеснение по времени. Сравнить вслух с подходом на `ConcurrentHashMap`.

---

### Ср 19 авг · Scheduler с ограничением параллелизма ⏱

**Задача.** Task scheduler running at most N tasks concurrently, preserving submission order per key.

**20 мин** — Как обеспечить порядок по ключу при N параллельных — на бумаге.

**+40 мин** — Реализовать через `Semaphore` или `limitedParallelism`. Таймер 45 мин.

**+60 мин** — Тесты, доказывающие сохранение порядка. Плюс: debounce и throttle утилиты без Flow.

---

### Чт 20 авг · KV-store с транзакциями ⏱

**Задача.** In-memory key-value store with nested transactions (`begin`, `commit`, `rollback`).

**20 мин** — Спроектировать вложенность на бумаге.

**+40 мин** — Реализовать через стек изменений. Таймер 45 мин.

**+60 мин** — Тесты на вложенные откаты. Плюс: pub/sub event bus with backpressure handling.

---

### Пт 21 авг · КОД: currency conversion engine ⏱ 🔥

**Задача.** Currency conversion engine: rate table, cross-rates, stale-rate handling. **Самая профильная задача для Revolut.**

**20 мин** — Модель курсов, кросс-курсы, устаревшие курсы — на бумаге.

**+40 мин** — Реализовать полностью с тестами. Таймер 60 мин.

**+60 мин** — Обработка stale rates и потокобезопасное обновление таблицы курсов под нагрузкой.

---

### Сб 22 авг · Полный прогон как на интервью ⏱

**20 мин**
13. In a 60-minute live coding round with TDD, what do you write first and why? *(сформулировать свой алгоритм действий)*

**+40 мин** — 🎤 Взять задачу **Streaming CSV transaction parser with error accumulation instead of fail-fast** и пройти её **вслух на английском**, комментируя каждый шаг. Диктофон. Таймер 40 мин.

**+60 мин** — Прослушать запись. Где молчал? Где путался? Где не проговорил trade-off? Плюс 🛠 Ч2 C10: **Given failing tests, make them pass without changing the tests.** Взять свой старый модуль, сломать реализацию, потом чинить по тестам.

---

### Вс 23 авг · История №3: архитектурное решение

**20 мин**
3. Tell me about a technical decision you later regretted.
4. Tell me about a time you disagreed with your manager or tech lead.
10. Describe convincing others to adopt an approach they initially resisted.

**+40 мин** — Написать историю по STAR.

**+60 мин** — 🎤 English п.9: прогнать все три готовые истории подряд по 3 минуты. Отдельно потренировать проговаривание кода во время написания.

---
---

# НЕДЕЛЯ 4 · Compose и UI-gotchas (24–30 августа)

### Пн 24 авг · Внутренности Compose

**20 мин**
1. What does the Compose compiler do to a `@Composable` function — what are `$composer` and `$changed`?
2. What is the slot table, and how does positional memoization determine composable identity?
3. Explain the three phases: composition, layout, drawing. Which phase should you avoid doing work in?

**+40 мин**
4. What is a recompose scope, and why can a whole screen recompose because of one state read?
5. How does the snapshot state observation system decide which scopes to invalidate?
6. What makes a type "stable"? How does the compiler infer stability?

**+60 мин**
7. What is strong skipping mode, and what changed for lambdas and unstable parameters?
8. `@Stable` vs `@Immutable` — what is the contract, and what happens if you lie to the compiler?

🛠 Включить compiler metrics на модуле ABM, посмотреть реальный отчёт по стабильности.

---

### Вт 25 авг · Состояние и эффекты

**20 мин**
9. Why is `List<T>` treated as unstable, and what are your options?
10. `remember` vs `rememberSaveable` — what survives what? How do you write a custom `Saver`?
11. `mutableStateOf` in the ViewModel vs `StateFlow` — trade-offs.
12. What problem does `derivedStateOf` solve, and what is the most common misuse?

**+40 мин**
13. Why do keys matter in a `LazyColumn` for state and animation correctness?
14. Give a use case for each: `LaunchedEffect`, `DisposableEffect`, `SideEffect`, `rememberCoroutineScope`, `rememberUpdatedState`, `produceState`, `snapshotFlow`.

**+60 мин**
15. What happens when you pass a capturing lambda to a composable, and how does `remember` change it?
16. Why does `Modifier.padding().background()` differ from `background().padding()`?

🛠 Написать по одному минимальному примеру на каждый side-effect API.

---

### Ср 26 авг · Layout и производительность

**20 мин**
17. How do you write a custom `Layout`? Explain the single-measurement rule.
18. What is `SubcomposeLayout` and what does it cost?
19. When do you need intrinsic measurements?

**+40 мин**
20. How do you animate without triggering recomposition (`graphicsLayer`, deferred state reads)?
21. How do you diagnose excessive recomposition? (Layout Inspector counts, compiler metrics and reports.)
22. What is a baseline profile, and roughly what does it buy you on cold start? How do you generate one?

**+60 мин**
23. State hoisting and UDF — how do you structure a screen with 20 interactive fields without a god-object state?
24. How do you deliver one-off events from a ViewModel to Compose UI?
31. `LazyColumn` performance: keys, `contentType`, item stability, nested scrolling pitfalls.
32. Why do naive `TextField` implementations lag, and how do you fix input latency?

🛠 **Задача:** A `RecyclerView`/`LazyColumn` janks while scrolling. Profile it and fix it live. Замерить до и после.

---

### Чт 27 авг · Навигация и экосистема

**20 мин**
25. How does the Navigation Compose back stack work? What does Navigation 3 change conceptually (`NavKey`, `NavDisplay`, `SceneStrategy`, `EntryProvider`)?
26. How do you scope a ViewModel to a nav graph or a single destination? What is the `NavBackStackEntry` lifecycle?

**+40 мин**
27. Interop: `AndroidView` and `ComposeView` — how do you migrate a large XML screen incrementally?
28. How do you test Compose UI (`createComposeRule`, semantics, synchronization)?

**+60 мин**
29. How would you build a design system on Compose — tokens, `CompositionLocal`, Material 3 theming?
30. When is `CompositionLocal` appropriate, and why is it not dependency injection?

✍️ Связать с ABM: как устроена навигация в твоём мультимодульном проекте, что бы поменял.

---

### Пт 28 авг · Gotchas: Compose 🔥

🛠 Проверять в проекте, не угадывать.

**20 мин**
73. `LaunchedEffect(Unit)` sits inside an `if (condition)` branch that toggles. How many times does the effect run?
74. Does changing an effect's key *always* restart the effect? Name the exception.
75. What happens if `onDispose {}` inside a `DisposableEffect` throws?
76. `remember { }` without keys inside a `LazyColumn` item — what breaks when you scroll away and back?
77. `rememberCoroutineScope()` vs `LaunchedEffect` — give a case where using the wrong one is a bug, not a style choice.

**+40 мин**
78. `derivedStateOf { }` written without `remember` — what's the defect?
79. A composable takes a `() -> Unit` parameter. Is it skippable? What changed with strong skipping?
80. `LaunchedEffect(viewModel)` — is that a sensible key?
81. What happens if you call a `@Composable` function inside `LaunchedEffect`?
82. `mutableStateListOf` vs `mutableStateOf(listOf())` — when does each trigger recomposition?

**+60 мин**
83. A `Modifier` chain is hoisted into a top-level `val` outside the composable. What's the effect on recomposition?
84. Reading a `State` inside a `Modifier.clickable { }` lambda vs in the composable body — which recomposes?
85. Your `LazyColumn` items animate incorrectly after a delete. What's the most likely cause?

🛠 Практика: взять экран с лишними рекомпозициями и починить его. Замерить до и после.

---

### Сб 29 авг · ViewModel, Context, утечки + алгоритмы

**20 мин**
86. ViewModel survives rotation. Does it survive process death? Demonstrate how you'd prove it on a device.
87. `SavedStateHandle` — what can you put in it, and what's the practical size limit?
88. Two Fragments share an Activity-scoped ViewModel. What are the failure modes?
89. Is there ever a safe way for a ViewModel to hold a `Context`?

**+40 мин**
90. What happens to `viewModelScope` in `onCleared()`, and what does NOT get cancelled?
91. Passing a screen argument into a ViewModel: assisted injection vs `SavedStateHandle` — when is each correct?
92. A `ViewModel` obtained inside a `LazyColumn` item — what's the lifecycle and why is it a bug?
93. LiveData vs StateFlow for a state holder — argue both sides, then pick one.
94. A singleton holds an Activity `Context`. How long does the leak last, and what exactly is retained?
95. You inflate a themed view with `applicationContext`. What breaks?
96. When do you actually need `ContextWrapper` / `getBaseContext()`?
97. A static `Handler` inner class inside an Activity — what's the classic leak and the classic fix?

**+60 мин** — Алгоритмы: Meeting Rooms II, Valid Parentheses, Min Stack.

🛠 **Две задачи на живой код:**
- A screen re-fetches data on every rotation. Fix it, then explain what you changed and why.
- Take a screen with a leaking listener and fix the leak; prove the fix.

---

### Вс 30 авг · Конфликты + архитектура вслух

**20 мин**
5. Describe a conflict with a teammate and how you resolved it.
7. Tell me about delivering with unclear or shifting requirements.
8. Give an example of pushing back on scope or a deadline.

**+40 мин** — Написать историю по STAR.

**+60 мин** — 🎤 English п.2: **3-минутный рассказ об архитектуре ABM на английском.** Отрепетировать до гладкости, без бумажки.

---
---

# НЕДЕЛЯ 5 · Архитектура, модули, данные (31 августа – 6 сентября)

### Пн 31 авг · Паттерны и слои

**20 мин**
1. MVVM vs MVI vs MVP — what do you actually gain from MVI and what does it cost?
2. Single state class vs multiple flows for a screen — defend your choice.
3. How do you model loading / error / empty / content without a combinatorial explosion of states?

**+40 мин**
4. Clean Architecture: what belongs in the domain layer, and do you always need use cases?
5. When is a UseCase layer just ceremony?
6. Where do you map DTO → entity → domain → UI models, and why there?

**+60 мин**
7. A feature needs data owned by three other features. How do you avoid coupling them?

🛠 **Задача:** Implement a `Result`-like type and a composable pipeline over it (`map`, `flatMap`, `recover`). 30 минут.

✍️ Записать, как это устроено в ABM и что бы ты изменил сегодня.

---

### Вт 1 сен · Модуляризация и DI 🔥

**20 мин**
8. What problem does an `api`/`impl` module split solve, and how do you wire it with Hilt?
9. How do you enforce module dependency rules mechanically rather than at code review?
10. How do you detect and break a circular module dependency?
11. What goes into a Gradle convention plugin, and how do version catalogs scale to 100 modules?

**+40 мин**
12. Dynamic feature modules vs regular feature modules — trade-offs.
13. Hilt components and scopes, `@Binds` vs `@Provides`, multibindings — how do you provide a feature-scoped dependency?
14. How does Hilt handle a multi-module graph, and what is the compile-time cost?

**+60 мин**
15. Hilt vs Koin vs manual DI — argue for one in a 100-module banking app.
16. How do you inject into classes you don't construct (`Worker`, `ContentProvider`, `BroadcastReceiver`)?

📊 Подготовить **конкретные цифры по ABM**: количество модулей, время чистой и инкрементальной сборки, что делал для ускорения.

---

### Ср 2 сен · Эволюция и миграции

**20 мин**
17. Repository pattern: what does it own, and what should never live there?
18. How do you evolve a public module API without breaking 30 consumers?
19. How do you architect for feature flags, and how do you avoid flag debt?
20. How do you structure navigation in a multi-module app so features don't depend on each other?

**+40 мин**
21. What is an ADR, and how do you drive an architecture decision across a team that disagrees?
22. How would you incrementally migrate a legacy XML/MVP app to Compose/MVI without freezing the roadmap?
23. How do you run a monolith → modular migration with eight engineers shipping in parallel?

**+60 мин**
24. What are the honest trade-offs of KMP for shared business logic in a banking app?
25. How would you design a design-system module consumed by 15 teams, including deprecation policy?

---

### Чт 3 сен · Данные и сеть

**20 мин**
1. Design an offline-first sync layer. What are its failure modes?
2. Conflict resolution: last-write-wins, version vectors, server authority — which fits a bank and why?
3. Room migrations: what happens when one is missing, and how do you test migrations?
4. How does Room's invalidation tracker work with Flow, and what does it cost?

**+40 мин**
5. Draw the data flow for Paging 3 with `RemoteMediator`.
6. Cursor-based vs offset pagination — why does it matter for a transactions list?
7. OkHttp application vs network interceptors — where do auth, retry and logging belong?

**+60 мин**
8. Implement token refresh when five parallel requests all return 401 simultaneously.
9. How do you map HTTP, network and parsing failures into a single domain error model?
10. HTTP caching with ETag and `Cache-Control` — when do you roll your own cache instead?

---

### Пт 4 сен · КОД: token refresh ⏱

**20 мин** — Спроектировать на бумаге: пять запросов получают 401 одновременно, refresh уходит один раз.

**+40 мин** — Реализовать через `Mutex` + `Deferred`, с тестами на конкурентность. Таймер 45 мин.

**+60 мин** — Добавить случай «refresh тоже упал» и корректный выход в разлогин. Плюс задача: request deduplication cache — same key → one in-flight call, all callers receive the result.

🛠 **Ещё две задачи на пагинацию:**
- Repository pagination logic combining a cursor with a local cache.
- Add pagination with loading/error states to an existing list screen.

---

### Сб 5 сен · Финтех-специфика данных + алгоритмы

**20 мин**
11. Certificate pinning bypasses the device trust store — what is the operational cost, and how do you avoid bricking the app on rotation?
12. What is idempotency, and why does a payment request need an idempotency key?
13. How do you guarantee a "send money" action executes exactly once from the client's point of view?
14. Design optimistic UI with rollback — first for a "like", then for a money transfer. What changes?

**+40 мин**
15. WebSocket vs SSE vs long polling vs FCM push — pick one for live balance updates and justify it.
16. How do you make a large file upload survive process death?
17. DataStore vs SharedPreferences — why is DataStore async, and how do you migrate safely?
18. Encrypting local data: SQLCipher, `EncryptedSharedPreferences`, Keystore-backed keys — trade-offs.
19. Design a client-side analytics pipeline with batching, offline buffering and sampling.
20. Image loading: Coil vs Glide, cache tiers, and what to do about OOM on an image-heavy feed.

**+60 мин** — Алгоритмы: LRU Cache (design), Kth Largest Element, Top K Frequent Elements.

---

### Вс 6 сен · Раунд «расскажи про свой проект» 🔥

Это первый технический звонок в Monzo и отдельный deep dive в N26. Ответы пишешь **по ABM**.

**20 мин**
1. Walk me through the architecture of the app you work on. *(3 минуты, без бумажки)*
2. Why is it structured that way? What would you change if you started today?
3. **Someone looking at your app might say it's over-engineered. What would you say to that?** *(реально задавали)*
4. How many modules do you have, and what is the actual build time? What have you done about it?

**+40 мин**
5. Which part of the codebase are you least happy with, and why haven't you fixed it?
6. Describe a decision where you disagreed with the team. What happened?
7. What's your test strategy, honestly — what is tested and what isn't?
8. What's the hardest bug you've debugged there? Walk me through the investigation.

**+60 мин**
9. How do you handle a feature that touches four teams' modules?
10. What does your release process look like, and what's the worst thing that ever shipped?
11. If I gave you two weeks and no product work, what would you fix first?
12. How is your app different from a non-banking app — what does the domain force you to do?

🎤 English п.4: объяснить один технический trade-off из ABM нетехническому человеку.

---
---

# НЕДЕЛЯ 6 · Mobile system design (7–13 сентября)

### Каркас ответа — выучить наизусть, проговаривать в этом порядке

1. **Clarify scope** — одна фича или приложение? Платформы? Пользователи? Нужен ли офлайн? Real-time или pull-to-refresh?
2. **Non-functional** — latency, offline, battery, memory, security, accessibility, localization.
3. **High-level client architecture** — слои, модули, поток данных.
4. **API contract & data model** — форма пагинации, размер payload, версионирование.
5. **Caching & sync** — single source of truth, инвалидация, разрешение конфликтов.
6. **Threading** — что где выполняется, что отменяемо.
7. **Edge cases** — нет сети, медленная сеть, process death, частичный отказ, расхождение часов.
8. **Observability** — метрики, логи, крашлитика, на что алертить.
9. **Testing & rollout** — как безопасно выкатить.
10. **Trade-offs** — что сделал бы иначе при 10× нагрузке.

> Заметка по Revolut: в дизайн-раунде ценят операционный workflow больше, чем красивую диаграмму. Не рисуй схему — рассказывай, как это работает в продакшене.

**Реальные формулировки, которые давали кандидатам** (используем как материал для моков в неделях 8–9):
ride-sharing между тремя корпусами кампуса · photo streaming app · Instagram Stories · Slack chat · ranked Instagram feed · Robinhood app · JIRA-подобное приложение для планирования событий · фича, показывающая водителям зоны высокого спроса (сначала API, потом клиент)

---

### Пн 7 сен · Каркас + лента

**20 мин** — Выучить каркас из 10 шагов. Проговорить по памяти без подглядывания.

**+40 мин** — **Design the client side of an Instagram-style feed.** Пройти по всем 10 шагам письменно, 40 минут.

**+60 мин** — Разбор: что забыл? Офлайн? Метрики? Threading? Плюс быстрый набросок (15 мин): **Design an offline-first notes app with multi-device sync.**

---

### Вт 8 сен · Перевод денег 🔥

**20 мин** — **Design a money transfer flow, including retries, idempotency and failure states.** Выписать требования и non-functional.

**+40 мин** — Полный проход: идемпотентность, ретраи, состояния перевода, что показываем пользователю при неизвестном исходе.

**+60 мин** — Быстрый набросок: **Design a KYC onboarding flow with document upload and resumable steps.** Плюс связать с вопросом «What specifically are you looking for when reviewing a PR that touches the payments flow?»

---

### Ср 9 сен · Чат с офлайном

**20 мин** — **Design a chat app with offline support, read receipts and message ordering.** Модель данных и состояния сообщения (pending/sent/delivered/read).

**+40 мин** — Полный проход: очередь отправки, порядок, дедупликация, синхронизация при возврате в сеть.

**+60 мин** — Быстрый набросок: **Design push notification handling: deduplication, deep links, foreground vs background.**

---

### Чт 10 сен · Живые котировки

**20 мин** — **Design a trading screen with live prices over WebSocket: throttling, ordering, stale data.** Накидать структуру.

**+40 мин** — Полный проход: переподключение, backpressure при 100 обновлениях в секунду, батчинг в UI.

**+60 мин** — Быстрый набросок: **Design a multi-currency balance screen updating in real time.**

---

### Пт 11 сен · КОД: алгоритмы ⏱

**20 мин** — Binary Search: first/last occurrence. Search in Rotated Sorted Array.

**+40 мин** — Binary Tree Level Order Traversal. Validate BST.

**+60 мин** — Реальные задачи с мобильных интервью:
- Given a list of intervals `[x, y]` describing when each driver is available, find the time with the maximum number of available drivers. *(sweep line — учи этот паттерн)*
- Add two binary strings.

**Вопросы про сложность** — уметь отвечать после каждой задачи:
- Explain amortized analysis using dynamic array growth as the example.
- What are hash collisions, how are they resolved, and when does `HashMap` degrade to O(n)?
- When is O(n log n) actually better than O(n) in practice?
- Describe the space–time trade-off you made in the last problem you solved.

---

### Сб 12 сен · Большой прогон ⏱

**20 мин** — **Design a transactions/statements screen covering ten years of history.** Требования и подход к пагинации.

**+40 мин** — 🎤 Полный дизайн на 45 минут **вслух на английском**. Запись.

**+60 мин** — Ещё 45 минут: **A feature telling drivers which part of the city has the highest demand — design the server API first, then the client architecture.** Плюс набросок: **Design in-app search with typeahead over local and remote data.**

---

### Вс 13 сен · Быстрые наброски + behavioral

**20 мин** — По 6 минут на набросок:
- Design a client-side analytics SDK: batching, offline buffering, sampling, privacy.
- Design a feature-flag and remote-config client.
- Design a background sync engine: scheduling, backoff, conflicts, battery.

**+40 мин**
11. Tell me about the largest migration or refactor you led. How did you de-risk it?
12. How do you decide which technical debt to pay down?
13. Tell me about something you shipped that you weren't proud of.

**+60 мин** — Два наброска: **Design a client-side A/B testing framework** и **Design a "download for offline" feature for media, with expiry.** Плюс 🎤 English п.5 и п.6: отработать переспрашивание и покупку времени.

---
---

# НЕДЕЛЯ 7 · Платформа, производительность, тесты, безопасность (14–20 сентября)

### Пн 14 сен · Жизненный цикл и компоненты

**20 мин**
1. Walk through the full Activity lifecycle on rotation. What changes with `android:configChanges`?
2. Process death vs configuration change — how do they differ, and how do you actually test process death?
3. `onSaveInstanceState` vs `SavedStateHandle` vs `ViewModel` — what survives what?
4. What is the practical `Bundle` size limit, and how do you avoid `TransactionTooLargeException`?

**+40 мин**
5. Explain Binder IPC. What happens when an `Intent` crosses a process boundary?
6. Launch modes and task affinity — when do you genuinely need `singleTop` or `singleTask`?
7. Explicit vs implicit intents, and what changed with package visibility on Android 11+.

**+60 мин**
8. Why does the Jetpack Startup library exist, and what problem with `ContentProvider` initialization does it fix?
9. Started, bound and foreground services. What changed with mandatory foreground service types and restricted exact alarms?
10. WorkManager vs Foreground Service vs AlarmManager vs JobScheduler — give a decision matrix.

---

### Вт 15 сен · Фон, разрешения, релиз

**20 мин**
11. How does WorkManager guarantee execution across process death and device reboot?
12. Doze mode and App Standby buckets — how do they affect a background sync feature?
13. Runtime permissions: one-time grants, `POST_NOTIFICATIONS`, the photo picker and partial media access.
14. Deep links vs App Links — how do you verify an App Link and debug it when verification fails?

**+40 мин**
15. What is a `PendingIntent`, and why is mutability now explicit?
16. Trace the build pipeline: sources → dex → APK/AAB → install → ART. Where do AOT, JIT and profile-guided compilation fit?
17. What does R8 actually do? How do you debug a crash that only reproduces in a minified release build?
18. Where should keep rules live for a library module, and why?

**+60 мин**
19. App Bundles, dynamic feature modules and Play Feature Delivery — trade-offs.
20. What is the predictive back gesture and what does adding proper support to an existing app require?
21. Edge-to-edge is enforced now — how do you handle window insets, including IME insets, in Compose?
22. Configuration changes beyond rotation: locale, dark mode, font scale, density. What typically breaks?

---

### Ср 16 сен · Остаток платформы

**20 мин**
23. How does the system decide to kill your process? Explain `onTrimMemory` and importance levels.
24. What is StrictMode and what would you enable in a debug build?
25. Notification channels and importance — what control does the user actually have?

**+40 мин**
26. Multi-window and desktop windowing — which assumptions in a typical app break?
27. Accessibility: what does a senior engineer owe here (TalkBack, touch targets, semantics in Compose)?
28. Per-app language (Android 13+) — how is it implemented and what are the gotchas?
29. `Context` types — application, activity, base, themed. Which one leaks and why?
30. How would you support a device with no Google Play Services in a banking app?

**+60 мин** — 🎤 Прогнать rapid-fire из Недели 0 (все 20 вопросов) вслух под таймер. Цель — 12 минут на все.

---

### Чт 17 сен · Производительность

**20 мин**
1. Walk through cold, warm and hot start. What actually happens during a cold start?
2. How do you measure startup properly (Macrobenchmark, `reportFullyDrawn`, Play Vitals)?
3. Cold start regressed by 400 ms after a release. Walk me through finding the cause.
4. Baseline profiles vs startup profiles — what does each do?

**+40 мин**
5. What causes jank? Explain the frame lifecycle and the budget at 60 Hz vs 120 Hz.
6. How do you diagnose jank with Perfetto?
7. Memory leak vs memory churn vs fragmentation — how do the symptoms differ?

**+60 мин**
8. How does LeakCanary detect a leak? What are typical leak sources in a Compose codebase?
9. Given a heap dump, how do you prove which reference chain retains an Activity?
10. How much RAM does a 4000×3000 photo cost as a Bitmap, and how do you avoid paying it?

---

### Пт 18 сен · КОД: тесты ⏱

**20 мин**
1. Describe your testing pyramid for a banking app, concretely.
2. Mocks verify interactions, stubs return canned responses, fakes are simplified working implementations — when do you use each, and why do seniors lean towards fakes?
3. How do you make a ViewModel fully unit-testable?
4. `StandardTestDispatcher` vs `UnconfinedTestDispatcher`, `advanceUntilIdle`, `runCurrent` — when does each matter?

**+40 мин** — 🛠 Написать реальные тесты для ViewModel со `stateIn(WhileSubscribed)` через Turbine.
5. How do you test a `SharedFlow` of one-off events with Turbine?
6. How do you test a state holder that uses `stateIn(WhileSubscribed)`?
7. Robolectric vs instrumented tests — where do you draw the line?

**+60 мин**
8. How do you test Room migrations?
9. What makes UI tests flaky, and what are your five standard fixes?
10. Screenshot testing: what does it catch, and what does it cost to maintain?
11. How do you test a feature module in isolation from the rest of a 100-module app?
12. What is your position on code coverage as a target metric?
14. How do you test logic that depends on time, dates and timezones?
15. Is contract testing between mobile and backend worth it? Defend your answer.

🛠 **Задача:** Add unit tests to an untested ViewModel; then refactor it so the tests get simpler. Второй шаг важнее первого.

---

### Сб 19 сен · ANR, релизы, сборка

**20 мин**
11. An ANR happens when the main thread is blocked too long — how does the system detect it, and how do you debug one from Play Console data alone?
12. Which disk/IO operations typically sneak onto the main thread in a real app?
13. How do you reduce APK/AAB size? Give five concrete levers.
14. How do you profile and reduce battery drain caused by a sync feature?

**+40 мин**
15. Which metrics belong on a mobile performance dashboard, and which of them gate a release?
16. How do you find and fix over-recomposition in production code?
17. AOT vs JIT vs profile-guided compilation on ART — what does each buy you?
18. How would you cut a six-minute incremental build to under one minute?
19. Crash-free rate dropped from 99.8% to 99.1% overnight. Walk me through your response, minute by minute.
20. How do you approach a performance issue you cannot reproduce locally?

**+60 мин** — Gradle и CI (низкий приоритет для финтеха, но должен уметь ответить):
1. Explain the Gradle build lifecycle: initialization, configuration, execution.
2. Configuration cache vs build cache vs incremental compilation — what does each actually skip?
3. Why does moving from KAPT to KSP matter for build times?
4. What goes into a convention plugin, and why is it better than `subprojects {}`?
5. What problems do version catalogs solve at 100 modules, and what do they not solve?
6. How do you diagnose a slow build (build scans, `--profile`, task-level timing)?
7. Product flavors vs build types vs source sets — how do you structure dev/staging/prod?
8. How do you keep CI under 15 minutes for a large app?

---

### Вс 20 сен · Безопасность + behavioral

**20 мин**
1. Which OWASP Mobile Top 10 risks matter most for a banking app, and why?
2. Where do you store an auth token, and why not in SharedPreferences?
3. The Android Keystore keeps keys inside the TEE or StrongBox — what guarantee do you actually get, and what do you not?
4. How does hardware key attestation prove to your backend that the device is genuine and unmodified?
5. `BiometricPrompt` with a `CryptoObject` — why does binding a key to biometrics matter?

**+40 мин**
6. Pinning can be defeated by hooking on a rooted device — so what is the realistic role of root and hook detection?
7. Walk through a pre-release security checklist: R8, HTTPS-only, `FLAG_SECURE`, `allowBackup`, exported components, no hardcoded secrets, dependency audit.
8. How do you protect against screen recording and tapjacking/overlay attacks?
9. How do you audit exported components in a large app?
10. How do you prevent deep link hijacking?
11. How do you handle API keys and config in the app — what is the honest answer?
12. What does obfuscation actually protect against, and what does it not?
13. Give a WebView security checklist.
14. GDPR/PII: what does a mobile engineer owe regarding logging, analytics and data deletion?
15. Session management: idle timeout, step-up re-authentication, background screenshot blur.
16. You're reviewing a PR that touches the payments flow. What specifically are you looking for?

**+60 мин** — Behavioral:
9. Tell me about mentoring someone. What concretely changed for them?
14. Describe a time you had to say no.
15. Tell me about receiving hard feedback.
16. Tell me about a time you were wrong and a colleague was right.
17. How do you handle a teammate who consistently submits low-quality PRs?
18. Describe your role in a cross-functional project with design, backend and compliance.

🎤 English п.7 и п.8: вежливое несогласие и признание пробела.

---
---

# НЕДЕЛЯ 8 · Kotlin, добивание, мок (21–27 сентября)

### Пн 21 сен · Kotlin: ядро языка

**20 мин**
1. What does `inline` actually change in the generated bytecode, and when does inlining hurt?
2. What problems do `noinline` and `crossinline` each solve?
3. Why does `reified` only work inside `inline` functions?
4. How are `equals`/`hashCode` generated for a `data class`, and what breaks if a `var` property is used as a `HashMap` key?
5. What is a value class (`@JvmInline`)? When does it still get boxed at runtime?

**+40 мин**
6. `sealed class` vs `sealed interface` vs `enum` — how do you choose when modelling UI state?
7. What thread-safety guarantees does a Kotlin `object` give for its initialization?
8. How does `by lazy` work internally, and what are the three `LazyThreadSafetyMode` options?
9. `lateinit` vs `by lazy` vs nullable — what are the trade-offs?
10. How do Kotlin's `internal` and `public` map to JVM visibility, and why does that matter in a multi-module project?

**+60 мин**
11. Explain declaration-site vs use-site variance (`in`, `out`, star projection) with an example from a repository API.
12. What is type erasure and how do you work around it in Kotlin?
13. Why are extension functions statically dispatched, and what surprising behaviour does that cause?
14. `const val` vs `val` — what is the difference at compile time and for binary compatibility?
15. How do platform types work in Java interop, and where can an NPE still occur in "null-safe" Kotlin?

---

### Вт 22 сен · Kotlin: остальное + JVM

**20 мин**
16. What do `@JvmStatic`, `@JvmOverloads`, `@JvmField`, `@JvmName` change?
17. How do delegated properties work under the hood (`getValue`, `setValue`, `provideDelegate`)?
18. Explain the `equals`/`hashCode`/`compareTo` contracts and what breaks when they are inconsistent.
19. `Sequence` vs `List` operator chains — when does `Sequence` actually win?
20. Is `listOf()` immutable? How does it differ from `kotlinx.collections.immutable`?

**+40 мин**
21. How would you model domain errors: exceptions, `Result`, or a sealed error type? Defend the choice.
22. What are context parameters / context receivers, and where would you use them?
23. What are `expect`/`actual` declarations and how are they compiled in KMP?
24. What practically changed for your project with the K2 compiler?
25. How do you design a generic, source-compatible public API for an `api` module consumed by 30 other modules?

**+60 мин**
26. Describe JVM/ART memory regions: heap, stack, metaspace. Where do Kotlin objects live?
27. How does generational garbage collection work on ART, and how does it differ from HotSpot?
28. Strong, weak, soft and phantom references — when have you actually needed a `WeakReference`?
29. What is the happens-before relationship? Give an example using `volatile`.
30. What is escape analysis, and why can't you rely on it on Android?

Плюс остаток Gradle:
9. Trunk-based development vs GitFlow for a mobile app with two-week release trains.
10. Staged rollout, kill switches, forced upgrade — how do you halt a bad release?
11. A critical bug is found when the release is 30% rolled out. What do you do?
12. Signing, Play App Signing, and secrets management in CI.
13. How do you set up crash reporting, symbolication and alerting so on-call is actually actionable?
14. What is your dependency-update policy in a regulated app?
15. How do you make code review scale (PR size limits, ownership, automated checks)?

---

### Ср 23 сен · Gotchas: Kotlin и OOP 🔥

🛠 Проверять в IDE.

**20 мин**
98. A `data class` with a `var` field is placed in a `HashSet`, then the field is mutated. What happens on `contains()`?
99. `copy()` on a data class with a private constructor — what invariant can it break?
100. Why can't a `data class` cleanly participate in inheritance with `equals`?
101. How many instances of a Kotlin `object` exist in a multi-process app?
102. `==` vs `===` for two boxed `Int` values of 1000. What's printed, and why does 100 behave differently?

**+40 мин**
103. `lateinit var` accessed before initialization — which exception, and how do you check safely?
104. Adding a new subtype to a `sealed` hierarchy vs adding an `enum` constant — what breaks at compile time vs runtime?
105. `Serializable` vs `Parcelable` — performance, reflection, and when the difference actually matters.
106. Complexity of `ArrayList` vs `LinkedList` vs `HashMap` for insert/lookup/delete — and when does `HashMap` degrade?
107. What breaks if `equals` is implemented without `hashCode`?

**+60 мин**
108. Abstraction vs encapsulation — explain the difference with an Android example.
109. Walk through SOLID, one letter at a time, with an example from a real codebase.
110. Why "composition over inheritance"? Give a case where inheritance is still the right call.

Плюс: пройти все 🔴 из недель 1–2 (конкурентность, корутины, Flow).

---

### Чт 24 сен · Красная зона

**20 мин** — Пройти все 🔴 из недель 4–5 (Compose, архитектура, данные).

**+40 мин** — Переобъяснить вслух каждый вопрос, где путался. Не читать ответ — сформулировать заново.

**+60 мин** — Повторно пройти раунд «расскажи про свой проект» (Вс 6 сен), уже без бумажки. Особенно вопрос про over-engineered.

---

### Пт 25 сен · КОД: случайная задача ⏱

**20 мин** — Выбрать наугад нерешённую задачу. Прочитать, написать тест-кейсы.

**+40 мин** — 🎤 Решить полностью вслух на английском. Таймер 50 минут.

**+60 мин** — Задача в формате Monzo: **взять свой старый код и «починить» его** — половина фичи, краши, утечка, недоделанный дизайн. Довести до спеки за 60 минут.

Плюс алгоритмы: Number of Islands, Course Schedule, Coin Change, House Robber, Merge k Sorted Lists, Lowest Common Ancestor.

Плюс две задачи, которые давали на мобильных интервью:
- Parse and evaluate a simple expression.
- Flatten a nested structure — design the iterator, not just the recursion.

---

### Сб 26 сен · Полный мок-интервью ⏱ 🔥

**20 мин** — Настроить запись. Выбрать задачи заранее, чтобы не подглядывать.

**+40 мин** — 🎤 **45 минут live coding** без пауз, вслух, на английском. Запись.

**+60 мин** — 🎤 **45 минут system design** на задаче, которую ещё не делал: *Design a photo/video upload pipeline that survives process death* или *Design a payments SDK embedded by third-party apps*. Разобрать обе записи.

---

### Вс 27 сен · Behavioral: закрыть всё

**20 мин**
19. Tell me about improving a process rather than a product.
20. How do you keep up with the Android ecosystem?
23. Describe disagreeing with a product decision.
24. Tell me about trading off quality against speed.

**+40 мин**
25. How do you onboard onto an unfamiliar codebase?
26. What does "senior" mean to you beyond writing code?
27. Tell me about a metric you moved. How did you measure it?
28. Describe taking ownership of something outside your remit.
29. Why are you leaving your current role? Why this company?
30. Where do you want to be in three years?

**+60 мин** — 🎤 English п.10: small talk в начале и корректное завершение. Плюс проверить покрытие: восемь историй должны закрывать все темы — ownership · conflict · failure · ambiguity · influence · mentorship · prioritization · delivery under pressure · incident response · cross-functional work.

---
---

# НЕДЕЛЯ 9 · Прогоны и выход на рынок (28 сентября – 4 октября)

### Пн 28 сен · Мок: live coding ⏱

**20 мин** — Разобрать запись от 26 сентября: где молчал, где не проговорил trade-off.

**+40 мин** — 🎤 Новая задача: *Booking/parking-lot system made concurrency-safe*. 50 минут вслух. Сравнить с прошлой записью.

**+60 мин** — Переписать решение чище за 20 минут. Что бы улучшил при большем времени — сформулировать вслух.

---

### Вт 29 сен · Мок: system design ⏱

**20 мин** — Прогнать каркас из 10 шагов по памяти.

**+40 мин** — 🎤 45 минут на задаче: *Design a ride-hailing client: live location, ETA, trip state machine.*

**+60 мин** — Ещё одна: *Design a shared caching layer used by every feature in a modular app* или *Design an image-loading library from scratch*. Разбор по чек-листу: все ли 10 шагов покрыты.

---

### Ср 30 сен · Мок: behavioral + вопросы им

**20 мин** — Прогнать 3 главные истории по 3 минуты.

**+40 мин** — 🎤 Прогнать все 8 историй подряд на английском, без бумажки. Плюс values-вопросы:
31. Tell me about a time you used data to make a decision.
32. Describe moving fast and breaking something. How do you balance it now?
33. How do you operate under high ambiguity and high pace?
34. Tell me about a calculated risk you took.
35. How do you think about the trade-off between shipping speed, security and quality?

**+60 мин** — Выбрать **5 вопросов, которые задашь ты**:
1. What does the mobile release process look like end to end?
2. How is the codebase modularized, and who owns architecture decisions?
3. What's the current crash-free rate, and how is it tracked?
4. How much of the app is Compose vs Views? What's the migration state?
5. What does on-call look like for mobile engineers?
6. How do product and engineering split ownership of "what" vs "how"?
7. What's the biggest source of friction for engineers right now?
8. How is time for tech debt allocated?
9. What would a successful first 90 days look like in this role?
10. How does the team resolve technical disagreements in practice?
11. What's the testing culture — coverage, e2e, manual QA?
12. How do compliance constraints affect the mobile release cycle?
13. Why is this role open?
14. What's the team's biggest technical challenge in the next six months?
15. How is performance evaluated for senior ICs, and what's the path beyond senior?

---

### Чт 1 окт · Материалы

**20 мин** — Обновить CV: цифры вместо обязанностей.

**+40 мин** — LinkedIn: заголовок, About, опыт. Открыть «open to work» для рекрутёров.

**+60 мин** — 🎤 English п.1: отточить 2-минутное самопредставление до автоматизма. Плюс подготовить список из 15 компаний.

---

### Пт 2 окт · Первые отклики 🔥

**20 мин** — Подать 3 заявки. Revolut в первой тройке.

**+40 мин** — Ещё 5 заявок. Написать 3 рекрутёрам напрямую.

**+60 мин** — Подготовить ответы на скрининг рекрутёра: зарплатные ожидания, релокация, виза, сроки, почему уходишь.

---

### Сб 3 окт · Последний проход

**20 мин** — Прогнать оставшиеся 🔴.

**+40 мин** — Rapid-fire из Недели 0 целиком под таймер.

**+60 мин** — Перечитать 8 мета-правил из Вс 2 августа и свои 5 вопросов интервьюеру.

---

### Вс 4 окт · Пауза

Отдых. Составить план откликов на неделю: сколько заявок в день, кому написать, что подтягивать между интервью.

---
---

## Сводка

| Неделя | Тема | Риск, если пропустишь |
|--------|------|----------------------|
| 0 | Калибровка и настройка | Учишь то, что уже знаешь |
| 1 | Конкурентность + корутины | **Провал live coding в Revolut** |
| 2 | Flow + gotchas | Сыпешься на «а что выведется» |
| 3 | Live coding под таймер | Не укладываешься в 60 минут |
| 4 | Compose + UI gotchas | Слабый технический deep dive |
| 5 | Архитектура + данные | Не защитишь решения по ABM |
| 6 | System design | **Отсев на дизайн-раунде** |
| 7 | Платформа, perf, тесты, security | Проседание на follow-up |
| 8 | Kotlin + добивание + мок | Нет обкатки под давлением |
| 9 | Прогоны + отклики | Готов, но не начал искать |

**63 дня.** Проверенный состав:

| Что | Сколько | Где |
|-----|---------|-----|
| Пронумерованных вопросов | 445 | распределены по дням |
| Задач на живой код (§13) | 15 | недели 1–3, 5, 8–9 |
| Задач «починить чужой код» (Ч2 C) | 10 | недели 1, 2, 4, 5, 7, 8 |
| Дизайн-задач | 20 | недели 6, 8, 9 |
| Алгоритмов + вопросов про сложность | 25 + 4 | недели 2–8 |
| Задач с реальных мобильных интервью (Ч2 E) | 8 | недели 3, 6, 8 |
| STAR-историй | 8 | воскресенья недель 1–8 |

Дубли между §14 и Ч2 E схлопнуты. **Оба банка перенесены полностью — ничего не потеряно.**

Если за неделю выходит меньше трёх дней — не растягивай план, а урезай. Первыми выкидываются Gradle/CI и алгоритмы: для европейского финтеха они наименее критичны.
