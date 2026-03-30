// ============================================================
// 12 - TYPESCRIPT: WHAT IT IS AND WHY IT EXISTS
// ============================================================
// TypeScript is JavaScript with a type system bolted on.
// Microsoft created it in 2012, open-sourced it, and it has
// become one of the most beloved languages in web development.
//
// The core promise: catch errors at COMPILE TIME, not at
// RUNTIME in production while your users hit them.
//
// This file assumes you know JavaScript. We'll show TypeScript
// by contrasting it with the JavaScript problems it solves.
// ============================================================


// ─────────────────────────────────────────────────────────────
// THE PROBLEM: JavaScript's Type Flexibility Bites Back
// ─────────────────────────────────────────────────────────────

/*
  JavaScript's dynamic typing is great for quick scripts.
  For large codebases with teams, it's a maintenance nightmare.
  
  Let's look at real problems TypeScript solves:
*/

// PROBLEM 1: You call a function with wrong arguments
// In JavaScript, this silently produces NaN or "undefinedundefined"
function addJS(a, b) {
  return a + b;
}
addJS("5", 3);        // "53" — string concatenation! Not an error.
addJS(undefined, 10); // NaN — not an error!
addJS({ x: 1 }, 2);  // "[object Object]2" — not an error!

// In TypeScript, this is a COMPILE-TIME error:
// function addTS(a: number, b: number): number {
//   return a + b;
// }
// addTS("5", 3);    // ❌ Error: Argument of type 'string' is not assignable to 'number'


// PROBLEM 2: You access a property that doesn't exist
function getUserNameJS(user) {
  return user.profil.name; // typo: "profil" instead of "profile"
  // No error until runtime. If user exists, you get "Cannot read property 'name' of undefined"
}

// TypeScript catches this immediately:
// function getUserNameTS(user: { profile: { name: string } }): string {
//   return user.profil.name; // ❌ Error: Property 'profil' does not exist on type...
// }


// PROBLEM 3: API response shape changes, you don't know
// Your API returns this today:
const userResponse = { id: 1, name: "Alice", email: "alice@example.com" };
// Next week someone changes it to:
const userResponseChanged = { id: 1, username: "alice", emailAddress: "..." };
// Now all your code using .name and .email silently returns undefined.
// TypeScript forces you to update types everywhere — the compiler guides you.


// PROBLEM 4: Code completion and documentation
// Without TypeScript, you need to READ the source or docs to know:
// - What parameters does this function take?
// - What does it return?
// - What properties does this object have?
// With TypeScript, your IDE knows everything and tells you instantly.


// ─────────────────────────────────────────────────────────────
// TYPESCRIPT BASICS
// ─────────────────────────────────────────────────────────────
// These are TypeScript examples — save them as .ts files

const basicTypesTS = `
// ── Type annotations ────────────────────────────────────────
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;

// Type INFERENCE — TypeScript often figures it out!
// You DON'T need to annotate everything
let name2 = "Alice";   // TypeScript KNOWS this is string
let age2   = 30;       // TypeScript KNOWS this is number

// Let TypeScript infer when it can — only annotate when needed
// name2 = 42;  // ❌ Error: Type 'number' is not assignable to type 'string'


// ── Arrays ───────────────────────────────────────────────────
const names: string[] = ["Alice", "Bob", "Carol"];
const scores: number[] = [95, 87, 92];
const mixed: (string | number)[] = ["Alice", 30]; // union type

// Generic array syntax (equivalent)
const names2: Array<string> = ["Alice", "Bob"];


// ── Tuples: fixed-length, typed arrays ──────────────────────
const pair: [string, number] = ["Alice", 30]; // exactly [string, number]
const [personName, personAge] = pair;

// ── Objects ──────────────────────────────────────────────────
// Inline type
const user: { name: string; age: number; email?: string } = {
  name: "Alice",
  age: 30,
  // email is optional (the ? means it can be undefined or omitted)
};


// ── Type aliases: name a type for reuse ─────────────────────
type UserId = string;
type Coordinates = [number, number];
type Status = "pending" | "active" | "inactive"; // union literal type

const id: UserId = "user-123";
const location: Coordinates = [40.7128, -74.0060];
const status: Status = "active";
// const badStatus: Status = "maybe"; // ❌ Error: not in union


// ── Interfaces: describe the shape of objects ──────────────
interface User {
  readonly id: string;        // can't be changed after creation
  name: string;
  email: string;
  age?: number;               // optional
  role: "admin" | "user" | "viewer"; // literal union
}

const alice: User = {
  id: "u-1",
  name: "Alice",
  email: "alice@example.com",
  role: "admin"
};
// alice.id = "u-2"; // ❌ Error: Cannot assign to 'id' because it is read-only


// ── Extending interfaces ─────────────────────────────────────
interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}


// ── Function types ────────────────────────────────────────────
// Annotate parameters AND return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}

// Rest parameters
function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// Function type as a type alias
type Transformer = (input: string) => string;
const toUpper: Transformer = (s) => s.toUpperCase();

// Void: function that returns nothing
function log(message: string): void {
  console.log(message);
  // Can't: return "something"; ❌
}

// Never: function that NEVER returns (always throws or infinite loop)
function fail(message: string): never {
  throw new Error(message);
}
`;


// ─────────────────────────────────────────────────────────────
// UNION TYPES AND TYPE NARROWING
// ─────────────────────────────────────────────────────────────

const unionNarrowingTS = `
// Union types: a value can be one of several types
type StringOrNumber = string | number;

function formatValue(value: string | number): string {
  // TypeScript knows value is string | number
  // You must "narrow" before using type-specific methods

  if (typeof value === "string") {
    // TypeScript KNOWS it's string here
    return value.toUpperCase();
  } else {
    // TypeScript KNOWS it's number here
    return value.toFixed(2);
  }
}


// Discriminated unions — the most powerful pattern
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;  // shape.radius is safe here
    case "square":
      return shape.side ** 2;              // shape.side is safe here
    case "rectangle":
      return shape.width * shape.height;   // shape.width/height safe here
    default:
      // TypeScript KNOWS this is unreachable if all cases are handled
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck; // ensures you handle all shape types!
  }
}

// Add "triangle" to Shape? TypeScript FORCES you to add a case here.
// That's the power of exhaustive checking.


// Optional chaining type narrowing
interface ApiResponse {
  data?: {
    user?: {
      profile?: {
        avatar?: string;
      };
    };
  };
}

function getAvatar(response: ApiResponse): string {
  return response.data?.user?.profile?.avatar ?? "/default-avatar.jpg";
  // TypeScript knows this is string (not undefined) because of ?? fallback
}
`;


// ─────────────────────────────────────────────────────────────
// GENERICS: Type-Safe Functions and Classes
// ─────────────────────────────────────────────────────────────

const genericsTS = `
// Without generics — you lose type info
function firstItemAny(arr: any[]): any {
  return arr[0];
  // Returns any — TypeScript can't help you after this
}

// With generics — type flows through
function firstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}

const name = firstItem(["Alice", "Bob", "Carol"]); // TypeScript knows: string | undefined
const num  = firstItem([1, 2, 3]);                 // TypeScript knows: number | undefined


// Generic constraints: T must have certain properties
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // type-safe property access!
}

const user = { name: "Alice", age: 30 };
const name2 = getProperty(user, "name"); // TypeScript knows: string
const age   = getProperty(user, "age");  // TypeScript knows: number
// getProperty(user, "email"); // ❌ Error: "email" not in user


// Generic interfaces
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User { id: string; name: string; email: string; }

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // ... database query
    return null;
  }
  async findAll(): Promise<User[]> { return []; }
  async save(user: User): Promise<User> { return user; }
  async delete(id: string): Promise<void> {}
}


// Generic React-style state hook
function useState<T>(initialState: T): [T, (newState: T) => void] {
  let state = initialState;
  const setState = (newState: T) => { state = newState; };
  return [state, setState];
}

const [count, setCount] = useState(0);   // TypeScript knows count is number
const [name3, setName3]  = useState("");  // TypeScript knows name3 is string
// setCount("hello"); // ❌ Error: can't set number state to string
`;


// ─────────────────────────────────────────────────────────────
// UTILITY TYPES: TypeScript's Built-In Helpers
// ─────────────────────────────────────────────────────────────

const utilityTypesTS = `
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
}

// Partial<T>: make all fields optional (great for update payloads)
type UpdateUserPayload = Partial<User>;
// { id?: string; name?: string; email?: string; ... }

// Required<T>: make all fields required (opposite of Partial)
type RequiredUser = Required<User>;

// Readonly<T>: make all fields read-only
type FrozenUser = Readonly<User>;
// const u: FrozenUser = { ... };
// u.name = "Bob"; // ❌ Error: Cannot assign to 'name'

// Pick<T, K>: select only certain fields
type PublicUser = Pick<User, "id" | "name" | "email">;
// No password, no role — safe to send to client

// Omit<T, K>: exclude certain fields
type UserWithoutPassword = Omit<User, "password">;
// Perfect for user responses

// Record<K, V>: object with specific key and value types
type UserCache = Record<string, User>;
const cache: UserCache = {};
cache["user-1"] = { id: "user-1", name: "Alice", /* ... */ };

// ReturnType<T>: get the return type of a function
function getUser() { return { id: "1", name: "Alice" }; }
type GetUserReturn = ReturnType<typeof getUser>;
// { id: string; name: string }

// Parameters<T>: get the parameter types of a function
function createUser(name: string, email: string, age: number) {}
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string, age: number]

// Awaited<T>: unwrap a Promise type
type ResolvedUser = Awaited<Promise<User>>;
// User (not Promise<User>)

// NonNullable<T>: remove null and undefined
type SafeString = NonNullable<string | null | undefined>;
// string

// Practical example: build API response types
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
};

type UserListResponse = ApiResponse<User[]>;
type UserResponse     = ApiResponse<User>;
type CreatedUser      = ApiResponse<Pick<User, "id" | "name" | "email">>;
`;


// ─────────────────────────────────────────────────────────────
// SETTING UP TYPESCRIPT
// ─────────────────────────────────────────────────────────────

const setup = `
# Install TypeScript
npm install --save-dev typescript @types/node

# Initialize tsconfig.json
npx tsc --init

# Compile
npx tsc              # compile all .ts files
npx tsc --watch      # watch mode, recompile on changes
npx tsc --noEmit     # type-check without outputting files

# For Node.js: run TypeScript directly
npm install --save-dev ts-node
npx ts-node src/index.ts

# Or with type-checking:
npm install --save-dev tsx  # modern alternative to ts-node
npx tsx src/index.ts
`;

// tsconfig.json — the key settings
const tsconfigJSON = `
{
  "compilerOptions": {
    // Target environment
    "target": "ES2022",            // compile to ES2022 features
    "module": "NodeNext",          // module system
    "lib": ["ES2022", "DOM"],      // available type definitions

    // Strictness (ALWAYS enable strict)
    "strict": true,                // enables ALL strict checks below:
    //   noImplicitAny           — error when TypeScript infers 'any'
    //   strictNullChecks        — null/undefined are separate types
    //   strictFunctionTypes     — stricter function parameter checking
    //   strictPropertyInitialization — class fields must be initialized
    //   noImplicitThis          — error when 'this' has type 'any'
    //   alwaysStrict            — emit 'use strict' in output

    // Additional strict checks (add these too)
    "noUnusedLocals": true,        // error on unused variables
    "noUnusedParameters": true,    // error on unused function parameters
    "noImplicitReturns": true,     // error when not all paths return
    "noFallthroughCasesInSwitch": true,

    // Output
    "outDir": "./dist",            // where to put compiled JS
    "rootDir": "./src",            // where source .ts files are
    "declaration": true,           // generate .d.ts files
    "sourceMap": true,             // generate source maps

    // Module resolution
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,       // allow default imports from CJS modules
    "resolveJsonModule": true,     // allow importing .json files
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]           // path aliases
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;


// ─────────────────────────────────────────────────────────────
// JAVASCRIPT PROBLEMS TYPESCRIPT SOLVES: SUMMARY
// ─────────────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         JavaScript Problems TypeScript Solves               ║
╚══════════════════════════════════════════════════════════════╝

❌ JavaScript Problem → ✅ TypeScript Solution

1. "Cannot read property X of undefined"
   → Type checker catches null/undefined access at compile time.
   → Optional chaining with type safety.

2. Wrong function arguments (wrong type, wrong count)
   → Function signatures are typed. Call with wrong args = error.

3. Renamed a variable/property — now it's broken somewhere
   → Rename refactoring in IDE updates ALL references instantly.

4. What does this function return?
   → Return types are explicit. IDE shows you without reading code.

5. Adding/removing fields from an object
   → Interface changes propagate — compiler shows every place to update.

6. Null checks everywhere
   → strictNullChecks forces you to handle null/undefined explicitly.

7. Large refactors are terrifying
   → Types provide a safety net. If it compiles, it probably works.

8. Autocomplete that doesn't work
   → TypeScript powers intelligent autocomplete in VS Code and more.

9. "This worked in dev, broke in prod" (undefined behavior)
   → Many classes of bugs are caught before running any code.

10. New team member doesn't know the codebase
    → Types ARE the documentation. Self-documenting code.
`);
