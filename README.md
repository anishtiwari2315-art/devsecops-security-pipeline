# DevSecOps Security Scanning CI Pipeline

![CI + Security Scanning](https://github.com/anishtiwari2315-art/devsecops-security-pipeline/actions/workflows/ci-security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Problem Statement

Most development teams push code and Docker images to production **without any automated security checks**. This leads to:
- Vulnerable npm dependencies shipped to production
- Docker images with OS/library CVEs
- Static code vulnerabilities (SQL injection, XSS, etc.) going undetected
- No visibility into security issues until it is too late

---

## Solution

This project implements a real-world **DevSecOps CI pipeline** using GitHub Actions that automatically:
- Runs unit tests on every push and pull request
- Scans npm dependencies for vulnerabilities using `npm audit` and Trivy
- Builds and scans the Docker image for OS and library CVEs using Trivy
- Performs Static Application Security Testing (SAST) using CodeQL
- Uploads all scan results to the GitHub Security tab (SARIF format)
- Runs on a **daily schedule** to catch newly discovered CVEs

---

## Architecture

```
Push / PR / Nightly Schedule
         |
         v
  +------+------+
  |  tests job  |  (Unit Tests with Jest)
  +------+------+
         |
    +----+----+
    |         |         |
    v         v         v
dependency  container  sast-scan
  -scan      -scan     (CodeQL)
(npm audit  (Trivy      SAST for
 + Trivy     image      JavaScript
   fs)       scan)
    |
    v
GitHub Security Tab
(SARIF reports)
```

---

## CI Pipeline Jobs

| Job | What it does | Tools |
|-----|-------------|-------|
| `tests` | Run unit tests on every push/PR | Jest, Supertest, Node.js 20 |
| `dependency-scan` | Scan npm packages and filesystem for CVEs | npm audit, Trivy |
| `container-scan` | Build Docker image and scan for OS + library vulns | Trivy |
| `sast-scan` | Static code analysis for JS vulnerabilities | GitHub CodeQL |

---

## Tech Stack

- **App:** Node.js + Express (REST API)
- **CI/CD:** GitHub Actions
- **Container:** Docker (multi-stage, non-root user)
- **Security Scanning:** Trivy, CodeQL, npm audit
- **Testing:** Jest + Supertest

---

## Project Structure

```
devsecops-security-pipeline/
  app/
    src/
      index.js          # Express app entry point
      routes.js         # API routes (/health, /users)
    test/
      app.test.js       # Jest + Supertest unit tests
    package.json
  Dockerfile            # Multi-stage Docker build (non-root user)
  .github/
    workflows/
      ci-security.yml   # Full CI + security scanning pipeline
  README.md
  LICENSE
```

---

## How to Run Locally

### 1. Run the Node.js App

```bash
cd app
npm install
npm start
# App running at http://localhost:3000
```

### 2. Run Tests

```bash
cd app
npm test
```

### 3. Build and Run with Docker

```bash
docker build -t devsecops-app .
docker run -p 3000:3000 devsecops-app
```

### 4. Test the API

```bash
curl http://localhost:3000/health
curl http://localhost:3000/users
```

---

## How the Pipeline Works

1. **Every push to main or PR** triggers the workflow
2. `tests` job runs first - if tests fail, all other jobs are blocked
3. On test success, 3 jobs run in parallel:
   - `dependency-scan` - npm audit + Trivy filesystem scan
   - `container-scan` - Docker build + Trivy image scan
   - `sast-scan` - CodeQL analysis for JS
4. All SARIF scan results are uploaded to the **GitHub Security tab**
5. **Nightly at 2 AM** the full pipeline runs again to catch new CVEs

---

## Security Features

- Fails build if HIGH or CRITICAL vulnerabilities found in dependencies
- Docker image uses **multi-stage build** to minimize attack surface
- Container runs as **non-root user** (security best practice)
- CodeQL alerts appear in **GitHub Security > Code scanning alerts**
- Trivy results appear in **GitHub Security > Code scanning alerts**

---

## What I Learned

- Implementing shift-left security in a CI/CD pipeline
- Using Trivy for both filesystem and container image scanning
- Setting up CodeQL SAST for JavaScript applications
- Uploading SARIF reports to GitHub Security tab
- Docker security best practices (multi-stage, non-root)
- Structuring a GitHub Actions workflow with job dependencies

---

## License

MIT License - see [LICENSE](LICENSE) for details.
