// ============================================================
// 07 - OBJECT-ORIENTED JAVASCRIPT
// ============================================================
// JavaScript's OOP is prototype-based — different from the
// class-based systems of Java, C++, or Python. ES6 classes are
// syntactic sugar over the prototype system, making it look
// familiar, but under the hood it's still prototypes.
// ============================================================


// ─────────────────────────────────────────────────────────────
// THE PROTOTYPE CHAIN: JavaScript's Inheritance System
// ─────────────────────────────────────────────────────────────

// Every object has a [[Prototype]] (its "parent").
// When you access a property, JS looks:
//   object → object's prototype → prototype's prototype → ... → null

const animal = {
  breathe() { return `${this.name} breathes`; },
  eat()     { return `${this.name} eats`; },
};

const dog = Object.create(animal); // dog's prototype IS animal
dog.name = "Rex";
dog.bark = function() { return `${this.name} barks!`; };

console.log(dog.bark());    // "Rex barks!" — own property
console.log(dog.breathe()); // "Rex breathes" — from prototype
console.log(dog.eat());     // "Rex eats" — from prototype

// The prototype chain lookup:
// dog.breathe → not in dog → look in animal → found! Call it.

// Check the chain
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty("name"));   // true
console.log(dog.hasOwnProperty("breathe")); // false (it's on the prototype)

// instanceof checks the chain
// dog instanceof Animal — would check if Animal.prototype is in dog's chain


// ─────────────────────────────────────────────────────────────
// ES6 CLASSES: The Modern Way
// ─────────────────────────────────────────────────────────────

class Animal {
  // Class fields (modern syntax)
  #name;       // private field (truly private, not just convention)
  #sound;
  static count = 0; // static field shared by all instances

  constructor(name, sound) {
    this.#name  = name;
    this.#sound = sound;
    Animal.count++;
  }

  // Getter/setter pair
  get name() { return this.#name; }
  set name(value) {
    if (!value.trim()) throw new Error("Name cannot be empty");
    this.#name = value.trim();
  }

  // Instance method
  speak() { return `${this.#name} says ${this.#sound}!`; }

  // Static method — called on the class, not instances
  static create(name, sound) { return new Animal(name, sound); }
  static getCount() { return Animal.count; }

  // toString for nice printing
  toString() { return `Animal(${this.#name})`; }
}

const cat = new Animal("Whiskers", "meow");
console.log(cat.speak());         // "Whiskers says meow!"
console.log(cat.name);            // "Whiskers" (via getter)
cat.name = "  Mittens  ";         // setter trims whitespace
console.log(Animal.count);        // number of created animals
// console.log(cat.#name);        // ❌ SyntaxError — truly private!


// ─────────────────────────────────────────────────────────────
// INHERITANCE WITH EXTENDS
// ─────────────────────────────────────────────────────────────

class Dog extends Animal {
  #breed;

  constructor(name, breed) {
    super(name, "woof");  // MUST call super() before using 'this'
    this.#breed = breed;
  }

  get breed() { return this.#breed; }

  // Override parent method
  speak() {
    return `${super.speak()} *wags tail*`; // call parent's speak
  }

  fetch(item) { return `${this.name} fetches ${item}`; }
}

const rex = new Dog("Rex", "Labrador");
console.log(rex.speak());  // "Rex says woof! *wags tail*"
console.log(rex.breed);    // "Labrador"
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true (inherits from Animal)


// ─────────────────────────────────────────────────────────────
// MIXINS: Compose Behavior Without Deep Inheritance
// ─────────────────────────────────────────────────────────────
// Inheritance is great for "is-a" relationships.
// Mixins are great for "has-ability" relationships.
// A class can only extend ONE class but can use many mixins.

const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify(this); }
  static deserialize(json) { return Object.assign(new this(), JSON.parse(json)); }
};

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  touch() { this.updatedAt = new Date(); }
};

const Validatable = (Base) => class extends Base {
  validate() {
    const errors = {};
    if (this.constructor.rules) {
      for (const [field, rule] of Object.entries(this.constructor.rules)) {
        const error = rule(this[field]);
        if (error) errors[field] = error;
      }
    }
    return Object.keys(errors).length ? errors : null;
  }
};

// Compose mixins
class User extends Serializable(Timestamped(Validatable(class {}))) {
  static rules = {
    name: v => !v ? "Name is required" : null,
    email: v => !v?.includes("@") ? "Invalid email" : null,
  };

  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
  }
}

const u = new User("Alice", "alice@example.com");
console.log(u.validate());    // null (no errors)
console.log(u.serialize());   // JSON string
console.log(u.createdAt);     // Date object


// ─────────────────────────────────────────────────────────────
// DESIGN PATTERNS
// ─────────────────────────────────────────────────────────────

// ── Singleton ─────────────────────────────────────────────────
class Database {
  static #instance = null;

  constructor(url) {
    if (Database.#instance) return Database.#instance;
    this.url = url;
    this.connected = false;
    Database.#instance = this;
  }

  connect() { this.connected = true; return this; }
  static getInstance() { return Database.#instance; }
}

const db1 = new Database("mongodb://localhost");
const db2 = new Database("anything-else");
console.log(db1 === db2); // true — same instance!


// ── Factory Pattern ───────────────────────────────────────────
class NotificationFactory {
  static create(type, options) {
    const creators = {
      email:  (opts) => new EmailNotification(opts),
      sms:    (opts) => new SMSNotification(opts),
      push:   (opts) => new PushNotification(opts),
    };
    if (!creators[type]) throw new Error(`Unknown type: ${type}`);
    return creators[type](options);
  }
}

class EmailNotification {
  constructor({ to, subject, body }) { this.to = to; this.subject = subject; this.body = body; }
  send() { console.log(`Email to ${this.to}: ${this.subject}`); }
}
class SMSNotification {
  constructor({ to, message }) { this.to = to; this.message = message; }
  send() { console.log(`SMS to ${this.to}: ${this.message}`); }
}
class PushNotification {
  constructor({ token, title }) { this.token = token; this.title = title; }
  send() { console.log(`Push to ${this.token}: ${this.title}`); }
}

const notification = NotificationFactory.create("email", {
  to: "alice@example.com", subject: "Hello", body: "..."
});
notification.send();


// ── Observer Pattern ─────────────────────────────────────────
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(listener);
    return () => this.off(event, listener); // return unsubscribe function!
  }

  off(event, listener) {
    const listeners = this.#events.get(event);
    if (listeners) {
      this.#events.set(event, listeners.filter(l => l !== listener));
    }
  }

  emit(event, ...args) {
    this.#events.get(event)?.forEach(listener => listener(...args));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

class Store extends EventEmitter {
  #state;

  constructor(initialState) {
    super();
    this.#state = initialState;
  }

  get state() { return { ...this.#state }; } // return copy

  setState(updates) {
    const prev = this.#state;
    this.#state = { ...this.#state, ...updates };
    this.emit("change", this.#state, prev);
  }
}

const store = new Store({ count: 0, user: null });
const unsub = store.on("change", (state) => console.log("State:", state));
store.setState({ count: 1 });
store.setState({ user: { name: "Alice" } });
unsub(); // stop listening
store.setState({ count: 2 }); // listener won't fire


// ── Strategy Pattern ─────────────────────────────────────────
class Sorter {
  constructor(strategy) { this.strategy = strategy; }
  sort(data) { return this.strategy(data); }
}

const bubbleSort = (arr) => {
  const a = [...arr];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
};

const quickSort = (arr) => arr.length <= 1 ? arr : (() => {
  const [pivot, ...rest] = arr;
  return [...quickSort(rest.filter(x => x <= pivot)), pivot, ...quickSort(rest.filter(x => x > pivot))];
})();

const sorter = new Sorter(quickSort);
console.log(sorter.sort([3, 1, 4, 1, 5, 9, 2, 6]));
sorter.strategy = bubbleSort; // swap strategy at runtime!


// ── Builder Pattern ──────────────────────────────────────────
class QueryBuilder {
  #table = "";
  #conditions = [];
  #columns = ["*"];
  #limit = null;
  #offset = null;
  #orderBy = null;

  from(table)     { this.#table = table; return this; }
  select(...cols) { this.#columns = cols; return this; }
  where(cond)     { this.#conditions.push(cond); return this; }
  limit(n)        { this.#limit = n; return this; }
  offset(n)       { this.#offset = n; return this; }
  orderBy(col, dir = "ASC") { this.#orderBy = `${col} ${dir}`; return this; }

  build() {
    let query = `SELECT ${this.#columns.join(", ")} FROM ${this.#table}`;
    if (this.#conditions.length) query += ` WHERE ${this.#conditions.join(" AND ")}`;
    if (this.#orderBy) query += ` ORDER BY ${this.#orderBy}`;
    if (this.#limit)   query += ` LIMIT ${this.#limit}`;
    if (this.#offset)  query += ` OFFSET ${this.#offset}`;
    return query;
  }
}

const query = new QueryBuilder()
  .from("users")
  .select("id", "name", "email")
  .where("active = true")
  .where("age >= 18")
  .orderBy("name")
  .limit(20)
  .offset(0)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE active = true AND age >= 18 ORDER BY name ASC LIMIT 20 OFFSET 0
