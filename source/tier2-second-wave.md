# Список 2 — ВТОРАЯ ВОЛНА

**Всё, что не попало в ядро.** Это не «мусор» — это вопросы, которые либо задают реже, либо задают как follow-up внутри тем из Списка 1, либо они узкие/устаревающие, либо дублируют то, что ты уже закроешь.

## Правило использования

> **Не открывай этот файл, пока в Списке 1 остался хоть один 🔴.**

Когда ядро закрыто — работай отсюда по приоритету колонки «Когда». Внутри каждого блока вопросы отсортированы: сверху те, что ближе всего к ядру.

## Что значит колонка «Когда»

| Метка | Смысл |
|---|---|
| **A** | Сразу после ядра. Это почти-ядро: частый follow-up, срезался бы на нём — обидно |
| **B** | Если останется время после A. Полезно, но не решает исход раунда |
| **C** | Только если попал в конкретную компанию, где это профиль (или из интереса) |

## Сводка

| Блок | Тема | Вопросов |
|---|---|---|
| 1 | Coroutines & Flow — второй эшелон | 20 |
| 2 | Compose — внутренности и UI-инженерия | 24 |
| 3 | Kotlin & JVM — второй эшелон | 22 |
| 4 | Concurrency — второй эшелон | 5 |
| 5 | Android Platform | 12 |
| 6 | Architecture & Modularization | 12 |
| 7 | Data, Networking & Offline | 8 |
| 8 | Performance & Memory | 10 |
| 9 | Testing | 4 |
| 10 | Build, CI/CD & Release Engineering | 15 |
| 11 | Security | 8 |
| 12 | Live Coding / LLD — второй эшелон | 15 |
| 13 | Mobile System Design — второй эшелон | 16 |
| 14 | Algorithms — второй эшелон | 12 |
| 15 | Rapid-fire экран | 20 |
| 16 | Behavioral — расширенный | 16 |
| 17 | Вопросы интервьюеру — расширенный | 11 |
| 18 | English | 3 |
| | **Итого** | **233** |

> Списки 1 + 2 = 449 позиций против исходных ~515. Разница — не потеря: часть исходных вопросов схлопнута в объединённые формулировки (например, «`@Stable` vs `@Immutable`» + «что если соврать компилятору» стали одним пунктом), часть дублировалась между Частью 1 и Частью 2 банка, часть касалась API, которые к августу 2026 уже не спрашивают. Ничего содержательного не выброшено.

---

# Блок 1. Coroutines & Flow — второй эшелон

Самый ценный блок Списка 2. Если бы ядро было чуть больше, первые пять пунктов были бы в нём.

| # | Вопрос | Когда |
|---|---|---|
| 1.1 | What happens if you catch and swallow a `CancellationException`? | **A** |
| 1.2 | What happens when an exception is thrown inside `launch` in a `viewModelScope`? Two coroutines are launched in the same scope, the first throws — what happens to the second, and to the scope? | **A** |
| 1.3 | What is the difference between cancelling a `Job` and cancelling its `CoroutineScope`? Can you reuse the scope afterwards? | **A** |
| 1.4 | `SharedFlow` parameters `replay`, `extraBufferCapacity`, `onBufferOverflow` — how do you configure a one-shot event stream? With `extraBufferCapacity = 0` and a slow collector, does `tryEmit` succeed? | **A** |
| 1.5 | How does `StateFlow` conflate, and what bug does that cause with rapid emissions? | **A** |
| 1.6 | `ensureActive()`, `isActive`, `yield()` — what does each actually do? | **A** |
| 1.7 | When is `withContext(NonCancellable)` correct, what is the risk, and does it protect nested `launch` calls from cancellation? | **A** |
| 1.8 | What is a suspension point, and what happens to the call stack when a coroutine suspends? | **B** |
| 1.9 | What are the elements of a `CoroutineContext` and how does `+` combine them? What does a scope do if you pass `Job() + Job() + Job()`? | **B** |
| 1.10 | `runBlocking { launch { println("A") }; println("B") }` — what's the output order and why? | **B** |
| 1.11 | You launch a coroutine in a ViewModel's `init {}` block and the screen is closed immediately. What happens? | **B** |
| 1.12 | `job.cancel()` followed immediately by reading a result — what's the race? | **B** |
| 1.13 | `buffer`, `conflate`, `debounce`, `sample`, `distinctUntilChanged` — semantics and pitfalls. | **B** |
| 1.14 | Fan-out semantics: how do multiple collectors behave on `SharedFlow` vs `Channel`? | **B** |
| 1.15 | What goes wrong if you call `stateIn(GlobalScope)`? | **B** |
| 1.16 | Implement retry with exponential backoff and jitter **over a Flow** (as opposed to a standalone executor). | **B** |
| 1.17 | How do you guarantee ordering when merging two flows that emit at different rates? | **B** |
| 1.18 | How does backpressure in Flow differ from RxJava's model? | **C** |
| 1.19 | `delay(1000)` inside `runTest` — how long does the test actually take, and why? | **C** |
| 1.20 | `coroutineScope { launch { throw E } }` vs `supervisorScope { launch { throw E } }` — what exactly does the *caller* observe? | **C** |

---

# Блок 2. Compose — внутренности и UI-инженерия

Внутренности (слот-таблица, `$composer`) спрашивают реже, чем принято думать: интервьюеру важнее, умеешь ли ты чинить рекомпозицию, чем знаешь ли ты, как устроен компилятор. Но на deep-dive-раунде в компании с большим Compose-кодом — могут.

| # | Вопрос | Когда |
|---|---|---|
| 2.1 | Interop: `AndroidView` and `ComposeView` — how do you migrate a large XML screen incrementally? | **A** |
| 2.2 | How do you test Compose UI (`createComposeRule`, semantics, synchronization)? | **A** |
| 2.3 | How would you build a design system on Compose — tokens, `CompositionLocal`, Material 3 theming? When is `CompositionLocal` appropriate, and why is it not dependency injection? | **A** |
| 2.4 | `mutableStateOf` in the ViewModel vs `StateFlow` — trade-offs. | **A** |
| 2.5 | Why do naive `TextField` implementations lag, and how do you fix input latency? | **A** |
| 2.6 | What makes a type "stable"? How does the compiler infer stability? Why is `List<T>` treated as unstable, and what are your options now that strong skipping exists? | **A** |
| 2.7 | `remember { }` without keys inside a `LazyColumn` item — what breaks when you scroll away and back? | **A** |
| 2.8 | Reading a `State` inside a `Modifier.clickable { }` lambda vs in the composable body — which recomposes? | **A** |
| 2.9 | Does changing an effect's key *always* restart the effect? Name the exception. | **B** |
| 2.10 | What happens if you call a `@Composable` function inside `LaunchedEffect`? | **B** |
| 2.11 | `LaunchedEffect(viewModel)` — is that a sensible key? | **B** |
| 2.12 | What happens if `onDispose {}` inside a `DisposableEffect` throws? | **B** |
| 2.13 | A `Modifier` chain is hoisted into a top-level `val` outside the composable. What's the effect on recomposition? | **B** |
| 2.14 | What happens when you pass a capturing lambda to a composable, and how does `remember` change it? | **B** |
| 2.15 | Why does `Modifier.padding().background()` differ from `background().padding()`? | **B** |
| 2.16 | How do you animate without triggering recomposition (`graphicsLayer`, deferred state reads)? | **B** |
| 2.17 | Your `LazyColumn` items animate incorrectly after a delete. What's the most likely cause? | **B** |
| 2.18 | What does the Compose compiler do to a `@Composable` function — what are `$composer` and `$changed`? | **C** |
| 2.19 | What is the slot table, and how does positional memoization determine composable identity? | **C** |
| 2.20 | How does the snapshot state observation system decide which scopes to invalidate? | **C** |
| 2.21 | How do you write a custom `Layout`? Explain the single-measurement rule. | **C** |
| 2.22 | What is `SubcomposeLayout` and what does it cost? | **C** |
| 2.23 | When do you need intrinsic measurements? | **C** |
| 2.24 | A `ViewModel` obtained inside a `LazyColumn` item — what's the lifecycle, and why is it a bug? | **B** |

---

# Блок 3. Kotlin & JVM — второй эшелон

| # | Вопрос | Когда |
|---|---|---|
| 3.1 | `Serializable` vs `Parcelable` — performance, reflection, and when the difference actually matters. | **A** |
| 3.2 | How do platform types work in Java interop, and where can an NPE still occur in "null-safe" Kotlin? | **A** |
| 3.3 | `lateinit var` accessed before initialization — which exception, and how do you check safely? | **A** |
| 3.4 | `==` vs `===` for two boxed `Int` values of 1000. What's printed, and why does 100 behave differently? | **A** |
| 3.5 | How do Kotlin's `internal` and `public` map to JVM visibility, and why does that matter in a multi-module project? | **A** |
| 3.6 | Abstraction vs encapsulation — explain the difference with an Android example. | **A** |
| 3.7 | Explain the `equals`/`hashCode`/`compareTo` contracts and what breaks when they are inconsistent. | **A** |
| 3.8 | Describe JVM/ART memory regions: heap, stack, metaspace. Where do Kotlin objects live? | **B** |
| 3.9 | How does generational garbage collection work on ART, and how does it differ from HotSpot? | **B** |
| 3.10 | Strong, weak, soft and phantom references — when have you actually needed a `WeakReference`? | **B** |
| 3.11 | How do delegated properties work under the hood (`getValue`, `setValue`, `provideDelegate`)? | **B** |
| 3.12 | What do `@JvmStatic`, `@JvmOverloads`, `@JvmField`, `@JvmName` change? | **B** |
| 3.13 | `const val` vs `val` — difference at compile time and for binary compatibility. | **B** |
| 3.14 | Is `listOf()` immutable? How does it differ from `kotlinx.collections.immutable`? | **B** |
| 3.15 | Why can't a `data class` cleanly participate in inheritance with `equals`? | **B** |
| 3.16 | `copy()` on a data class with a private constructor — what invariant can it break? | **B** |
| 3.17 | How would you design a generic, source-compatible public API for an `api` module consumed by 30 other modules? | **B** |
| 3.18 | What are `expect`/`actual` declarations and how are they compiled in KMP? | **C** |
| 3.19 | What practically changed for your project with the K2 compiler? | **C** |
| 3.20 | What are context parameters / context receivers, and where would you use them? | **C** |
| 3.21 | What is escape analysis, and why can't you rely on it on Android? | **C** |
| 3.22 | What does `@Synchronized` compile to? What is a daemon thread? | **C** |

---

# Блок 4. Concurrency — второй эшелон

Ядро закрывает 12 из 17 вопросов этой темы. Вот остальные.

| # | Вопрос | Когда |
|---|---|---|
| 4.1 | What is thread confinement, and how does it simplify concurrent state? | **A** |
| 4.2 | `CountDownLatch`, `Semaphore`, `CyclicBarrier` — one real use case each. | **A** |
| 4.3 | What is `ThreadLocal` and when have you legitimately needed one? | **B** |
| 4.4 | How does `ReadWriteLock` help, and when does it make things worse? | **B** |
| 4.5 | What is false sharing, and does it matter on mobile? | **C** |

---

# Блок 5. Android Platform

| # | Вопрос | Когда |
|---|---|---|
| 5.1 | Configuration changes beyond rotation: locale, dark mode, font scale, density. What typically breaks? | **A** |
| 5.2 | What is a `PendingIntent`, and why is mutability now explicit? | **A** |
| 5.3 | Accessibility: what does a senior engineer owe here (TalkBack, touch targets, semantics in Compose)? | **A** |
| 5.4 | What is StrictMode and what would you enable in a debug build? | **A** |
| 5.5 | Explicit vs implicit intents, and what changed with package visibility on Android 11+. | **B** |
| 5.6 | Launch modes and task affinity — when do you genuinely need `singleTop` or `singleTask`? | **B** |
| 5.7 | Multi-window and desktop windowing — which assumptions in a typical app break? *(поднимается до **A**, если целишься в компанию с планшетным/foldable трафиком: с targetSdk 36 на экранах 600dp+ блокировки ориентации игнорируются)* | **B** |
| 5.8 | Where should keep rules live for a library module, and why? | **B** |
| 5.9 | App Bundles, dynamic feature modules and Play Feature Delivery — trade-offs. | **B** |
| 5.10 | Notification channels and importance — what control does the user actually have? | **B** |
| 5.11 | Why does the Jetpack Startup library exist, and what problem with `ContentProvider` initialization does it fix? | **C** |
| 5.12 | Per-app language (Android 13+) — how is it implemented and what are the gotchas? | **C** |

---

# Блок 6. Architecture & Modularization

| # | Вопрос | Когда |
|---|---|---|
| 6.1 | What goes into a Gradle convention plugin, and how do version catalogs scale to 100 modules? | **A** |
| 6.2 | How do you run a monolith → modular migration with eight engineers shipping in parallel? | **A** |
| 6.3 | A feature needs data owned by three other features. How do you avoid coupling them? | **A** |
| 6.4 | Repository pattern: what does it own, and what should never live there? | **A** |
| 6.5 | Hilt vs Koin vs manual DI — argue for one in a 100-module banking app. | **A** |
| 6.6 | How do you detect and break a circular module dependency? | **B** |
| 6.7 | How does Hilt handle a multi-module graph, and what is the compile-time cost? | **B** |
| 6.8 | How do you inject into classes you don't construct (`Worker`, `ContentProvider`, `BroadcastReceiver`)? | **B** |
| 6.9 | What is an ADR, and how do you drive an architecture decision across a team that disagrees? | **B** |
| 6.10 | How would you design a design-system module consumed by 15 teams, including a deprecation policy? | **B** |
| 6.11 | Dynamic feature modules vs regular feature modules — trade-offs. | **C** |
| 6.12 | What are the honest trade-offs of KMP for shared business logic in a banking app? | **C** |

---

# Блок 7. Data, Networking & Offline

| # | Вопрос | Когда |
|---|---|---|
| 7.1 | Draw the data flow for Paging 3 with `RemoteMediator`. | **A** |
| 7.2 | DataStore vs SharedPreferences — why is DataStore async, and how do you migrate safely? | **A** |
| 7.3 | Image loading: Coil vs Glide, cache tiers, and what to do about OOM on an image-heavy feed. | **A** |
| 7.4 | Design an offline-first sync layer in detail. What are its failure modes? *(расширение вопроса 6.3 из Списка 1)* | **A** |
| 7.5 | How does Room's invalidation tracker work with Flow, and what does it cost? | **B** |
| 7.6 | HTTP caching with ETag and `Cache-Control` — when do you roll your own cache instead? | **B** |
| 7.7 | How do you make a large file upload survive process death? *(расширение 6.4)* | **B** |
| 7.8 | Design a client-side analytics pipeline with batching, offline buffering and sampling. *(расширение 6.9)* | **B** |

---

# Блок 8. Performance & Memory

| # | Вопрос | Когда |
|---|---|---|
| 8.1 | Which disk/IO operations typically sneak onto the main thread in a real app? | **A** |
| 8.2 | Baseline profiles vs startup profiles — what does each do? | **A** |
| 8.3 | How do you reduce APK/AAB size? Give five concrete levers. | **A** |
| 8.4 | Which metrics belong on a mobile performance dashboard, and which of them gate a release? | **A** |
| 8.5 | Given a heap dump, how do you prove which reference chain retains an Activity? | **B** |
| 8.6 | How much RAM does a 4000×3000 photo cost as a Bitmap, and how do you avoid paying it? | **B** |
| 8.7 | How do you profile and reduce battery drain caused by a sync feature? | **B** |
| 8.8 | How do you find and fix over-recomposition in *production* code (not in a sample)? | **B** |
| 8.9 | AOT vs JIT vs profile-guided compilation on ART — what does each buy you? | **B** |
| 8.10 | How would you cut a six-minute incremental build to under one minute? | **B** |

---

# Блок 9. Testing

| # | Вопрос | Когда |
|---|---|---|
| 9.1 | Robolectric vs instrumented tests — where do you draw the line? | **A** |
| 9.2 | How do you test a feature module in isolation from the rest of a 100-module app? | **A** |
| 9.3 | Screenshot testing: what does it catch, and what does it cost to maintain? | **B** |
| 9.4 | Is contract testing between mobile and backend worth it? Defend your answer. | **B** |

---

# Блок 10. Build, CI/CD & Release Engineering

**Целиком во второй волне.** По отчётам о процессах Revolut / Monzo / N26 / Wise отдельного раунда по билд-инженерии нет. Но вопросы 10.1–10.4 регулярно всплывают как follow-up, когда ты рассказываешь про свой многомодульный проект (см. вопрос 4.4 из Списка 1 — «сколько модулей и какое реальное время сборки»). Поэтому первые четыре — **A**.

| # | Вопрос | Когда |
|---|---|---|
| 10.1 | Staged rollout, kill switches, forced upgrade — how do you halt a bad release? A critical bug is found when the release is 30% rolled out. What do you do? | **A** |
| 10.2 | How do you diagnose a slow build (build scans, `--profile`, task-level timing)? How do you keep CI under 15 minutes for a large app? | **A** |
| 10.3 | How do you set up crash reporting, symbolication and alerting so on-call is actually actionable? | **A** |
| 10.4 | How do you make code review scale (PR size limits, ownership, automated checks)? | **A** |
| 10.5 | Configuration cache vs build cache vs incremental compilation — what does each actually skip? | **B** |
| 10.6 | Why does moving from KAPT to KSP matter for build times? | **B** |
| 10.7 | Product flavors vs build types vs source sets — how do you structure dev/staging/prod? | **B** |
| 10.8 | Trunk-based development vs GitFlow for a mobile app with two-week release trains. | **B** |
| 10.9 | What is your dependency-update policy in a regulated app? | **B** |
| 10.10 | Signing, Play App Signing, and secrets management in CI. | **B** |
| 10.11 | Explain the Gradle build lifecycle: initialization, configuration, execution. | **C** |
| 10.12 | What goes into a convention plugin, and why is it better than `subprojects {}`? | **C** |
| 10.13 | What problems do version catalogs solve at 100 modules, and what do they *not* solve? | **C** |
| 10.14 | How do you enforce a build-time budget as a team policy? | **C** |
| 10.15 | How do you handle a flaky CI suite without disabling tests? | **C** |

---

# Блок 11. Security

| # | Вопрос | Когда |
|---|---|---|
| 11.1 | Which OWASP Mobile Top 10 risks matter most for a banking app, and why? | **A** |
| 11.2 | How do you handle API keys and config in the app — what is the honest answer? | **A** |
| 11.3 | GDPR/PII: what does a mobile engineer owe regarding logging, analytics and data deletion? | **A** |
| 11.4 | How do you audit exported components in a large app? | **B** |
| 11.5 | How do you protect against screen recording and tapjacking/overlay attacks? | **B** |
| 11.6 | What does obfuscation actually protect against, and what does it not? | **B** |
| 11.7 | Give a WebView security checklist. | **C** |
| 11.8 | How do you prevent deep link hijacking? *(частично закрыто вопросом 13.5 Списка 1)* | **C** |

---

# Блок 12. Live Coding / LLD — второй эшелон

Задачи, которые не попали в топ-10 ядра. Формат тот же: **работающий код + тесты + thread safety + таймбокс**.

| # | Задача | Когда |
|---|---|---|
| 12.1 | Debounce and throttle utilities **without using Flow**. | **A** |
| 12.2 | In-memory key-value store with nested transactions (`begin`, `commit`, `rollback`). | **A** |
| 12.3 | Implement a `Result`-like type and a composable pipeline over it. | **A** |
| 12.4 | Repository pagination logic combining a cursor with a local cache. | **A** |
| 12.5 | Pub/sub event bus with backpressure handling. | **A** |
| 12.6 | **Implement a List / dynamic array from scratch**: growth strategy, amortized complexity, iterator, `equals`. *(реальная задача Lyft; для европейского финтеха вторично, для Big Tech — **A**)* | **B** |
| 12.7 | Add pagination with loading/error states to an existing list screen. | **A** |
| 12.8 | Add search with debounce to an existing screen without breaking rotation behaviour. | **A** |
| 12.9 | A screen re-fetches data on every rotation. Fix it, then explain what you changed and why. | **A** |
| 12.10 | Take a screen with a leaking listener and fix the leak; **prove** the fix. | **A** |
| 12.11 | Given failing tests, make them pass without changing the tests. | **B** |
| 12.12 | Add unit tests to an untested ViewModel; then refactor it to make the tests simpler. | **B** |
| 12.13 | A `RecyclerView`/`LazyColumn` janks while scrolling. Profile it and fix it live. | **B** |
| 12.14 | Streaming CSV transaction parser with error accumulation instead of fail-fast. | **B** |
| 12.15 | Booking / parking-lot system (classic OOD) made concurrency-safe. | **C** |

---

# Блок 13. Mobile System Design — второй эшелон

| # | Задача | Когда |
|---|---|---|
| 13.1 | Design a shared caching layer used by every feature in a modular app. | **A** |
| 13.2 | Design in-app search with typeahead over local and remote data. | **A** |
| 13.3 | Design "download for offline" for media, with expiry. | **A** |
| 13.4 | Design an offline-first notes app with multi-device sync. | **A** |
| 13.5 | Migrate a legacy monolithic app to a modular structure — plan it **as a design problem**, not as a refactor. | **A** |
| 13.6 | Design a client-side A/B testing framework. | **B** |
| 13.7 | Design a payments SDK embedded by third-party apps. | **B** |
| 13.8 | Design an image-loading library from scratch. | **B** |
| 13.9 | Design a ride-hailing client: live location, ETA, trip state machine. | **B** |
| 13.10 | A feature telling drivers which part of the city has the highest demand — **design the server API first, then the client architecture.** *(реальная задача Lyft; тренирует навык «и клиент, и контракт»)* | **B** |
| 13.11 | Design the Robinhood app. | **B** |
| 13.12 | Design Instagram Stories. | **C** |
| 13.13 | Design Slack chat. | **C** |
| 13.14 | Design a photo streaming app. | **C** |
| 13.15 | Design a ride-sharing service between three buildings on a campus. | **C** |
| 13.16 | Design a JIRA-like app for planning family and neighbourhood events. *(реально задавали на Google Android)* | **C** |

---

# Блок 14. Algorithms — второй эшелон

Если целишься только в европейский финтех — весь блок **C**. Если добавляешь Bolt или Big Tech — 14.1–14.6 становятся **A**.

| # | Задача | Когда |
|---|---|---|
| 14.1 | Valid Parentheses / Min Stack *(stack design)* | **B** |
| 14.2 | Product of Array Except Self *(prefix/suffix)* | **B** |
| 14.3 | Three Sum *(two pointers)* | **B** |
| 14.4 | Validate BST + Lowest Common Ancestor | **B** |
| 14.5 | Merge k Sorted Lists *(heap)* | **B** |
| 14.6 | House Robber *(DP)* | **B** |
| 14.7 | Add two binary strings *(реально задавали на мобильном интервью)* | **B** |
| 14.8 | Flatten a nested structure — iterator design | **B** |
| 14.9 | Parse and evaluate a simple expression | **C** |
| 14.10 | Amortized analysis: объяснить на примере динамического массива | **B** |
| 14.11 | Hash collisions: что происходит и когда `HashMap` деградирует | **B** |
| 14.12 | When is O(n log n) better than O(n) in practice? Space-time trade-offs. | **B** |

---

# Блок 15. Rapid-fire экран

Блок коротких вопросов бывает в начале телефонного скрина (подтверждено отчётами по Reddit: «Android rapid fire questions в начале, потом LeetCode»). Ответ — **2–3 предложения, без «ну, это когда…»**.

**Это дешёвый блок.** Один вечер прогона вслух закрывает его целиком. Сделай это в последнюю неделю перед первым собеседованием, а не сейчас.

| # | Вопрос | Когда |
|---|---|---|
| 15.1 | What's the difference between a process and a thread on Android? | **A** |
| 15.2 | `Service` vs `IntentService` vs `WorkManager` — one sentence each. | **A** |
| 15.3 | What is `minSdk` vs `targetSdk` vs `compileSdk`? | **A** |
| 15.4 | What is an `AAB` and how does it differ from an `APK`? | **A** |
| 15.5 | What is a memory leak, in one sentence? | **A** |
| 15.6 | What is `dp` vs `sp` vs `px`? | **A** |
| 15.7 | What is the difference between an abstract class and an interface in Kotlin? | **A** |
| 15.8 | `HashMap` vs `LinkedHashMap` vs `TreeMap`? | **A** |
| 15.9 | What is the difference between `Iterable` and `Sequence`? | **A** |
| 15.10 | What is `Parcelable` and why is it faster than `Serializable`? | **A** |
| 15.11 | What is a `BroadcastReceiver` and what changed with implicit broadcasts? | **B** |
| 15.12 | What is the difference between `commit()` and `apply()`? | **B** |
| 15.13 | What is a `Fragment` back stack, and what is `addToBackStack(null)` doing? | **B** |
| 15.14 | What is `ViewHolder` and why does `RecyclerView` need it? | **B** |
| 15.15 | `View.GONE` vs `INVISIBLE` — what's the layout cost? | **B** |
| 15.16 | What is a `ContentProvider` used for today? | **B** |
| 15.17 | What is tail recursion and does Kotlin optimise it? | **B** |
| 15.18 | What is a daemon thread? | **C** |
| 15.19 | What is a sticky intent, and why is it discouraged? | **C** |
| 15.20 | What does `@Synchronized` compile to? | **C** |

---

# Блок 16. Behavioral — расширенный

Ядро закрывает 15 вопросов через 6–8 историй. Эти — те же истории под другими углами. Проверь, что каждая заготовленная история отвечает минимум на три вопроса отсюда — тогда блок закрыт без отдельной подготовки.

| # | Вопрос | Когда |
|---|---|---|
| 16.1 | Describe your role in a cross-functional project with design, backend and compliance. | **A** |
| 16.2 | Tell me about working in a legacy codebase you didn't write. How do you onboard onto an unfamiliar codebase? | **A** |
| 16.3 | Tell me about something you shipped that you weren't proud of. | **A** |
| 16.4 | Describe a time you had to say no. | **A** |
| 16.5 | Tell me about a time you used data to make a decision. | **A** |
| 16.6 | How do you operate under high ambiguity and high pace? | **A** |
| 16.7 | Describe taking ownership of something outside your remit. | **A** |
| 16.8 | How do you handle a teammate who consistently submits low-quality PRs? | **B** |
| 16.9 | Describe disagreeing with a product decision. | **B** |
| 16.10 | Tell me about a calculated risk you took. | **B** |
| 16.11 | Describe moving fast and breaking something. How do you balance it now? | **B** |
| 16.12 | Tell me about improving a process rather than a product. | **B** |
| 16.13 | What's the most interesting bug you've ever debugged? *(во многом дубль 4.7 из Списка 1 — переиспользуй ту же историю)* | **B** |
| 16.14 | How do you keep up with the Android ecosystem? | **B** |
| 16.15 | Where do you want to be in three years? | **B** |
| 16.16 | Tell me about trading off quality against speed. *(дубль 15.14 из Списка 1)* | **C** |

---

# Блок 17. Вопросы интервьюеру — расширенный

Ядро даёт четыре сгруппированных вопроса — этого хватает. Здесь остальные, на случай, когда у тебя несколько раундов подряд и нужны разные вопросы для разных людей.

| # | Вопрос | Кому задавать |
|---|---|---|
| 17.1 | How much of the app is Compose vs Views? What's the migration state? | инженеру |
| 17.2 | What does on-call look like for mobile engineers? | инженеру |
| 17.3 | What's the testing culture — coverage, e2e, manual QA? | инженеру |
| 17.4 | How does the team resolve technical disagreements in practice? | инженеру |
| 17.5 | What's the team's biggest technical challenge in the next six months? | инженеру / EM |
| 17.6 | How do product and engineering split ownership of "what" vs "how"? | EM |
| 17.7 | Why is this role open? | EM / рекрутеру |
| 17.8 | How is the team structured, and who would I work with day to day? | EM |
| 17.9 | What does the mobile platform team own, and how do feature teams interact with it? | EM |
| 17.10 | How do you decide what goes into the app vs the backend? | инженеру |
| 17.11 | What's the app's crash-free rate trend over the last year, and what drove it? | инженеру |

---

# Блок 18. English

| # | Что нужно уметь произнести | Когда |
|---|---|---|
| 18.1 | Explaining a technical trade-off to a **non-technical stakeholder**. *(поднимается до **A** для Monzo: там в behavioural-раунде интервьюеры могут не иметь мобильного опыта)* | **B** |
| 18.2 | Small talk at the start and a graceful close at the end. | **B** |
| 18.3 | Спрашивать про процесс, дедлайны и следующие шаги, не звуча тревожно. | **B** |

---

# Приложение: что было выброшено полностью и почему

Ничего из исходного банка не удалено без причины. Ниже — единственные категории, которые не вошли ни в один из двух списков:

1. **Мета-советы (раздел G исходной Части 2).** Это не вопросы, а правила поведения. Они перенесены в раздел «На чём основан отбор» Списка 1, где им место — рядом с доказательствами.
2. **Каркас ответа для system design (раздел 12 исходной Части 1).** Перенесён целиком в блок 6 Списка 1 как инструмент, а не как вопрос.
3. **Матрица покрытия behavioral-историй.** Перенесена в блок 15 Списка 1.
4. **Дубли между Частью 1 и Частью 2 исходного банка.** Например, «`transfer` между счетами» встречался и в разделе 3, и в разделе 13, и в разделе A; «утечка через статический `Handler`» пересекалась с «синглтон держит Activity Context». Схлопнуто в одну формулировку с сохранением всех follow-up.
