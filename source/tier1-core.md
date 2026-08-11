# Список 1 — ЯДРО. То, что нужно закрыть к концу октября

**Отобрано из банка в 515 вопросов. Осталось 216.**
Критерий отбора — не «интересность», а **доказанная встречаемость** на senior-собеседованиях в Revolut, Monzo, N26, Wise, Bolt и Big Tech. Обоснование каждого блока — в конце файла, раздел «На чём основан отбор».

## Легенда приоритета

| Метка | Что значит | Сколько |
|---|---|---|
| ⭐⭐ | **Kill-вопрос.** На нём режут. Не закрыть = провал раунда | 68 |
| ⭐ | Высокий. Спрашивают регулярно, follow-up почти гарантирован | 148 |

## Как пользоваться

1. Проставь 🔴 / 🟡 / 🟢 по каждому пункту. Правило: **не объяснил вслух по-английски за 2 минуты без подглядывания — не 🟢.**
2. Все ⭐⭐ должны стать 🟢 **к 30 сентября**. Все ⭐ — к 25 октября.
3. Для блоков 4, 5, 6, 8, 10 держи наготове **пример из ABM**. Реальный кейс бьёт теорию.
4. Список 2 (остальные 233 вопроса) не трогать, пока в этом файле есть хоть один 🔴.

## Распределение по блокам

| Блок | Тема | Вопросов | Из них ⭐⭐ |
|---|---|---|---|
| 1 | Concurrency & thread safety | 12 | 9 |
| 2 | Live coding / LLD | 10 | 7 |
| 3 | Coroutines & Flow | 42 | 20 |
| 4 | Защита своей архитектуры (ABM) | 12 | 8 |
| 5 | Architecture & modularization | 12 | 3 |
| 6 | Mobile system design | 10 | 5 |
| 7 | Data, networking, offline | 12 | 4 |
| 8 | Jetpack Compose | 16 | 4 |
| 9 | ViewModel, lifecycle, state | 9 | 3 |
| 10 | Testing | 9 | 3 |
| 11 | Performance & diagnostics | 8 | 1 |
| 12 | Kotlin & JVM | 12 | 0 |
| 13 | Android platform | 10 | 0 |
| 14 | Security (fintech) | 7 | 0 |
| 15 | Behavioral | 15 | 0 |
| 16 | Algorithms | 8 | 0 |
| 17 | English + вопросы интервьюеру | 12 | 0 |
| | **Итого** | **216** | **68** |

---

# Блок 1. Concurrency & Thread Safety

**Почему первый.** Это документированный фильтр Revolut. В отзывах кандидатов и в гайдах по процессу конкурентность названа отдельно как то, на чём отсеивают Java/Kotlin-кандидатов. У Monzo в system design грилят по concurrency / consistency / network faults. Ни один другой блок не даёт такой плотности отказов.

Учить **до автоматизма** — не «знаю определение», а «пишу корректный код под таймером и вслух объясняю, почему он корректен».

| # | Вопрос | Приоритет |
|---|---|---|
| 1.1 | Define race condition, data race, deadlock, livelock and starvation. Give a concrete example of each. | ⭐⭐ |
| 1.2 | Two parallel requests withdraw money from the same account at the same time. Walk me through the race and fix it. *(прямая формулировка из отчётов о Revolut)* | ⭐⭐ |
| 1.3 | What does `@Volatile` guarantee — and what does it explicitly NOT guarantee? | ⭐⭐ |
| 1.4 | What is the happens-before relationship in the JMM? Give an example using `volatile`. | ⭐⭐ |
| 1.5 | `synchronized` vs `ReentrantLock` vs `Mutex` — trade-offs, and why you cannot use `synchronized` around a suspend call. | ⭐⭐ |
| 1.6 | How do you prevent deadlock in `transfer(from, to, amount)` between two accounts? *(lock ordering — проговори явно)* | ⭐⭐ |
| 1.7 | Optimistic vs pessimistic locking — model an account transfer with both. Which would you ship in a bank and why? | ⭐⭐ |
| 1.8 | What is CAS? How do `AtomicInteger` / `AtomicReference` use it, and when does CAS perform badly? | ⭐⭐ |
| 1.9 | Explain double-checked locking and why `volatile` is required for correctness. | ⭐⭐ |
| 1.10 | `ConcurrentHashMap` vs `Collections.synchronizedMap` — what is actually different? | ⭐ |
| 1.11 | Why are unbounded thread pools dangerous? How do you size a pool for CPU-bound vs IO-bound work? | ⭐ |
| 1.12 | Explain the Android main thread machinery: `Looper`, `MessageQueue`, `Handler`, `Choreographer`. | ⭐ |

---

# Блок 2. Live Coding / LLD

**Формат раунда:** 45–60 минут, 2–3 задачи подряд, свой IDE, часто без Copilot и без поиска. Требования: **работающий код + юнит-тесты + thread safety by default + SOLID**. Главная причина провала — кандидаты относятся к раунду как к спортивному программированию вместо инженерной задачи. Take-home без тестов у Revolut описывается как автоматический отказ.

**Тренируй с таймером и вслух.** Работающее решение с тестами бьёт элегантное без тестов.

| # | Задача | Приоритет |
|---|---|---|
| 2.1 | **Thread-safe in-memory account ledger**: `deposit`, `withdraw`, `transfer`. No deadlocks. With unit tests. | ⭐⭐ |
| 2.2 | **In-memory load balancer** with pluggable strategies (round-robin, weighted, least-connections) + register/unregister. Thread-safe. | ⭐⭐ |
| 2.3 | **Rate limiter** — implement fixed window, then sliding window, then token bucket. Thread-safe. *(named by Monzo candidates too)* | ⭐⭐ |
| 2.4 | **Currency conversion engine**: rate table, cross-rates, stale-rate handling. | ⭐⭐ |
| 2.5 | **LRU cache with TTL**, O(1), thread-safe. | ⭐⭐ |
| 2.6 | **Request deduplication cache**: same key → one in-flight call, all callers receive the result. | ⭐⭐ |
| 2.7 | **Fix a broken app.** You inherit a half-finished screen with crashes, a memory leak and unfinished design. Get it to spec inside the timebox, narrating trade-offs. *(буквально описанный сценарий Monzo take-home)* | ⭐⭐ |
| 2.8 | **Retry executor** with exponential backoff, jitter and cancellation. | ⭐ |
| 2.9 | **Task scheduler** running at most N tasks concurrently, preserving submission order per key. | ⭐ |
| 2.10 | Convert a callback-based repository to coroutines **without breaking existing callers**. | ⭐ |

> **Правило для 2.7 и 2.10.** Monzo прямо просит уложиться в таймбокс и показать осознанные компромиссы, а не идеальное решение за выходные. На разборе решения нужно **защищать ключевые решения** и честно говорить, что сделал бы иначе при большем времени. Готовь эту формулировку заранее.

---

# Блок 3. Coroutines & Flow

**Самый вероятный технический deep-dive для Android-роли** и одновременно топливо для блока 1. Разделено на теорию и gotcha-вопросы — вторые ценнее, там сеньоры и валятся.

## 3A. Теория и модель

| # | Вопрос | Приоритет |
|---|---|---|
| 3.1 | What is a coroutine at the bytecode level? Explain CPS transformation and `Continuation`. | ⭐ |
| 3.2 | What is structured concurrency and what concrete problems does it eliminate? | ⭐⭐ |
| 3.3 | `launch` vs `async` vs `withContext` — return type, exception behaviour, dispatch. | ⭐⭐ |
| 3.4 | `Job` vs `SupervisorJob`; `coroutineScope {}` vs `supervisorScope {}` — how does exception propagation differ? | ⭐⭐ |
| 3.5 | Why is cancellation cooperative, and what does that mean for your code? | ⭐⭐ |
| 3.6 | How do you make a blocking third-party call cancellable? | ⭐ |
| 3.7 | How does `CoroutineExceptionHandler` work, and why doesn't it catch exceptions from `async`? | ⭐ |
| 3.8 | `Main` vs `Main.immediate` vs `Default` vs `IO` — thread pools, sizing, use cases. What problem does `limitedParallelism` solve? | ⭐ |
| 3.9 | What does "main-safe suspend function" mean, and whose responsibility is main-safety? | ⭐ |
| 3.10 | How do you inject dispatchers so the code stays testable? | ⭐ |
| 3.11 | `runBlocking` vs `runTest`; how does `runTest` handle virtual time and delay skipping? | ⭐ |
| 3.12 | Cold vs hot: `Flow`, `SharedFlow`, `StateFlow`, `Channel` — compare semantics. | ⭐⭐ |
| 3.13 | What exactly does `SharingStarted.WhileSubscribed(5_000)` do, and why 5 seconds? | ⭐⭐ |
| 3.14 | `map` vs `flatMapLatest` vs `flatMapMerge` vs `flatMapConcat` — a real use case for each. | ⭐ |
| 3.15 | `combine` vs `zip` — behaviour with different emission rates. | ⭐ |
| 3.16 | `collect` vs `collectLatest` — what exactly gets cancelled? | ⭐ |
| 3.17 | What does `flowOn` change, and why does it only affect upstream operators? | ⭐ |
| 3.18 | How do `callbackFlow` and `channelFlow` work, and why is `awaitClose` mandatory? | ⭐ |
| 3.19 | Wrap a callback-based API in `suspendCancellableCoroutine`. What must you handle? | ⭐ |
| 3.20 | `Mutex` vs `synchronized` — and how do you deduplicate in-flight requests so five simultaneous callers trigger one network call? | ⭐⭐ |
| 3.21 | `repeatOnLifecycle` vs `flowWithLifecycle` vs `launchWhenStarted` — what is deprecated and why? | ⭐ |
| 3.22 | How do you test a Flow? Show the Turbine approach for a `SharedFlow`. | ⭐ |

## 3B. Gotchas — «покажу код, скажи что не так»

Формат: тебе дают сниппет и спрашивают «что выведется» / «что здесь баг». Это **самый ценный подраздел всего файла**: тут ты «знаешь тему», но отвечаешь неправильно.

| # | Вопрос | Приоритет |
|---|---|---|
| 3.23 | A network call is in flight when `onCleared()` is called. What happens to the coroutine? To the HTTP request? To the OkHttp thread? | ⭐⭐ |
| 3.24 | Why doesn't `try { launch { throw ... } } catch (e: Exception) {}` catch anything? | ⭐⭐ |
| 3.25 | `async {}` throws and you never call `await()`. Where does the exception go? | ⭐⭐ |
| 3.26 | A parent is cancelled while a child is inside a `finally` block that calls a suspend function. What happens? | ⭐⭐ |
| 3.27 | Name three concrete production failures caused by `GlobalScope.launch` inside a ViewModel. | ⭐⭐ |
| 3.28 | Does marking a function `suspend` guarantee it won't block the main thread? | ⭐⭐ |
| 3.29 | `while (true) { doWork() }` inside a coroutine — is it cancellable? How do you fix it? | ⭐⭐ |
| 3.30 | `MutableStateFlow` is assigned an equal value twice. How many emissions do collectors see? Why? | ⭐⭐ |
| 3.31 | `_state.value.items.add(newItem)` where `items` is a `MutableList` — does the UI update? Why not? | ⭐⭐ |
| 3.32 | A navigation event is emitted into a `SharedFlow(replay = 0)` before the screen subscribes. What happens, and how do you fix it *properly*? | ⭐⭐ |
| 3.33 | Two collectors subscribe to the same cold `Flow` from a Retrofit call. How many network requests fire? | ⭐⭐ |
| 3.34 | An exception is thrown inside `collect {}`. Is upstream cancelled? Does `catch {}` intercept it? What changes if `catch {}` is placed before vs after `map {}`? | ⭐⭐ |
| 3.35 | `stateIn` requires an initial value. What are the two standard ways to model "nothing loaded yet", and what's wrong with `null`? | ⭐⭐ |
| 3.36 | Why is `StateFlow` a poor fit for one-off events (navigation, snackbar)? Walk through `Channel` vs `SharedFlow` vs state-driven event, and the lifecycle race in each. *(живой спор в комьюнити — сильный ответ обязателен для senior)* | ⭐⭐ |
| 3.37 | You're already on `Dispatchers.IO` and call `withContext(Dispatchers.IO)`. Does a thread switch happen? | ⭐ |
| 3.38 | `Dispatchers.IO` and `Dispatchers.Default` share threads. What does that imply for a CPU-heavy task launched on IO? | ⭐ |
| 3.39 | `WhileSubscribed(5000)` vs `Eagerly` vs `Lazily` — what does the user actually see on rotation for each? | ⭐ |
| 3.40 | `.flowOn(Dispatchers.IO)` placed after `.collect {}` — does it do anything? And `combine(a, b)` where `b` hasn't emitted yet — does downstream receive anything? | ⭐ |
| 3.41 | `distinctUntilChanged()` on a data class holding a `List` — does it reliably deduplicate? | ⭐ |
| 3.42 | `lifecycleScope.launch { flow.collect {} }` in `onCreate` — what exactly leaks, and when? | ⭐ |

---

# Блок 4. Защита своей архитектуры (раунд по ABM)

**Самый высокий ROI на час подготовки во всём файле.** Это отдельный раунд у Monzo (первый часовой звонок — разбор недавнего сложного проекта, кода не пишешь), у N26 (deep dive, где два senior-инженера заставляют защищать каждое решение), у Wise (разбор take-home). Ты уже знаешь материал — нужно только отрепетировать формулировки на английском.

**Заготовь три истории по ABM**, каждая на 3 минуты, каждая с цифрами:
1. Сложная фича с trade-offs.
2. Инцидент/баг с расследованием.
3. Архитектурное решение, которое продавил — или проиграл.

| # | Вопрос | Приоритет |
|---|---|---|
| 4.1 | Walk me through the architecture of the app you work on. *(3 минуты, без бумажки, на английском)* | ⭐⭐ |
| 4.2 | Why is it structured that way? What would you change if you started today? | ⭐⭐ |
| 4.3 | **Someone looking at your app might say it's over-engineered. What would you say to that?** *(реально задавали на Monzo — это не троллинг, это проверка, умеешь ли обосновывать, а не оправдываться)* | ⭐⭐ |
| 4.4 | How many modules do you have, what is the actual build time, and what have you done about it? | ⭐⭐ |
| 4.5 | Which part of the codebase are you least happy with, and why haven't you fixed it? | ⭐⭐ |
| 4.6 | What's your test strategy, honestly — what is tested and what isn't? | ⭐⭐ |
| 4.7 | What's the hardest bug you've debugged there? Walk me through the investigation. | ⭐⭐ |
| 4.8 | Tell me about a big technical challenge you overcame, and how you influenced stakeholders around it. *(дословно то, что Monzo указывает как содержание первого звонка)* | ⭐⭐ |
| 4.9 | How do you handle a feature that touches four teams' modules? | ⭐ |
| 4.10 | What does your release process look like, and what's the worst thing that ever shipped? | ⭐ |
| 4.11 | If I gave you two weeks and no product work, what would you fix first? | ⭐ |
| 4.12 | How is your app different from a non-banking app — what does the domain force you to do? | ⭐ |

---

# Блок 5. Architecture & Modularization

Твоя домашняя территория (ABM: multi-module, MVI, Hilt, api/impl, convention plugins). Держи ⭐⭐ там, где N26 реально резал кандидатов.

| # | Вопрос | Приоритет |
|---|---|---|
| 5.1 | Single state class vs multiple flows for a screen — defend your choice. *(N26 отклонял take-home именно за отдельные потоки под error / loading / result)* | ⭐⭐ |
| 5.2 | How do you model loading / error / empty / content without a combinatorial explosion of states? | ⭐⭐ |
| 5.3 | MVVM vs MVI vs MVP — what do you actually gain from MVI, and what does it cost? | ⭐⭐ |
| 5.4 | Clean Architecture: what belongs in the domain layer? When is a UseCase layer just ceremony? | ⭐ |
| 5.5 | Where do you map DTO → entity → domain → UI models, and why there? | ⭐ |
| 5.6 | What problem does an `api`/`impl` module split solve, and how do you wire it with Hilt? | ⭐ |
| 5.7 | How do you enforce module dependency rules mechanically rather than at code review? | ⭐ |
| 5.8 | Hilt components and scopes, `@Binds` vs `@Provides`, multibindings — how do you provide a feature-scoped dependency? | ⭐ |
| 5.9 | How do you structure navigation in a multi-module app so features don't depend on each other? | ⭐ |
| 5.10 | How do you evolve a public module API without breaking 30 consumers? | ⭐ |
| 5.11 | How would you incrementally migrate a legacy XML/MVP app to Compose/MVI without freezing the roadmap? | ⭐ |
| 5.12 | How do you architect for feature flags, and how do you avoid flag debt? | ⭐ |

---

# Блок 6. Mobile System Design

**Отдельный раунд у Monzo** (час, два мобильных инженера, виртуальная доска Excalidraw, кода не пишешь кроме моделей данных и интерфейсов). Тебе дают **UI-дизайн + начальные требования** и просят blueprint end-to-end реализации — такой, чтобы по нему можно было начать писать вместе. Оценивают: удержание общего понимания с интервьюером и проактивное снятие неоднозначности. У N26 и Bolt тоже отдельный system design раунд.

**Важно:** в отчётах по Revolut отмечают, что в system design ценили **операционный workflow больше, чем красивую общую диаграмму**. Не рисуй схему — рассказывай, как это работает в проде. И почти всегда просят **и клиент, и контракт API** — не застревай в Android-слое.

## Каркас ответа (проговаривай вслух в этом порядке)

1. **Clarify scope** — одна фича или всё приложение? Платформы? Офлайн нужен? Real-time или pull-to-refresh?
2. **Non-functional requirements** — latency, офлайн, батарея, память, безопасность, доступность, локализация.
3. **High-level client architecture** — слои, модули, поток данных.
4. **API contract & data model** — форма пагинации, размер payload, версионирование.
5. **Caching & sync** — single source of truth, инвалидация, разрешение конфликтов.
6. **Threading & concurrency** — что где выполняется, что отменяемо.
7. **Edge cases & failure modes** — нет сети, медленная сеть, process death, частичный отказ, clock skew.
8. **Observability** — метрики, логи, crash reporting, на что бы алертил.
9. **Testing & rollout** — как безопасно выкатить.
10. **Trade-offs и что сделал бы иначе на 10× масштабе.**

## Задачи

| # | Задача | Приоритет |
|---|---|---|
| 6.1 | Design a transactions/statements screen covering ten years of history. | ⭐⭐ |
| 6.2 | Design a money transfer flow, including retries, idempotency and failure states. | ⭐⭐ |
| 6.3 | Design an offline-first sync engine: scheduling, backoff, conflicts, battery. | ⭐⭐ |
| 6.4 | Design a photo/video upload pipeline that survives process death. *(вариант: KYC onboarding с загрузкой документов и резюмируемыми шагами)* | ⭐⭐ |
| 6.5 | Design a chat app with offline support, read receipts and message ordering. | ⭐⭐ |
| 6.6 | Design an Instagram-style / ranked feed client. | ⭐ |
| 6.7 | Design a multi-currency balance screen updating in real time over WebSocket: throttling, ordering, stale data. | ⭐ |
| 6.8 | Design push notification handling: deduplication, deep links, foreground vs background. | ⭐ |
| 6.9 | Design a client-side analytics SDK: batching, offline buffering, sampling, privacy. | ⭐ |
| 6.10 | Design a feature-flag and remote-config client. | ⭐ |

---

# Блок 7. Data, Networking & Offline

Это топливо для блока 6. Каждый вопрос отсюда — потенциальный follow-up в system design.

| # | Вопрос | Приоритет |
|---|---|---|
| 7.1 | What is idempotency, and why does a payment request need an idempotency key? | ⭐⭐ |
| 7.2 | How do you guarantee a "send money" action executes exactly once from the client's point of view? | ⭐⭐ |
| 7.3 | Implement token refresh when five parallel requests all return 401 simultaneously. | ⭐⭐ |
| 7.4 | Conflict resolution: last-write-wins, version vectors, server authority — which fits a bank and why? | ⭐⭐ |
| 7.5 | Design optimistic UI with rollback — first for a "like", then for a money transfer. What changes? | ⭐ |
| 7.6 | OkHttp application vs network interceptors — where do auth, retry and logging belong? | ⭐ |
| 7.7 | How do you map HTTP, network and parsing failures into a single domain error model? | ⭐ |
| 7.8 | WebSocket vs SSE vs long polling vs FCM push — pick one for live balance updates and justify it. | ⭐ |
| 7.9 | Cursor-based vs offset pagination — why does it matter for a transactions list? | ⭐ |
| 7.10 | Room migrations: what happens when one is missing, and how do you test migrations? | ⭐ |
| 7.11 | Certificate pinning bypasses the device trust store — what is the operational cost, and how do you avoid bricking the app on rotation? | ⭐ |
| 7.12 | Encrypting local data: SQLCipher, `EncryptedSharedPreferences`, Keystore-backed keys — trade-offs. | ⭐ |

---

# Блок 8. Jetpack Compose

Compose — уже не опция, а дефолт; интервьюеры на mid/senior спрашивают про него системно. Но глубина спроса ниже, чем по корутинам: тебя проверяют на понимание **рекомпозиции и стабильности**, а не на знание всех API.

| # | Вопрос | Приоритет |
|---|---|---|
| 8.1 | Explain the three phases: composition, layout, drawing. Which phase should you avoid doing work in? | ⭐⭐ |
| 8.2 | What is a recompose scope, and why can a whole screen recompose because of one state read? | ⭐⭐ |
| 8.3 | **What is strong skipping mode and what changed?** Unstable параметры теперь сравниваются по instance equality (`===`), лямбды с unstable-захватами авто-мемоизируются, а большинство ручных `@Stable`/`@Immutable` стали мёртвым грузом — они нужны только там, где требуется сравнение по `equals()`. Знать это точно: тема свежая, и на ней ловят тех, кто выучил старые правила стабильности. | ⭐⭐ |
| 8.4 | How do you diagnose excessive recomposition? (Layout Inspector counts, compiler reports, composition tracing.) | ⭐⭐ |
| 8.5 | `@Stable` vs `@Immutable` — what is the contract, and what happens if you lie to the compiler? | ⭐ |
| 8.6 | `remember` vs `rememberSaveable` — what survives what? How do you write a custom `Saver`? | ⭐ |
| 8.7 | What problem does `derivedStateOf` solve, and what is the most common misuse? What's the defect if it's written without `remember`? | ⭐ |
| 8.8 | Give a use case for each: `LaunchedEffect`, `DisposableEffect`, `SideEffect`, `rememberCoroutineScope`, `rememberUpdatedState`, `snapshotFlow`. | ⭐ |
| 8.9 | `LaunchedEffect(Unit)` sits inside an `if (condition)` branch that toggles. How many times does the effect run? | ⭐ |
| 8.10 | `rememberCoroutineScope()` vs `LaunchedEffect` — give a case where the wrong one is a bug, not a style choice. | ⭐ |
| 8.11 | Why do `key`s matter in a `LazyColumn` for state and animation correctness? `mutableStateListOf` vs `mutableStateOf(listOf())`? | ⭐ |
| 8.12 | `LazyColumn` performance: keys, `contentType`, item stability, nested scrolling pitfalls. | ⭐ |
| 8.13 | What is a baseline profile, roughly what does it buy you on cold start, and how do you generate one? | ⭐ |
| 8.14 | State hoisting and UDF — how do you structure a screen with 20 interactive fields without a god-object state? | ⭐ |
| 8.15 | How does the Navigation Compose back stack work? What does Navigation 3 change conceptually (`NavKey`, `NavDisplay`, `SceneStrategy`, `EntryProvider`)? How do you scope a ViewModel to a nav graph or a single destination? | ⭐ |
| 8.16 | Edge-to-edge is enforced now — how do you handle window insets, including IME insets, in Compose? | ⭐ |

---

# Блок 9. ViewModel, Lifecycle & State

Плотный gotcha-блок. Спрашивают почти везде, потому что дёшево проверить и хорошо разделяет middle от senior.

| # | Вопрос | Приоритет |
|---|---|---|
| 9.1 | Process death vs configuration change — how do they differ, and how do you *actually* test process death on a device? | ⭐⭐ |
| 9.2 | `onSaveInstanceState` vs `SavedStateHandle` vs `ViewModel` — what survives what? What can you put in `SavedStateHandle`, and what's the practical size limit? | ⭐⭐ |
| 9.3 | What happens to `viewModelScope` in `onCleared()`, and what does NOT get cancelled? | ⭐⭐ |
| 9.4 | Walk through the full Activity lifecycle on rotation. What changes with `android:configChanges`? | ⭐ |
| 9.5 | What is the practical `Bundle` size limit, and how do you avoid `TransactionTooLargeException`? | ⭐ |
| 9.6 | Is there ever a safe way for a ViewModel to hold a `Context`? Which `Context` types leak and why? | ⭐ |
| 9.7 | Passing a screen argument into a ViewModel: assisted injection vs `SavedStateHandle` — when is each correct? | ⭐ |
| 9.8 | A singleton holds an Activity `Context`. How long does the leak last, and what exactly is retained? | ⭐ |
| 9.9 | LiveData vs StateFlow for a state holder — argue both sides, then pick one. | ⭐ |

---

# Блок 10. Testing

Не факультатив. У Revolut отправка take-home без тестов описывается как автоматический отказ; в live coding ждут юнит-тесты внутри таймбокса.

| # | Вопрос | Приоритет |
|---|---|---|
| 10.1 | In a 60-minute live coding round with TDD, what do you write first and why? | ⭐⭐ |
| 10.2 | `StandardTestDispatcher` vs `UnconfinedTestDispatcher`, `advanceUntilIdle`, `runCurrent` — when does each matter? | ⭐⭐ |
| 10.3 | How do you make a ViewModel fully unit-testable? | ⭐⭐ |
| 10.4 | Mocks verify interactions, stubs return canned responses, fakes are simplified working implementations — when do you use each, and why do seniors lean towards fakes? | ⭐ |
| 10.5 | How do you test a `SharedFlow` of one-off events with Turbine? And a state holder using `stateIn(WhileSubscribed)`? | ⭐ |
| 10.6 | Describe your testing pyramid for a banking app, concretely. | ⭐ |
| 10.7 | What makes UI tests flaky, and what are your five standard fixes? | ⭐ |
| 10.8 | How do you test logic that depends on time, dates and timezones? | ⭐ |
| 10.9 | What is your position on code coverage as a target metric? | ⭐ |

---

# Блок 11. Performance & Diagnostics

Твоя сильная зона — здесь нужны истории из ABM с цифрами, а не теория.

| # | Вопрос | Приоритет |
|---|---|---|
| 11.1 | Crash-free rate dropped from 99.8% to 99.1% overnight. Walk me through your response, minute by minute. | ⭐⭐ |
| 11.2 | Walk through cold, warm and hot start. How do you measure startup properly (Macrobenchmark, `reportFullyDrawn`, Play Vitals)? | ⭐ |
| 11.3 | Cold start regressed by 400 ms after a release. Walk me through finding the cause. | ⭐ |
| 11.4 | What causes jank? Explain the frame lifecycle and the budget at 60 Hz vs 120 Hz. How do you diagnose jank with Perfetto? | ⭐ |
| 11.5 | An ANR happens when the main thread is blocked too long — how does the system detect it, and how do you debug one from Play Console data alone? | ⭐ |
| 11.6 | Memory leak vs memory churn vs fragmentation — how do the symptoms differ? How does LeakCanary detect a leak, and what are typical leak sources in a Compose codebase? | ⭐ |
| 11.7 | How do you approach a performance issue you cannot reproduce locally? | ⭐ |
| 11.8 | What does R8 actually do? How do you debug a crash that only reproduces in a minified release build? | ⭐ |

---

# Блок 12. Kotlin & JVM

Базовый слой. Спрашивают на скрине и как follow-up внутри других блоков — редко как отдельный раунд. Поэтому все ⭐, ни одного ⭐⭐: провалить один такой вопрос обычно не фатально, но провалить пять подряд — фатально.

| # | Вопрос | Приоритет |
|---|---|---|
| 12.1 | What does `inline` change in the generated bytecode, and when does inlining hurt? What problems do `noinline` and `crossinline` solve? Why does `reified` only work inside `inline`? | ⭐ |
| 12.2 | How are `equals`/`hashCode` generated for a `data class`? A `data class` with a `var` field is put in a `HashSet`, then the field is mutated — what happens on `contains()`? | ⭐ |
| 12.3 | `sealed class` vs `sealed interface` vs `enum` for UI state. What breaks at compile time vs runtime when you add a new subtype vs a new enum constant? | ⭐ |
| 12.4 | How does `by lazy` work internally? What are the three `LazyThreadSafetyMode` options? `lateinit` vs `by lazy` vs nullable — trade-offs. | ⭐ |
| 12.5 | What thread-safety guarantees does a Kotlin `object` give for its initialization, and how many instances exist in a multi-process app? | ⭐ |
| 12.6 | Explain declaration-site vs use-site variance (`in`, `out`, star projection) with an example from a repository API. What is type erasure and how do you work around it? | ⭐ |
| 12.7 | How would you model domain errors: exceptions, `Result`, or a sealed error type? Defend the choice. | ⭐ |
| 12.8 | What is a value class (`@JvmInline`)? When does it still get boxed at runtime? | ⭐ |
| 12.9 | `Sequence` vs `List` operator chains — when does `Sequence` actually win? | ⭐ |
| 12.10 | Complexity of `ArrayList` vs `LinkedList` vs `HashMap` for insert/lookup/delete — and when does `HashMap` degrade? What breaks if `equals` is implemented without `hashCode`? | ⭐ |
| 12.11 | Why are extension functions statically dispatched, and what surprising behaviour does that cause? | ⭐ |
| 12.12 | Walk through SOLID, one letter at a time, with an example from a real codebase. Why "composition over inheritance", and when is inheritance still the right call? | ⭐ |

---

# Блок 13. Android Platform

Отобрано по принципу «спросят у senior в 2026», а не «есть в учебнике». Первый вопрос — новый, его не было в исходном банке: он актуален прямо сейчас.

| # | Вопрос | Приоритет |
|---|---|---|
| 13.1 | **Google Play requires targetSdk 36 for new apps and updates from 31 August 2026.** What breaks when you bump: edge-to-edge can no longer be opted out of, `onBackPressed()` stops firing, apps on screens 600dp+ can no longer lock orientation or aspect ratio, and 16 KB page-size support is required for native libraries. Walk me through how you'd plan and QA that migration. *(идеальный вопрос для «что ты сделал недавно» — подготовь ответ по ABM)* | ⭐ |
| 13.2 | What is the predictive back gesture, and what does adding proper support to an existing app require? | ⭐ |
| 13.3 | WorkManager vs Foreground Service vs AlarmManager vs JobScheduler — give a decision matrix. How does WorkManager guarantee execution across process death and reboot? | ⭐ |
| 13.4 | What changed with mandatory foreground service types and restricted exact alarms? How do Doze mode and App Standby buckets affect a background sync feature? | ⭐ |
| 13.5 | Deep links vs App Links — how do you verify an App Link, debug failed verification, and prevent deep link hijacking? | ⭐ |
| 13.6 | Runtime permissions: one-time grants, `POST_NOTIFICATIONS`, the photo picker and partial media access. How does the current photo/video model differ from SDK 33? | ⭐ |
| 13.7 | How does the system decide to kill your process? Explain `onTrimMemory` and importance levels. | ⭐ |
| 13.8 | Trace the build pipeline: sources → dex → APK/AAB → install → ART. Where do AOT, JIT and profile-guided compilation fit? | ⭐ |
| 13.9 | Explain Binder IPC. What happens when an `Intent` crosses a process boundary? | ⭐ |
| 13.10 | How would you support a device with no Google Play Services in a banking app? | ⭐ |

---

# Блок 14. Security (fintech)

Не отдельный раунд, но всплывает в system design, в разборе твоего проекта и в вопросах про платёжный флоу. Держи семь заготовленных ответов.

| # | Вопрос | Приоритет |
|---|---|---|
| 14.1 | Where do you store an auth token, and why not in SharedPreferences? | ⭐ |
| 14.2 | The Android Keystore keeps keys inside the TEE or StrongBox — what guarantee do you actually get, and what do you *not*? What does hardware key attestation prove to your backend? | ⭐ |
| 14.3 | `BiometricPrompt` with a `CryptoObject` — why does binding a key to biometrics matter? | ⭐ |
| 14.4 | Pinning can be defeated by hooking on a rooted device — so what is the realistic role of root and hook detection? | ⭐ |
| 14.5 | Walk through a pre-release security checklist: R8, HTTPS-only, `FLAG_SECURE`, `allowBackup`, exported components, no hardcoded secrets, dependency audit. | ⭐ |
| 14.6 | Session management: idle timeout, step-up re-authentication, background screenshot blur. | ⭐ |
| 14.7 | You're reviewing a PR that touches the payments flow. What specifically are you looking for? | ⭐ |

---

# Блок 15. Behavioral

**Не недооценивай этот блок.** У Revolut Bar Raiser — часовой финальный раунд, отдельно сертифицированный интервьюер, который копает **на 2–3 слоя вглубь** по каждому достижению. По опубликованному плейбуку: ждут амбиции, честности, высокого темпа; готовности назвать слабости **с доказательством, что ты над ними работал**; количественных достижений. Тот же интервьюер потом делает reference call по тем же темам — расхождения между твоим рассказом и рефересами видны. Плюс сигнал считается плохим, если текущий работодатель не пытался тебя удержать.

У Monzo — час, два интервьюера, **четыре вопроса** про коммуникацию, обучение, работу в команде и доставку проектов; интервьюеры могут быть не мобильными, поэтому контекст объясняй с нуля. У N26 — оценка по рубрике trade-off между скоростью, безопасностью и качеством.

**Правила:** говори «я», а не «мы» — иначе теряется сигнал о личном вкладе. Держи цифры: ответы без метрик читаются как отсутствие ownership. Шести–восьми историй хватает на всё.

| # | Вопрос | Приоритет |
|---|---|---|
| 15.1 | Tell me about yourself. *(2 минуты, отрепетированные, без филлеров)* | ⭐ |
| 15.2 | **What were your key achievements and your low points in your last role?** *(прямая формулировка из плейбука Bar Raiser — будут копать на 2–3 слоя вглубь по каждому пункту)* | ⭐ |
| 15.3 | Walk me through the most complex feature you shipped end to end. | ⭐ |
| 15.4 | Tell me about a technical decision you later regretted. | ⭐ |
| 15.5 | Tell me about a time you disagreed with your manager or tech lead. | ⭐ |
| 15.6 | Tell me about a production incident you caused or fixed. What changed afterwards? | ⭐ |
| 15.7 | Tell me about delivering with unclear or shifting requirements. | ⭐ |
| 15.8 | Give an example of pushing back on scope or a deadline. | ⭐ |
| 15.9 | Describe convincing others to adopt an approach they initially resisted. | ⭐ |
| 15.10 | Tell me about the largest migration or refactor you led. How did you de-risk it? | ⭐ |
| 15.11 | Tell me about mentoring someone. What concretely changed for them? | ⭐ |
| 15.12 | Tell me about receiving hard feedback — and about a time you were wrong and a colleague was right. | ⭐ |
| 15.13 | Tell me about a metric you moved. How did you measure it? | ⭐ |
| 15.14 | How do you think about the trade-off between shipping speed, security and quality? *(N26 оценивает это по рубрике)* | ⭐ |
| 15.15 | Why are you leaving your current role? Why this company? What does "senior" mean to you beyond writing code? | ⭐ |

**Матрица покрытия.** Проверь, что 6–8 историй закрывают: ownership · conflict · failure · ambiguity · influence · mentorship · prioritization · delivery under pressure · incident response · cross-functional work.

---

# Блок 16. Algorithms

Нужны для Bolt (HackerRank, 1 ч 15, medium–hard, с живым интервьюером) и Big Tech, где мобильные роли оценивают как обычные SWE-позиции. Для европейского финтеха (Revolut, Monzo, N26, Wise) — вторично: там задачи привязаны к банковским сценариям, а не к головоломкам.

**Минимум, а не программа-максимум:**

| # | Задача / паттерн | Приоритет |
|---|---|---|
| 16.1 | Merge Intervals / Meeting Rooms II — и **sweep line**: дан список интервалов доступности водителей, найди момент с максимальным числом доступных. *(реально названная задача с мобильного интервью)* | ⭐ |
| 16.2 | LRU Cache *(пересекается с 2.5 — делай один раз, засчитывается в оба блока)* | ⭐ |
| 16.3 | Top K Frequent Elements / Kth Largest *(heap)* | ⭐ |
| 16.4 | Longest Substring Without Repeating Characters *(sliding window)* | ⭐ |
| 16.5 | Two Sum / Group Anagrams *(hash map)* | ⭐ |
| 16.6 | Binary Search: first/last occurrence + Search in Rotated Sorted Array | ⭐ |
| 16.7 | Number of Islands + Binary Tree Level Order Traversal *(BFS/DFS)* | ⭐ |
| 16.8 | Course Schedule *(topological sort)* + Coin Change *(базовый DP)* | ⭐ |

**Про сложность:** amortized analysis, hash collisions, когда O(n log n) практически лучше O(n), space-time trade-offs.

---

# Блок 17. English + вопросы интервьюеру

Не отдельный раунд, но проверяется во всех. Отрабатывать **вслух**, с диктофоном.

| # | Что нужно уметь произнести | Приоритет |
|---|---|---|
| 17.1 | A two-minute self-introduction, without filler. | ⭐ |
| 17.2 | A three-minute walkthrough of your app's architecture. | ⭐ |
| 17.3 | A three-minute bug-hunt story with a clear resolution. | ⭐ |
| 17.4 | Narrating code while writing it during live coding. *(отдельно тренируй — это неестественно)* | ⭐ |
| 17.5 | Asking for clarification: *"Just to make sure I understand correctly — are you asking about X or Y?"* | ⭐ |
| 17.6 | Buying time: *"Let me think about that for a second."* | ⭐ |
| 17.7 | Disagreeing politely: *"I see it differently, and here's why."* | ⭐ |
| 17.8 | Admitting a gap: *"I haven't worked with that directly, but based on how X works, I'd expect…"* | ⭐ |

**Вопросы, которые задаёшь ты** (Monzo оставляет минимум 5 минут на это в *каждом* интервью — приходи с заготовками):

| # | Вопрос | Приоритет |
|---|---|---|
| 17.9 | What does the mobile release process look like end to end, and how do compliance constraints affect it? | ⭐ |
| 17.10 | How is the codebase modularized, and who owns architecture decisions? What's the current crash-free rate? | ⭐ |
| 17.11 | What's the biggest source of friction for engineers right now, and how is time for tech debt allocated? | ⭐ |
| 17.12 | What would a successful first 90 days look like? How is performance evaluated for senior ICs, and what's the path beyond senior? | ⭐ |

---

# На чём основан отбор

Приоритеты выставлены не «на глаз», а по фактам о процессах целевых компаний, собранным из первичных источников (инженерные блоги компаний, опубликованный плейбук найма) и вторичных (Glassdoor, Blind, отчёты кандидатов, гайды 2026 года).

## Revolut

* Процесс: 5–6 этапов за 3–6 недель. Recruiter screen → online assessment (HackerRank: DS&A, SQL) → **live coding / LLD** → system design → hiring manager → **Bar Raiser**.
* Live coding — самая характерная часть: 45–60 минут, 2–3 задачи подряд, свой IDE, нужно реализовать **работающую** фичу. Код должен быть thread-safe, следовать SOLID, содержать юнит-тесты. Названные задачи: **in-memory load balancer** со стратегиями роутинга, **сервис перевода между счетами** с корректной обработкой конкурентности, **движок конвертации валют**, TinyURL с упором на OOD/TDD/конкурентность.
* **Конкурентность — известный фильтр**, особенно для Java/Kotlin-кандидатов. Большинство кандидатов проваливают live coding, потому что относятся к нему как к спортивному программированию, а не как к инженерной задаче.
* Отчёты Glassdoor на Android-роль: реализовать фичу на Views/XML; объяснить концепции конкурентности и синхронизации; темы «структуры данных, абстракция в Android, интенты, конкурентность». Был также отдельный этап с опросником, который проводил нетехнический человек.
* В system design ценили операционный workflow больше, чем красивую общую диаграмму.
* **Bar Raiser** (июль 2026, опубликованный совместно с QuantumLight плейбук найма): часовой финальный раунд, сертифицированный интервьюер, оценка по true/false скоркарте. Примеры вопросов — про ключевые достижения и низшие точки в последней роли. Копают на 2–3 слоя вглубь. Плюсы: количественные достижения, повышения, готовность назвать слабости с доказательством работы над ними. Минус: отсутствие попыток текущего работодателя удержать. Тот же интервьюер проводит reference-звонки по тем же темам (оценка 0–10, крупнейшее достижение, зоны развития и реакция на фидбэк, взяли бы обратно).
* В плейбуке зафиксировано: если pass rate интервьюера стабильно выше 60%, его переаттестовывают. То есть бар заведомо высокий по дизайну.

## Monzo (единственная компания, публикующая процесс для мобильных ролей)

Из инженерного блога Monzo, «Preparing for Mobile Interviews at Monzo»:

* **Первый звонок:** 1 час с инженером той же роли, **кода не пишешь**. Темы: крупный технический вызов, который ты преодолел; разработка клиентских приложений; работа в кросс-функциональных командах; **убеждение и влияние на стейкхолдеров**. Скорее разговор, чем список вопросов.
* **Take-home:** изменения в **существующем** Android-проекте. В проекте намеренно есть баги, проблемы с качеством кода, недостающие фичи и расхождения с дизайном. Строгий таймбокс — **4 часа**, дедлайна на сдачу нет. Смотрят не только на код, но и на то, **как ты приоритизируешь**, и на дизайнерское чутьё. Потом 45-минутный созвон-разбор: защищать ключевые решения и говорить, что сделал бы иначе при большем времени.
* **Альтернатива take-home:** часовой pair coding — небольшие задачи в проекте, который присылают заранее. Явно сказано: **не тестируют память и скорость**, смотрят на коммуникацию, сотрудничество и владение платформой/тулингом.
* **Behavioural:** 1 час, два интервьюера, **четыре вопроса** — коммуникация, обучение, работа в команде, доставка проектов. Интервьюеры могут не иметь мобильного опыта → давай контекст.
* **Mobile systems design:** 1 час, два мобильных инженера, минимум один твоей специализации. Дают **UI-дизайн и начальные требования**, просят blueprint end-to-end реализации. Кода не пишешь, кроме набросков моделей данных и интерфейсов. Фокус — потоки данных и абстракции. Инструмент — **Excalidraw** (поставь и потренируйся заранее). Ключ к успеху: удерживать общее понимание с интервьюерами и проактивно снимать неоднозначность. Лучше отличный подход, чем учебниковая архитектура.
* Брейнтизеров и квизов на знание нет — заявлено явно.
* В каждом интервью минимум 5 минут на твои вопросы.
* Из отчёта кандидата: интервьюер подробно расспрашивал про архитектуру текущего приложения и заявил, что она выглядит **переусложнённой**. → готовь ответ на «over-engineered».
* В system design у Monzo (не мобильного) кандидаты сообщают, что грилят по concurrency, consistency и network faults, и советуют освежить DDIA.

## N26

* Процесс (отчёт марта 2026): recruiter call → Codility (в основном лёгкие вопросы по Android-разработке и работе с данными) → командная беседа про любимый проект и твой вклад → **system design и live coding**. Кандидат отметил, что срезался именно на последнем этапе.
* Более ранние отчёты: 5–6 раундов за 3–6 недель, take-home Android-приложение с чёткими требованиями, deep dive по своему коду с двумя senior-инженерами (защищать каждое решение), финальное behavioral с оценкой по рубрике trade-off между скоростью, безопасностью и качеством.
* **Реальные причины отказа по take-home** (из отчёта кандидата): неиспользуемые зависимости, неиспользуемые импорты, краш, **использование отдельных LiveData под error / loading / result**, единственный модуль вместо многомодульной структуры. → отсюда ⭐⭐ на вопросы 5.1 и 5.2, и почему в take-home нужен линт-прогон перед отправкой.

## Wise

* Take-home Android-проект + живой разбор решения. По отзыву кандидата, ожидают **больше, чем просто работающее решение с юнит-тестами**. Совет из гайдов: сдавай простой, протестированный, задокументированный код и будь готов расширять его вживую.

## Bolt

* Технический скрин — **алгоритмический**: HackerRank, 1 час 15 минут, medium–hard, с живым интервьюером. Дальше system design и behavioral с hiring manager. Ценят коммуникацию, ownership ошибок и умение просить уточнений — не только правильный ответ.
* Старые Android-отчёты: на live coding спрашивали про communication между Activity и Fragment; архитектуру можно любую, но ждут MVVM.
* → Для Bolt блок 16 поднимается в приоритете; для Revolut/Monzo/N26/Wise он вторичен.

## Big Tech (Google, Meta, Uber, Reddit, Microsoft)

* Консенсус: мобильные роли обрабатывают как обычные SWE-позиции. **LeetCode обязателен** — уровень medium, hard маловероятен. System design критичен.
* Reddit (отчёты senior Android): телефонный скрин в coderpad — LeetCode-подобная задача с ситуационным контекстом плюс быстрые Android-вопросы в начале; онсайт — три алгоритмические задачи с лёгкой стороны medium, Android-специфики почти нет.
* Uber гоняет по алгоритмам от скрина до онсайта: на онсайте две алгоритмические секции и одна Android-специфичная.
* Google Android: в system design бывает и классический клиентский дизайн, и вопросы, требующие знания framework-level API, и замаскированные алгоритмические.
* Отчёт инженера, прошедшего пять L5-собеседований на Android-роли в Airbnb, Amazon, Meta, Microsoft и Doordash: **стандартного процесса нет**, каждая компания ждёт чего-то своего — в отличие от бэкенд-ролей.

## Общий вывод по стратегии

Это **две разные подготовки**:

| | Европейский финтех | Big Tech |
|---|---|---|
| Ядро | Конкурентность + практический код + защита решений | LeetCode medium + mobile system design |
| Блоки-приоритеты | 1, 2, 3, 4, 6 | 16, 6, 3, 9 |
| Формат кода | Работающая фича с тестами в своём IDE | Алгоритм в coderpad |
| Android-специфика | Высокая | Низкая (кроме отдельной секции) |

Твоя цель — Revolut и европейский финтех. Значит порядок инвестирования времени: **1 → 2 → 3 → 4 → 6 → 5 → 7 → 8**, и только потом остальное. Блок 16 (алгоритмы) держи на поддерживающем уровне — 2–3 задачи в неделю, чтобы не остыло, а не как основной трек.

## Технические факты, проверенные при отборе (актуальность на август 2026)

* **targetSdk 36 обязателен** для новых приложений и обновлений в Google Play с 31 августа 2026. Ломается: edge-to-edge больше нельзя отключить (`windowOptOutEdgeToEdgeEnforcement` задеприкейчен и отключён), `onBackPressed()` не вызывается, на экранах от 600dp игнорируются блокировки ориентации и aspect ratio (временный обход — `PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY`), требуется поддержка 16 KB страниц памяти для нативных библиотек.
* **Strong skipping** включён по умолчанию начиная с Compose 1.6–1.7. Все restartable-композаблы становятся skippable независимо от стабильности параметров; unstable-параметры сравниваются по instance equality (`===`), stable — по `equals()`; лямбды с unstable-захватами авто-мемоизируются. Практическое следствие: большая часть ручных `@Stable`/`@Immutable` в кодовых базах стала бесполезной, и на этом ловят тех, кто выучил старые правила. Вопрос 8.3 — про это.
* **One-off events** (навигация, снекбары) остаются открытым спором в комьюнити: `Channel` / `SharedFlow` теряют события, если UI в PAUSED, а часть инженеров Google считает сами one-off events антипаттерном и предлагает поля в state-классе. Сильный ответ на 3.36 = знать все три подхода и их режимы отказа, а не назвать «правильный».
