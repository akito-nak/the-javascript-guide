// ============================================================
// 09 - THE EVENT LOOP
// ============================================================
// This is the concept that confuses JavaScript developers the
// most — and the one that explains almost everything weird
// about async behavior.
//
// JavaScript is SINGLE-THREADED. One thread. One call stack.
// One operation at a time. So how does it handle async work
// without freezing?
//
// The answer: the Event Loop, Call Stack, Web APIs (or Node APIs),
// the Callback/Task Queue, and the Microtask Queue all working
// together in a carefully orchestrated dance.
// ============================================================


// ─────────────────────────────────────────────────────────────
// THE CAST OF CHARACTERS
// ─────────────────────────────────────────────────────────────

/*
  ┌─────────────────────────────────────────────────────────┐
  │                   JavaScript Engine                     │
  │                                                         │
  │  ┌──────────────┐    ┌──────────────────────────────┐  │
  │  │  Call Stack  │    │          Memory Heap         │  │
  │  │  (execution) │    │      (object allocation)     │  │
  │  └──────────────┘    └──────────────────────────────┘  │
  └─────────────────────────────────────────────────────────┘
           │
           │ offloads async work to:
           ▼
  ┌─────────────────────────────────────────────────────────┐
  │            Web APIs (Browser) / C++ APIs (Node)         │
  │                                                         │
  │   setTimeout   fetch   DOM events   File I/O    etc.    │
  └─────────────────────────────────────────────────────────┘
           │
           │ when done, sends callback to:
           ▼
  ┌──────────────────┐    ┌──────────────────┐
  │   Microtask      │    │   Macrotask       │
  │   Queue          │    │   Queue           │
  │                  │    │                   │
  │  Promise .then() │    │  setTimeout       │
  │  queueMicrotask  │    │  setInterval      │
  │  MutationObserver│    │  I/O callbacks    │
  │                  │    │  setImmediate*    │
  └──────────────────┘    └──────────────────┘
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │     Event Loop      │
           │                     │
           │  1. Run current JS  │
           │  2. Drain microtasks│ ← ALL of them, before anything else
           │  3. Run ONE macrotask│
           │  4. Drain microtasks│ ← again
           │  5. Repeat          │
           └─────────────────────┘
*/


// ─────────────────────────────────────────────────────────────
// THE CALL STACK
// ─────────────────────────────────────────────────────────────
// The call stack tracks function calls.
// When a function is called, a frame is pushed.
// When it returns, the frame is popped.
// Stack overflow happens when there are too many frames.

function third() {
  console.log("Third function");
  // Stack at this point: main → first → second → third
}

function second() {
  third();
}

function first() {
  second();
}

first();
// Stack grows: [] → [first] → [first, second] → [first, second, third]
// Then shrinks: [first, second] → [first] → []

// Stack overflow:
// function infinite() { return infinite(); }
// infinite(); // Uncaught RangeError: Maximum call stack size exceeded


// ─────────────────────────────────────────────────────────────
// PROVING THE EVENT LOOP: A Visual Demo
// ─────────────────────────────────────────────────────────────

console.log("═══ Event Loop Demo ═══");
console.log("A: Script start");   // 1. runs immediately

setTimeout(() => console.log("B: setTimeout 0ms"), 0);  // goes to macrotask queue
setTimeout(() => console.log("C: setTimeout 100ms"), 100); // goes to macrotask queue

Promise.resolve()
  .then(() => console.log("D: Promise 1"))    // goes to microtask queue
  .then(() => console.log("E: Promise 2"))    // chained microtask
  .then(() => console.log("F: Promise 3"));

queueMicrotask(() => console.log("G: queueMicrotask")); // goes to microtask queue

Promise.resolve()
  .then(() => console.log("H: Promise 4"));  // another microtask

console.log("I: Script end");  // 2. runs immediately

/*
  Output order (and WHY):

  A: Script start       ← synchronous, runs first
  I: Script end         ← synchronous, runs second (before ANY async!)

  ---- Call stack is now empty → Event Loop kicks in ----

  D: Promise 1          ← microtask queue starts draining...
  G: queueMicrotask     ← ...
  H: Promise 4          ← ...
  E: Promise 2          ← D's .then() created E, now it runs
  F: Promise 3          ← E's .then() created F, now it runs

  ---- Microtask queue empty → pick ONE macrotask ----

  B: setTimeout 0ms     ← first macrotask from queue

  ---- Drain microtasks again (none) → pick next macrotask ----

  C: setTimeout 100ms   ← second macrotask (after 100ms)

  Key insight: ALL microtasks run before ANY macrotask.
  And new microtasks added DURING microtask processing run IMMEDIATELY.
*/


// ─────────────────────────────────────────────────────────────
// MICROTASKS vs MACROTASKS: The Practical Difference
// ─────────────────────────────────────────────────────────────

// Microtasks (run immediately after current task, before any macrotask):
//   Promise .then() / .catch() / .finally()
//   async/await (which is Promise under the hood)
//   queueMicrotask()
//   MutationObserver callbacks

// Macrotasks (one per event loop iteration):
//   setTimeout / setInterval
//   I/O callbacks (file reads, network)
//   setImmediate (Node.js)
//   requestAnimationFrame (browser)
//   UI rendering (browser)
//   HTML parsing

// Why does this matter in practice?
async function demo() {
  console.log("Start of async function"); // synchronous

  await Promise.resolve(); // suspends, queues continuation as microtask

  console.log("After first await"); // microtask — runs before any setTimeout

  setTimeout(() => console.log("setTimeout inside async"), 0); // macrotask

  await Promise.resolve(); // suspend again

  console.log("After second await"); // another microtask
}

console.log("Before async call");
demo();
console.log("After async call"); // runs before "After first await"!

/*
  Output:
  Before async call
  Start of async function    ← sync part of async function
  After async call           ← sync code continues after first await
  After first await          ← microtask resumes
  After second await         ← microtask resumes again
  setTimeout inside async    ← macrotask runs last
*/


// ─────────────────────────────────────────────────────────────
// BLOCKING THE EVENT LOOP: The Cardinal Sin
// ─────────────────────────────────────────────────────────────
// If your synchronous code runs for too long, NOTHING ELSE happens.
// No UI updates, no response to clicks, no other async callbacks.

// This blocks for 3 seconds — terrible in a browser
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Spinning. Nothing else can run during this time.
  }
  return "Done blocking";
}
// blockingOperation(); // DON'T run this — it would freeze everything

// Instead: break long work into chunks
function processInChunks(items, processFn, chunkSize = 100) {
  return new Promise(resolve => {
    let index = 0;
    const results = [];

    function processNextChunk() {
      const end = Math.min(index + chunkSize, items.length);
      while (index < end) {
        results.push(processFn(items[index]));
        index++;
      }

      if (index < items.length) {
        // Yield to the event loop by scheduling next chunk as a macrotask
        setTimeout(processNextChunk, 0); // "0ms" but still yields!
      } else {
        resolve(results);
      }
    }

    processNextChunk();
  });
}

// Or use requestIdleCallback in browsers — runs when browser is idle
// requestIdleCallback(deadline => {
//   while (deadline.timeRemaining() > 0 && hasMoreWork()) {
//     doSmallChunk();
//   }
// });


// ─────────────────────────────────────────────────────────────
// STARVATION: When Microtasks Go Wrong
// ─────────────────────────────────────────────────────────────
// Remember: ALL microtasks drain before ANY macrotask runs.
// If you keep adding microtasks, macrotasks never run!

function microtaskFlood() {
  function recurse() {
    // This adds a new microtask, which adds another microtask, ad infinitum
    Promise.resolve().then(recurse);
  }
  recurse();
  // setTimeout never fires because microtask queue never empties!
  setTimeout(() => console.log("This will never run"), 0);
}
// microtaskFlood(); // DON'T run — would hang

// Contrast with setTimeout recursion (which is fine):
function recurseViaMacrotask() {
  setTimeout(recurseViaMacrotask, 0);
  // Each call yields to the event loop, allowing other work to run between calls
}


// ─────────────────────────────────────────────────────────────
// setTimeout(fn, 0) — THE GREAT MISCONCEPTION
// ─────────────────────────────────────────────────────────────
// setTimeout with 0ms delay does NOT run immediately.
// It says "run this in the NEXT macrotask cycle, minimum delay 0ms".
// But the actual delay is:
// - Browser: minimum 4ms (HTML spec requirement for nested timeouts)
// - Node.js: approximately 1ms

console.log("before setTimeout");
setTimeout(() => console.log("inside setTimeout"), 0);
console.log("after setTimeout");
// Output: before → after → inside (NOT before → inside → after)

// Real use cases for setTimeout(fn, 0):
// 1. Defer work to after current rendering in browser
// 2. Let the call stack clear before running something
// 3. Allow DOM to update before accessing measurements
// 4. Break up a long synchronous task

// Example: update the DOM, then measure it
// function measureAfterUpdate() {
//   element.style.height = "auto"; // DOM change queued
//   setTimeout(() => {
//     const height = element.offsetHeight; // measured AFTER DOM paint
//   }, 0);
// }


// ─────────────────────────────────────────────────────────────
// setInterval: recurring work
// ─────────────────────────────────────────────────────────────

let ticks = 0;
const intervalId = setInterval(() => {
  ticks++;
  console.log(`Tick ${ticks}`);
  if (ticks >= 3) {
    clearInterval(intervalId); // ALWAYS store the ID and clear when done
    console.log("Stopped");
  }
}, 500);

// Problem: setInterval doesn't account for execution time of the callback
// If your callback takes 400ms and interval is 500ms, you only get 100ms rest!

// Better for recurring tasks where timing matters:
function reliableInterval(fn, delay) {
  let start = Date.now();

  function tick() {
    fn();
    const elapsed = Date.now() - start;
    const drift = elapsed % delay;
    setTimeout(tick, delay - drift); // adjust for drift
    start = Date.now();
  }

  setTimeout(tick, delay);
}


// ─────────────────────────────────────────────────────────────
// CONCURRENCY PATTERNS
// ─────────────────────────────────────────────────────────────

// Sequential — one after another
async function sequential(ids) {
  const results = [];
  for (const id of ids) {
    results.push(await fetchUser(id)); // waits for each before starting next
  }
  return results;
}

// Parallel — all at once
async function parallel(ids) {
  return Promise.all(ids.map(id => fetchUser(id))); // all start simultaneously
}

// Parallel with limit (concurrency control)
async function parallelLimited(ids, limit = 3) {
  const results = [];
  for (let i = 0; i < ids.length; i += limit) {
    const batch = ids.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(id => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}

// Race with fallback
async function fetchWithFallback(primaryUrl, fallbackUrl) {
  try {
    const result = await Promise.race([
      fetch(primaryUrl).then(r => r.json()),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000))
    ]);
    return result;
  } catch {
    console.log("Primary failed, trying fallback...");
    return fetch(fallbackUrl).then(r => r.json());
  }
}

// Simulate fetchUser for examples above
function fetchUser(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id, name: `User ${id}` }), 50)
  );
}


// ─────────────────────────────────────────────────────────────
// ADVANCED: Scheduling and Prioritization
// ─────────────────────────────────────────────────────────────

// queueMicrotask — lower-level than Promise, useful for scheduling
// Runs ASAP in the microtask queue
queueMicrotask(() => {
  console.log("This runs before any macrotask");
});

// Node.js-specific: setImmediate vs process.nextTick
// process.nextTick: runs BEFORE any I/O, even before Promises
// setImmediate: runs AFTER I/O callbacks in the current iteration

// process.nextTick(callback); // Node.js only
// setImmediate(callback);     // Node.js only

// In the browser, you can approximate with:
const asap = typeof process !== "undefined"
  ? process.nextTick
  : queueMicrotask;


// ─────────────────────────────────────────────────────────────
// MEMORY AND THE EVENT LOOP: Avoiding Leaks
// ─────────────────────────────────────────────────────────────

// Closures in async code can capture references and prevent GC
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.cleanup = null;
  }

  start() {
    // LEAKY: stores a reference that keeps this object alive
    this.cleanup = setInterval(() => {
      this.checkResources(); // 'this' prevents GC of ResourceManager
    }, 1000);
  }

  stop() {
    // IMPORTANT: always clear intervals/timeouts when done
    clearInterval(this.cleanup);
    this.cleanup = null;
  }

  checkResources() {
    // ... cleanup expired resources
  }
}

const manager = new ResourceManager();
manager.start();
// manager.stop(); // Call this when done! Otherwise interval runs forever.
