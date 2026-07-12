# 🌱 Verdantis — AI-Powered ESG Management Platform (Backend)

Production-ready Node.js/Express/MongoDB backend for the Verdantis ESG Management Platform, built for a 6-hour hackathon.

## Tech Stack
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator
- **Other:** cors, dotenv, morgan

## Folder Structure
```
backend/
├── config/          # DB connection & app constants
├── controllers/      # Request handlers / business logic entry points
├── middleware/        # auth, role-based access, validation, error handling
├── models/            # Mongoose schemas (17 domain models)
├── routes/            # Express routers
├── services/          # Reusable business logic (ESG scoring, XP, notifications)
├── utils/              # ApiError, ApiResponse, asyncHandler, generateToken, seed
├── validators/         # express-validator rule chains per resource
├── app.js              # Express app (middleware + route wiring)
└── server.js           # Entry point (DB connect + listen)
```

## Getting Started

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed               # optional: populate demo data
npm start                  # or `npm run dev` with nodemon
```

Server boots on `http://localhost:5000` by default. Health check: `GET /api/health`.

### Demo credentials (after `npm run seed`)
| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@verdantis.io     | Password123  |
| Manager  | manager@verdantis.io   | Password123  |
| Employee | employee@verdantis.io  | Password123  |

## Authentication
All endpoints except `/api/auth/register` and `/api/auth/login` require:
```
Authorization: Bearer <JWT_TOKEN>
```
Roles: `Admin`, `Manager`, `Employee`. Role-gated routes return `403` if the caller's role isn't permitted.

## Core Business Logic

| Rule | Implementation |
|---|---|
| Carbon Emission = Quantity × Emission Factor | `carbonTransactionController.createCarbonTransaction` |
| Environmental score auto-updates after carbon transactions | `scoreService.recalcEnvironmentalScore` (100 − totalEmission/10, clamped 0-100) |
| Social score auto-updates after CSR participation | `scoreService.recalcSocialScore` (completed activities × 5 + hours × 0.5) |
| Governance score auto-updates after policy ack / compliance changes | `scoreService.recalcGovernanceScore` (ack rate × 70 + resolution rate × 30) |
| Overall ESG Score = Env×40% + Social×30% + Gov×30% | `scoreService.recalcOverall` |
| XP awarded on challenge completion | `xpService.awardXP`, triggered from `challengeParticipationController` |
| Badges auto-awarded when XP threshold reached | `xpService.checkAndAwardBadges` |
| Reward redemption deducts points & stock | `rewardController.redeemReward` |
| Leaderboard sorted by XP | `xpService.getLeaderboard` |
| Notifications stored for key events | `notificationService.createNotification`, called from most controllers |

## API Overview

Base URL: `/api`

| Resource | Base Route |
|---|---|
| Auth | `/auth` (register, login, me) |
| Users | `/users` |
| Departments | `/departments` |
| Emission Factors | `/emission-factors` |
| ESG Goals | `/esg-goals` |
| Carbon Transactions | `/carbon-transactions` |
| CSR Activities | `/csr-activities` |
| Employee Participation | `/participations` |
| Challenges | `/challenges` |
| Challenge Participation | `/challenge-participations` (+ `/leaderboard`) |
| Badges | `/badges` |
| Rewards | `/rewards` (+ `/:id/redeem`) |
| Policies | `/policies` |
| Policy Acknowledgements | `/policy-acknowledgements` |
| Audits | `/audits` |
| Compliance Issues | `/compliance-issues` |
| Department ESG Scores | `/department-scores` (+ `/:departmentId/recalculate`) |
| Notifications | `/notifications` (+ `/read-all`, `/:id/read`) |
| **Dashboard** | `GET /dashboard` |

Every resource supports standard REST verbs: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (subset per role permissions).

### Dashboard Response Shape
```json
GET /api/dashboard
{
  "success": true,
  "data": {
    "overallESG": 72.5,
    "environmentalScore": 68.2,
    "socialScore": 75.0,
    "governanceScore": 80.0,
    "totalCarbonEmission": 1245.6,
    "activeChallenges": 3,
    "employeeCount": 42,
    "departmentCount": 5,
    "leaderboard": [ { "name": "...", "xp": 500, "badges": [...] } ],
    "notifications": [ { "title": "...", "message": "...", "isRead": false } ]
  }
}
```

## Error Handling
All errors funnel through `middleware/errorMiddleware.js` and return:
```json
{ "success": false, "message": "...", "errors": [ { "field": "email", "message": "..." } ] }
```
Mongoose CastError / ValidationError / duplicate-key errors and JWT errors are normalized automatically.

## Notes for Judges / Reviewers
- All 17 required models are implemented with full CRUD where applicable.
- Business logic (scoring, XP, badges, rewards) lives in `services/`, kept out of controllers for reusability.
- Every write-mutating route is wrapped in `asyncHandler` — no repeated try/catch blocks.
- Input validation via `express-validator` chains + a centralized `validate` middleware.
- Passwords hashed with bcrypt (salt rounds: 10); JWT expires per `JWT_EXPIRES_IN` env var (default 7d).
