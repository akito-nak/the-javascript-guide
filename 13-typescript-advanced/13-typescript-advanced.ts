// ============================================================
// 13 - TYPESCRIPT ADVANCED
// ============================================================
// With the basics down, this chapter covers the features that
// make TypeScript truly powerful: advanced type system features,
// classes with full type safety, declaration files, and how to
// integrate TypeScript into real projects.
// ============================================================


// ─────────────────────────────────────────────────────────────
// CLASSES: OOP with Full Type Safety
// ─────────────────────────────────────────────────────────────

const classesTS = `
// TypeScript classes add access modifiers to JavaScript classes
class BankAccount {
  // public:    accessible anywhere (default)
  // private:   only accessible within this class
  // protected: accessible within this class and subclasses
  // readonly:  can only be set in constructor

  readonly id: string;
  private balance: number;
  protected owner: string;
  public currency: string;

  constructor(owner: string, initialBalance: number = 0) {
    this.id      = crypto.randomUUID();
    this.owner   = owner;
    this.balance = initialBalance;
    this.currency = "USD";
  }

  // Getter/setter with types
  get currentBalance(): number {
    return this.balance;
  }

  // Methods
  deposit(amount: number): this {         // 'this' return type for chaining
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.balance += amount;
    return this;
  }

  withdraw(amount: number): this {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    return this;
  }

  // Static members belong to the class, not instances
  static readonly MIN_BALANCE = 0;
  static create(owner: string, balance?: number): BankAccount {
    return new BankAccount(owner, balance);
  }
}

// Parameter shorthand: declare + assign in constructor
class User {
  constructor(
    public readonly id: string,
    public name: string,
    private email: string,
    protected role: "admin" | "user" = "user"
  ) {} // ← auto-creates and assigns: this.id, this.name, this.email, this.role

  getEmail(): string { return this.email; }
}

// Inheritance
class AdminUser extends User {
  constructor(
    id: string,
    name: string,
    email: string,
    public permissions: string[]
  ) {
    super(id, name, email, "admin");
  }

  hasPermission(perm: string): boolean {
    return this.permissions.includes(perm);
  }
}

// Abstract classes
abstract class Shape {
  constructor(protected color: string) {}

  abstract area(): number;       // must be implemented by subclass
  abstract perimeter(): number;

  describe(): string {           // concrete shared method
    return \`\${this.color} \${this.constructor.name}: area=\${this.area().toFixed(2)}\`;
  }
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }

  area(): number      { return Math.PI * this.radius ** 2; }
  perimeter(): number { return 2 * Math.PI * this.radius; }
}
`;


// ─────────────────────────────────────────────────────────────
// INTERFACES FOR CLASSES AND CONTRACTS
// ─────────────────────────────────────────────────────────────

const interfacesTS = `
// Interfaces define contracts that classes must fulfill
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Loggable {
  log(level: "info" | "warn" | "error", message: string): void;
}

// A class can implement multiple interfaces
class UserService implements Serializable, Loggable {
  private users: User[] = [];

  serialize(): string {
    return JSON.stringify(this.users);
  }

  deserialize(data: string): void {
    this.users = JSON.parse(data);
  }

  log(level: "info" | "warn" | "error", message: string): void {
    console[\`\${level}\`](\`[UserService] \${message}\`);
  }
}

// Interface for function signatures
interface Comparator<T> {
  (a: T, b: T): number;
}

const byAge: Comparator<User> = (a, b) => a.age - b.age;

// Interface merging (declaration merging)
interface Window {
  myCustomProperty: string; // Add to the built-in Window interface!
}

// Extending interfaces
interface Animal {
  name: string;
  sound(): string;
}

interface Pet extends Animal {
  owner: string;
  breed: string;
}

interface ServiceAnimal extends Pet {
  certification: string;
  tasks: string[];
}
`;


// ─────────────────────────────────────────────────────────────
// ADVANCED TYPE FEATURES
// ─────────────────────────────────────────────────────────────

const advancedTypesTS = `
// ── Conditional types ───────────────────────────────────────
type IsArray<T> = T extends any[] ? true : false;
type IsString<T> = T extends string ? "yes" : "no";

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false
type C = IsString<"hello">; // "yes"


// ── Infer within conditional types ──────────────────────────
type ArrayElement<T> = T extends (infer Element)[] ? Element : never;
type StringArrayElement = ArrayElement<string[]>; // string
type NumberArrayElement = ArrayElement<number[]>; // number


// ── Mapped types: transform every property ──────────────────
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // remove readonly
};

type Optional<T> = {
  [K in keyof T]?: T[K]; // make all optional (same as Partial<T>)
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Stringify<T> = {
  [K in keyof T]: string; // make all string
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; email: string | null }


// ── Template literal types ───────────────────────────────────
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickHandler = EventName<"click">;   // "onClick"
type HoverHandler = EventName<"hover">;   // "onHover"

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }


// ── The satisfies operator (TS 4.9+) ─────────────────────────
type Color = "red" | "green" | "blue";
const palette = {
  red:   [255, 0, 0],
  green: "#00ff00",
  blue:  [0, 0, 255],
} satisfies Record<Color, string | number[]>;
// satisfies checks against the type but preserves the specific types
// So palette.red is number[], not string | number[]


// ── Discriminated unions with exhaustive checks ──────────────
type Result<T, E = Error> =
  | { success: true;  data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { success: false, error: "Division by zero" };
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.data);  // TypeScript knows: result.data exists here
} else {
  console.error(result.error); // TypeScript knows: result.error exists here
}


// ── Type predicates: custom type guards ─────────────────────
interface Dog { kind: "dog"; bark(): void; }
interface Cat { kind: "cat"; meow(): void; }

function isDog(animal: Dog | Cat): animal is Dog {
  return animal.kind === "dog";
}

function makeNoise(animal: Dog | Cat): void {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows: animal is Dog here
  } else {
    animal.meow(); // TypeScript knows: animal is Cat here
  }
}


// ── Assertion functions ──────────────────────────────────────
function assertDefined<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

const maybeUser: User | null = getUser();
assertDefined(maybeUser, "User must exist");
// After this line, TypeScript knows maybeUser is User, not User | null
console.log(maybeUser.name); // ✅ safe!
`;


// ─────────────────────────────────────────────────────────────
// DECLARATION FILES (.d.ts)
// ─────────────────────────────────────────────────────────────

const declarationFilesTS = `
// .d.ts files contain ONLY type information — no actual code.
// They tell TypeScript what types a JavaScript library has.

// When you install: npm install lodash
// TypeScript asks: "What are the types for lodash?"
// When you install: npm install --save-dev @types/lodash
// That package contains: lodash.d.ts (the type declarations)

// You can also WRITE your own .d.ts files for untyped packages:

// mylib.d.ts
declare module "untyped-library" {
  export function doSomething(input: string): number;
  export const VERSION: string;

  interface Options {
    timeout: number;
    retries?: number;
  }

  export function configure(opts: Options): void;
}

// Augment existing types (declaration merging)
declare global {
  interface String {
    toSlug(): string; // add a method to all strings
  }

  interface Window {
    analytics: {
      track(event: string, properties?: Record<string, unknown>): void;
    };
  }
}

// Ambient declarations: tell TS about global variables
declare const __DEV__: boolean;
declare const __VERSION__: string;

// Environment variable types (process.env)
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    JWT_SECRET: string;
    PORT?: string; // optional
  }
}

// Now TypeScript knows the shape of process.env:
// process.env.NODE_ENV   — "development" | "production" | "test"
// process.env.RANDOM_KEY — string | undefined (unknown vars = undefined)
`;


// ─────────────────────────────────────────────────────────────
// TYPESCRIPT IN PRACTICE: REAL PATTERNS
// ─────────────────────────────────────────────────────────────

const realPatternsTS = `
// ── Pattern 1: Typed fetch wrapper ──────────────────────────
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
  }
  return response.json() as Promise<T>;
}

interface Post { id: number; title: string; body: string; userId: number; }

// TypeScript knows post is Post
const post = await fetchJson<Post>("https://jsonplaceholder.typicode.com/posts/1");
console.log(post.title); // ✅ fully typed


// ── Pattern 2: Builder pattern with method chaining ──────────
class QueryBuilder<T> {
  private conditions: string[] = [];
  private fields: (keyof T)[] = [];
  private limitValue?: number;

  select(...fields: (keyof T)[]): this {
    this.fields = fields;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  build(): string {
    const select = this.fields.length ? this.fields.join(", ") : "*";
    const where  = this.conditions.length ? \` WHERE \${this.conditions.join(" AND ")}\` : "";
    const limit  = this.limitValue ? \` LIMIT \${this.limitValue}\` : "";
    return \`SELECT \${select}\${where}\${limit}\`;
  }
}

interface User { id: number; name: string; email: string; age: number; }

const query = new QueryBuilder<User>()
  .select("name", "email")   // only allows valid User fields!
  .where("age > 18")
  .limit(10)
  .build();
// "SELECT name, email WHERE age > 18 LIMIT 10"


// ── Pattern 3: Event emitter with typed events ───────────────
type EventMap = Record<string, any>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): this {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }
}

// Define your app's events
type AppEvents = {
  "user:login":   { userId: string; timestamp: Date };
  "user:logout":  { userId: string };
  "order:placed": { orderId: string; total: number; items: string[] };
  "error":        { code: string; message: string };
};

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("user:login", ({ userId, timestamp }) => {
  // TypeScript knows the shape! userId is string, timestamp is Date
  console.log(\`User \${userId} logged in at \${timestamp.toISOString()}\`);
});

emitter.emit("user:login", { userId: "u-1", timestamp: new Date() }); // ✅
// emitter.emit("user:login", { userId: 42 }); // ❌ userId must be string


// ── Pattern 4: Dependency injection with interfaces ──────────
interface Logger {
  info(msg: string): void;
  error(msg: string, err?: Error): void;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger: Logger
  ) {}

  async getUserById(id: string): Promise<User> {
    this.logger.info(\`Fetching user \${id}\`);
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error(\`User \${id} not found\`);
    return user;
  }
}

// In tests: pass mock implementations
class MockUserRepo implements UserRepository {
  async findById(id: string) { return { id, name: "Test", email: "t@t.com", age: 25 }; }
  async save(user: User) { return user; }
}

class ConsoleLogger implements Logger {
  info(msg: string) { console.log(msg); }
  error(msg: string, err?: Error) { console.error(msg, err); }
}

const service = new UserService(new MockUserRepo(), new ConsoleLogger());
`;


// ─────────────────────────────────────────────────────────────
// MIGRATING FROM JAVASCRIPT TO TYPESCRIPT
// ─────────────────────────────────────────────────────────────

const migrationGuide = `
// Gradual migration strategy — the right way to adopt TypeScript

// Step 1: Add TypeScript to your project
// npm install --save-dev typescript @types/node
// npx tsc --init

// Step 2: Enable "allowJs": true in tsconfig.json
// This lets TypeScript check .js files too
// Set "checkJs": false initially (less strict for JS files)

// Step 3: Rename files one at a time: .js → .ts
// Fix errors as you go. TypeScript will guide you.

// Step 4: Replace 'any' with real types gradually
// Use // @ts-ignore for temporarily problematic lines
// Use // @ts-expect-error when you know there's an error

// Step 5: Enable stricter settings over time
// Start: "strict": false
// Add individual strict flags as you improve coverage:
// "noImplicitAny": true
// "strictNullChecks": true

// Step 6: Full strict mode
// "strict": true — and all your code stays clean

// The key: TypeScript doesn't have to be 100% typed to be useful.
// Even 50% typed code is massively better than 0% typed.


// Dealing with third-party libraries without types:
// Option 1: Install @types/packagename (often available)
//   npm install --save-dev @types/lodash @types/express

// Option 2: Write a minimal .d.ts
// declare module "untyped-package";  ← makes it type 'any', allows use

// Option 3: Use 'any' temporarily
// const untypedLib = require("untyped-package") as any;

// Check if @types exists: https://www.npmjs.com/~types
`;

console.log("TypeScript Advanced chapter loaded.");
console.log("TypeScript is JavaScript with superpowers.");
console.log("Start with the basics, add types gradually, and enjoy the safety net.");

// Helper for examples above
function getUser(): { id: number; name: string; email: string; age: number } | null {
  return { id: 1, name: "Alice", email: "alice@example.com", age: 30 };
}
