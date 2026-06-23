# 🩹 Retrofit.js

> A lightweight, zero-dependency, self-healing HTTP client wrapper that dynamically repairs API drift and schema mismatches in real time.

![npm version](https://img.shields.io/npm/v/retrofit-js.svg?style=flat-cache)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/retrofit-js)

---

## 💡 What is Retrofit.js?

Modern applications often depend on third-party APIs that can change unexpectedly. A backend deployment that renames a property from `user_id` to `userId` may silently break frontend code and trigger runtime errors such as:

```javascript
Cannot read properties of undefined
```

**Retrofit.js** acts as a protective layer between your application and external APIs.

It intercepts HTTP responses (`fetch` or `Axios`) and applies lightweight fuzzy-matching heuristics to automatically remap deviated response keys back to the contract your frontend expects.

This allows applications to remain functional even when API providers introduce minor schema changes.

---

## ✨ Features

### 📦 Ultra Lightweight

* Zero external dependencies
* Less than 2KB minified and gzipped

### 🧠 Intelligent Key Matching

Automatically maps common naming variations:

```text
user_id
user-id
UserID
USER_ID
```

into:

```javascript
userId
```

### 🛡️ Self-Healing Fallbacks

Injects safe fallback values when expected properties are missing:

| Type    | Default Value |
| ------- | ------------- |
| string  | `""`          |
| number  | `0`           |
| boolean | `false`       |
| object  | `{}`          |
| array   | `[]`          |

### 🔌 Universal Adapters

Works seamlessly with:

* Native Fetch API
* Axios instances
* Custom HTTP layers

### 🌲 Deep Recursive Mapping

Supports:

* Nested objects
* Arrays of objects
* Complex API response trees

---

# 🚀 Installation

```bash
npm install retrofit-js
```

---

# Quick Start

## 1. Global Fetch Interception

Install Retrofit.js once at application startup.

```javascript
import { hookFetch } from 'retrofit-js';

const userSchema = {
  userId: 'number',
  fullName: 'string',
  preferences: {
    themeMode: 'string'
  }
};

hookFetch({
  expectedSchema: userSchema,
  urlFilter: '/api/v1'
});
```

Now every matching request is automatically normalized.

```javascript
const response = await fetch('/api/v1/profile');
const user = await response.json();

console.log(user.userId);
console.log(user.fullName);
console.log(user.preferences.themeMode);
```

Even if the backend returns:

```json
{
  "user_id": 42,
  "full_name": "John Doe",
  "preferences": {
    "theme_mode": "dark"
  }
}
```

Your frontend receives:

```json
{
  "userId": 42,
  "fullName": "John Doe",
  "preferences": {
    "themeMode": "dark"
  }
}
```

---

## 2. Axios Integration

For projects using custom Axios instances:

```javascript
import axios from 'axios';
import { hookAxios } from 'retrofit-js';

const apiClient = axios.create({
  baseURL: 'https://api.domain.com'
});

hookAxios(apiClient, {
  expectedSchema: {
    productId: 'number',
    tags: []
  },
  silent: true
});
```

All responses passing through the instance will be normalized automatically.

---

# 🛠️ Schema Definition

Schemas describe the structure your application expects.

## Primitive Types

```javascript
const schema = {
  userId: 'number',
  fullName: 'string',
  active: 'boolean'
};
```

## Nested Objects

```javascript
const schema = {
  userId: 'number',
  preferences: {
    themeMode: 'string'
  }
};
```

## Arrays

```javascript
const schema = {
  tags: [],
  categories: []
};
```

---

# 📊 Architecture

```text
Raw API Response
        │
        ▼
Retrofit.js Interceptor
        │
        ▼
Fuzzy Matching Engine
        │
        ▼
Schema Normalization
        │
        ▼
UI-Ready Application State
```

---

# ⚙️ How It Works

Retrofit.js performs three core operations:

1. **Key Normalization**

   * Converts keys into a canonical format.

2. **Similarity Matching**

   * Detects equivalent property names using lightweight heuristics.

3. **Fallback Injection**

   * Provides safe defaults for missing values.

This process helps applications tolerate minor API contract drift without introducing runtime failures.

---

# 📈 Performance

Designed for high-throughput applications:

* Zero dependencies
* Minimal memory overhead
* Recursive traversal optimized for nested structures
* Sub-millisecond processing for typical API payloads

---

# 🤝 Contributing

Contributions are welcome.

You can help by:

* Reporting bugs
* Suggesting new features
* Improving documentation
* Submitting pull requests

Before opening a pull request, please ensure:

```bash
npm run lint
npm test
```

---

# 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

## 👨‍💻 Author

Developed with ❤️ by **Daniel de Lima**.
