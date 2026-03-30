// ============================================================
// 03 - OBJECTS AND ARRAYS
// ============================================================
// Objects and arrays are the workhorses of JavaScript data
// manipulation. Master these and you can handle almost any
// data transformation task — from filtering API responses
// to building complex UI state.
// ============================================================


// ─────────────────────────────────────────────────────────────
// OBJECTS: Key-Value Stores
// ─────────────────────────────────────────────────────────────

// Object literals
const user = {
  name: "Alice",
  age: 30,
  "email address": "alice@example.com", // keys with spaces need quotes
  greet() {                              // method shorthand (ES6)
    return `Hi, I'm ${this.name}`;
  },
  get fullInfo() {                       // getter
    return `${this.name}, ${this.age}`;
  },
  set displayName(value) {               // setter
    this.name = value.trim();
  }
};

// Property access
console.log(user.name);              // dot notation (prefer this)
console.log(user["age"]);            // bracket notation (needed for dynamic keys)
console.log(user["email address"]);  // required for keys with spaces

// Dynamic property access
const prop = "name";
console.log(user[prop]); // "Alice" — can't do user.prop for dynamic keys

// Computed property names
const prefix = "user";
const dynamic = {
  [`${prefix}Id`]: 1,
  [`${prefix}Name`]: "Alice",
};
console.log(dynamic.userId);   // 1
console.log(dynamic.userName); // "Alice"

// Property shorthand — when variable name matches key name
const name2 = "Bob";
const age2 = 25;
const userShorthand = { name: name2, age: age2 }; // old way
const userShorthand2 = { name: name2, age: age2 }; // still explicit
const user2 = { name: name2, age: age2 };           // shorthand would be: { name2, age2 } if variable names matched

const x = 10, y = 20;
const point = { x, y }; // { x: 10, y: 20 } — shorthand!

// Adding, updating, deleting properties
user.city = "NYC";          // add
user.age = 31;              // update
delete user.city;           // delete (avoid — makes engines deoptimize)
// Better: set to undefined or null rather than delete


// ─────────────────────────────────────────────────────────────
// OBJECT UTILITY METHODS
// ─────────────────────────────────────────────────────────────

const person = { name: "Alice", age: 30, role: "admin" };

// Object.keys / values / entries
console.log(Object.keys(person));    // ["name", "age", "role"]
console.log(Object.values(person));  // ["Alice", 30, "admin"]
console.log(Object.entries(person)); // [["name","Alice"], ["age",30], ["role","admin"]]

// Iterate over entries — the most useful pattern
for (const [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`);
}

// Transform object values
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2, c: 3 }).map(([k, v]) => [k, v * 2])
);
console.log(doubled); // { a: 2, b: 4, c: 6 }

// Object.assign — shallow merge (mutates target)
const defaults = { color: "blue", size: "md", visible: true };
const custom = { color: "red" };
const merged = Object.assign({}, defaults, custom); // empty {} is target
console.log(merged); // { color: "red", size: "md", visible: true }

// Spread is usually cleaner for merging:
const merged2 = { ...defaults, ...custom };

// Object.freeze — make an object immutable
const config = Object.freeze({ apiUrl: "https://api.example.com", timeout: 5000 });
config.timeout = 10000; // silently fails (throws in strict mode)
console.log(config.timeout); // still 5000

// Object.freeze is SHALLOW — nested objects are still mutable
const shallowFreeze = Object.freeze({ nested: { count: 0 } });
shallowFreeze.nested.count = 99; // ✅ This DOES work!

// Object.create — create with a specific prototype
const animalProto = {
  speak() { return `${this.name} says ${this.sound}`; }
};
const dog = Object.create(animalProto);
dog.name = "Rex";
dog.sound = "woof";
console.log(dog.speak()); // "Rex says woof"

// Check if property exists
console.log("name" in person);                    // true (includes prototype chain)
console.log(person.hasOwnProperty("name"));       // true (own properties only)
console.log(Object.hasOwn(person, "name"));       // true (modern, prefer this)
console.log(Object.hasOwn(person, "toString"));   // false (inherited, not own)

// Optional chaining with objects
const config2 = {
  database: {
    host: "localhost",
    port: 5432
  }
};
console.log(config2?.database?.host);   // "localhost"
console.log(config2?.cache?.host);      // undefined (safe!)
console.log(config2?.database?.toString()); // "[object Object]"


// ─────────────────────────────────────────────────────────────
// ARRAYS: Ordered Collections
// ─────────────────────────────────────────────────────────────

const numbers = [1, 2, 3, 4, 5];

// Basic operations
console.log(numbers.length);     // 5
console.log(numbers[0]);         // 1 (first)
console.log(numbers.at(-1));     // 5 (last — .at() is modern, great for negative indexing)
console.log(numbers.at(-2));     // 4

// Mutating methods (change the original array)
const arr = [1, 2, 3];
arr.push(4);          // add to end → [1,2,3,4]
arr.pop();            // remove from end → [1,2,3]
arr.unshift(0);       // add to start → [0,1,2,3]
arr.shift();          // remove from start → [1,2,3]
arr.splice(1, 1);     // remove 1 element at index 1 → [1,3]
arr.splice(1, 0, 2);  // insert 2 at index 1 → [1,2,3]
arr.reverse();        // reverse in place → [3,2,1]
arr.sort();           // sort in place (string sort by default!)
arr.fill(0, 1, 3);    // fill indices 1-3 with 0

// ⚠️ sort() gotcha — default is STRING comparison
console.log([10, 9, 2, 1, 11].sort()); // [1, 10, 11, 2, 9] — WRONG!
console.log([10, 9, 2, 1, 11].sort((a, b) => a - b)); // [1, 2, 9, 10, 11] — correct


// ─────────────────────────────────────────────────────────────
// THE BIG FIVE ARRAY METHODS
// These are the foundation of modern JavaScript data processing
// ─────────────────────────────────────────────────────────────

const people = [
  { name: "Alice", age: 30, city: "NYC", salary: 95000 },
  { name: "Bob",   age: 25, city: "LA",  salary: 72000 },
  { name: "Carol", age: 35, city: "NYC", salary: 120000 },
  { name: "Dave",  age: 28, city: "LA",  salary: 85000 },
  { name: "Eve",   age: 42, city: "NYC", salary: 150000 },
];

// 1. map() — transform each element, returns new array of same length
const names = people.map(p => p.name);
console.log(names); // ["Alice", "Bob", "Carol", "Dave", "Eve"]

const withTax = people.map(p => ({
  ...p,
  salaryAfterTax: p.salary * 0.75
}));

// 2. filter() — keep elements matching predicate, returns new array
const nycPeople = people.filter(p => p.city === "NYC");
console.log(nycPeople.map(p => p.name)); // ["Alice", "Carol", "Eve"]

const highEarners = people.filter(p => p.salary > 90000);

// 3. reduce() — fold entire array into one value
// reduce(callback(accumulator, currentValue), initialValue)
const totalSalary = people.reduce((total, p) => total + p.salary, 0);
console.log(totalSalary); // 522000

// Group by city — classic reduce pattern
const byCity = people.reduce((groups, person) => {
  const city = person.city;
  if (!groups[city]) groups[city] = [];
  groups[city].push(person);
  return groups;
}, {});
console.log(Object.keys(byCity)); // ["NYC", "LA"]

// 4. find() — returns first matching element (or undefined)
const alice = people.find(p => p.name === "Alice");
console.log(alice); // { name: "Alice", ... }

const nobody = people.find(p => p.age > 100);
console.log(nobody); // undefined

// 5. some() and every() — boolean queries
const anyNYC     = people.some(p => p.city === "NYC");    // true
const allAdults  = people.every(p => p.age >= 18);        // true
const allNYC     = people.every(p => p.city === "NYC");   // false

// Chaining — read like a pipeline
const result = people
  .filter(p => p.city === "NYC")           // only NYC residents
  .sort((a, b) => b.salary - a.salary)     // sort by salary descending
  .slice(0, 2)                             // take top 2
  .map(p => `${p.name}: $${p.salary.toLocaleString()}`);

console.log(result); // ["Eve: $150,000", "Carol: $120,000"]


// ─────────────────────────────────────────────────────────────
// MORE ARRAY METHODS
// ─────────────────────────────────────────────────────────────

// indexOf / includes — searching
const fruits = ["apple", "banana", "cherry", "banana"];
console.log(fruits.indexOf("banana"));  // 1 (first occurrence)
console.log(fruits.lastIndexOf("banana")); // 3
console.log(fruits.includes("cherry")); // true
console.log(fruits.indexOf("mango"));   // -1 (not found)

// findIndex — like find but returns the index
const oldestIdx = people.findIndex(p => p.age === Math.max(...people.map(p => p.age)));

// flat() and flatMap()
const nested = [[1, 2], [3, 4], [5]];
console.log(nested.flat());     // [1, 2, 3, 4, 5]

const deepNested = [1, [2, [3, [4]]]];
console.log(deepNested.flat(Infinity)); // [1, 2, 3, 4]

// flatMap = map + flat(1) — very useful
const sentences = ["Hello world", "foo bar baz"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // ["Hello", "world", "foo", "bar", "baz"]

// slice() — extract a portion (non-mutating)
const arr2 = [1, 2, 3, 4, 5];
console.log(arr2.slice(1, 3));  // [2, 3]
console.log(arr2.slice(2));     // [3, 4, 5]
console.log(arr2.slice(-2));    // [4, 5]
console.log(arr2.slice());      // [1, 2, 3, 4, 5] (copy!)

// concat() — combine arrays (non-mutating)
console.log([1, 2].concat([3, 4], [5, 6])); // [1, 2, 3, 4, 5, 6]
// Spread is usually cleaner: [...[1,2], ...[3,4]]

// join() — array to string
console.log(["Alice", "Bob", "Carol"].join(", ")); // "Alice, Bob, Carol"
console.log([2024, 1, 15].join("-"));               // "2024-1-15"

// Array.from() — create from iterable or array-like
console.log(Array.from("hello"));          // ['h','e','l','l','o']
console.log(Array.from({length: 5}, (_, i) => i)); // [0,1,2,3,4]
console.log(Array.from(new Set([1,2,2,3]))); // [1,2,3]

// Array.of() — create from arguments
console.log(Array.of(1, 2, 3)); // [1, 2, 3]

// forEach() — for side effects (doesn't return anything)
people.forEach((person, index) => {
  console.log(`${index + 1}. ${person.name}`);
});

// Spread in arrays
const first3 = [1, 2, 3];
const last3 = [4, 5, 6];
const all = [...first3, ...last3];   // [1,2,3,4,5,6]
const copy = [...all];                // shallow copy


// ─────────────────────────────────────────────────────────────
// SETS: Unique Value Collections
// ─────────────────────────────────────────────────────────────
// Sets store UNIQUE values. Much faster than arrays for
// membership checks (.has() is O(1) vs O(n) for array.includes())

const set = new Set([1, 2, 3, 2, 1]); // duplicates removed
console.log(set.size);        // 3
console.log(set.has(2));      // true (O(1))
set.add(4);
set.delete(1);
console.log([...set]);        // [2, 3, 4]

// Remove duplicates from an array — one-liner
const dupes = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(dupes)]; // [1, 2, 3, 4]

// Set operations (JavaScript doesn't have them built in, but easy to make)
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const union        = new Set([...setA, ...setB]);          // {1,2,3,4,5,6}
const intersection = new Set([...setA].filter(x => setB.has(x))); // {3,4}
const difference   = new Set([...setA].filter(x => !setB.has(x))); // {1,2}


// ─────────────────────────────────────────────────────────────
// MAPS: Key-Value with Any Key Type
// ─────────────────────────────────────────────────────────────
// Maps are like objects but:
// - Any value can be a key (not just strings/symbols)
// - Maintain insertion order
// - Have a size property
// - No inherited keys (safer)
// - Better performance for frequent adds/deletes

const map = new Map();

// Any value as key
map.set("string key", "value1");
map.set(42, "value2");
map.set({ id: 1 }, "value3");  // object as key!
map.set(true, "value4");

console.log(map.get("string key")); // "value1"
console.log(map.get(42));           // "value2"
console.log(map.size);              // 4
console.log(map.has("string key")); // true

// Create from array of pairs
const roleMap = new Map([
  ["alice", "admin"],
  ["bob",   "editor"],
  ["carol", "viewer"],
]);

for (const [user3, role] of roleMap) {
  console.log(`${user3}: ${role}`);
}

// Map vs Object — when to use which:
// Use Map when:
// - Keys aren't strings (DOM nodes, objects)
// - Frequent insertions/deletions
// - Need to iterate in insertion order
// - Need to know the size
// Use Object when:
// - JSON serialization needed (maps don't serialize)
// - Simple string-keyed data
// - Using known keys with dot notation

// Count occurrences — Map shines here
function countOccurrences(arr) {
  return arr.reduce((map, item) => {
    map.set(item, (map.get(item) || 0) + 1);
    return map;
  }, new Map());
}

const wordCounts = countOccurrences("the quick brown fox the lazy fox".split(" "));
console.log([...wordCounts.entries()]); // [["the",2],["quick",1],...,["fox",2]]
console.log(wordCounts.get("the")); // 2


// ─────────────────────────────────────────────────────────────
// WEAKMAP AND WEAKSET: Garbage-Collection Friendly
// ─────────────────────────────────────────────────────────────
// Keys in WeakMap must be objects. If the object is garbage
// collected, the entry is automatically removed. Useful for
// attaching private data to objects without memory leaks.

const privateData = new WeakMap();

class Widget {
  constructor(name) {
    privateData.set(this, { name, clickCount: 0 });
  }
  click() {
    const data = privateData.get(this);
    data.clickCount++;
  }
  getClickCount() {
    return privateData.get(this).clickCount;
  }
}

const btn = new Widget("submitButton");
btn.click();
btn.click();
console.log(btn.getClickCount()); // 2
// When 'btn' is garbage collected, its entry in privateData is too.
// This prevents memory leaks — the private data doesn't outlive the object.
