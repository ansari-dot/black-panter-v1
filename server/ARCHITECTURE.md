# Backend Architecture

This backend uses a MERN-style JavaScript stack:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

## Structure

- `config/` - database and external service setup
- `controllers/` - request handlers
- `models/` - MongoDB schemas
- `routes/` - API route definitions
- `middleware/` - auth, validation, uploads, and error handling
- `validators/` - Zod schemas for request validation
- `base/` - shared repository and controller helpers

## Notes

- The backend is intentionally kept in JavaScript, not TypeScript.
- Shared base classes keep CRUD modules consistent and reduce repetition.
- Add new modules by creating a model, route, and controller that reuse the base classes.
