
# 📘 Purifier Management Backend
![version](https://img.shields.io/badge/version-1.0.0-blue)

## 🚀 Overview

This backend powers an **IoT-enabled Water Purifier Rental Management System**.  
It provides **REST APIs** and **real-time Socket.IO events** for:

- 📦 **Admin dashboard APIs** (managing purifiers & users)  
- 🔧 **Developer / IoT APIs** (used by hardware devices & testing team)  
- 🔐 **Authentication & Authorization** (JWT-based login/register for Admin & Users)  
- ⚡ **Real-time events** for purifier lifecycle changes  

---

## 📂 Project Structure

```
purifier-management-backend/
 ┣ 📂src
 ┃ ┣ 📂config
 ┃ ┃ ┗ db.js                # MongoDB connection
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ authController.js                # Auth logic
 ┃ ┃ ┣ purifierController.js            # Admin-facing logic
 ┃ ┃ ┗ developerPurifierController.js   # IoT/Developer APIs
 ┃ ┣ 📂middleware
 ┃ ┃ ┣ auth.js                     # Authenticate & Authorize logic
 ┃ ┃ ┣ header_ErrorHandler.js      # Central error handler & Remove unwanted headers
 ┃ ┣ 📂models
 ┃ ┃ ┗ Purifier.js          # Purifier schema/model
 ┃ ┃ ┗ User.js          # User schema/model
 ┃ ┣ 📂routes
 ┃ ┃ ┣ 📜authRoutes.js                 # Auth routes
 ┃ ┃ ┣ 📜developerPurifierRoutes.js    # IoT/Developer routes
 ┃ ┃ ┣ 📜purifierRoutes.js             # Admin-control routes
 ┃ ┣ 📂sockets
 ┃ ┃ ┗ 📜index.js               # Socket logic
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜activeTimers.js        # helper logic
 ┃ ┗ app.js                 # Express app setup
 ┣ server.js                # Server entry (ready for Socket.IO)
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

## 📑 API Endpoints (Phase 1)

### 🔹 Auth APIs (`/api/auth`)
- `POST /login` → Login with phone number & password (returns JWT)
- `POST /register` → Register new User/Admin

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

## 🔮 Next Steps (Phase 2)
- **User & Admin** routes expansion (/api/user, /api/admin)
- Integration with purifier connection requests
---

## 📓 Changelog
See detailed version history in [CHANGELOG.md](./CHANGELOG.md)