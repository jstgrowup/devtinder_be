# 🧩 API Architecture Overview

## 📁 File-Based Routing (The Dispatcher)

In this setup, you don’t write routes like `app.post('/api/login')`. Instead, you have a **Dispatcher**.

The dispatcher is a single Express route (`/api`) that looks at the `namespace` and `apiName` in the request body. It then dynamically imports the file at:

```
src/api/<namespace>/<apiName>/run.ts
```

### ✅ Why it’s good

- **Discovery**: If you want to find the "Swipe Right" logic, just look for the folder `swipe/right`.
- **Scalability**: You can have hundreds of endpoints, and your `app.ts` file stays the same size.

---

## 🛡️ Zod Validations (The Firewall)

Every API folder contains a `schema.ts` file. This file defines exactly what the incoming data should look like.

Before the logic in `run.ts` even starts, the dispatcher validates the input using this Zod schema.

If the user sends invalid data (e.g., a string instead of a number), Zod catches it immediately.

### 💡 The Benefit

Your business logic in `run.ts` can **trust the data**.

No need to write repetitive checks like:

```ts
if (!req.body.amount) {
  throw new Error("Amount is required");
}
```

---

## ⚙️ `run.ts` (The Brain)

This is where the actual work happens. Each API endpoint exports a single function.

### Example

```ts
// src/api/profile/update/run.ts

export const run = async ({ data, context }) => {
  const { userId } = context;

  const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

  return {
    message: "Profile updated successfully",
    data: updatedUser,
  };
};
```

### ✅ Why this is powerful

- Fully **unit-testable**
- No need to mock Express `req`/`res`
- Clean separation of concerns

---

## 📦 `constants.ts` (The Source of Truth)

To avoid **magic strings** and typos, store all reusable values here.

### Includes

- **Enums**

  ```ts
  REQUEST_STATUS.ACCEPTED;
  SUBSCRIPTION_STATUS.ACTIVE;
  ```

- **Configuration**
  - Monthly pricing
  - Pagination limits

### 💡 Benefit

Change a value in one place, and it updates across the entire app.

---

## 🔁 The "Always 200" Response Strategy

This is the most controversial—but powerful—part of the architecture.

Regardless of success or failure, the HTTP status code is always:

```
200 OK
```

Instead of relying on HTTP status codes (`400`, `401`, `500`), success and failure are handled inside the response body.

### 📦 Response Structure

#### ✅ Success

```json
{
  "status": "ok",
  "data": {
    "message": "Done",
    "payload": []
  }
}
```

#### ❌ Error

```json
{
  "status": "error",
  "data": {
    "message": "Amount is too small"
  }
}
```

---

## 🤔 Why this approach?

### 1. Frontend Consistency

Your API client only needs a single `try/catch` block.

It simply checks:

```ts
response.data.status;
```

---

### 2. Dispatcher Simplicity

The dispatcher doesn’t need to decide which HTTP status code to send.

It just:

- Catches errors
- Formats them (e.g., using `fromZodError`)
- Wraps everything in a `200 OK` response

---

### 3. Clear Error Separation

- **Network Errors** → e.g., `502 Bad Gateway`
  - Indicates server/infrastructure failure

- **Logic Errors** → `status: "error"`
  - Indicates validation or business logic failure

### 💡 Interpretation

- `500` → Server crashed
- `200 + status: "error"` → Request handled, but invalid input or logic failure

---

## 🚀 Summary

This architecture gives you:

- 🔍 Easy discovery
- 📈 Infinite scalability
- 🛡️ Strong validation
- 🧠 Clean business logic
- 🔁 Predictable API responses

Perfect for building large, maintainable backend systems.
