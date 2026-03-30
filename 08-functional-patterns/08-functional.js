// ============================================================
// 08 - FUNCTIONAL PATTERNS IN JAVASCRIPT
// ============================================================
// Functional programming (FP) treats computation as the
// evaluation of mathematical functions. Key principles:
// - Pure functions (same input → same output, no side effects)
// - Immutability (don't mutate, create new)
// - Function composition (build complex behavior from simple parts)
// - Declarative style (say WHAT, not HOW)
//
// JavaScript isn't a pure FP language but supports FP patterns
// beautifully. You don't have to go "full FP" — cherry-picking
// the good parts makes your code cleaner and more testable.
// ============================================================


// ─────────────────────────────────────────────────────────────
// PURE FUNCTIONS: The Foundation
// ─────────────────────────────────────────────────────────────

// Impure — depends on external state, modifies external state
let total = 0;
function addToTotal(n) {
  total += n;   // mutates external state
  return total; // result depends on external state
}

// Pure — same input always gives same output, no side effects
function add(a, b) { return a + b; }  // pure!
function double(n) { return n * 2; }  // pure!
function formatName(first, last) { return `${first} ${last}`; }  // pure!

// Benefits of pure functions:
// ✅ Easy to test (just assert input/output)
// ✅ Easy to reason about
// ✅ Safe to run in parallel
// ✅ Can be memoized
// ✅ Composable

// Keeping functions pure with immutability
// Impure (mutates array):
function addItemBad(cart, item) {
  cart.push(item);   // mutates the original!
  return cart;
}

// Pure (returns new array):
function addItem(cart, item) {
  return [...cart, item];  // new array, original unchanged
}

// Impure (mutates object):
function updatePriceBad(product, price) {
  product.price = price;  // mutates original!
  return product;
}

// Pure (returns new object):
function updatePrice(product, price) {
  return { ...product, price };  // new object, original unchanged
}


// ─────────────────────────────────────────────────────────────
// IMMUTABILITY PATTERNS
// ─────────────────────────────────────────────────────────────

// Immutable array operations
const arr = [1, 2, 3, 4, 5];
const addEnd   = [...arr, 6];          // add to end
const addStart = [0, ...arr];          // add to start
const addAt    = [...arr.slice(0, 2), 99, ...arr.slice(2)]; // add at index
const removeAt = arr.filter((_, i) => i !== 2); // remove index 2
const updateAt = arr.map((v, i) => i === 2 ? 99 : v); // update index 2
const withMethod = arr.with(2, 99);   // ES2023 native non-mutating update

// Immutable object operations
const obj = { a: 1, b: 2, c: { d: 3 } };
const added   = { ...obj, e: 5 };          // add property
const updated = { ...obj, b: 99 };         // update property
const removed = (({ b, ...rest }) => rest)(obj); // remove property 'b'

// Deep update (preserve immutability at every level)
const state = {
  user: { name: "Alice", settings: { theme: "dark" } }
};
const newState = {
  ...state,
  user: {
    ...state.user,
    settings: { ...state.user.settings, theme: "light" }
  }
};

// For deeply nested immutable updates, consider immer.js:
// const newState = produce(state, draft => {
//   draft.user.settings.theme = "light"; // looks like mutation, is immutable!
// });


// ─────────────────────────────────────────────────────────────
// FUNCTION COMPOSITION
// ─────────────────────────────────────────────────────────────

// Compose: f(g(x)) — apply right to left
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);

// Pipe: same as compose but left to right (more readable)
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);

// Simple utility functions
const trim       = str => str.trim();
const lowercase  = str => str.toLowerCase();
const replace    = (from, to) => str => str.replace(new RegExp(from, "g"), to);
const split      = sep => str => str.split(sep);
const join       = sep => arr => arr.join(sep);

// Compose them into a pipeline
const toSlug = pipe(
  trim,
  lowercase,
  replace("\\s+", "-"),
  replace("[^a-z0-9-]", "")
);

console.log(toSlug("  Hello World!!  ")); // "hello-world"
console.log(toSlug("My Blog Post Title")); // "my-blog-post-title"


// ─────────────────────────────────────────────────────────────
// POINT-FREE STYLE: Describe Transformations Without Data
// ─────────────────────────────────────────────────────────────

const people = [
  { name: "Alice", age: 30, active: true },
  { name: "Bob",   age: 17, active: false },
  { name: "Carol", age: 25, active: true },
];

// Point-free helpers
const prop  = key => obj => obj[key];
const gt    = n => x => x > n;
const eq    = x => y => y === x;
const not   = fn => (...args) => !fn(...args);
const both  = (f, g) => x => f(x) && g(x);

const isActive = prop("active");
const getAge   = prop("age");
const getName  = prop("name");
const isAdult  = pipe(getAge, gt(17));

// Now filter/map reads like a description:
const activeAdults = people
  .filter(both(isActive, isAdult))
  .map(getName);

console.log(activeAdults); // ["Alice", "Carol"]


// ─────────────────────────────────────────────────────────────
// TRANSDUCERS: Efficient Pipelines
// ─────────────────────────────────────────────────────────────
// Multiple map/filter passes create intermediate arrays.
// Transducers compose transformations into a SINGLE pass.

// Normal: creates [filtered], then [mapped] — 2 arrays
const normal = [1,2,3,4,5,6,7,8,9,10]
  .filter(n => n % 2 === 0)  // [2,4,6,8,10]
  .map(n => n * n);           // [4,16,36,64,100]

// Transducer: single reduce pass — no intermediate arrays
const filterEven = (reducer) => (acc, x) => x % 2 === 0 ? reducer(acc, x) : acc;
const mapSquare  = (reducer) => (acc, x) => reducer(acc, x * x);
const append     = (acc, x) => [...acc, x];

const transduced = [1,2,3,4,5,6,7,8,9,10].reduce(
  filterEven(mapSquare(append)),
  []
); // [4, 16, 36, 64, 100] — one pass!


// ─────────────────────────────────────────────────────────────
// MONADS (light introduction): Handling Uncertainty Safely
// ─────────────────────────────────────────────────────────────
// You already use monads — Promise is a monad!
// Monads wrap values and provide a way to chain operations
// while handling the "wrapper context" (async, nullable, error)

// Maybe monad — handles null/undefined safely
class Maybe {
  constructor(value) { this._value = value; }

  static of(value) { return new Maybe(value); }
  static empty()   { return new Maybe(null); }

  isNothing() { return this._value === null || this._value === undefined; }

  map(fn) {
    return this.isNothing() ? Maybe.empty() : Maybe.of(fn(this._value));
  }

  flatMap(fn) {
    return this.isNothing() ? Maybe.empty() : fn(this._value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this._value;
  }

  toString() { return this.isNothing() ? "Maybe(Nothing)" : `Maybe(${this._value})`; }
}

// Safely chain operations that might return null
const user = { profile: { address: { city: "NYC" } } };
const nullUser = null;

const city = Maybe.of(user)
  .map(u => u.profile)
  .map(p => p.address)
  .map(a => a.city)
  .getOrElse("Unknown");

const city2 = Maybe.of(nullUser)
  .map(u => u.profile) // won't execute — value is null
  .map(p => p.address) // won't execute
  .map(a => a.city)    // won't execute
  .getOrElse("Unknown"); // "Unknown"

console.log(city);  // "NYC"
console.log(city2); // "Unknown"  — no TypeError!

// Result/Either monad — handles errors without exceptions
class Result {
  static ok(value)    { return { ok: true,  value }; }
  static err(error)   { return { ok: false, error }; }

  static map(result, fn) {
    return result.ok ? Result.ok(fn(result.value)) : result;
  }

  static flatMap(result, fn) {
    return result.ok ? fn(result.value) : result;
  }
}

function divide(a, b) {
  if (b === 0) return Result.err("Division by zero");
  return Result.ok(a / b);
}

function sqrt(n) {
  if (n < 0) return Result.err("Cannot sqrt negative number");
  return Result.ok(Math.sqrt(n));
}

const result = Result.flatMap(
  Result.flatMap(divide(100, 4), sqrt),
  n => Result.ok(n.toFixed(2))
);

console.log(result); // { ok: true, value: "5.00" }

const badResult = Result.flatMap(divide(10, 0), sqrt);
console.log(badResult); // { ok: false, error: "Division by zero" }


// ─────────────────────────────────────────────────────────────
// PRACTICAL FUNCTIONAL PATTERNS
// ─────────────────────────────────────────────────────────────

// tap: perform a side effect in a pipeline without changing the value
const tap = fn => x => { fn(x); return x; };

const result2 = [1, 2, 3, 4, 5]
  .filter(n => n % 2 === 0)
  .map(tap(n => console.log(`Processing: ${n}`))) // log but don't change
  .map(n => n * n);

// memoize: cache pure function results
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

const fibonacci = memoize(n => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2));
console.log(fibonacci(40)); // instant after first call

// once: only execute once
const once = fn => {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
};

const initialize = once(() => {
  console.log("Initialized!");
  return { ready: true };
});

initialize(); // "Initialized!"
initialize(); // (nothing — returns same result)
initialize(); // (nothing — returns same result)

// debounce and throttle — time-based function control
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn(...args);
    }
  };
}

// Search input — only fires after typing stops for 300ms
const handleSearch = debounce(query => fetch(`/search?q=${query}`), 300);

// Scroll handler — fires at most once per 100ms
const handleScroll = throttle(() => updateNavbar(), 100);
