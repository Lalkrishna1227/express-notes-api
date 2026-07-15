# Express Notes API

A small REST API built with Node.js, Express, and TypeScript for managing notes. Demonstrates clean route design, input validation, and automated tests without any external database.

## Features

- Full CRUD for notes (create, read, update, delete)
- In-memory data store, no database setup required
- Basic request validation with meaningful error responses
- Automated tests with Jest and Supertest

## Tech Stack

Node.js, Express, TypeScript, Jest, Supertest

## Getting Started

```bash
npm install
npm run dev
```

The API runs at http://localhost:3001.

## Endpoints

| Method | Route        | Description        |
|--------|--------------|---------------------|
| GET    | /health      | Health check        |
| GET    | /notes       | List all notes      |
| GET    | /notes/:id   | Get a single note   |
| POST   | /notes       | Create a note       |
| PUT    | /notes/:id   | Update a note       |
| DELETE | /notes/:id   | Delete a note       |

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
  server.ts       Express app, routes, and validation
  server.test.ts  Jest + Supertest test suite
```

## Why this project

Built to demonstrate backend fundamentals relevant to full-stack roles: RESTful API design, request validation, error handling, and test coverage, the same patterns used when building the server side of a production front-end application.
