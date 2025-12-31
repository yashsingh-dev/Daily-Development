# Day 1 - Learning Journal

**Date:** December 31, 2025  
**Topics Covered:** Race Conditions in Data Fetching

---

## 📚 What I Learned Today

### Topic 1: Race Conditions in Data Fetching

**Description:**  
A race condition happens when a network request for an earlier action (like Page 1) takes longer to finish than a request for a later action (like Page 2). This causes the UI to show old data (Page 1) even though the user is currently on the new page (Page 2).

**Code Snippet:**
```javascript
useEffect(() => {
  // 1. Create a controller
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchData = async () => {
    try {
      setLoading(true);
      // 2. Pass 'signal' to fetch to connect them
      const response = await fetch(
        `https://jsonplaceholder.com/api/posts?page=${page}&limit=10`, 
        { signal }
      );
      const result = await response.json();
      
      // If we reach here, the request wasn't cancelled
      setData(result);
    } catch (error) {
      // 3. Handle cancellation error specifically
      if (error.name === "AbortError") {
        console.log("Request cancelled! (Old data ignore)"); 
      } else {
        console.error("Real error:", error);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  fetchData();

  // 4. CLEANUP FUNCTION: Runs when component unmounts OR before 'page' changes again
  return () => {
    controller.abort(); // Cancels the previous pending request
  };
}, [page]); // Runs whenever 'page' changes
```

**Notes:**
- Always check `error.name === "AbortError"` to avoid treating cancellations as actual crashes.
- This pattern prevents "stale state" bugs.

