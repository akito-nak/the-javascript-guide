// ============================================================
// 06 - ES6+ AND MODERN JAVASCRIPT
// ============================================================
// ES6 (2015) was the biggest update to JavaScript ever.
// It transformed how we write JS. Every year since, new features
// have been added. This chapter covers the modern features
// every JavaScript developer needs in their toolkit.
// ============================================================

// ─────────────────────────────────────────────────────────────
// SYMBOLS: Unique Identifiers
// ─────────────────────────────────────────────────────────────

const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false — every Symbol is unique!

const ID = Symbol("id");
const user = {
  [ID]: "usr-123",  // computed property with symbol key
  name: "Alice",
};
console.log(user[ID]);   // "usr-123"
console.log(user.name);  // "Alice"
// Symbol keys don't appear in for...in or Object.keys()
// They're "semi-private" properties

// Well-known symbols — customize built-in behavior
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {           // make Range iterable!
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
}

for (const n of new Range(1, 5)) console.log(n); // 1 2 3 4 5
console.log([...new Range(10, 15)]); // [10, 11, 12, 13, 14, 15]


// ─────────────────────────────────────────────────────────────
// PROXY: Intercept Object Operations
// ─────────────────────────────────────────────────────────────
// Proxy wraps an object and lets you intercept and customize
// operations like get, set, delete, function calls.

const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} = ${value}`);
    if (typeof value !== "number") throw new TypeError("Must be a number!");
    return Reflect.set(target, prop, value, receiver);
  },
};

const reactive = new Proxy({}, handler);
reactive.x = 10;  // "Setting x = 10"
reactive.x;       // "Getting x"

// Validation proxy
function createValidator(target, rules) {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (rules[prop]) {
        const error = rules[prop](value);
        if (error) throw new Error(error);
      }
      obj[prop] = value;
      return true;
    }
  });
}

const person = createValidator({}, {
  age: v => v < 0 ? "Age cannot be negative" : null,
  email: v => !v.includes("@") ? "Invalid email" : null,
});
person.age   = 25;          // ✅
// person.age = -5;         // ❌ throws "Age cannot be negative"


// ─────────────────────────────────────────────────────────────
// REFLECT: Meta-programming the Right Way
// ─────────────────────────────────────────────────────────────

const obj = { x: 1, y: 2 };
Reflect.get(obj, "x");           // 1
Reflect.set(obj, "z", 3);        // true
Reflect.deleteProperty(obj, "x"); // true
Reflect.has(obj, "y");            // true
Reflect.ownKeys(obj);             // ["y", "z"]
Reflect.apply(Math.max, null, [1, 2, 3]); // 3


// ─────────────────────────────────────────────────────────────
// TAGGED TEMPLATE LITERALS: Custom String Processing
// ─────────────────────────────────────────────────────────────

// Tag functions receive the template strings and substitutions
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    return result + `<mark>${value}</mark>` + str;
  });
}

const name = "Alice";
const score = 95;
const msg = highlight`Player ${name} scored ${score} points!`;
// "Player <mark>Alice</mark> scored <mark>95</mark> points!"

// SQL tag to prevent injection
function sql(strings, ...values) {
  const query = strings.reduce((q, str, i) => q + `$${i}` + str);
  return { query, params: values };
}
const { query, params } = sql`SELECT * FROM users WHERE id = ${userId} AND active = ${true}`;
// query: "SELECT * FROM users WHERE id = $1 AND active = $2"
// params: [userId, true]  ← parameterized, safe from SQL injection!


// ─────────────────────────────────────────────────────────────
// NULLISH COALESCING AND OPTIONAL CHAINING (ES2020)
// ─────────────────────────────────────────────────────────────

// Already covered in foundations, but so important it's worth seeing again:
const config = null;
const timeout = config?.server?.timeout ?? 3000; // 3000 (safe chain + fallback)

const users = [{ name: "Alice" }, { name: "Bob" }];
const third = users[2]?.name ?? "No third user"; // "No third user"

// Optional chaining with method calls
const result = config?.getServer?.()?.getPort?.() ?? 80;

// Nullish assignment
let x = null;
x ??= "default"; // x = "default" (only assigns if null/undefined)
x ??= "other";   // x = "default" (NOT reassigned — already has value)


// ─────────────────────────────────────────────────────────────
// LOGICAL ASSIGNMENT (ES2021)
// ─────────────────────────────────────────────────────────────

let a = null;
let b = 0;
let c = "hello";

a ||= "default";  // a = "default" (assigned because a is falsy)
b ||= "default";  // b = "default" (assigned because 0 is falsy)
c ||= "default";  // c = "hello"   (NOT assigned — "hello" is truthy)

a &&= "updated";  // a = "default" (NOT assigned — "default" is truthy)
// Wait... let me re-check: a was "default", so &&= assigns: a = "updated"

a ??= "new";      // a = "updated" (NOT assigned — not null/undefined)


// ─────────────────────────────────────────────────────────────
// OBJECT.HASOWN (ES2022): Better than hasOwnProperty
// ─────────────────────────────────────────────────────────────

const obj2 = { name: "Alice" };
Object.hasOwn(obj2, "name");      // true (own property)
Object.hasOwn(obj2, "toString");  // false (inherited)

// The old way was error-prone:
// obj.hasOwnProperty("name") — doesn't work if obj has no prototype!
// const bare = Object.create(null); bare.hasOwnProperty("x"); // TypeError!
// Object.hasOwn(bare, "x"); // ✅ always works


// ─────────────────────────────────────────────────────────────
// ARRAY METHODS: Modern Additions
// ─────────────────────────────────────────────────────────────

const arr = [1, 2, 3, 4, 5];

// .at() — access with negative indices (ES2022)
console.log(arr.at(-1));  // 5 (last element)
console.log(arr.at(-2));  // 4

// .findLast() / .findLastIndex() (ES2023)
const last = arr.findLast(n => n % 2 === 0);  // 4 (last even)

// .toSorted() / .toReversed() / .toSpliced() (ES2023) — NON-MUTATING versions!
const sorted   = arr.toSorted((a, b) => b - a); // [5,4,3,2,1] — new array
const reversed = arr.toReversed();               // [5,4,3,2,1] — new array
// Original arr is unchanged!

// .with() — create a new array with one element changed (ES2023)
const updated = arr.with(2, 99); // [1, 2, 99, 4, 5] — new array
// Like arr[2] = 99 but non-mutating — great for React state!


// ─────────────────────────────────────────────────────────────
// OBJECT.GROUPBY / MAP.GROUPBY (ES2024)
// ─────────────────────────────────────────────────────────────

const people = [
  { name: "Alice", city: "NYC" },
  { name: "Bob",   city: "LA"  },
  { name: "Carol", city: "NYC" },
];

// Replaces common reduce pattern:
const grouped = Object.groupBy(people, p => p.city);
// { NYC: [{name:"Alice",...}, {name:"Carol",...}], LA: [{name:"Bob",...}] }


// ─────────────────────────────────────────────────────────────
// PROMISE.WITHRESOLVERS (ES2024)
// ─────────────────────────────────────────────────────────────

// Old pattern — resolve/reject had to be captured in outer scope:
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

// New clean pattern:
const { promise: p2, resolve: res2, reject: rej2 } = Promise.withResolvers();
// Can now call res2() or rej2() from anywhere, without the closure dance


// ─────────────────────────────────────────────────────────────
// WELL-KNOWN SYMBOLS: Customize Language Behavior
// ─────────────────────────────────────────────────────────────

class Temperature {
  constructor(celsius) { this.celsius = celsius; }

  // Custom toString (for template literals and + concatenation)
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.celsius;
    if (hint === "string") return `${this.celsius}°C`;
    return this.celsius; // default
  }

  // Custom type in Array.isArray-like checks
  static [Symbol.hasInstance](instance) {
    return instance.celsius !== undefined;
  }
}

const t = new Temperature(100);
console.log(`${t}`);      // "100°C" (string hint)
console.log(t + 10);      // 110 (number hint)
console.log(+t);          // 100 (number hint)


// ─────────────────────────────────────────────────────────────
// ASYNC PATTERNS IN MODERN JS
// ─────────────────────────────────────────────────────────────

// Top-level await (in ES modules)
// const data = await fetch("https://api.example.com").then(r => r.json());
// This works at the module top level in modern environments

// Async iteration
async function* asyncFibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    await new Promise(r => setTimeout(r, 100));
    yield a;
    [a, b] = [b, a + b];
  }
}

async function printFirstFibs(n) {
  let count = 0;
  for await (const fib of asyncFibonacci()) {
    console.log(fib);
    if (++count >= n) break;
  }
}

// AbortController — cancel fetch/async operations
const controller = new AbortController();
const { signal } = controller;

setTimeout(() => controller.abort(), 5000); // cancel after 5s

fetch("https://api.example.com/data", { signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === "AbortError") console.log("Request cancelled");
    else throw err;
  });

// Structured clone — deep copy any structured data
const original = { name: "Alice", scores: [1, 2, 3], date: new Date() };
const copy = structuredClone(original);
copy.scores.push(4);
console.log(original.scores.length); // 3 — not affected!
// Works with Date, Map, Set, RegExp — unlike JSON.parse(JSON.stringify())!

function userId() { return "u-1"; }
