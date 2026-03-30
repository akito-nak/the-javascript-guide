// ============================================================
// 05 - ASYNC JAVASCRIPT
// ============================================================
// JavaScript is single-threaded — only one thing runs at a time.
// But the web is full of waiting: network requests, timers,
// file reads. How do you wait without blocking everything else?
//
// The evolution: Callbacks → Promises → async/await
// Each solved problems of the previous. You need to know all
// three: callbacks to read old code, Promises to understand
// the machinery, async/await to write clean modern code.
// ============================================================


// ─────────────────────────────────────────────────────────────
// CALLBACKS: Where It All Started
// ─────────────────────────────────────────────────────────────
// A callback is just a function you pass to another function,
// to be called later when some async work is done.

// Simple timer callbacks
setTimeout(() => console.log("1 second later"), 1000);
setInterval(() => console.log("Every 2 seconds"), 2000);

// Classic callback style — Node.js and older browser APIs
function readFile(filename, callback) {
  // Simulating async file read
  setTimeout(() => {
    if (filename.endsWith(".txt")) {
      callback(null, `Contents of ${filename}`); // null = no error
    } else {
      callback(new Error("File not found")); // error-first convention
    }
  }, 100);
}

readFile("data.txt", (error, data) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log(data);
});

// Error-first callbacks: callback(error, result)
// This is the Node.js convention. If error is null/undefined, success.

// THE PROBLEM: Callback Hell / Pyramid of Doom
// Nested callbacks become unreadable and hard to handle errors:
function callbackHell() {
  readFile("users.txt", (err1, users) => {
    if (err1) { handleError(err1); return; }
    readFile("orders.txt", (err2, orders) => {
      if (err2) { handleError(err2); return; }
      readFile("products.txt", (err3, products) => {
        if (err3) { handleError(err3); return; }
        // Finally do something with all three... but we're 3 levels deep
        console.log("Got everything:", users, orders, products);
      });
    });
  });
}

function handleError(err) { console.error(err); }


// ─────────────────────────────────────────────────────────────
// PROMISES: A Better Way
// ─────────────────────────────────────────────────────────────
// A Promise represents a value that will be available in the
// future. It has three states:
//   - pending:  initial state, neither fulfilled nor rejected
//   - fulfilled: operation succeeded, has a value
//   - rejected:  operation failed, has a reason

// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  // Async work happens here
  const success = true;
  setTimeout(() => {
    if (success) {
      resolve("Operation successful!");     // fulfill the promise
    } else {
      reject(new Error("Something went wrong")); // reject the promise
    }
  }, 1000);
});

// Consuming a Promise with .then() and .catch()
myPromise
  .then(value => {
    console.log("Resolved:", value);
    return value.toUpperCase(); // can chain by returning a value
  })
  .then(upper => {
    console.log("Chained:", upper); // gets the returned value
  })
  .catch(error => {
    console.error("Rejected:", error.message); // catches ANY rejection in chain
  })
  .finally(() => {
    console.log("Always runs — success or failure"); // cleanup code
  });

// Wrap callback APIs in Promises (promisification)
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    readFile(filename, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

// Now we can chain instead of nesting:
readFilePromise("users.txt")
  .then(users => readFilePromise("orders.txt")) // return a new promise
  .then(orders => readFilePromise("products.txt"))
  .then(products => console.log("Got all data"))
  .catch(error => console.error("Any error:", error)); // ONE error handler!

// ── Promise static methods ────────────────────────────────────

// Promise.resolve / Promise.reject — create immediately settled promises
const p1 = Promise.resolve(42);
const p2 = Promise.reject(new Error("immediate failure"));
p1.then(v => console.log(v));  // 42

// Promise.all — run multiple promises in PARALLEL, wait for ALL
// Fails fast: rejects as soon as any one rejects
function fetchUser(id) {
  return new Promise(resolve => setTimeout(() => resolve({ id, name: `User ${id}` }), 100));
}

Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)])
  .then(([user1, user2, user3]) => {
    console.log("All users:", user1, user2, user3);
  })
  .catch(err => console.error("At least one failed:", err));

// Promise.allSettled — wait for ALL, never rejects
// Returns array of { status: "fulfilled"|"rejected", value|reason }
Promise.allSettled([
  fetchUser(1),
  Promise.reject(new Error("user 2 not found")),
  fetchUser(3),
]).then(results => {
  results.forEach(result => {
    if (result.status === "fulfilled") {
      console.log("Success:", result.value);
    } else {
      console.log("Failed:", result.reason.message);
    }
  });
});

// Promise.race — resolves/rejects with the FIRST settled promise
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
);

Promise.race([fetchUser(1), timeout(50)])
  .then(user => console.log("Got user in time:", user))
  .catch(err => console.log("Timed out:", err.message));

// Promise.any — resolves with the FIRST fulfilled promise
// Only rejects if ALL promises reject
Promise.any([
  Promise.reject(new Error("first")),
  fetchUser(2),
  fetchUser(3),
]).then(first => console.log("First to succeed:", first));


// ─────────────────────────────────────────────────────────────
// ASYNC/AWAIT: Synchronous-Looking Async Code
// ─────────────────────────────────────────────────────────────
// async/await is syntactic sugar over Promises.
// It doesn't change how async works — just makes the code
// look and read like synchronous code.

// async function ALWAYS returns a Promise
async function fetchUserData(userId) {
  // await pauses execution of THIS function (not the whole program!)
  // until the Promise resolves
  const user = await fetchUser(userId);
  return user; // auto-wrapped in Promise.resolve()
}

// Top-level await (works in ES modules or at Node.js top level)
// For now, we wrap in an async function:
async function main() {
  // Sequential (each waits for the previous)
  const user1 = await fetchUser(1);    // wait ~100ms
  const user2 = await fetchUser(2);    // wait another ~100ms
  console.log("Sequential:", user1, user2); // total: ~200ms

  // Parallel (start both, then wait for both)
  const [userA, userB] = await Promise.all([fetchUser(1), fetchUser(2)]);
  console.log("Parallel:", userA, userB); // total: ~100ms (concurrent!)
}

// Error handling with async/await
async function fetchWithErrorHandling(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (error) {
    // Catches rejected promises AND thrown errors
    console.error("Failed:", error.message);
    return null;
  } finally {
    console.log("Cleanup — always runs");
  }
}

// A neat pattern: wrap promises to handle errors without try/catch
async function safeAwait(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

async function example() {
  const [err, user] = await safeAwait(fetchUser(1));
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("User:", user);
}

// Async iteration with for...of
async function* asyncRange(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise(r => setTimeout(r, 100)); // simulate async work
    yield i;
  }
}

async function consumeAsync() {
  for await (const num of asyncRange(1, 5)) {
    console.log(num); // 1, 2, 3, 4, 5 (with 100ms between each)
  }
}

function fetchOrders(userId) {
  return new Promise(resolve => setTimeout(() => resolve([{id: 1, userId}]), 100));
}


// ─────────────────────────────────────────────────────────────
// REAL-WORLD PATTERNS
// ─────────────────────────────────────────────────────────────

// Fetch API — the modern way to make HTTP requests
async function getGithubUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Full fetch with timeout, retry, and error handling
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const { timeout = 5000, ...fetchOptions } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${timeout}ms`);
      }

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff: wait 1s, 2s, 4s...
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// POST request
async function createPost(data) {
  const response = await fetch("https://api.example.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${response.status}`);
  }

  return response.json();
}

function getAuthToken() { return "token123"; }


// ─────────────────────────────────────────────────────────────
// THE MICROTASK QUEUE (brief preview — full coverage in Chapter 9)
// ─────────────────────────────────────────────────────────────
// Promises use the microtask queue, which runs BEFORE the next
// task (like setTimeout). This is why:

console.log("1 - synchronous");

setTimeout(() => console.log("3 - macrotask (setTimeout)"), 0);

Promise.resolve().then(() => console.log("2 - microtask (Promise)"));

console.log("4 - also synchronous"); // wait, this is actually 2nd...

// Actual output order:
// 1 - synchronous
// 4 - also synchronous   (code continues to end of script)
// 2 - microtask (Promise) (microtasks run after current script)
// 3 - macrotask (setTimeout) (macrotasks run last)
