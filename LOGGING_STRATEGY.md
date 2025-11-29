# API Logging Strategy

This document outlines the client-side API logging strategy implemented in the application. The logging system is designed to provide high visibility into API interactions during development while remaining silent in production.

## Overview

The logging mechanism is built using **Axios Interceptors**. It intercepts every request and response to log detailed information to the browser console.

### Key Features
- **Environment Aware**: Active only in development (`import.meta.env.DEV`).
- **Configurable**: Can be toggled via `VITE_API_LOGGING` environment variable.
- **Visual Hierarchy**: Uses `console.groupCollapsed` to keep the console clean but accessible.
- **Rich Formatting**: Uses CSS styling in console logs for better readability.
- **Performance Metrics**: Tracks and logs request duration.

## Configuration

To enable or disable logging, use the environment variable in your `.env` file:

```env
# Enable logging (default in DEV)
VITE_API_LOGGING=true

# Disable logging
VITE_API_LOGGING=false
```

## Implementation Details

The implementation is located in `src/api/client.ts`.

### 1. Request Logging

Before a request is sent, the interceptor logs the details.

**What is logged:**
- **Method & URL**: e.g., `GET /api/users`
- **Timestamp**: When the request started.
- **Headers**: Authorization status (masked) and Content-Type.
- **Body/Params**: Payload data if present.
- **Special Handling**: `/upload-image` endpoints show file details (name, size, type).

**Code Example:**

```typescript
apiClient.interceptors.request.use((config) => {
  // ... (Token logic)

  // Metadata for duration calculation
  (config as any).metadata = { startTime: new Date() };

  if (import.meta.env.DEV && import.meta.env.VITE_API_LOGGING !== 'false') {
    console.groupCollapsed(
      `%c➡️ ${config.method?.toUpperCase()} %c${config.url}`,
      'color: #3b82f6; font-weight: bold',
      'color: #10b981; font-weight: normal'
    );
    
    // Log details...
    console.log('%cURL:', 'color: #8b5cf6', `${config.baseURL}${config.url}`);
    if (config.data) console.log('Body:', config.data);
    
    console.groupEnd();
  }
  return config;
});
```

### 2. Response Logging

When a response is received, the interceptor calculates the duration and logs the result.

**What is logged:**
- **Status Code**: Color-coded (Green 2xx, Orange 3xx, Red 4xx/5xx).
- **Duration**: Time taken in milliseconds.
- **Data Size**: Approximate size of the response payload.
- **Data Structure**: Keys of the response object for quick inspection.

**Code Example:**

```typescript
apiClient.interceptors.response.use((response) => {
  const config = response.config as any;
  const duration = new Date().getTime() - config.metadata.startTime.getTime();

  if (import.meta.env.DEV) {
    console.groupCollapsed(
      `%c✅${response.status} %c${config.method} %c${config.url}%c (${duration}ms)`,
      'color: #10b981', // Dynamic color based on status
      'color: #3b82f6',
      'color: #10b981',
      'color: #6b7280'
    );
    
    console.log('Response Data:', response.data);
    console.groupEnd();
  }
  return response;
});
```

### 3. Error Handling

Errors are caught and logged with distinctive styling to attract attention.

**Features:**
- **Icons**: 🔒 (403), 🔍 (404), 💥 (500+) for quick visual scanning.
- **Context**: Logs the original request config to help reproduce the error.
- **Token Refresh**: Specifically logs the flow of 401 Unauthorized errors and the token refresh attempt.

**Code Example:**

```typescript
(error: AxiosError) => {
  if (import.meta.env.DEV) {
    const status = error.response?.status;
    // ... Determine icon and color

    console.groupCollapsed(
      `%c❌ ${status} %c${error.config?.url}`,
      'color: #ef4444',
      'color: #6b7280'
    );
    
    console.error('Error Message:', error.message);
    console.groupEnd();
  }
  return Promise.reject(error);
}
```

## Best Practices

1.  **Security**: Never log full sensitive tokens or PII in production. This implementation masks tokens and only runs in DEV.
2.  **Noise Control**: Use `console.groupCollapsed` so developers can expand only what they need to see.
3.  **Clarity**: Use CSS styling in `console.log` to make important information (like methods and status codes) stand out.
