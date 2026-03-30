// ============================================================
// 02 - FUNCTIONS
// ============================================================
// Functions are the heart of JavaScript. They're first-class
// citizens — you can pass them as arguments, return them from
// other functions, and store them in variables. This flexibility
// is what makes JavaScript patterns like callbacks, promises,
// and functional programming possible.
// ============================================================


// ─────────────────────────────────────────────────────────────
// WAYS TO DEFINE A FUNCTION
// ─────────────────────────────────────────────────────────────

// 1. Function declaration — hoisted to the top of its scope
//    (you can call it before it appears in the file)
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice")); // Works even though it's called below the definition
// Actually, hoisting means JS processes declarations first, so this would
// work even if greet() call appeared above the declaration.

// 2. Function expression — stored in a variable, NOT hoisted
const greetExpr = function(name) {
  return `Hello, ${name}!`;
};

// 3. Named function expression — has a name, but still expression
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // can use 'fact' to recurse
};
// fact(5); // ❌ 'fact' is not available outside the expression
console.log(factorial(5)); // 120

// 4. Arrow function — concise syntax, different 'this' behavior (see below)
const greetArrow = (name) => `Hello, ${name}!`;
const double = n => n * 2;                // parens optional for single param
const add = (a, b) => a + b;             // implicit return for single expression
const getUser = () => ({ name: "Alice" }); // wrap object in parens to distinguish from block


// ─────────────────────────────────────────────────────────────
// PARAMETERS: defaults, rest, and destructuring
// ─────────────────────────────────────────────────────────────

// Default parameters
function createUser(name, role = "viewer", active = true) {
  return { name, role, active };
}
console.log(createUser("Alice"));              // { name:"Alice", role:"viewer", active:true }
console.log(createUser("Bob", "admin"));       // { name:"Bob", role:"admin", active:true }
console.log(createUser("Carol", undefined, false)); // undefined triggers default!

// Rest parameters — collect remaining args into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum(10, 20));          // 30

// Rest must be last
function first(a, b, ...rest) {
  console.log(a, b, rest); // 1 2 [3, 4, 5]
}
first(1, 2, 3, 4, 5);

// Destructured parameters — very common in React/modern JS
function renderCard({ title, description, image = "/default.jpg", tags = [] }) {
  return `<div class="card">
    <img src="${image}" alt="${title}">
    <h2>${title}</h2>
    <p>${description}</p>
    <ul>${tags.map(t => `<li>${t}</li>`).join("")}</ul>
  </div>`;
}

renderCard({
  title: "JavaScript Guide",
  description: "Learn JS from scratch",
  tags: ["programming", "web"]
});


// ─────────────────────────────────────────────────────────────
// CLOSURES: The Most Important JavaScript Concept
// ─────────────────────────────────────────────────────────────
// A closure is a function that "remembers" the variables from
// its outer scope, even after that outer scope has finished.
//
// This is NOT magic — it's how JavaScript's scope chain works.
// Every function carries a reference to its lexical environment.

function makeCounter(start = 0) {
  let count = start; // This variable lives in the closure

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    reset()     { count = start; return count; },
    value()     { return count; }
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.value());     // 11
console.log(counter.reset());     // 10

// 'count' is private — can't be accessed from outside!
// This is how you do encapsulation in JavaScript without classes.

// Closure for data privacy
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  const transactions = [];

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      transactions.push({ type: "deposit", amount, balance });
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactions.push({ type: "withdrawal", amount, balance });
      return balance;
    },
    getBalance() { return balance; },
    getHistory() { return [...transactions]; } // return a copy, not original
  };
}

const account = createBankAccount(1000);
account.deposit(500);
account.withdraw(200);
console.log(account.getBalance());  // 1300
console.log(account.getHistory()); // [...transaction records]
// console.log(balance);            // ❌ ReferenceError — truly private!

// Closure for memoization (caching expensive results)
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveSquare = memoize((n) => {
  console.log(`Computing ${n}²...`);
  return n * n;
});

console.log(expensiveSquare(10)); // Computing 100
console.log(expensiveSquare(10)); // Cache hit! 100
console.log(expensiveSquare(15)); // Computing 225

// The classic closure gotcha — and the fix
// Old buggy way:
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() { return i; }); // all capture the SAME var i
}
console.log(funcs[0]()); // 3 — NOT 0! (var is function-scoped, loop already finished)
console.log(funcs[1]()); // 3
console.log(funcs[2]()); // 3

// Fix 1: use let instead of var (creates new binding per iteration)
const funcs2 = [];
for (let j = 0; j < 3; j++) {
  funcs2.push(function() { return j; }); // each iteration gets its own j
}
console.log(funcs2[0]()); // 0 ✅
console.log(funcs2[1]()); // 1 ✅
console.log(funcs2[2]()); // 2 ✅

// Fix 2: use an IIFE to capture the value (old-school approach)
const funcs3 = [];
for (var k = 0; k < 3; k++) {
  funcs3.push((function(captured) {
    return function() { return captured; };
  })(k)); // immediately invoke with current k
}


// ─────────────────────────────────────────────────────────────
// HIGHER-ORDER FUNCTIONS (HOF)
// ─────────────────────────────────────────────────────────────
// A function that takes a function as an argument OR returns
// a function. This is the foundation of functional programming.

// Functions as arguments (callbacks)
function doTwice(fn) {
  fn();
  fn();
}
doTwice(() => console.log("Hello!")); // Hello! Hello!

// Functions as return values (function factories)
function multiply(factor) {
  return function(number) {    // returns a new function
    return number * factor;
  };
}
const double2 = multiply(2);
const triple  = multiply(3);
console.log(double2(5));  // 10
console.log(triple(5));   // 15

// Compose functions (do A then B)
function compose(...fns) {
  return function(value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

function pipe(...fns) {
  return function(value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

const normalize = pipe(
  str => str.trim(),
  str => str.toLowerCase(),
  str => str.replace(/\s+/g, "-")
);

console.log(normalize("  Hello World  ")); // "hello-world"

// Partial application — pre-fill some arguments
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function log(level, message, timestamp = new Date().toISOString()) {
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
}

const info  = partial(log, "info");
const error = partial(log, "error");
info("Server started");    // [timestamp] INFO: Server started
error("Database down");    // [timestamp] ERROR: Database down

// Currying — transform a multi-arg function into chain of single-arg functions
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3));  // 6
console.log(curriedAdd(1, 2)(3));  // 6
console.log(curriedAdd(1)(2, 3));  // 6
console.log(curriedAdd(1, 2, 3));  // 6


// ─────────────────────────────────────────────────────────────
// THIS: The Most Confusing Thing in JavaScript
// ─────────────────────────────────────────────────────────────
// 'this' refers to different things depending on HOW a function is called.

// Rule 1: As a method — 'this' is the object before the dot
const obj = {
  name: "Alice",
  greet() {
    console.log(`Hi, I'm ${this.name}`); // this = obj
  }
};
obj.greet(); // "Hi, I'm Alice"

// Rule 2: As a regular function — 'this' is undefined (strict mode) or global
function whoAmI() {
  console.log(this); // undefined in strict mode, global in sloppy mode
}
whoAmI();

// Rule 3: Arrow functions — NO own 'this'. Inherits from enclosing scope.
const timer = {
  seconds: 0,
  startBroken() {
    setInterval(function() {
      this.seconds++; // ❌ 'this' is NOT timer here — it's undefined/global
      console.log(this.seconds);
    }, 1000);
  },
  startFixed() {
    setInterval(() => {
      this.seconds++; // ✅ arrow function inherits 'this' from startFixed's scope
      console.log(this.seconds);
    }, 1000);
  }
};

// Rule 4: Explicit binding — call, apply, bind
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

introduce.call(person1, "Hello", "!");   // "Hello, I'm Alice!"
introduce.call(person2, "Hey", ".");     // "Hey, I'm Bob."

introduce.apply(person1, ["Hello", "!"]); // same as call but args as array

const aliceIntro = introduce.bind(person1); // returns a NEW function
aliceIntro("Hi", "..."); // "Hi, I'm Alice..."

// Rule 5: new — 'this' is the newly created object
function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log(`I'm ${this.name}`);
  };
}
const alice = new Person("Alice");
alice.greet(); // "I'm Alice"


// ─────────────────────────────────────────────────────────────
// IIFE: Immediately Invoked Function Expression
// ─────────────────────────────────────────────────────────────
// Execute a function the moment it's defined.
// Classic use: create a private scope (before ES6 modules).

(function() {
  const privateVar = "I'm private to this IIFE";
  console.log(privateVar);
})(); // <- immediately invoked

// Arrow function IIFE
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with return value
const result = (() => {
  const x = 10;
  const y = 20;
  return x + y;
})();
console.log(result); // 30

// Modern use: top-level await in Node.js scripts
// (async () => {
//   const data = await fetchSomething();
//   console.log(data);
// })();


// ─────────────────────────────────────────────────────────────
// GENERATORS: Functions that pause and resume
// ─────────────────────────────────────────────────────────────
// Generator functions use function* syntax and yield values
// one at a time. The caller controls when execution resumes.

function* counter2(start = 0, step = 1) {
  let current = start;
  while (true) {       // infinite, but only runs when asked
    yield current;
    current += step;
  }
}

const evens = counter2(0, 2);
console.log(evens.next().value); // 0
console.log(evens.next().value); // 2
console.log(evens.next().value); // 4

// Generator for finite sequences
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8]

// Generators are iterables — use in for...of
for (const num of range(1, 5)) {
  console.log(num); // 1 2 3 4
}

// Generator for lazy data processing (memory efficient)
function* processLargeDataset(data) {
  for (const item of data) {
    yield transform(item); // process one at a time, not all at once
  }
}

function transform(x) { return x * 2; }

// Only materializes values as needed
const processed = processLargeDataset([1, 2, 3, 4, 5]);
for (const value of processed) {
  console.log(value);
}
