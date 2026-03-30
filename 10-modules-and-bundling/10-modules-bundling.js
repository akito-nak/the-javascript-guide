// ============================================================
// 10 - MODULES AND BUNDLING
// ============================================================
// As JavaScript apps grew, putting everything in one file
// became chaos. Modules solve this: each file has its own
// scope, explicitly exports what it wants to share, and
// explicitly imports what it needs.
//
// There are two module systems in JavaScript:
// 1. CommonJS (CJS) — Node.js's original system, require/module.exports
// 2. ES Modules (ESM) — the official JavaScript standard, import/export
//
// Both exist in the wild. You need to know both.
// ============================================================


// ═══════════════════════════════════════════════════════════
// PART 1: COMMONJS — The Node.js Original
// ═══════════════════════════════════════════════════════════

/*
  CommonJS was created by the Node.js team in 2009 when there
  was no official module standard. It became THE way to share
  code in Node.js and through npm.

  Key characteristics:
  - Synchronous loading (fine for disk, bad for browser)
  - require() can be called ANYWHERE (inside functions, conditionally)
  - Loaded/cached after first require
  - module.exports is the thing you're exporting
*/

// ── math.js (CommonJS module file) ──────────────────────────
/*
// Named exports via module.exports object
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  PI: 3.14159265,
};

// Alternative: add to exports one at a time
// exports.add = (a, b) => a + b;
// exports.PI = 3.14159265;
// NOTE: Never reassign exports itself: exports = { ... }
// That breaks the reference. Use module.exports = { ... } for full replacement.
*/

// ── Using CommonJS modules ───────────────────────────────────
/*
// Import the whole module
const math = require("./math");
console.log(math.add(2, 3)); // 5
console.log(math.PI);         // 3.14159

// Destructure on import
const { add, subtract } = require("./math");
console.log(add(10, 5));       // 15

// Import built-in Node modules
const path = require("path");
const fs   = require("fs");
const http = require("http");

// Import npm packages
const express  = require("express");
const lodash   = require("lodash");
const mongoose = require("mongoose");

// Dynamic require (can be conditional, at runtime)
const moduleName = process.env.NODE_ENV === "test" ? "./mock-db" : "./db";
const db = require(moduleName); // ← this is impossible with static import/export!

// require() returns the CACHED module after first load
const a = require("./math"); // loads from disk, caches
const b = require("./math"); // returns cache — SAME object
console.log(a === b); // true — identical object
*/


// ═══════════════════════════════════════════════════════════
// PART 2: ES MODULES — The Modern Standard
// ═══════════════════════════════════════════════════════════

/*
  ES Modules were standardized in ES2015 (ES6). They're:
  - Static: imports/exports must be at the TOP LEVEL (no conditional imports)
  - Asynchronous: can be loaded in browsers natively
  - Live bindings: imported values stay in sync with exports
  - Tree-shakeable: bundlers can remove unused exports
  - The future: Node.js and browsers both support them natively

  File extension: .mjs in Node.js, or set "type": "module" in package.json
  In browsers: <script type="module" src="app.js">
*/

// ── math.mjs (ES Module) ─────────────────────────────────────
/*
// Named exports — can export multiple things
export const PI = 3.14159265;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Export at declaration
export class Calculator {
  add(a, b) { return a + b; }
}

// Export list at the bottom (common style — keeps exports visible)
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;
export { multiply, divide };

// Rename on export
export { multiply as times, divide as dividedBy };

// Default export — ONE per module
// (often the "main thing" the module does)
export default function mainCalculation(a, b) {
  return a + b;
}
*/

// ── Using ES Modules ─────────────────────────────────────────
/*
// Import named exports
import { add, subtract, PI } from "./math.mjs";
console.log(add(2, 3)); // 5

// Import with rename
import { add as plus, PI as tau } from "./math.mjs";

// Import default export
import myCalculator from "./math.mjs";

// Import default + named in one statement
import Calculator, { add, PI } from "./math.mjs";

// Import EVERYTHING as a namespace
import * as Math from "./math.mjs";
console.log(Math.add(2, 3));
console.log(Math.PI);

// Side-effect only import (runs the module, imports nothing)
import "./analytics.js"; // registers event listeners, etc.

// Dynamic import — returns a Promise
// This IS possible with ESM for code splitting!
async function loadFeature() {
  const { Chart } = await import("./chart.js");
  return new Chart();
}

// Conditional dynamic import
const utils = await import(
  process.platform === "win32" ? "./windows-utils.js" : "./unix-utils.js"
);
*/


// ═══════════════════════════════════════════════════════════
// CJS vs ESM: KEY DIFFERENCES SUMMARY
// ═══════════════════════════════════════════════════════════

/*
  ┌─────────────────────┬──────────────────────┬─────────────────────────┐
  │ Feature             │ CommonJS             │ ES Modules              │
  ├─────────────────────┼──────────────────────┼─────────────────────────┤
  │ Syntax              │ require/module.exports│ import/export           │
  │ Loading             │ Synchronous           │ Asynchronous            │
  │ Where               │ Node.js native        │ Browsers + Node.js      │
  │ Conditional         │ ✅ require() anywhere │ ❌ Static at top level  │
  │ Dynamic             │ ✅ require(variable)  │ ✅ await import()       │
  │ Tree shaking        │ ❌ Hard               │ ✅ Easy for bundlers    │
  │ Default in Node.js  │ ✅ Yes (.js files)    │ ⚙️ With .mjs or config  │
  │ Default in browsers │ ❌ No                 │ ✅ Yes (type="module")  │
  │ this at top level   │ module.exports {}     │ undefined               │
  │ Live bindings       │ ❌ Copy of values     │ ✅ Live reference       │
  └─────────────────────┴──────────────────────┴─────────────────────────┘

  The Live Binding difference explained:
*/

// CJS: imported value is a COPY at time of import
// counter.js: let count = 0; exports.count = count; exports.increment = () => count++;
// main.js:
// const { count, increment } = require("./counter");
// increment();
// console.log(count); // STILL 0! You got a copy of the value.

// ESM: imported binding stays in sync with the export
// counter.mjs: export let count = 0; export function increment() { count++; }
// main.mjs:
// import { count, increment } from "./counter.mjs";
// increment();
// console.log(count); // 1 ✅ — live binding, sees the updated value


// ═══════════════════════════════════════════════════════════
// PART 3: BUNDLING — Why We Bundle
// ═══════════════════════════════════════════════════════════

/*
  Even with ES Modules, browsers have a problem:
  
  Modern apps might have 1,000+ module files.
  Each import = an HTTP request (or more, due to deps of deps).
  Even with HTTP/2 multiplexing, 1,000 requests is slow.
  
  Enter bundlers: they analyze your import graph and combine
  all your modules into fewer (often one) optimized files.
  
  Bundlers also do:
  - Tree shaking: remove unused exports (dead code elimination)
  - Code splitting: split app into chunks, load on demand
  - Transpilation: convert modern JS → older JS (via Babel)
  - Minification: remove whitespace/comments, shorten names
  - Asset handling: import images, CSS, fonts as if they're JS
  - Source maps: debug minified code with original filenames/lines
  - Hot Module Replacement (HMR): update browser without full reload
*/


// ─────────────────────────────────────────────────────────────
// WEBPACK: The Veteran
// ─────────────────────────────────────────────────────────────
/*
  Webpack has been the dominant bundler since ~2014. It's powerful,
  highly configurable, and has an ecosystem of thousands of plugins.
  
  The tradeoff: complex configuration and slower builds.
  Many projects (Next.js, Create React App) abstract it away.

  webpack.config.js:
*/
const webpackConfig = `
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // Entry point — where Webpack starts building the graph
  entry: "./src/index.js",

  // Output — where to put the bundles
  output: {
    filename: "[name].[contenthash].js", // contenthash = changes when file changes
    path: path.resolve(__dirname, "dist"),
    clean: true,                          // delete dist/ before each build
  },

  // Mode: "development" or "production"
  // production: minification, tree shaking, optimizations
  // development: source maps, readable output, fast rebuilds
  mode: "production",

  // Loaders: transform files before adding to the bundle
  module: {
    rules: [
      {
        test: /\\.jsx?$/,           // transform .js and .jsx files
        exclude: /node_modules/,
        use: "babel-loader",        // transpile with Babel
      },
      {
        test: /\\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: "asset/resource",    // handles images
      },
    ],
  },

  // Plugins: do things loaders can't
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],

  // Code splitting
  optimization: {
    splitChunks: {
      chunks: "all",              // split vendor code into separate chunk
    },
  },

  // Dev server
  devServer: {
    port: 3000,
    hot: true,                    // Hot Module Replacement
    historyApiFallback: true,     // SPA routing support
  },
};
`;


// ─────────────────────────────────────────────────────────────
// VITE: The Modern Fast Bundler
// ─────────────────────────────────────────────────────────────
/*
  Vite (French for "fast") takes a fundamentally different approach:
  
  Development: Uses native ES Modules in the browser!
    - No bundling during development
    - Only transpiles the file you actually request
    - Changes reflect in milliseconds (vs seconds with Webpack)
    
  Production: Uses Rollup under the hood
    - Full bundling, tree shaking, code splitting
    - Highly optimized output
  
  This makes Vite dramatically faster for development.
  It's the default for Vue projects, and commonly used with React.

  vite.config.js:
*/
const viteConfig = `
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()], // framework plugins

  // Aliases (import @/components instead of ../../components)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Build output
  build: {
    outDir: "dist",
    sourcemap: true,             // keep source maps in prod
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],  // separate vendor chunk
        },
      },
    },
  },

  // Dev server
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",  // proxy API requests
    },
  },
});
`;


// ─────────────────────────────────────────────────────────────
// ROLLUP: Library Bundler
// ─────────────────────────────────────────────────────────────
/*
  Rollup excels at bundling LIBRARIES (not apps).
  It produces the cleanest, smallest output.
  It invented tree shaking.
  
  When to use Rollup:
  - Building a library for npm
  - Need output in multiple formats (CJS + ESM)
  - Minimal runtime overhead
  
  rollup.config.js:
*/
const rollupConfig = `
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",

  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs",               // CommonJS for Node.js
    },
    {
      file: "dist/bundle.esm.js",
      format: "esm",               // ES Module for bundlers/modern browsers
    },
    {
      file: "dist/bundle.umd.js",
      format: "umd",               // Universal: works in browser, Node, AMD
      name: "MyLibrary",           // global variable name in browser
      globals: { lodash: "_" },    // externals map (don't bundle lodash)
    },
  ],

  plugins: [
    nodeResolve(),     // resolve node_modules
    commonjs(),        // convert CJS deps to ESM
    typescript(),      // transpile TypeScript
    terser(),          // minify
  ],

  external: ["lodash", "react"], // don't bundle these — let the consumer provide them
};
`;


// ─────────────────────────────────────────────────────────────
// esbuild: The Speed Demon
// ─────────────────────────────────────────────────────────────
/*
  esbuild is written in Go and is 10-100x faster than JavaScript-based
  bundlers. It's used internally by Vite for dependency pre-bundling.
  
  Limitations: no support for some advanced Webpack/Rollup plugins.
  
  Build:
  esbuild src/index.js --bundle --minify --outfile=dist/bundle.js
  
  Or programmatically:
*/
const esbuildScript = `
// build.mjs
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ["es2020"],
  outfile: "dist/bundle.js",
  platform: "browser",           // or "node"
  format: "esm",
  external: ["react"],           // don't bundle react
});

console.log("Build complete");
`;


// ─────────────────────────────────────────────────────────────
// TREE SHAKING: Dead Code Elimination
// ─────────────────────────────────────────────────────────────

// Tree shaking analyzes your import/export statements and
// removes exports that are never imported anywhere.

// utils.js — a utility library
export function formatDate(date) { /* ... */ }
export function formatCurrency(amount) { /* ... */ }
export function formatPhoneNumber(phone) { /* ... */ }
export function slugify(text) { /* ... */ }
export function debounce(fn, delay) { /* ... */ }
// 50 more utility functions...

// main.js
import { formatDate } from "./utils.js"; // only imports formatDate
// Bundler sees you only import formatDate, so ALL other exports are
// excluded from the bundle. The final bundle only contains formatDate.

// For tree shaking to work:
// ✅ Use ES module syntax (import/export)
// ✅ Mark your package.json with "sideEffects": false (if no side effects)
// ❌ CJS (require) is NOT tree-shakeable — bundlers can't know what's used


// ─────────────────────────────────────────────────────────────
// CODE SPLITTING: Load Less, Load Later
// ─────────────────────────────────────────────────────────────

// Static split: route-based splitting with dynamic import
// Each route's code is only loaded when the user visits that route

// React lazy loading example:
const ReactSplitting = `
import React, { lazy, Suspense } from "react";

// These components are loaded lazily (separate chunk files)
const HomePage    = lazy(() => import("./pages/Home"));
const AboutPage   = lazy(() => import("./pages/About"));
const ProfilePage = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Route path="/"        element={<HomePage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Router>
    </Suspense>
  );
}
// Initial bundle only includes App code.
// Home, About, Profile load when navigated to.
`;

// Feature-based splitting
async function loadChartLibrary() {
  // Chart.js is only loaded when a chart is actually needed
  const { Chart } = await import("chart.js");
  return Chart;
}


// ─────────────────────────────────────────────────────────────
// CDN: Serving JavaScript Without a Bundle
// ─────────────────────────────────────────────────────────────

/*
  CDN (Content Delivery Network) serves files from servers
  geographically close to the user. For JavaScript:
  
  Option 1: Use a CDN instead of bundling dependencies
  - Script tags in HTML
  - No bundle step needed
  - Browser caches the library (shared across sites!)
  - But: no tree shaking, you load the whole library
  
  Option 2: Serve your OWN built files via CDN
  - Upload your bundle to AWS S3, Cloudflare, etc.
  - Users get fast delivery from nearby servers
  - Add cache-busting (contenthash in filename)
*/

// Using CDNs in HTML (old-school, still valid for simple projects)
const cdnHtml = `
<!DOCTYPE html>
<html>
<head>
  <!-- Import maps: tell the browser where to find modules -->
  <script type="importmap">
  {
    "imports": {
      "react":     "https://esm.sh/react@18",
      "react-dom": "https://esm.sh/react-dom@18",
      "lodash":    "https://esm.sh/lodash-es@4"
    }
  }
  </script>
</head>
<body>
  <script type="module">
    // These resolve via importmap — no bundler needed!
    import React from "react";
    import { debounce } from "lodash";
    
    console.log("React version:", React.version);
  </script>

  <!-- Traditional script CDN links -->
  <!-- Pros: browser may have it cached from another site -->
  <!-- Cons: load whole library, potential SRI issues -->
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
          integrity="sha256-..."
          crossorigin="anonymous"></script>

  <!-- jsDelivr: fast CDN for npm packages -->
  <!-- unpkg: direct npm package serving -->
  <!-- esm.sh: ESM versions of any npm package -->
  <!-- skypack: optimized ESM CDN (largely superseded by esm.sh) -->
</body>
</html>
`;

// Popular CDN providers for JavaScript:
const cdnProviders = {
  jsdelivr: {
    url: "https://cdn.jsdelivr.net/npm/",
    example: "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
    notes: "Fast, reliable, worldwide, serves both npm and GitHub"
  },
  unpkg: {
    url: "https://unpkg.com/",
    example: "https://unpkg.com/react@18/umd/react.production.min.js",
    notes: "Official npm package CDN"
  },
  esmsh: {
    url: "https://esm.sh/",
    example: "https://esm.sh/react@18",
    notes: "Serves ES modules — works with import statements in browsers"
  },
  cloudflare: {
    url: "https://cdnjs.cloudflare.com/",
    example: "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
    notes: "Cloudflare's CDN, very fast"
  }
};


// ─────────────────────────────────────────────────────────────
// PACKAGE.JSON: The Module Configuration
// ─────────────────────────────────────────────────────────────

const packageJsonExample = `
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "An example library",
  
  // "type" controls default module system for .js files:
  // "module" → .js files are ESM (import/export)
  // "commonjs" → .js files are CJS (require/module.exports) [default]
  "type": "module",
  
  // Main entry points
  "main": "./dist/index.cjs.js",      // CJS entry (require)
  "module": "./dist/index.esm.js",    // ESM entry (import)
  "types": "./dist/index.d.ts",       // TypeScript types
  
  // Modern "exports" field — fine-grained control
  "exports": {
    ".": {
      "require": "./dist/index.cjs.js",  // require("my-library")
      "import":  "./dist/index.esm.js",  // import from "my-library"
      "types":   "./dist/index.d.ts"
    },
    "./utils": {
      "require": "./dist/utils.cjs.js",  // require("my-library/utils")
      "import":  "./dist/utils.esm.js"
    }
  },
  
  // Tell bundlers this package has no side effects (enable tree shaking)
  "sideEffects": false,
  // Or: "sideEffects": ["./src/polyfills.js", "*.css"]
  
  "scripts": {
    "build": "rollup -c",
    "dev":   "vite",
    "test":  "jest"
  },
  
  "dependencies": {
    "lodash": "^4.17.21"          // ^ = compatible version (minor/patch updates)
  },
  "devDependencies": {
    "vite": "^5.0.0",             // only needed for development/build
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "react": ">=17.0.0"           // consumer must provide this themselves
  }
}
`;

console.log("Module system overview complete.");
console.log("Key takeaways:");
console.log("- Use ESM (import/export) for new code");
console.log("- Know CJS for reading Node.js code and npm packages");
console.log("- Vite for apps (fast DX), Rollup for libraries");
console.log("- Tree shaking requires static ESM imports");
console.log("- Dynamic import() enables code splitting");
