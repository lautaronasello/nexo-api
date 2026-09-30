# 🔗 NEXO — Merchant API

> **Transaction & Settlement Processing Engine**  
> Backend REST API for managing merchant transactions, automatic fee calculation, and asynchronous settlement scheduling.

---

## 📋 Overview

**NEXO Merchant API** is a backend service built with **NestJS** that simulates the core processing logic of a payment gateway. It allows registering merchants, processing transactions with different payment methods, and automatically calculating and scheduling financial settlements via an async queue system.

The system handles the full lifecycle of a payment:

1. A **merchant** is registered in the system.
2. A **transaction** is submitted (debit, credit, or QR).
3. The engine **calculates the net settlement** (fees + 21% IVA deducted).
4. A **settlement job** is dispatched to a BullMQ queue with a scheduled delay.
5. On payout date, the settlement is **processed automatically**, moving the funds from `pendingBalance` to `availableBalance`.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) v10 |
| Language | TypeScript |
| Database | PostgreSQL (via [Prisma ORM](https://www.prisma.io/)) |
| Queue | [BullMQ](https://bullmq.io/) + Redis |
| API Docs | Swagger / OpenAPI |
| Containerization | Docker Compose |

---

## ⚙️ Features

### 🏪 Merchants
- Register a new merchant (with unique CUIT and email validation).
- List all registered merchants.
- Get merchant profile including `availableBalance` and `pendingBalance`.

### 💳 Transactions
- Register a transaction linked to a merchant.
- **Idempotency key** enforcement — prevents duplicate transaction processing.
- Supports 4 payment methods with different fee structures:

| Payment Method | Fee | IVA on Fee (21%) | Settlement Delay |
|---|---|---|---|
| `DEBIT` | 0.8% | ✅ | 24 hours |
| `CREDIT_1` | 1.8% | ✅ | 48 hours |
| `CREDIT_3` | 6.5% | ✅ | 10 business days |
| `CREDIT_3` (immediate) | 8.5% (+2% penalty) | ✅ | Immediate |
| `QR` | 0.6% | ✅ | Immediate |

- Automatically creates a linked **Settlement** record on transaction registration.
- Dispatches a **BullMQ job** with a precise millisecond delay to match the scheduled payout date.

### 📄 Settlements
- Get settlement details by ID.
- List all settlements for a specific merchant.
- **Preview endpoint**: calculate the expected net amount, fee, and tax for a given gross amount + payment method — without creating any record.

---

## 🏗️ Architecture

```
src/
├── merchants/          # Merchant registration & profile management
│   ├── dto/
│   ├── merchants.controller.ts
│   ├── merchants.module.ts
│   └── merchants.service.ts
├── transactions/       # Transaction ingestion & queue dispatch
│   ├── dto/
│   ├── transactions.controller.ts
│   ├── transactions.module.ts
│   └── transactions.service.ts
├── settlements/        # Settlement calculation, lookup & async processor
│   ├── dto/
│   ├── interfaces/
│   ├── processors/     # BullMQ worker — executes payouts
│   ├── services/       # SettlementCalculatorService (pure logic)
│   ├── settlements.controller.ts
│   ├── settlements.module.ts
│   └── settlements.service.ts
├── queues/             # BullMQ module setup & queue constants
├── prisma/             # PrismaService wrapper
├── common/             # Shared filters, pipes, interceptors
├── app.module.ts
└── main.ts
```

---

## 🗄️ Database Schema

```
Merchant  ──< Transaction >── Settlement
```

- **Merchant**: stores business identity (CUIT, email) and dual balance (`availableBalance`, `pendingBalance`).
- **Transaction**: records a payment event with method, gross amount, and status.
- **Settlement**: linked 1:1 to a transaction, stores net amount, fee, tax, scheduled payout date, and status.

---

## 🧮 Settlement Calculation Logic

The `SettlementCalculatorService` applies the following formula:

```
feeApplied  = amountGross × feePercentage
taxApplied  = feeApplied × 0.21 (IVA)
amountNet   = amountGross - feeApplied - taxApplied
```

All values are rounded to **2 decimal places** using `Number.EPSILON` to avoid floating-point drift.

Business days calculation skips Saturdays and Sundays for `CREDIT_3` (10-day) payouts.

---

## 🔌 API Endpoints

### Merchants `/merchants`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/merchants` | Register a new merchant |
| `GET` | `/merchants` | List all merchants |
| `GET` | `/merchants/:id` | Get merchant details and balances |

### Transactions `/transactions`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transactions` | Register transaction + schedule settlement |
| `GET` | `/transactions/:id` | Get transaction details |
| `GET` | `/transactions/merchant/:merchantId` | List transactions for a merchant |

### Settlements `/settlements`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/settlements/calculate-preview` | Preview settlement breakdown (dry-run) |
| `GET` | `/settlements/:id` | Get settlement by ID |
| `GET` | `/settlements/merchant/:merchantId` | List settlements for a merchant |

> 📖 Full interactive docs available at **`/api`** (Swagger UI) when the server is running.

---

## 🛠️ Local Setup

### Prerequisites
- Node.js >= 20
- Docker & Docker Compose

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd api
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
DATABASE_URL="postgresql://nexo_user:nexo_password@localhost:5432/nexo_db?schema=public"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

### 3. Start infrastructure (PostgreSQL + Redis)

```bash
docker-compose up -d
```

### 4. Run database migrations

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at **`http://localhost:3000`**  
Swagger docs at **`http://localhost:3000/api`**

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start with hot-reload (development) |
| `npm run start:prod` | Start production build |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run prisma:migrate` | Run pending database migrations |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run test:cov` | Run tests with coverage report |

---

## 📄 License

MIT
