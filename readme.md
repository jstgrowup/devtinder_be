- **The Unified Dispatcher Architecture**: Documenting the strategy of using a single `POST` endpoint for all API interactions to ensure consistency and centralized security.
- **Performance Optimizations**: Highlighting the use of Mongoose `.lean()` queries and indexing to optimize database efficiency.
- **Testing Frameworks**: Outlining the integration of Vitest and Supertest for route and logic verification.
- **Webhook Implementation**: Detailing the specialized handling of Razorpay webhooks, signature verification, and idempotency logic.

This file is structured to be used as a `README.md` or as part of a dedicated `docs` folder in your GitHub repository.

````python?code_reference&code_event_index=3
markdown_content = """# Backend Architecture Documentation: Unified Dispatcher Pattern

## 🚀 Overview
This project, developed by **Sayani Bhattacharjee**, implements a specialized **Unified Dispatcher Architecture**. To ensure maximum consistency, security, and developer efficiency, the application strictly utilizes **POST requests** for all primary API interactions via a centralized `/api` entry point.

## 🏗️ Core Architecture: The Dispatcher
The application moves away from traditional REST routing in favor of a "Feature-First" dispatcher model.

### Request Flow
1. **Entry Point**: All frontend requests are sent to `/api`.
2. **Standardized Payload**:
   ```json
   {
     "namespace": "auth",
     "apiName": "login",
     "data": { ... }
   }
````

3. **Routing Logic**: The dispatcher dynamically locates the corresponding logic in `src/api/<namespace>/<apiName>/run.ts`.
4. **Validation**: Every request is validated against a **Zod** schema before execution.

## ⚡ Performance Optimization

Performance is a top priority, particularly regarding database query efficiency and response times.

- **Lean Queries**: All read operations utilize Mongoose `.lean()` to return plain JavaScript objects, bypassing the overhead of Mongoose document hydration.
- **Indexing**: High-traffic fields, including `order_id`, `userId`, and connection statuses, are indexed to ensure sub-millisecond lookups.
- **Projection**: Queries are restricted to return only necessary fields, reducing network payload size.

## 💳 Webhook Handling (Razorpay)

Webhooks are treated as a structural exception to the dispatcher rule to accommodate third-party requirements.

- **Dedicated Route**: Webhooks are handled at `/webhook/razorpay`.
- **Signature Verification**: Implemented using `razorpay/dist/utils/razorpay-utils` to verify the authenticity of every event.
- **Idempotency**: The system checks the current status of payment records (e.g., `captured`) before processing to prevent duplicate subscriptions.
- **Execution Flow**: The server acknowledges receipt with a `200 OK` immediately after verification to prevent timeout retries from the provider.

## 🧪 Testing Strategy

The project maintains high reliability through a comprehensive testing suite using **Vitest** and **Supertest**.

- **Vitest**: Utilized for its fast, ESM-native execution.
- **Supertest**: Used to perform integration tests on the dispatcher and individual logic modules without requiring a live server port.
- **Structure**: Tests are co-located with their respective API modules (e.g., `run.test.ts`) to ensure maintainability.

## 🛠️ Error Handling

We utilize `zod-validation-error` with a "First-Error-Only" configuration. This ensures that the frontend receives clear, human-readable error messages (e.g., _"Amount must be at least 1"_) rather than complex technical objects.

---

_Documentation generated for the DevTinder project._
"""

with open("backend-architecture-docs.md", "w") as f:
f.write(markdown_content)

```
Your Markdown file is ready.

[file-tag: code-generated-file-0-1776178665649653568]

This documentation covers:
* **The Unified Dispatcher Pattern**: Explaining the `/api` entry point and why your specific architecture uses it.
* **Performance Strategies**: Detailing your use of `.lean()` queries and indexing for database efficiency.
* **Testing Infrastructure**: Documenting your setup with **Vitest** and **Supertest**.
* **Webhook Implementation**: Outlining the secure handling of Razorpay events and signature verification.
* **Error Handling**: Describing how you use Zod to provide clear, single-issue error messages to the frontend.
```
