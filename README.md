# JavaScript: The Definitive Guide
### For beginners and experienced engineers alike

> JavaScript is the most widely deployed programming language in history. It runs in every browser, on servers via Node.js, in mobile apps, desktop apps, IoT devices, and even space rovers. If you're going to learn one language deeply, this is the one.
>
> This guide treats JavaScript with the seriousness it deserves. We cover everything from the ground floor — variables, types, functions — through advanced patterns like closures, generators, and the event loop, all the way to production topics like TypeScript, module systems, and bundling.
>
> Every concept is explained twice: once as a definition, and once as a story that makes it stick. Every code sample runs. No hand-waving.

---

## Table of Contents

1. [Repo Structure](#repo-structure)
2. [Getting Started](#getting-started)
3. [Chapter 1 — Foundations](#chapter-1--foundations)
4. [Chapter 2 — Functions](#chapter-2--functions)
5. [Chapter 3 — Objects and Arrays](#chapter-3--objects-and-arrays)
6. [Chapter 4 — The DOM & Browser APIs](#chapter-4--the-dom--browser-apis)
7. [Chapter 5 — Async JavaScript](#chapter-5--async-javascript)
8. [Chapter 6 — ES6+ and Modern JavaScript](#chapter-6--es6-and-modern-javascript)
9. [Chapter 7 — Object-Oriented JavaScript](#chapter-7--object-oriented-javascript)
10. [Chapter 8 — Functional Patterns](#chapter-8--functional-patterns)
11. [Chapter 9 — The Event Loop](#chapter-9--the-event-loop)
12. [Chapter 10 — Modules & Bundling](#chapter-10--modules--bundling)
13. [Chapter 11 — Node.js](#chapter-11--nodejs)
14. [Chapter 12 — TypeScript Introduction](#chapter-12--typescript-introduction)
15. [Chapter 13 — TypeScript Advanced](#chapter-13--typescript-advanced)
16. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Repo Structure

```
javascript-guide/
│
├── 01-foundations/
│   └── 01-foundations.js       ← Variables, types, strings, numbers, operators, control flow, destructuring
│
├── 02-functions/
│   └── 02-functions.js         ← Declarations, expressions, arrows, closures, HOFs, this, IIFEs, generators
│
├── 03-objects-and-arrays/
│   └── 03-objects-arrays.js    ← Objects, prototypes, Big Five array methods, Sets, Maps, WeakMap
│
├── 04-dom-and-browser/
│   └── 04-dom.js               ← Selecting, reading, writing, events, delegation, Storage, Web APIs
│
├── 05-async-javascript/
│   └── 05-async.js             ← Callbacks, Promises, async/await, fetch, error handling, patterns
│
├── 06-es6-and-modern-js/
│   └── 06-modern-js.js         ← Symbols, Proxy, Reflect, tagged templates, modern array/object methods
│
├── 07-object-oriented-js/
│   └── 07-oop.js               ← Prototype chain, ES6 classes, private fields, mixins, design patterns
│
├── 08-functional-patterns/
│   └── 08-functional.js        ← Pure functions, immutability, composition, pipe, monads, memoize
│
├── 09-the-event-loop/
│   └── 09-event-loop.js        ← Call stack, microtask queue, macrotask queue, blocking, starvation
│
├── 10-modules-and-bundling/
│   └── 10-modules-bundling.js  ← CommonJS vs ESM, Webpack, Vite, Rollup, esbuild, tree shaking, CDN
│
├── 11-nodejs/
│   └── 11-nodejs.js            ← Architecture, core modules, streams, Express, ecosystem
│
├── 12-typescript-intro/
│   └── 12-typescript-intro.ts  ← What TS solves, types, interfaces, generics, utility types
│
├── 13-typescript-advanced/
│   └── 13-typescript-advanced.ts ← Classes, mapped types, conditional types, real patterns, migration
│
├── .gitignore
└── README.md                   ← This file — the complete tutorial
```

---

## Getting Started

**Prerequisites:** Node.js installed ([nodejs.org](https://nodejs.org) — use the LTS version)

```bash
# Clone or download
git clone https://github.com/yourusername/javascript-guide.git
cd javascript-guide

# Run any chapter file directly
node 01-foundations/01-foundations.js
node 02-functions/02-functions.js
node 09-the-event-loop/09-event-loop.js

# For TypeScript files, install ts-node
npm install -g tsx
tsx 12-typescript-intro/12-typescript-intro.ts

# Or use the Node.js REPL for quick experiments
node
> const x = 42
> x * 2
84
```

**Recommended tools:**
- [VS Code](https://code.visualstudio.com/) — best JavaScript/TypeScript IDE
- [Quokka.js](https://quokkajs.com/) — VS Code extension that shows results inline as you type
- [Node.js](https://nodejs.org/) — run JS outside the browser
- The browser's DevTools console — always available, great for quick tests

---

## Chapter 1 — Foundations

> **File:** `01-foundations/01-foundations.js`

### Variables: `let`, `const`, and the ghost of `var`

JavaScript gives you three ways to declare variables. In practice, you need two:

```javascript
const name = "Alice";    // Can't be reassigned. Use this first.
let   count = 0;         // Can be reassigned. Use when the value changes.
var   legacy = "avoid";  // Old way. Function-scoped, hoisted. Don't use in new code.
```

**The `const` misconception:** `const` doesn't make values *immutable* — it makes *bindings* immutable. The binding (the variable name pointing to a value) can't change, but if the value is an object or array, you can still change its contents:

```javascript
const user = { name: "Alice" };
user.name = "Bob";    // ✅ Fine — we're mutating the object, not reassigning
user = {};            // ❌ TypeError — can't reassign the binding
```

**`let` and `const` are block-scoped.** They only exist within the `{ }` block they're declared in. `var` is function-scoped — it leaks out of `if`, `for`, and other blocks. This is why `var` causes bugs:

```javascript
for (var i = 0; i < 3; i++) { /* ... */ }
console.log(i); // 3 — var leaked out!

for (let j = 0; j < 3; j++) { /* ... */ }
console.log(j); // ReferenceError — let stayed inside
```

### JavaScript's Eight Types

JavaScript is dynamically typed. Variables don't have types — *values* do.

```javascript
// The seven primitives (stored by value)
"hello"      // string
42           // number  (ALL numbers — integers AND floats)
3.14         // also number
true         // boolean
null         // intentional absence of value (you set this)
undefined    // unintentional absence (value not set yet)
9007199254740991n // bigint (for huge integers, note the 'n' suffix)
Symbol("id") // symbol (unique identifier, used for metaprogramming)

// The one reference type
{}           // object (arrays, functions, dates — all objects under the hood)
```

**The `typeof` gotcha:** `typeof null` returns `"object"`. This is a 29-year-old bug in the language that can never be fixed without breaking the web. Check for null explicitly: `value === null`.

### Truthy and Falsy: JavaScript's Hidden Booleans

Every value in JavaScript has an inherent boolean nature. Exactly **six values are falsy** — everything else is truthy:

```javascript
false    // obviously
0        // zero
-0       // negative zero
0n       // BigInt zero
""       // empty string
null     
undefined
NaN      // Not a Number
```

This is why you can write patterns like:
```javascript
const username = input || "Anonymous";    // fallback if input is empty/null/undefined
if (user) { doSomething(); }             // check for existence
const arr = []; if (arr.length) { ... }  // check if array has items
```

### The Modern Operators You Need Daily

```javascript
// Nullish coalescing (??) — fallback ONLY for null/undefined, not 0 or ""
const volume = 0;
volume || 50   // 50 (wrong! 0 is falsy)
volume ?? 50   // 0  (correct! 0 is a valid setting)

// Optional chaining (?.) — safe access through potentially null objects
const city = user?.address?.city;       // undefined instead of TypeError
const port = config?.getPort?.();       // safe method call
const name = users[99]?.name;          // undefined instead of TypeError

// Spread operator (...)
const combined = [...arr1, ...arr2];    // merge arrays
const merged   = { ...obj1, ...obj2 }; // merge objects (later keys win)
const [head, ...tail] = array;         // rest in destructuring
```

### Destructuring: Unpack Elegantly

```javascript
// Array destructuring
const [first, second, , fourth] = [10, 20, 30, 40];
const [a = 0, b = 0] = [1];           // default values
const [x, ...rest] = [1, 2, 3, 4];   // rest elements
[a, b] = [b, a];                      // swap variables!

// Object destructuring
const { name, age, city = "NYC" } = person;      // with default
const { name: firstName, age: years } = person;  // rename
const { server: { host, port } } = config;       // nested

// In function parameters (very common in React)
function greet({ name, greeting = "Hello" }) {
  return `${greeting}, ${name}!`;
}
```

---

## Chapter 2 — Functions

> **File:** `02-functions/02-functions.js`

### Four Ways to Define a Function

```javascript
// 1. Declaration — hoisted, can be called before it's defined in the file
function add(a, b) { return a + b; }

// 2. Expression — not hoisted, stored in a variable
const add = function(a, b) { return a + b; };

// 3. Arrow function — concise, inherits 'this' from surrounding scope
const add = (a, b) => a + b;
const double = n => n * 2;           // single param: no parens needed
const getUser = () => ({ id: 1 });   // returning object: wrap in parens

// 4. Named function expression — useful for recursion
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // can call itself by name
};
```

**Arrow functions are NOT just shorthand.** They're fundamentally different: they don't have their own `this`, `arguments`, or `prototype`. This makes them perfect for callbacks, wrong for methods and constructors.

### Closures: The Most Important Concept in JavaScript

A **closure** is a function that "remembers" variables from the scope where it was created, even after that scope has finished executing.

This isn't magic — it's how JavaScript's scope chain works. Every function carries a reference to its lexical environment.

```javascript
function makeCounter(start = 0) {
  let count = start;  // lives in the closure

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    value()     { return count; }
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.value();     // 12
// 'count' is PRIVATE — impossible to access directly from outside
```

Closures are how you achieve **encapsulation** in JavaScript without classes. The bank account, the counter, the memoize cache — all closures.

**The classic bug and its fix:**

```javascript
// Bug: var is function-scoped, all closures share the SAME i
const buggy = [];
for (var i = 0; i < 3; i++) {
  buggy.push(() => i);
}
buggy[0](); // 3 — wrong!

// Fix: let creates a new binding per iteration
const fixed = [];
for (let i = 0; i < 3; i++) {
  fixed.push(() => i);
}
fixed[0](); // 0 ✅
```

### Higher-Order Functions

A higher-order function (HOF) either **accepts** functions as arguments or **returns** functions. This is the foundation of functional programming in JavaScript.

```javascript
// Accepts a function
function doTwice(fn) { fn(); fn(); }
doTwice(() => console.log("hello")); // "hello" twice

// Returns a function (factory)
function multiply(factor) {
  return (number) => number * factor;
}
const double = multiply(2);
const triple = multiply(3);
double(5); // 10
triple(5); // 15

// Compose: create a pipeline of transformations
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);
const processInput = pipe(
  str => str.trim(),
  str => str.toLowerCase(),
  str => str.replace(/\s+/g, "-")
);
processInput("  Hello World  "); // "hello-world"
```

### Understanding `this`

`this` is determined by **how a function is called**, not where it's defined (for regular functions). Arrow functions inherit `this` from their enclosing scope.

```javascript
// Rule 1: Method call — 'this' is the object
const obj = { name: "Alice", greet() { return this.name; } };
obj.greet(); // "Alice"

// Rule 2: Regular function — 'this' is undefined (strict) or global (sloppy)
function who() { return this; }
who(); // undefined (strict mode)

// Rule 3: Arrow function — inherits 'this' from enclosing scope
const timer = {
  count: 0,
  start() {
    setInterval(() => {
      this.count++; // 'this' = timer (arrow inherits from start())
    }, 1000);
  }
};

// Rule 4: Explicit binding
fn.call(thisValue, arg1, arg2);
fn.apply(thisValue, [arg1, arg2]);
const bound = fn.bind(thisValue); // returns new function with 'this' locked

// Rule 5: new — 'this' is the new object being created
function Person(name) { this.name = name; }
const alice = new Person("Alice");
```

---

## Chapter 3 — Objects and Arrays

> **File:** `03-objects-and-arrays/03-objects-arrays.js`

### Objects: Everything is One

```javascript
// Creating objects
const user = {
  name: "Alice",
  age: 30,
  greet() { return `Hi, I'm ${this.name}`; }, // method shorthand
  get fullInfo() { return `${this.name}, ${this.age}`; }, // getter
};

// Dynamic property names
const key = "name";
console.log(user[key]);            // "Alice"
const { [key]: value } = user;     // dynamic destructuring

// Computed property names
const field = "email";
const form = { [field]: "alice@example.com", [`${field}Confirmed`]: true };
```

**Object utility methods** — the ones you'll use every day:

```javascript
Object.keys(obj)     // → array of keys
Object.values(obj)   // → array of values
Object.entries(obj)  // → array of [key, value] pairs
Object.assign({}, a, b)  // shallow merge (mutates target)
Object.freeze(obj)   // make immutable (shallow)
Object.create(proto) // create with specific prototype

// Transform an object
const doubled = Object.fromEntries(
  Object.entries(scores).map(([k, v]) => [k, v * 2])
);

// Check property ownership
Object.hasOwn(obj, "name"); // ✅ modern, works with null-prototype objects
```

### The Big Five Array Methods

These five methods are the backbone of modern JavaScript data processing. Learn them deeply.

```javascript
const people = [
  { name: "Alice", age: 30, city: "NYC" },
  { name: "Bob",   age: 17, city: "LA"  },
  { name: "Carol", age: 25, city: "NYC" },
];

// 1. map() — transform each element, returns same-length array
const names = people.map(p => p.name); // ["Alice", "Bob", "Carol"]

// 2. filter() — keep matching elements
const adults = people.filter(p => p.age >= 18); // [Alice, Carol]

// 3. reduce() — fold entire array into one value
const totalAge = people.reduce((sum, p) => sum + p.age, 0); // 72

// Group by city — classic reduce pattern
const byCity = people.reduce((groups, p) => {
  (groups[p.city] ||= []).push(p);
  return groups;
}, {});

// 4. find() — first match or undefined
const alice = people.find(p => p.name === "Alice");

// 5. some() and every() — boolean queries
const anyNYC  = people.some(p => p.city === "NYC");   // true
const allAdult = people.every(p => p.age >= 18);       // false

// Chain them — reads like a description of what you want
const result = people
  .filter(p => p.city === "NYC")
  .sort((a, b) => b.age - a.age)
  .slice(0, 2)
  .map(p => p.name);
```

### Sets and Maps: When Objects Aren't Enough

```javascript
// Set: unique values, O(1) lookup
const unique = new Set([1, 2, 2, 3, 3, 3]); // {1, 2, 3}
unique.has(2);  // true — much faster than array.includes()!
const deduped = [...new Set(arrayWithDupes)];

// Set operations
const union        = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference   = new Set([...a].filter(x => !b.has(x)));

// Map: any key type, insertion-order iteration, better performance
const map = new Map();
map.set(domNode, "associated data"); // object as key!
map.set(42, "a number key");
map.get(domNode);    // "associated data"
map.size;            // 2

// Count occurrences — Map shines here
const counts = words.reduce((map, word) => {
  map.set(word, (map.get(word) || 0) + 1);
  return map;
}, new Map());
```

**Use Map (not Object) when:** keys aren't strings, you need frequent add/delete, you need insertion-order iteration, or you need to know the size efficiently.

---

## Chapter 4 — The DOM & Browser APIs

> **File:** `04-dom-and-browser/04-dom.js`

### Selecting and Manipulating Elements

```javascript
// querySelector — CSS selector syntax (returns first match or null)
const header  = document.querySelector("header");
const byId    = document.querySelector("#my-id");
const byClass = document.querySelector(".my-class");
const complex = document.querySelector("article h2.title");

// querySelectorAll — returns static NodeList
const cards = document.querySelectorAll(".card");
const arr   = Array.from(cards); // or [...cards]

// Reading and writing
element.textContent = "Safe text";     // escapes HTML — use for user content
element.innerHTML   = "<b>HTML</b>";   // parses HTML — only for trusted content
element.getAttribute("href");
element.setAttribute("data-id", "123");

// Classes
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");
element.classList.contains("active"); // boolean

// Creating and inserting
const div = document.createElement("div");
div.textContent = "Hello";
parent.append(div);          // add at end
parent.prepend(div);         // add at start
ref.before(div);             // before a sibling
ref.after(div);              // after a sibling
element.remove();            // remove from DOM
```

### Events: The Right Way

```javascript
// addEventListener — always use this, not onclick="" attributes
button.addEventListener("click", (event) => {
  event.preventDefault();   // stop form submit, link navigation
  event.stopPropagation();  // stop event from bubbling to parents
  console.log(event.target);         // the element that was clicked
  console.log(event.currentTarget);  // the element with the listener
});

// Event delegation — one listener handles many items
// Add to PARENT, not each item. Works for dynamically added items too!
list.addEventListener("click", (event) => {
  const item = event.target.closest(".list-item");
  if (!item) return;
  handleItemClick(item.dataset.id);
});
```

### Storage and Key Browser APIs

```javascript
// localStorage — persists forever, same origin
localStorage.setItem("key", JSON.stringify(value));
JSON.parse(localStorage.getItem("key") ?? "null");
localStorage.removeItem("key");

// Intersection Observer — lazy loading, scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".animate").forEach(el => observer.observe(el));

// History API — SPA routing
history.pushState({ page: "about" }, "", "/about");
window.addEventListener("popstate", e => handleRoute(e.state));
```

---

## Chapter 5 — Async JavaScript

> **File:** `05-async-javascript/05-async.js`

### The Evolution: Callbacks → Promises → async/await

This is the most important progression to understand in JavaScript. Each generation solved problems of the previous.

**Callbacks (1995–2015):** Pass a function to be called when async work is done.

```javascript
readFile("data.txt", (error, data) => {  // error-first convention
  if (error) { handleError(error); return; }
  processData(data);
});
```

The problem: nesting callbacks creates "callback hell" — code that's impossible to read, maintain, or handle errors in properly.

**Promises (ES2015):** An object representing a future value. Has three states: pending, fulfilled, rejected.

```javascript
readFilePromise("users.txt")
  .then(users => processUsers(users))   // chain instead of nesting
  .then(result => saveResult(result))
  .catch(error => handleError(error))   // ONE error handler for the whole chain
  .finally(() => cleanup());            // always runs
```

**async/await (ES2017):** Syntactic sugar over Promises. Looks synchronous, IS asynchronous.

```javascript
async function loadData() {
  try {
    const users  = await fetchUsers();    // pause here until resolved
    const orders = await fetchOrders();   // then pause here
    return { users, orders };
  } catch (error) {
    console.error("Failed:", error.message);
  }
}
```

### Promise Combinators — Pick the Right One

```javascript
// Promise.all — all must succeed, fail-fast
const [user, posts, comments] = await Promise.all([
  fetchUser(id), fetchPosts(id), fetchComments(id)
]);
// If ANY fails, the whole thing rejects immediately

// Promise.allSettled — wait for all, never rejects
const results = await Promise.allSettled([req1, req2, req3]);
results.forEach(r => r.status === "fulfilled" ? use(r.value) : log(r.reason));

// Promise.race — first one to settle wins
const data = await Promise.race([fetchPrimary(), timeout(5000)]);

// Promise.any — first SUCCESS wins (ignores rejections)
const fastest = await Promise.any([server1, server2, server3]);
```

### Parallel vs Sequential: The Performance Trap

```javascript
// ❌ Sequential — waits 300ms total (100 + 100 + 100)
const user  = await fetchUser(id);
const posts = await fetchPosts(id);
const stats = await fetchStats(id);

// ✅ Parallel — waits ~100ms (all run simultaneously)
const [user, posts, stats] = await Promise.all([
  fetchUser(id), fetchPosts(id), fetchStats(id)
]);
```

The golden rule: **only use `await` in sequence if each request depends on the previous result.** Otherwise, run in parallel with `Promise.all`.

### The Fetch API

```javascript
// GET request
const response = await fetch("https://api.example.com/users");
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const users = await response.json();

// POST request
const newUser = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
}).then(r => r.json());

// With timeout (using AbortController)
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);
const data = await fetch(url, { signal: controller.signal });
```

---

## Chapter 6 — ES6+ and Modern JavaScript

> **File:** `06-es6-and-modern-js/06-modern-js.js`

### The Game-Changing Additions Since 2015

ES6 (2015) was the biggest update in JavaScript history. Here are the most important additions:

**Symbols** — truly unique identifiers, semi-private object keys:
```javascript
const ID = Symbol("id");
const obj = { [ID]: "usr-123", name: "Alice" };
obj[ID]; // "usr-123" — not visible in for...in or Object.keys()
```

**Custom iterables** with `Symbol.iterator`:
```javascript
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return { next: () => current <= end
      ? { value: current++, done: false }
      : { value: undefined, done: true }
    };
  }
}
[...new Range(1, 5)]; // [1, 2, 3, 4, 5]
for (const n of new Range(1, 5)) { /* 1, 2, 3, 4, 5 */ }
```

**Proxy** — intercept object operations:
```javascript
const validated = new Proxy({}, {
  set(target, prop, value) {
    if (prop === "age" && value < 0) throw new Error("Age can't be negative");
    target[prop] = value;
    return true;
  }
});
```

### Modern Array Methods (Non-Mutating — Perfect for React)

```javascript
const arr = [1, 2, 3, 4, 5];

arr.at(-1);          // 5 — last element (ES2022)
arr.findLast(n => n % 2 === 0);  // 4 — last even (ES2023)

// These return NEW arrays — original is unchanged
arr.toSorted((a, b) => b - a); // [5,4,3,2,1]
arr.toReversed();               // [5,4,3,2,1]
arr.with(2, 99);               // [1,2,99,4,5] — update one element
```

**`structuredClone()`** — proper deep copy (works with Date, Set, Map):
```javascript
const copy = structuredClone(original); // deep clone!
// vs JSON.parse(JSON.stringify()) which loses Dates and circular refs
```

---

## Chapter 7 — Object-Oriented JavaScript

> **File:** `07-object-oriented-js/07-oop.js`

### Prototypes: The Real Story

JavaScript OOP is **prototype-based**, not class-based. Classes are syntactic sugar — under the hood, it's still prototypes.

Every object has an internal `[[Prototype]]` link. When you access a property, JavaScript first checks the object itself, then walks the prototype chain until it finds it or reaches `null`.

```javascript
const animal = { breathe() { return `${this.name} breathes`; } };
const dog = Object.create(animal); // dog's [[Prototype]] = animal
dog.name = "Rex";
dog.breathe(); // found on prototype! "Rex breathes"
```

ES6 classes are a **cleaner API** for the same prototype system:

```javascript
class Animal {
  #name;           // private field — truly private (ES2022)
  #sound;
  static count = 0;

  constructor(name, sound) {
    this.#name  = name;
    this.#sound = sound;
    Animal.count++;
  }

  get name() { return this.#name; }
  speak() { return `${this.#name} says ${this.#sound}!`; }
  static create(name, sound) { return new Animal(name, sound); }
}

class Dog extends Animal {
  constructor(name) { super(name, "woof"); }
  speak() { return `${super.speak()} *wags tail*`; }
}
```

### Mixins: Composition Over Inheritance

JavaScript doesn't support multiple inheritance. Mixins provide "multiple inheritance via composition":

```javascript
// A mixin is a function that takes a class and returns an extended class
const Serializable = Base => class extends Base {
  serialize()  { return JSON.stringify(this); }
};
const Timestamped = Base => class extends Base {
  constructor(...args) { super(...args); this.createdAt = new Date(); }
};

// Compose multiple mixins
class User extends Serializable(Timestamped(BaseModel)) {
  constructor(name) { super(); this.name = name; }
}

const u = new User("Alice");
u.serialize();  // from Serializable mixin
u.createdAt;    // from Timestamped mixin
```

### Design Patterns You'll Actually Use

**Factory** — create objects without `new`:
```javascript
const NotificationFactory = {
  create(type, opts) {
    const creators = { email: EmailNotif, sms: SMSNotif, push: PushNotif };
    return new creators[type](opts);
  }
};
```

**Observer** — subscribe/unsubscribe to events:
```javascript
const off = emitter.on("user:created", handler);
// ... later
off(); // return value of .on() is an unsubscribe function
```

**Builder** — fluent API for complex object construction:
```javascript
const query = new QueryBuilder()
  .from("users").select("name", "email")
  .where("age > 18").limit(20).build();
```

---

## Chapter 8 — Functional Patterns

> **File:** `08-functional-patterns/08-functional.js`

### Why Functional Matters

Functional programming isn't about using `.map()` instead of `for` loops. It's about writing code that is:
- **Predictable**: same input → same output, always
- **Testable**: no hidden state to set up
- **Composable**: small pieces that combine cleanly

### Pure Functions and Immutability

```javascript
// Impure: depends on external state, causes side effects
let total = 0;
function addToTotal(n) { total += n; return total; } // unpredictable!

// Pure: self-contained
function add(a, b) { return a + b; } // always returns a + b

// Immutable updates (don't mutate, return new values)
const addItem = (cart, item) => [...cart, item];         // new array
const updateUser = (user, data) => ({ ...user, ...data }); // new object
const updateAt = (arr, i, val) => arr.with(i, val);      // new array (ES2023)
```

### Function Composition and Pipe

```javascript
// Build complex transformations from simple pieces
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);

const processInput = pipe(
  str => str.trim(),
  str => str.toLowerCase(),
  str => str.replace(/\s+/g, "-")
);
processInput("  Hello World!  "); // "hello-world!"
```

### Practical Utilities

```javascript
// memoize — cache pure function results
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

// debounce — delay until input pauses (search fields)
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// throttle — execute at most once per interval (scroll handlers)
function throttle(fn, limit) {
  let lastRun = 0;
  return (...args) => {
    if (Date.now() - lastRun >= limit) { lastRun = Date.now(); fn(...args); }
  };
}
```

---

## Chapter 9 — The Event Loop

> **File:** `09-the-event-loop/09-event-loop.js`

### The Big Question: How Can One Thread Handle Everything?

JavaScript is **single-threaded** — it can only do one thing at a time. And yet it handles network requests, timers, user clicks, and more, all without freezing. How?

The answer is the **Event Loop**: a system where the JavaScript engine, the runtime's C++ APIs, and two queues work together to give the illusion of concurrency.

```
┌─────────────────────────────────────────────────────────┐
│                    JavaScript Engine                    │
│  ┌──────────────┐   ┌──────────────────────────────┐   │
│  │  Call Stack  │   │         Memory Heap          │   │
│  └──────────────┘   └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │ offloads I/O to:
         ▼
┌─────────────────────────────────────────────────────────┐
│         Web APIs (Browser) / C++ APIs (Node.js)         │
│   setTimeout    fetch    DOM Events    File I/O          │
└─────────────────────────────────────────────────────────┘
         │ when done, queues callbacks in:
         ▼
┌────────────────────┐   ┌─────────────────────────┐
│  Microtask Queue   │   │    Macrotask Queue       │
│  (Promise .then)   │   │  (setTimeout callbacks)  │
│  (queueMicrotask)  │   │  (I/O callbacks)         │
└────────────────────┘   └─────────────────────────┘
```

**The Event Loop's algorithm:**
1. Run the current synchronous code to completion
2. **Drain the microtask queue completely** (ALL microtasks, including new ones added during this step)
3. Run ONE macrotask from the macrotask queue
4. Go to step 2

### Proving It With Code

```javascript
console.log("A");  // 1st — synchronous

setTimeout(() => console.log("B"), 0);  // queued as macrotask

Promise.resolve().then(() => console.log("C"));  // queued as microtask
Promise.resolve().then(() => console.log("D"));  // queued as microtask

console.log("E");  // 2nd — synchronous

// Output: A, E, C, D, B
// A and E run first (synchronous)
// C and D run second (microtasks drain before any macrotask)
// B runs last (macrotask)
```

### The Microtask vs Macrotask Distinction

| Type | Triggered by | Priority |
|------|-------------|----------|
| Microtask | `Promise.then()`, `async/await`, `queueMicrotask()` | **Higher** — runs before any macrotask |
| Macrotask | `setTimeout`, `setInterval`, I/O callbacks, `requestAnimationFrame` | **Lower** — one per event loop tick |

**Key insight:** `async/await` is just `Promise.then()` in disguise. Every `await` suspends the function and queues the continuation as a microtask.

### Never Block the Event Loop

If your synchronous code runs for too long, the entire browser/server freezes:

```javascript
// This blocks for 3 seconds — UI freezes, no clicks register, no network
while (Date.now() - start < 3000) { /* spinning */ }

// Fix: break long work into chunks, yielding between each
function processInChunks(items, processFn, chunkSize = 100) {
  return new Promise(resolve => {
    let index = 0;
    function processNextChunk() {
      while (index < items.length && index % chunkSize !== 0) {
        processFn(items[index++]);
      }
      if (index < items.length) {
        setTimeout(processNextChunk, 0); // yield to event loop!
      } else { resolve(); }
    }
    processNextChunk();
  });
}
```

---

## Chapter 10 — Modules & Bundling

> **File:** `10-modules-and-bundling/10-modules-bundling.js`

### Two Module Systems: Know Both

**CommonJS (CJS)** — Node.js's original module system (2009):
```javascript
// Export
module.exports = { add, multiply, PI };
exports.add = (a, b) => a + b;

// Import
const math   = require("./math");
const { add } = require("./math");
const db = require(process.env.NODE_ENV === "test" ? "./mock-db" : "./db"); // dynamic!
```

**ES Modules (ESM)** — the JavaScript standard (ES2015):
```javascript
// Export
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { /* ... */ }

// Import
import Calculator, { add, PI } from "./math.js";
import * as Math from "./math.js";
const { Chart } = await import("./chart.js"); // dynamic import!
```

### CJS vs ESM: The Deciding Differences

| | CommonJS | ES Modules |
|---|---|---|
| **Loading** | Synchronous | Asynchronous |
| **Conditional imports** | ✅ `require()` anywhere | ❌ Must be top-level |
| **Dynamic imports** | ✅ `require(variable)` | ✅ `await import()` |
| **Tree shaking** | ❌ Bundlers can't analyze | ✅ Bundlers can remove dead code |
| **Live bindings** | ❌ Copy of value | ✅ Always in sync with export |
| **Default in Node.js** | ✅ `.js` files | 🔧 Needs `.mjs` or `"type":"module"` |

**Live bindings example — the most subtle difference:**
```javascript
// CJS: you get a copy of the value at import time
const { count } = require("./counter"); // count = 0
increment(); // modifies the module's internal count
console.log(count); // still 0! You got a copy.

// ESM: you get a live reference
import { count } from "./counter.mjs"; // count = 0
increment();
console.log(count); // 1 ✅ the binding stays in sync
```

### Bundlers: Which One to Use

**Vite** — use for apps (especially React, Vue, Svelte):
- Development: serves native ESM with near-instant HMR
- Production: builds with Rollup, optimized output
- Config: `vite.config.js`

**Webpack** — use if you're already using it, or need maximum plugin ecosystem:
- Slower but battle-tested, huge ecosystem
- Complex config but powerful
- What Create React App uses under the hood

**Rollup** — use for libraries:
- Produces cleanest output, invented tree shaking
- Can output CJS + ESM simultaneously
- What Vite uses for production builds

**esbuild** — use for CI/CD speed or as a sub-tool:
- 10-100× faster than JS-based bundlers (written in Go)
- Limited plugin ecosystem
- Used by Vite for dependency pre-bundling

### Tree Shaking: Remove What You Don't Use

```javascript
// utils.js — 50 utility functions
export function formatDate(date) { /* ... */ }
export function formatCurrency(amount) { /* ... */ }
// ... 48 more

// main.js
import { formatDate } from "./utils.js"; // only import this one

// Bundler output only contains formatDate — the other 49 are removed!
// This is tree shaking. Only works with static ESM imports.
```

### CDN: JavaScript Without a Bundle

For simple projects or specific use cases, load libraries directly from a CDN:

```html
<!-- Modern: importmap — resolves module names without bundling -->
<script type="importmap">
{ "imports": {
    "react":     "https://esm.sh/react@18",
    "react-dom": "https://esm.sh/react-dom@18"
} }
</script>

<script type="module">
  import React from "react"; // resolved via importmap
</script>

<!-- Traditional: script tags -->
<script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>

<!-- Popular CDN providers:
  jsDelivr: cdn.jsdelivr.net     — fast, serves npm + GitHub
  unpkg:    unpkg.com            — official npm CDN
  esm.sh:   esm.sh               — serves ES modules of any npm package  -->
```

---

## Chapter 11 — Node.js

> **File:** `11-nodejs/11-nodejs.js`

### What Node.js Is (And Why It Exists)

Before Node.js, servers handled concurrency with threads — one thread per connection. Threads are expensive (~1–2MB each). Under heavy load (thousands of simultaneous connections), servers ran out of memory. This was the "C10k problem."

**Ryan Dahl's insight (2009):** JavaScript's event loop is *perfect* for server I/O. Most server work is waiting — waiting for a database query, waiting for a file read, waiting for a network response. Why pay for an idle thread?

Node.js takes V8 (Chrome's JavaScript engine) + libuv (a C++ async I/O library) and runs them as a server. One thread, non-blocking I/O, handles thousands of concurrent connections with minimal memory.

**Node.js is fast for:** APIs, web servers, real-time apps, microservices, CLI tools  
**Node.js is NOT great for:** CPU-intensive work (image processing, ML, video encoding)

### Core Modules — No Install Required

```javascript
const fs      = require("fs/promises");   // file system
const path    = require("path");          // path manipulation
const http    = require("http");          // HTTP server
const crypto  = require("crypto");        // cryptography
const events  = require("events");        // EventEmitter
const stream  = require("stream");        // streams
const os      = require("os");            // operating system info
const child_process = require("child_process"); // run system commands

// Key globals
process.env.NODE_ENV  // "production" | "development" | "test"
process.argv          // command line arguments
process.cwd()         // current working directory
process.exit(0)       // exit (0 = success, non-zero = error)
__dirname             // directory of current file (CJS only)
__filename            // path of current file (CJS only)
```

### Express.js: Build APIs Fast

```javascript
const express = require("express");
const app = express();

app.use(express.json()); // parse JSON request bodies

// Middleware runs before every route handler
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // don't forget this!
});

// Routes
app.get("/users",      getUsers);
app.post("/users",     createUser);
app.get("/users/:id",  getUser);    // :id is a param
app.patch("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// Error handler — must have 4 params
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000);
```

### The Ecosystem

```
Web Frameworks:   Express (classic) | Fastify (faster) | Hono (edge) | NestJS (enterprise)
ORMs:             Prisma (TypeScript-first) | Mongoose (MongoDB) | Drizzle (lightweight)
Auth:             Passport.js | jsonwebtoken | bcrypt
Testing:          Jest | Vitest | Mocha | Supertest
Utilities:        dotenv | zod (validation) | winston (logging) | axios
Dev Tools:        nodemon | tsx | ESLint | Prettier
```

---

## Chapter 12 — TypeScript Introduction

> **File:** `12-typescript-intro/12-typescript-intro.ts`

### What TypeScript Is (And Isn't)

TypeScript is JavaScript with an optional type system. It compiles to plain JavaScript — TypeScript itself never runs. The types exist only for you and your IDE; they're stripped out at compile time.

```
Your TypeScript → TypeScript Compiler (tsc) → JavaScript → Browser/Node.js
```

TypeScript isn't a different language — it's a JavaScript dialect. Every valid JavaScript file is valid TypeScript. You can adopt it gradually.

### The Problems TypeScript Solves

**1. The "cannot read property of undefined" error**
```typescript
function getCity(user: User): string {
  return user.address.city; // TypeScript error if user.address might be undefined
}
```

**2. Wrong function arguments**
```typescript
function add(a: number, b: number): number { return a + b; }
add("5", 3); // ❌ TypeScript: Argument of type 'string' is not assignable to 'number'
```

**3. Typos in property names**
```typescript
user.profil; // ❌ TypeScript: Property 'profil' does not exist (did you mean 'profile'?)
```

**4. Refactoring across large codebases**
Change a function signature → TypeScript shows every place that needs updating.

**5. Self-documenting code**
The types ARE the documentation. No need to read the source or write JSDoc.

### The Type System Basics

```typescript
// Primitive types
let name:    string  = "Alice";
let age:     number  = 30;
let active:  boolean = true;

// TypeScript INFERS types — you don't always need to annotate
let name2 = "Alice";   // TypeScript knows: string
let age2  = 30;        // TypeScript knows: number

// Union types
function format(value: string | number): string {
  if (typeof value === "string") return value.toUpperCase(); // narrowed to string
  return value.toFixed(2);                                    // narrowed to number
}

// Interfaces — describe object shapes
interface User {
  readonly id:   string;    // can't be changed
  name:  string;
  email: string;
  age?:  number;            // optional
  role:  "admin" | "user"; // literal union
}

// Type aliases — name any type
type UserId    = string;
type Status    = "pending" | "active" | "inactive";
type Callback  = (err: Error | null, data: unknown) => void;

// Generics — write functions that work with any type
function firstItem<T>(arr: T[]): T | undefined { return arr[0]; }
const name3 = firstItem(["Alice", "Bob"]); // TypeScript knows: string | undefined
const num   = firstItem([1, 2, 3]);         // TypeScript knows: number | undefined
```

### Utility Types: TypeScript's Built-In Helpers

```typescript
interface User { id: string; name: string; email: string; password: string; }

Partial<User>          // { id?: string; name?: string; ... } — all optional
Required<User>         // all required (opposite of Partial)
Readonly<User>         // all read-only
Pick<User, "id" | "name">      // { id: string; name: string }
Omit<User, "password">         // User without the password field
Record<string, User>   // object with string keys and User values
ReturnType<typeof fn>  // get what a function returns
Parameters<typeof fn>  // get a function's parameter types as tuple
Awaited<Promise<User>> // unwrap a Promise: just User
```

---

## Chapter 13 — TypeScript Advanced

> **File:** `13-typescript-advanced/13-typescript-advanced.ts`

### Classes With Full Type Safety

```typescript
class BankAccount {
  readonly id:      string;   // can be read, not written
  private balance:  number;   // only this class
  protected owner:  string;   // this class + subclasses
  public currency:  string;   // anywhere (default)

  constructor(owner: string, balance = 0) {
    this.id      = crypto.randomUUID();
    this.owner   = owner;
    this.balance = balance;
    this.currency = "USD";
  }

  deposit(amount: number): this {  // 'this' type enables method chaining
    this.balance += amount;
    return this;
  }
}
```

### Advanced Type Features

```typescript
// Conditional types
type IsArray<T> = T extends any[] ? true : false;
type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false

// Mapped types — transform every property
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Optional<T> = { [K in keyof T]?: T[K] };

// Template literal types (TS 4.1+)
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickHandler = EventName<"click">; // "onClick"

// The satisfies operator (TS 4.9+) — validate type without losing specificity
const palette = {
  red: [255, 0, 0], green: "#00ff00"
} satisfies Record<string, string | number[]>;
// palette.red is number[], not string | number[]

// Discriminated unions with exhaustive checking
type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number };
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default:
      const _: never = shape; // TypeScript catches unhandled cases!
      return _;
  }
}
```

### Real-World Pattern: Typed Event Emitter

```typescript
type AppEvents = {
  "user:login":   { userId: string; timestamp: Date };
  "order:placed": { orderId: string; total: number };
};

class TypedEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {}
  emit<K extends keyof Events>(event: K, data: Events[K]): void {}
}

const emitter = new TypedEmitter<AppEvents>();
emitter.on("user:login", ({ userId, timestamp }) => {
  // TypeScript knows: userId is string, timestamp is Date
});
emitter.emit("user:login", { userId: "u-1", timestamp: new Date() }); // ✅
// emitter.emit("user:login", { userId: 42 }); // ❌ userId must be string
```

### Migrating JavaScript to TypeScript

**The gradual approach** — you don't have to convert everything at once:

```
Step 1: Install TypeScript: npm i -D typescript
Step 2: Create tsconfig.json with "allowJs": true
Step 3: Rename files .js → .ts one at a time
Step 4: Fix errors as you go (TypeScript guides you)
Step 5: Add "strict": true and fix remaining issues
```

TypeScript provides value even at 50% coverage. Start, don't wait for perfection.

---

## Quick Reference Cheat Sheet

### Variables & Types

```javascript
const x = 10;         // immutable binding
let y = 20;           // mutable binding
typeof x              // "number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint"
x === y               // strict equality (always use this)
x == y                // loose equality with coercion (avoid)
Number.isNaN(x)       // proper NaN check
Array.isArray(x)      // proper array check
```

### String Methods

```javascript
str.length                    str.at(-1)           // last char
str.toUpperCase()             str.toLowerCase()
str.trim()                    str.trimStart()       str.trimEnd()
str.includes("x")             str.startsWith("x")  str.endsWith("x")
str.indexOf("x")              str.lastIndexOf("x")
str.slice(start, end)         str.slice(-3)         // last 3 chars
str.replace("x", "y")        str.replaceAll("x", "y")
str.split(", ")               str.join             // array method
str.padStart(5, "0")          str.padEnd(5, ".")
str.repeat(n)
`Hello ${name}, score: ${n.toFixed(2)}`            // template literal
```

### Array Methods

```javascript
// Non-mutating (return new array/value)
arr.map(fn)           // transform each element
arr.filter(fn)        // keep matching elements
arr.reduce(fn, init)  // fold to one value
arr.find(fn)          // first match or undefined
arr.findIndex(fn)     // index of first match or -1
arr.some(fn)          // any match?
arr.every(fn)         // all match?
arr.includes(x)       // contains x?
arr.indexOf(x)        // index of x or -1
arr.flat()            // flatten one level
arr.flatMap(fn)       // map + flat(1)
arr.slice(start, end) // extract portion
arr.concat(arr2)      // combine arrays
arr.join(sep)         // array to string
arr.at(i)             // element at index (supports negative)
arr.toSorted(fn)      // sorted copy (ES2023)
arr.toReversed()      // reversed copy (ES2023)
arr.with(i, val)      // updated copy (ES2023)

// Mutating (modify original)
arr.push(...items)    // add to end, returns new length
arr.pop()             // remove from end, returns removed item
arr.shift()           // remove from start
arr.unshift(...items) // add to start
arr.splice(i, n, ...items) // remove/insert at position
arr.sort(fn)          // sort in place (mutates!)
arr.reverse()         // reverse in place (mutates!)
arr.fill(val, start, end)

// Creating
Array.from(iterable)
Array.from({length: 5}, (_, i) => i) // [0,1,2,3,4]
[...new Set(arr)]     // deduplicate
```

### Object Methods

```javascript
Object.keys(obj)              // ['a', 'b', 'c']
Object.values(obj)            // [1, 2, 3]
Object.entries(obj)           // [['a',1], ['b',2], ['c',3]]
Object.fromEntries(entries)   // inverse of entries
Object.assign({}, a, b)       // shallow merge (prefer spread)
Object.freeze(obj)            // immutable (shallow)
Object.create(proto)          // with specific prototype
Object.hasOwn(obj, "key")     // own property check (modern)
{ ...a, ...b }                // spread merge (prefer this)
```

### Async Patterns

```javascript
// Promise creation
new Promise((resolve, reject) => { })
Promise.resolve(value)
Promise.reject(error)

// Promise combinators
Promise.all([p1, p2])        // all succeed or fast-fail
Promise.allSettled([p1, p2]) // all settle, never rejects
Promise.race([p1, p2])       // first to settle
Promise.any([p1, p2])        // first to succeed

// async/await
async function fn() {
  try {
    const result = await somePromise;
    return result;
  } catch (err) {
    console.error(err);
  }
}

// Parallel (both start at same time)
const [a, b] = await Promise.all([fetch1(), fetch2()]);
```

### Modules

```javascript
// ESM (use for new code)
export const x = 1;
export function fn() {}
export default class {}
import { x, fn } from "./module.js";
import MyClass from "./module.js";
import * as ns from "./module.js";
const mod = await import("./module.js"); // dynamic

// CommonJS (Node.js legacy)
module.exports = { x, fn };
const { x, fn } = require("./module");
```

### TypeScript Quick Reference

```typescript
// Basic types
string | number | boolean | null | undefined | unknown | any | never | void

// Type aliases
type ID = string;
type Status = "active" | "inactive";

// Interfaces
interface User { id: string; name: string; age?: number; }
interface Admin extends User { permissions: string[]; }

// Generics
function identity<T>(value: T): T { return value; }
class Stack<T> { push(item: T): void {}; pop(): T {} }

// Utility types
Partial<T>       // all optional
Required<T>      // all required
Readonly<T>      // all readonly
Pick<T, "a"|"b"> // subset of keys
Omit<T, "a"|"b"> // exclude keys
Record<K, V>     // object type
ReturnType<F>    // function return type
Awaited<P>       // unwrap Promise

// Type guards
typeof x === "string"
x instanceof Date
Array.isArray(x)
function isUser(x: any): x is User { return "name" in x; }

// Non-null assertion
const name = user!.name; // tells TS: trust me, user is not null
```

---

*JavaScript has been the world's most-used language for over a decade for a reason: it's everywhere, it's capable, and once you understand it deeply, it's genuinely elegant. The weird parts — closures, prototypes, the event loop — aren't bugs. They're features with a specific design philosophy behind them. Learn the why, and the how becomes obvious.*

*Now go build something. 🚀*
