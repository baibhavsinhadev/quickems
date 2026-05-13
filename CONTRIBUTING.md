# Contributing to QuickEMS

Thanks for your interest in contributing to **QuickEMS**. This project is built to solve real-world problems, and contributions that improve usability, performance, and scalability are always welcome.

---

## How to Contribute

### 1. Fork the Repository

Create your own copy of the project:

```
https://github.com/baibhavsinhadev/quickems
```

Click on **Fork** and clone it locally:

```
git clone https://github.com/your-username/quickems.git
cd quickems
```

---

### 2. Create a New Branch

Always create a separate branch for your work:

```
git checkout -b feature/your-feature-name
```

Examples:

* `feature/add-search-filter`
* `fix/login-bug`
* `improvement/api-optimization`

---

### 3. Setup the Project

#### Backend

```
cd server
npm install
npm run server
```

#### Frontend

```
cd client
npm install
npm run dev
```

Make sure `.env` files are configured correctly.

---

### 4. Follow Coding Standards

Keep things consistent and readable:

* Use clear and meaningful variable names
* Keep functions small and focused
* Avoid unnecessary complexity
* Follow existing folder structure
* Maintain separation of concerns (controllers, services, routes, etc.)

---

### 5. Commit Guidelines

Write clean and meaningful commit messages:

```
feat: add employee search functionality
fix: resolve attendance check-in issue
refactor: improve leave controller structure
```

Avoid vague commits like:

```
update code
fix bug
```

---

### 6. Test Your Changes

Before submitting:

* Make sure the app runs without errors
* Test both Admin and Employee flows (if affected)
* Check API responses properly
* Verify UI changes on frontend

---

### 7. Push and Create Pull Request

Push your branch:

```
git push origin feature/your-feature-name
```

Then open a **Pull Request** with:

* Clear description of changes
* Screenshots (if UI changes)
* Steps to test

---

## Contribution Types

You can contribute in multiple ways:

### Features

* New modules (HR roles, analytics, etc.)
* UI/UX improvements
* Performance optimizations

### Bug Fixes

* Fix broken APIs
* Resolve UI glitches
* Improve validation & error handling

### Improvements

* Code refactoring
* Better folder structure
* Documentation updates

---

## Rules & Expectations

* Don’t break existing functionality
* Keep PRs focused (one feature/fix per PR)
* Avoid committing `.env` files
* Respect project structure and patterns
* Be open to feedback and changes

---

## Need Help?

If you’re stuck or unsure:

* Open an issue
* Ask clearly what you're trying to do
* Mention relevant files or errors

---

## Final Note

This project is meant to grow into a production-level system.
So if you're contributing, think like you're building something people will actually use — not just something that works locally.