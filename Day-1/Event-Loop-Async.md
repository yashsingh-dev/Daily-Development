# Async JS & The Event Loop: How it really works

## 1. Callbacks vs. Promises

### **Callbacks**
*   **Definition:** A function passed into another function to be executed later.
*   **Problem:** "Callback Hell" (nested callbacks making code unreadable) and Inversion of Control (trusting the third-party function to call your callback correctly).
*   **Event Loop:** Standard callbacks (like in `forEach`) run synchronously. Async callbacks (like in `fs.readFile` or `setTimeout`) run in the Macrotask Queue.

### **Promises**
*   **Definition:** An object representing the eventual completion (or failure) of an asynchronous operation.
*   **Benefit:** proper chaining (`.then()`), better error handling (`.catch()`), and avoids callback hell.
*   **Event Loop:** Promises execute in the **Microtask Queue** (Higher Priority).

---

## 2. The Event Loop Mechanism
JavaScript is single-threaded, meaning it has one **Call Stack**. To handle async operations, it relies on the browser (Web APIs) and two queues.

### **The Hierarchy of Execution:**
1.  **Call Stack (Synchronous Code):** Immediate execution. High priority.
2.  **Microtask Queue (High Priority):** `Promise.then`, `catch`, `finally`, `queueMicrotask`, `async/await`.
3.  **Macrotask Queue (Low Priority):** `setTimeout`, `setInterval`, DOM Events, I/O.

**The Rule:** The Event Loop will **ALWAYS** empty the entire *Microtask Queue* before it runs even a single item from the *Macrotask Queue*.

---

## 3. How Specific Tools work

### **A. setTimeout & setInterval**
*   **Type:** Macrotask (Task Queue).
*   **Mechanism:**
    1.  JS encounters `setTimeout(fn, 0)`.
    2.  It sends it to the **Web API** (Browser timer).
    3.  When the timer finishes, the Web API pushes `fn` into the **Macrotask Queue**.
    4.  The Event Loop waits for the Stack AND Microtask Queue to be empty.
    5.  Finally, it moves `fn` to the Stack to execute.
*   *Note:* `setInterval` works similarly but keeps pushing the task to the queue repeatedly.

### **B. Async / Await**
*   **Type:** Microtask (because it uses Promises).
*   **Mechanism:** `async/await` is just "syntactic sugar" for Promises.
    *   When you `await` a promise, the function **pauses** execution.
    *   The rest of the function (everything after `await`) is wrapped in a `.then()` block behind the scenes.
    *   This `.then()` goes into the **Microtask Queue**.

---

## 4. Code Example: Who wins?

```javascript
console.log("1. Start"); // Sync (Stack)

setTimeout(() => {
  console.log("2. SetTimeout"); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise"); // Microtask
});

console.log("4. End"); // Sync (Stack)
```

**Output Order:**
1.  `"1. Start"` (Stack)
2.  `"4. End"` (Stack)
3.  `"3. Promise"` (Microtask - wins over timeout!)
4.  `"2. SetTimeout"` (Macrotask - runs last)
```
