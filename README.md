
# 📘 Purifier Management Backend
![version](https://img.shields.io/badge/version-2.0.0-blue)

## 🚀 Overview 
#### {Updated}

This backend powers an **IoT-enabled Water Purifier Rental Management System**.  
It provides **REST APIs** and **real-time Socket.IO events** for:

- 📦 **Admin dashboard APIs** (managing purifiers, users & connection requests)  
- 🔧 **Developer / IoT APIs** (used by hardware devices & testing team)  
- 🔐 **Authentication & Authorization** (JWT-based login/register for Admin & Users)  
- ⚡ **Real-time events** (connection requests, approvals, rejections, purifier lifecycle) 

---

## 📂 Project Structure

```
purifier-management-backend/
 ┣ 📂src
 ┃ ┣ 📂config
 ┃ ┃ ┗ db.js                # MongoDB connection
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ adminController.js               # Admin: approve/reject connection requests
 ┃ ┃ ┣ authController.js                # Authentication logic
 ┃ ┃ ┗ developerPurifierController.js   # IoT/Developer APIs
 ┃ ┃ ┣ purifierController.js            # Admin purifier management logic
 ┃ ┃ ┣ userController.js                # User dashboard & request connection
 ┃ ┣ 📂middleware
 ┃ ┃ ┣ auth.js                     # JWT auth & role-based access
 ┃ ┃ ┣ header_ErrorHandler.js      # Error handling & header cleanup
 ┃ ┣ 📂models
 ┃ ┃ ┗ Purifier.js          # Purifier schema/model
 ┃ ┃ ┗ User.js              # User schema/model
 ┃ ┣ 📂routes
 ┃ ┃ ┣ adminRoutes.js                # /api/admin     
 ┃ ┃ ┣ authRoutes.js                 # /api/auth
 ┃ ┃ ┣ developerPurifierRoutes.js    # /api/dev/purifiers routes
 ┃ ┃ ┣ purifierRoutes.js             # /api/purifiers routes
 ┃ ┃ ┗ userRoutes.js                 # /api/user
 ┃ ┣ 📂sockets
 ┃ ┃ ┗ index.js               # Socket.IO setup
 ┃ ┃ ┣ connectionEvents.js    # Socket events for Device connection workflow
 ┃ ┣ 📂utils
 ┃ ┃ ┗ activeTimers.js        # IoT 60s activation timers
 ┃ ┗ app.js                 # Express app setup
 ┣ server.js                # Server entry 
 ┣ .env                     # Environment variables
 ┣ package.json
 ┗ README.md
```

---

## ⚙️ Tech Stack

- **Runtime:** Node.js (ESM imports)  
- **Framework:** Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT + bcrypt  
- **Real-time:** Socket.IO  
- **Logging:** Morgan  
- **CORS:** Configured with whitelist  
- **Environment Config:** dotenv  

---

## 📑 API Endpoints (Phase 2)

### 🔹 Auth APIs (`/api/auth`)
- `POST /login` → Login with phone number & password (returns JWT)
- `POST /register` → Register new User/Admin

---

### 🔹 User APIs (`/api/user`)
Protected with **JWT + role=user**  

- `GET /dashboard` → Get assigned purifiers & connection request status  
- `POST /request-connection` → Request new purifier connection (pending until admin action)  

Socket events received by **Users**:  
- `connection:accepted` → When admin accepts connection  
- `connection:rejected` → When admin rejects connection  

---

### 🔹 Admin APIs (`/api/admin`)
Protected with **JWT + role=admin**  

- `GET /pending-connections` → View users with pending connection requests  
- `POST /accept-connection` → Approve user request & assign purifier (auto-generate unique 5-digit ID)  
- `PATCH /reject-connection/:userId` → Reject user request  

Socket events received by **Admins**:  
- `connection:requested` → When a user submits a new connection request  
- `connection:updated` → When a connection is approved/rejected  

---

### 🔹 Admin / Application APIs (`/api/purifiers`)
Protected with **JWT + role=admin**  

* `GET /api/purifiers` → Get all purifiers
* `POST /api/purifiers` → Add a new purifier
* `PUT /api/purifiers/:id` → Update purifier details
* `DELETE /api/purifiers/:id` → Delete purifier
* `PATCH api/purifiers/:id/toggle-status` → Toggle Switch status by id

Real-time socket events:  
- `purifier:created`  
- `purifier:updated`  
- `purifier:deleted`  
- `purifier:toggled`  

---

### 🔹 Developer / IoT APIs (`/api/dev/purifiers`)
Open to IoT hardware (no auth required). 

* `GET /api/dev/purifiers/:id/status` → Get purifier current Switch status
* `GET /api/dev/purifiers/456/status?onlineStatus=0` → Switch status returned and purifier activated[1]/deactivated[0] (Activate purifier for **60s** (auto turn-off after timeout))
* `PUT /api/dev/purifiers?id=456&status=1` → Update switch status

---

### 🔹 Health Check
- `GET /` → `"Ping successful. DOR-Server responded"`

---

## 📦 Installation & Setup

### 1. Clone repo

```sh
git clone <repo-url>
cd purifier-management-backend
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure `.env`

Create a `.env` file in root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/purifierDB
JWT_SECRET=your_secret_key
```

### 4. Run server

```sh
npm run dev   # with nodemon
# or
npm start
```

Server runs at:
👉 `http://localhost:5000`

---

## 🔮 Next Steps (Phase 3)
- **Payment/Subscription** feature integration
- Notification service integration
---

## 📓 Changelog
See detailed version history in [CHANGELOG.md](./CHANGELOG.md)