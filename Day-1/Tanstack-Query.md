# TanStack Query (React Query)

## 1. What is TanStack Query?
TanStack Query (formerly React Query) is an **Async State Management** library. It is widely known as the "missing data-fetching library" for React.

While tools like Redux or Context API are great for **Client State** (theme, modal open/close), TanStack Query is designed specifically for **Server State** (data fetching, caching, synchronizing, and updating server data).

---

## 2. Why is it Famous? (The Problem it Solves)
Before React Query, fetching data looked like this (The `useEffect` Spaghetti 🍝):
1.  Create `useState` for `data`, `loading`, `error`.
2.  Write a `useEffect` to fetch.
3.  Handle race conditions manually (using AbortController).
4.  Handle caching manually (or re-fetch every time).
5.  Handle deduplication manually (if two components need the same data).

**React Query automates ALL of this.** It reduces lines of code by ~50-80%.

---

## 3. Why Should You Use It? (Key Features)

*   **Caching & Deduping:** If 5 components ask for "User Profile", it only fetches once.
*   **Auto-Refetching:**
    *   **On Window Focus:** User tabs away and comes back? Data refreshes automatically.
    *   **On Network Reconnect:** Internet goes off and back on? It retries.
*   **Stale-While-Revalidate:** It shows cached (old) data instantly while fetching new data in the background. zero loading spinners!
*   **Pagination & Infinite Scroll:** Built-in hooks for complex UI patterns.

---

## 4. How to Use It?

**👉 Hands-on Code Example:**
I have implemented a full working example in your `Coding` project.
*   **File:** [`Coding/src/components/Todos.jsx`](../Coding/src/components/Todos.jsx)
*   **Setup:** [`Coding/src/main.jsx`](../Coding/src/main.jsx)

### **What I did in the code:**
1.  **Installed Dependencies:** `npm install @tanstack/react-query axios`
2.  **Wrapped App:** Added `<QueryClientProvider>` in `main.jsx`.
3.  **Fetched Data:** Used `useQuery` in `Todos.jsx` to fetch a list from JSONPlaceholder.
4.  **Added Data:** Used `useMutation` to add a new item to the list.

Go check the `Coding` folder to see it in action!

---

## 5. When to Use It?

| Scenario | Use React Query? | Why? |
| :--- | :--- | :--- |
| **Fetching data from API** | ✅ **YES** | Handles caching, loading, errors perfectly. |
| **Simple Modal Open/Close** | ❌ **NO** | Use `useState` or Context. This is Client State. |
| **Global Theme/User Auth** | ❌ **NO** | Use Context or Zustand/Redux. |
| **Form State** | ❌ **NO** | Use `react-hook-form`. |

**Golden Rule:**
*   Is the data persisted remotely (in a DB/Server)? **Use React Query.**
*   Is the data only in the browser (UI state)? **Use useState/Zustand.**
