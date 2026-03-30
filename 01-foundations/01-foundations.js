// ============================================================
// 01 - JAVASCRIPT FOUNDATIONS
// ============================================================
// Welcome. JavaScript is the only language that runs natively
// in every browser on earth, on servers (Node.js), in mobile
// apps, IoT devices, and even space rovers. Learning it well
// is one of the highest-leverage things a developer can do.
//
// This file covers the ground floor: variables, types,
// operators, and control flow. Everything else builds on this.
//
// Run this file:
//   node 01-foundations.js
// Or paste sections into your browser's DevTools console.
// ============================================================


// ─────────────────────────────────────────────────────────────
// VARIABLES: let, const, and var
// ─────────────────────────────────────────────────────────────
// JavaScript has three ways to declare variables.
// The honest advice: use const by default, let when you need
// to reassign, and treat var as a historical artifact.

const name = "Alice";   // Cannot be reassigned — use this first
let   age  = 30;        // Can be reassigned — use when value changes
var   city = "NYC";     // Old way — has confusing scoping rules, avoid

// const ≠ immutable. It means the BINDING can't change.
const user = { name: "Alice" };
user.name = "Bob";      // ✅ This is fine — we're mutating, not reassigning
// user = {};           // ❌ TypeError — can't reassign the binding

// let can be reassigned
age = 31;               // ✅ Fine
age = "thirty-one";     // ✅ Also fine — JS doesn't enforce types (for now)

// Block scope: let and const are scoped to the nearest { }
{
  let blockScoped = "only visible here";
  const alsoBlock = "also only here";
}
// console.log(blockScoped); // ❌ ReferenceError — doesn't exist out here

// var is function-scoped, not block-scoped — this trips everyone up
{
  var functionScoped = "I leak out of blocks!";
}
console.log(functionScoped); // ✅ "I leak out of blocks!" — surprising!


// ─────────────────────────────────────────────────────────────
// TYPES: JavaScript's Eight Data Types
// ─────────────────────────────────────────────────────────────
// JavaScript is dynamically typed — variables don't have types,
// VALUES do. Any variable can hold any type at any time.

// ── Primitive types (stored by value) ────────────────────────

const aString   = "hello";              // string
const aNumber   = 42;                   // number (ALL numbers, int and float)
const aFloat    = 3.14;                 // also just "number"
const aBigInt   = 9007199254740991n;    // bigint (for huge integers, note n suffix)
const aBool     = true;                 // boolean (true or false)
const nothing   = null;                 // null (intentional absence of value)
const notDefined = undefined;           // undefined (accidental absence of value)
const aSymbol   = Symbol("unique");     // symbol (unique identifier, advanced use)

// ── Reference types (stored by reference) ────────────────────

const anObject  = { key: "value" };
const anArray   = [1, 2, 3];
const aFunction = function() {};

// The typeof operator reveals the type
console.log(typeof "hello");    // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object"  ← famous bug, has been this way since 1995
console.log(typeof {});         // "object"
console.log(typeof []);         // "object"  ← arrays are objects!
console.log(typeof function(){}); // "function"

// Better way to check for null:
const maybeNull = null;
console.log(maybeNull === null); // true — use strict equality

// Better way to check for arrays:
console.log(Array.isArray([1, 2, 3])); // true — reliable


// ─────────────────────────────────────────────────────────────
// STRINGS: More than just text
// ─────────────────────────────────────────────────────────────

const greeting = "Hello, World!";

// String methods (strings are immutable — these return NEW strings)
console.log(greeting.length);           // 13
console.log(greeting.toUpperCase());    // "HELLO, WORLD!"
console.log(greeting.toLowerCase());    // "hello, world!"
console.log(greeting.includes("World")); // true
console.log(greeting.startsWith("Hello")); // true
console.log(greeting.endsWith("!"));    // true
console.log(greeting.indexOf("World")); // 7
console.log(greeting.slice(7, 12));     // "World"
console.log(greeting.slice(-6));        // "orld!" (negative = from end)
console.log(greeting.replace("World", "JavaScript")); // "Hello, JavaScript!"
console.log(greeting.split(", "));     // ["Hello", "World!"]
console.log("  hello  ".trim());        // "hello"
console.log("ha".repeat(3));            // "hahaha"
console.log("5".padStart(3, "0"));      // "005"

// Template literals — use these over string concatenation
const firstName = "Alice";
const score = 95;
const message = `Hello, ${firstName}! Your score is ${score}/100.`;
// vs old way: "Hello, " + firstName + "! Your score is " + score + "/100."

// Template literals can span multiple lines:
const html = `
  <div class="card">
    <h2>${firstName}</h2>
    <p>Score: ${score}</p>
  </div>
`;

// Template literals can contain expressions:
console.log(`2 + 2 = ${2 + 2}`);      // "2 + 2 = 4"
console.log(`${score >= 90 ? "A" : "B"}`); // "A"


// ─────────────────────────────────────────────────────────────
// NUMBERS: The Details That Trip You Up
// ─────────────────────────────────────────────────────────────

console.log(0.1 + 0.2);         // 0.30000000000000004 — floating point!
console.log(0.1 + 0.2 === 0.3); // false — never compare floats with ===
// Fix: round before comparing
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

console.log(1 / 0);             // Infinity (not an error!)
console.log(-1 / 0);            // -Infinity
console.log(0 / 0);             // NaN (Not a Number)
console.log("hello" * 2);       // NaN

// NaN is the only value not equal to itself — use Number.isNaN()
console.log(NaN === NaN);          // false (!!!)
console.log(Number.isNaN(NaN));    // true
console.log(Number.isNaN("hello")); // false (unlike the old global isNaN())

// Number limits
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
// Beyond these, math gets imprecise. Use BigInt for larger numbers.

// Converting to numbers
console.log(Number("42"));     // 42
console.log(Number("3.14"));   // 3.14
console.log(Number(""));       // 0
console.log(Number("hello"));  // NaN
console.log(Number(true));     // 1
console.log(Number(false));    // 0
console.log(Number(null));     // 0
console.log(Number(undefined)); // NaN

console.log(parseInt("42px"));    // 42 (stops at non-numeric)
console.log(parseFloat("3.14em")); // 3.14

// Math object
console.log(Math.round(4.5));   // 5
console.log(Math.floor(4.9));   // 4
console.log(Math.ceil(4.1));    // 5
console.log(Math.abs(-7));      // 7
console.log(Math.max(1, 5, 3)); // 5
console.log(Math.min(1, 5, 3)); // 1
console.log(Math.pow(2, 8));    // 256 (same as 2 ** 8)
console.log(Math.sqrt(16));     // 4
console.log(Math.random());     // 0 to 0.999... (different each time)

// Random integer between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
console.log(randomInt(1, 6));  // simulates a die roll


// ─────────────────────────────────────────────────────────────
// EQUALITY: == vs === (use === always)
// ─────────────────────────────────────────────────────────────
// == performs type coercion (converts types before comparing)
// === checks value AND type (no coercion)

console.log(1 == "1");    // true  (coerced "1" to 1)
console.log(1 === "1");   // false (different types)
console.log(0 == false);  // true  (both coerce to 0)
console.log(0 === false); // false
console.log(null == undefined);  // true  (special case)
console.log(null === undefined); // false

// Rule: always use ===. The only time == makes sense is null checks:
// value == null   checks for both null AND undefined simultaneously
// But it's cleaner to just be explicit: value === null || value === undefined


// ─────────────────────────────────────────────────────────────
// TRUTHY AND FALSY: JavaScript's boolean coercion
// ─────────────────────────────────────────────────────────────
// Every value in JS can be used as a boolean.
// Falsy values: false, 0, -0, 0n, "", '', ``, null, undefined, NaN
// Everything else is truthy.

const falsyValues = [false, 0, -0, 0n, "", '', ``, null, undefined, NaN];
falsyValues.forEach(v => console.log(`${String(v).padEnd(10)} is falsy: ${!v}`));

// This is why you can write:
const username = getUserInput() || "Anonymous"; // fallback if input is falsy
const user2 = getUser();
if (user2) { // truthy check
  console.log(user2.name);
}

function getUserInput() { return ""; } // simulated
function getUser() { return null; }   // simulated


// ─────────────────────────────────────────────────────────────
// OPERATORS
// ─────────────────────────────────────────────────────────────

// Arithmetic
console.log(10 + 3);  // 13
console.log(10 - 3);  // 7
console.log(10 * 3);  // 30
console.log(10 / 3);  // 3.3333...
console.log(10 % 3);  // 1 (remainder / modulo)
console.log(2 ** 8);  // 256 (exponentiation)

// Comparison
console.log(5 > 3);   // true
console.log(5 >= 5);  // true
console.log(5 < 3);   // false
console.log(5 !== 4); // true

// Logical
console.log(true && false); // false (AND: both must be true)
console.log(true || false); // true  (OR: at least one must be true)
console.log(!true);         // false (NOT: inverts)

// Short-circuit evaluation — crucial JavaScript pattern
// && stops at the first falsy value
console.log(false && doSomething()); // false (doSomething never called!)
console.log(null && "anything");     // null

// || stops at the first truthy value
console.log("Alice" || "default");  // "Alice"
console.log("" || "default");       // "default"
console.log(null || undefined || 0 || "first truthy"); // "first truthy"

function doSomething() { return "result"; }

// Nullish coalescing ?? — like || but only falls back on null/undefined
// (not on 0, false, "")
const volume = 0;
console.log(volume || 50);   // 50 (wrong! 0 is falsy)
console.log(volume ?? 50);   // 0  (correct! 0 is a valid value)

const setting = null;
console.log(setting ?? "default"); // "default" (falls back correctly)
console.log(setting || "default"); // "default" (same result here)

// Optional chaining ?. — safely access nested properties
const userObj = null;
// console.log(userObj.profile.avatar); // ❌ TypeError!
console.log(userObj?.profile?.avatar);  // ✅ undefined (short-circuits safely)
console.log(userObj?.getName?.());       // ✅ undefined if getName doesn't exist

const users = [{ name: "Alice" }, { name: "Bob" }];
console.log(users[0]?.name);    // "Alice"
console.log(users[99]?.name);   // undefined (safe!)

// Assignment operators
let x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x **= 2;  // x = 36
x %= 10;  // x = 6
x &&= 0;  // x = 0 (assign if x is truthy)
x ||= 42; // x = 42 (assign if x is falsy)
x ??= 99; // x = 42 (assign only if x is null/undefined)

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2, e: 5 }; // { a:1, b:2, c:3, d:4, e:5 }

// Later spread wins (useful for overrides)
const defaults = { color: "blue", size: "md", weight: "normal" };
const custom   = { color: "red", weight: "bold" };
const final    = { ...defaults, ...custom }; // { color:"red", size:"md", weight:"bold" }


// ─────────────────────────────────────────────────────────────
// CONTROL FLOW
// ─────────────────────────────────────────────────────────────

// if / else if / else
const hour = new Date().getHours();
let timeOfDay;
if (hour < 12) {
  timeOfDay = "morning";
} else if (hour < 17) {
  timeOfDay = "afternoon";
} else if (hour < 21) {
  timeOfDay = "evening";
} else {
  timeOfDay = "night";
}

// Ternary operator — inline if/else (for simple cases)
const isAdult = age >= 18 ? "adult" : "minor";
// Avoid nesting ternaries — they become unreadable fast

// switch statement
const day = "Wednesday";
switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break; // ⚠️ Don't forget break! Fall-through is intentional here for Mon-Fri
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Unknown day");
}

// for loop
for (let i = 0; i < 5; i++) {
  process.stdout.write(i + " "); // 0 1 2 3 4
}
console.log();

// while loop
let count = 0;
while (count < 3) {
  console.log(`Count: ${count}`);
  count++;
}

// do...while (runs at least once)
let attempts = 0;
do {
  attempts++;
  console.log(`Attempt ${attempts}`);
} while (attempts < 3);

// for...of — iterate over values (arrays, strings, Maps, Sets)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in — iterate over object keys (use with caution)
const person = { name: "Alice", age: 30, city: "NYC" };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
// Note: for...in also iterates inherited properties, use hasOwnProperty or Object.keys()

// Breaking and continuing
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // skip 3
  if (i === 7) break;    // stop at 7
  process.stdout.write(i + " "); // 0 1 2 4 5 6
}
console.log();

// Labeled loops (rare but useful for nested breaks)
outer: for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (row === 1 && col === 1) break outer; // exit both loops
    console.log(`${row},${col}`);
  }
}


// ─────────────────────────────────────────────────────────────
// DESTRUCTURING: Elegant unpacking
// ─────────────────────────────────────────────────────────────

// Array destructuring
const [first, second, third] = [10, 20, 30];
console.log(first, second, third); // 10 20 30

// Skip elements
const [, , justTheThird] = [1, 2, 3];

// Rest elements
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values
const [a = 0, b = 0, c = 0] = [1, 2]; // c defaults to 0

// Swap variables — elegant JS trick
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q); // 2 1

// Object destructuring
const { name: firstName2, age: personAge, city: personCity = "Unknown" } = person;
// Rename with colon, default with =
console.log(firstName2, personAge, personCity); // Alice 30 NYC

// Shorthand when variable name matches property name
const { name, age: age2 } = person; // same as { name: name }

// Nested destructuring
const config = {
  server: { host: "localhost", port: 3000 },
  db: { host: "db.local", port: 5432 }
};
const { server: { host, port }, db: { host: dbHost } } = config;
console.log(host, port, dbHost); // localhost 3000 db.local

// Destructuring in function parameters — very common pattern
function displayUser({ name, age, city = "Unknown" }) {
  console.log(`${name}, ${age}, ${city}`);
}
displayUser({ name: "Bob", age: 25 }); // Bob, 25, Unknown

// Destructuring with arrays in function return
function getMinMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1 9
