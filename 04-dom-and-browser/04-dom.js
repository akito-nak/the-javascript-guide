// ============================================================
// 04 - THE DOM AND BROWSER APIs
// ============================================================
// The DOM (Document Object Model) is the browser's living
// representation of your HTML. JavaScript can read, modify,
// add, and delete any element on the page. This is where
// JavaScript went from "simple scripting" to "building apps."
// ============================================================


// ─────────────────────────────────────────────────────────────
// SELECTING ELEMENTS
// ─────────────────────────────────────────────────────────────

// querySelector — CSS selector, returns first match (or null)
const header = document.querySelector("header");
const title  = document.querySelector("h1.page-title");
const input  = document.querySelector("#email-input");
const btn    = document.querySelector(".submit-btn");

// querySelectorAll — returns a NodeList (like an array, but not quite)
const cards    = document.querySelectorAll(".card");
const allLinks = document.querySelectorAll("a[href]");

// Convert NodeList to array for full array methods
const cardsArray = Array.from(cards);
// or: [...cards]

// Older methods (you'll see these in legacy code)
const byId    = document.getElementById("main");
const byClass = document.getElementsByClassName("card"); // HTMLCollection (LIVE)
const byTag   = document.getElementsByTagName("div");    // HTMLCollection (LIVE)

// IMPORTANT: getElementsByClassName returns a LIVE collection
// — it updates automatically as the DOM changes!
// querySelectorAll returns a STATIC NodeList — a snapshot.


// ─────────────────────────────────────────────────────────────
// READING AND WRITING CONTENT
// ─────────────────────────────────────────────────────────────

const element = document.querySelector(".my-element");

// Reading
element.textContent; // all text content, no HTML
element.innerHTML;   // HTML string including child elements
element.innerText;   // like textContent but respects CSS visibility
element.outerHTML;   // element's own HTML + its content

// Writing — USE textContent for user content, innerHTML for trusted HTML
element.textContent = "Safe text — HTML tags are escaped automatically";
element.innerHTML   = "<strong>Only use for trusted HTML!</strong>";
// ⚠️ Setting innerHTML with user input = XSS vulnerability!
// "Alice <script>stealCookies()</script>" would execute!


// ─────────────────────────────────────────────────────────────
// ATTRIBUTES AND PROPERTIES
// ─────────────────────────────────────────────────────────────

const link = document.querySelector("a");

// Attributes — the HTML attribute values (strings)
link.getAttribute("href");            // "/about"
link.setAttribute("href", "/contact"); // set attribute
link.removeAttribute("disabled");     // remove attribute
link.hasAttribute("disabled");        // boolean check

// Properties — the JavaScript object properties (can be any type)
link.href;     // full URL: "https://example.com/about"
link.id;
link.className; // string of all class names
link.classList; // DOMTokenList — better for class manipulation!

// classList is the proper way to work with classes
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");     // add if absent, remove if present
element.classList.toggle("dark", true); // force add (second arg = boolean)
element.classList.contains("active");   // boolean
element.classList.replace("old", "new");


// ─────────────────────────────────────────────────────────────
// CREATING AND INSERTING ELEMENTS
// ─────────────────────────────────────────────────────────────

// Creating
const div  = document.createElement("div");
const text = document.createTextNode("Hello!");
const frag = document.createDocumentFragment(); // lightweight container

// Setting up
div.className = "card";
div.id = "my-card";
div.textContent = "Card content";
div.dataset.userId = "123"; // sets data-user-id attribute
div.style.backgroundColor = "blue"; // inline styles (camelCase!)

// Inserting
const parent = document.querySelector(".container");
parent.appendChild(div);                 // add at END of parent
parent.prepend(div);                     // add at START of parent
parent.append(div, "text node");         // modern: append multiple things
parent.insertBefore(div, parent.firstChild); // insert before a sibling

// Relative to reference element
const ref = document.querySelector(".reference");
ref.before(div);        // before the ref element
ref.after(div);         // after the ref element
ref.replaceWith(div);   // replace ref with div

// insertAdjacentHTML — most flexible insertion
element.insertAdjacentHTML("beforebegin", "<p>Before element</p>");
element.insertAdjacentHTML("afterbegin",  "<p>First inside</p>");
element.insertAdjacentHTML("beforeend",   "<p>Last inside</p>");
element.insertAdjacentHTML("afterend",    "<p>After element</p>");

// Removing
element.remove();                // remove from DOM
parent.removeChild(element);    // older way


// ─────────────────────────────────────────────────────────────
// EVENTS: Making Pages Interactive
// ─────────────────────────────────────────────────────────────

// addEventListener — the modern, correct way
const button = document.querySelector("#submit-btn");

button.addEventListener("click", function(event) {
  console.log("Clicked!", event.target);
});

// Arrow function event handler
button.addEventListener("click", (event) => {
  event.preventDefault();  // stop default browser behavior
  event.stopPropagation(); // stop event bubbling
});

// Remove an event listener (must use same function reference!)
function handleClick(event) {
  console.log("Clicked");
}
button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick); // must pass same function!

// Once option — runs once, then auto-removes
button.addEventListener("click", handleClick, { once: true });

// ── Common Events ─────────────────────────────────────────────
// Mouse: click, dblclick, mousedown, mouseup, mouseover, mouseout,
//        mousemove, mouseenter, mouseleave, contextmenu
// Keyboard: keydown, keyup, keypress (deprecated)
// Form: submit, change, input, focus, blur, reset, invalid
// Document: DOMContentLoaded, load (window), beforeunload (window)
// Touch: touchstart, touchmove, touchend, touchcancel
// Pointer: pointerdown, pointermove, pointerup (unified mouse/touch/pen)
// Drag: dragstart, drag, dragend, dragover, drop
// Media: play, pause, ended, timeupdate, volumechange
// Observer: scroll, resize (window), orientationchange


// ── Event Bubbling and Capturing ─────────────────────────────
// Events bubble UP by default: child → parent → grandparent
// Capturing goes DOWN: grandparent → parent → child

document.querySelector(".parent").addEventListener("click", (e) => {
  console.log("Parent clicked — target was:", e.target); // the actual clicked element
  console.log("Current target:", e.currentTarget); // the element with the listener
});

// Capture phase: third argument true or { capture: true }
document.addEventListener("click", handler, { capture: true }); // fires first

// ── Event Delegation: Efficient Event Handling ───────────────
// Instead of adding listeners to 100 items, add ONE to the parent

document.querySelector(".list").addEventListener("click", (event) => {
  // Check if clicked element (or an ancestor) is a list item
  const item = event.target.closest(".list-item");
  if (!item) return; // clicked something else

  const action = item.dataset.action;
  const id = item.dataset.id;

  if (action === "delete") deleteItem(id);
  if (action === "edit")   editItem(id);
});
// Works even for dynamically added items! No re-attaching needed.


// ─────────────────────────────────────────────────────────────
// THE FORM APIs
// ─────────────────────────────────────────────────────────────

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop page reload

  // Read form values
  const formData = new FormData(form);
  const data = Object.fromEntries(formData); // { name: "Alice", email: "..." }

  // Or read individual inputs
  const email = document.querySelector("#email").value;
  const name  = document.querySelector("#name").value;

  // FormData also handles file uploads!
  const fileInput = document.querySelector("#file-upload");
  const file = fileInput.files[0];

  // Send to API
  fetch("/api/submit", {
    method: "POST",
    body: formData, // with files, use FormData directly
    // OR for JSON: body: JSON.stringify(data), headers: {"Content-Type": "application/json"}
  });
});

// Validation API
const emailInput = document.querySelector("#email");
emailInput.addEventListener("input", () => {
  if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity("Email is required");
  } else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity("Please enter a valid email");
  } else {
    emailInput.setCustomValidity(""); // clear — input is valid
  }
});


// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE, SESSION STORAGE, AND COOKIES
// ─────────────────────────────────────────────────────────────

// localStorage — persists across browser sessions, same origin
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme"); // "dark" or null if not set
localStorage.removeItem("theme");
localStorage.clear(); // remove ALL items

// Store objects — must stringify/parse
const user = { id: "1", name: "Alice", prefs: { theme: "dark" } };
localStorage.setItem("user", JSON.stringify(user));
const savedUser = JSON.parse(localStorage.getItem("user") ?? "null");

// sessionStorage — same API but cleared when tab/browser closes
sessionStorage.setItem("tempData", "value");

// Helper functions for type-safe storage
function getStoredValue(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


// ─────────────────────────────────────────────────────────────
// WEB APIS YOU SHOULD KNOW
// ─────────────────────────────────────────────────────────────

// Intersection Observer — detect when elements enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, { threshold: 0.1 }); // trigger when 10% visible

document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));

// MutationObserver — watch for DOM changes
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === "childList") {
      console.log("Children changed:", mutation.addedNodes, mutation.removedNodes);
    }
    if (mutation.type === "attributes") {
      console.log(`${mutation.attributeName} changed`);
    }
  });
});
mutationObserver.observe(document.body, {
  childList: true,     // watch for add/remove of children
  attributes: true,    // watch for attribute changes
  subtree: true,       // watch all descendants
});
mutationObserver.disconnect(); // stop observing

// ResizeObserver — watch element size changes
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized to ${width}x${height}`);
  });
});
resizeObserver.observe(document.querySelector(".responsive-element"));

// History API — SPA routing
history.pushState({ page: "about" }, "About", "/about");
history.replaceState({}, "", "/home");
window.addEventListener("popstate", (event) => {
  console.log("Back/forward:", event.state);
});

// URL and URLSearchParams
const url = new URL("https://api.example.com/users?page=2&limit=20");
console.log(url.hostname);  // "api.example.com"
console.log(url.pathname);  // "/users"
console.log(url.searchParams.get("page")); // "2"

const params = new URLSearchParams(window.location.search);
const page  = params.get("page") || "1";

// Clipboard API
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  console.log("Copied!");
}

async function readFromClipboard() {
  const text = await navigator.clipboard.readText();
  return text;
}

// Notifications API
async function requestNotifications() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    new Notification("Hello!", {
      body: "This is a browser notification",
      icon: "/icon.png"
    });
  }
}

// Geolocation API
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude, position.coords.longitude);
  },
  (error) => console.error(error),
  { enableHighAccuracy: true, timeout: 5000 }
);

function deleteItem(id) { console.log("delete", id); }
function editItem(id)   { console.log("edit", id); }
function handler()      {}
