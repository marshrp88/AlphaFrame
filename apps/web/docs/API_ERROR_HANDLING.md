# API Error Handling Checklist & Template

This guide helps you handle errors from real-world APIs (like Plaid, authentication, etc.) in a robust and user-friendly way.

---

## Common API Error Types
- **Network Error:** No response from server (timeout, DNS failure)
- **Authentication Error:** Invalid or expired credentials
- **Validation Error:** Bad input data (missing fields, wrong types)
- **Rate Limit Error:** Too many requests in a short time
- **Server Error:** API is down or returns 5xx error
- **Not Found:** Resource does not exist (404)

---

## Error Handling Checklist
- [ ] Catch and log all API errors
- [ ] Show clear, user-friendly error messages
- [ ] Retry failed requests (with backoff) for network/server errors
- [ ] Handle authentication errors by prompting user to re-authenticate
- [ ] Validate all inputs before sending requests
- [ ] Respect API rate limits (use headers if available)
- [ ] Fallback to mock data or cached data if possible
- [ ] Track error frequency for monitoring

---

## Error Handling Template (JS)
```js
async function fetchWithHandling(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Handle different error types
      if (response.status === 401) throw new Error('Authentication error');
      if (response.status === 429) throw new Error('Rate limit exceeded');
      if (response.status === 404) throw new Error('Resource not found');
      throw new Error('Server error');
    }
    return await response.json();
  } catch (error) {
    // Log error
    console.error('API Error:', error);
    // Show user-friendly message
    alert('Something went wrong. Please try again.');
    // Optionally retry or fallback
    throw error;
  }
}
```

---

## User Feedback Examples
- "Could not connect to the server. Please check your internet connection."
- "Your session has expired. Please log in again."
- "We're experiencing high traffic. Please try again in a few minutes."
- "The requested data could not be found."

---

# Use this checklist and template to make your app resilient and user-friendly when dealing with real APIs. 