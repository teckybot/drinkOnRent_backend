
---

# Updated `CHANGELOG.md` (Phase-2)

```md
# Changelog

All notable changes to this project will be documented here.  
Format: [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 24-09-2025
### Added
- **Authentication system**:
  - Register (`/api/auth/register`) for Admin & User roles
  - Login (`/api/auth/login`) with JWT authentication
- **Purifier Management (Admin Controlled APIs)**:
  - CRUD operations on purifiers (`GET/POST/PUT/DELETE`)
  - Toggle purifier switch (`PATCH /:id/toggle-status`)
- **Developer / IoT APIs**:
  - Get purifier switch status (`GET /:id/status`)
  - Activate purifier for 60s (`GET /:id/status?onlineStatus=1`)
  - Update purifier switch status (`PUT /?id=456&status=0`)
- **Real-time support** with Socket.IO:
  - Events: `purifier:created`, `purifier:updated`, `purifier:deleted`, `purifier:toggled`
- **Timer management** for IoT activation (auto shutoff after 60s)
- **Error handling & security**:
  - Centralized error handler
  - Disabled `x-powered-by` and `etag` headers
  - JWT role-based authorization (`admin`, `user`)

### Changed
- Modularized backend:
  - Controllers, routes, models, middleware, sockets, utils
  - Split developer APIs from admin APIs
- Improved database schemas:
  - `Purifier` schema (status, onlineStatus, timers, metadata)
  - `User` schema with role-based discriminators (Admin, User)

### Notes
- This is the **first stable release (v1.0.0)** after modularization.  
- IoT APIs are hardware-ready and tested with timers.  
- Admin APIs are fully protected by JWT + role checks.  

---

## [2.0.0] - 26-09-2025
### Added
- **User APIs** (`/api/user`)
  - `GET /dashboard` → View assigned purifiers & connection status
  - `POST /request-connection` → Submit a new purifier connection request
- **Admin APIs** (`/api/admin`)
  - `GET /pending-connections` → List all pending requests
  - `POST /accept-connection` → Accept request, assign purifier (auto-generated 5-digit ID)
  - `PATCH /reject-connection/:userId` → Reject request
- **Socket.IO events for connection workflow**
  - `connection:requested` → Broadcast to admins when user submits request
  - `connection:accepted` → Sent to user when approved
  - `connection:rejected` → Sent to user when rejected
  - `connection:updated` → Notify admins to refresh pending list
- **Connection request lifecycle**
  - Users can request new purifier connections
  - Admins can approve/reject with real-time updates
- **Purifier assignment**: accepted users now get linked purifiers in their dashboard

### Changed
- Project structure extended with:
  - `controllers/adminController.js` & `userController.js`
  - `routes/adminRoutes.js` & `userRoutes.js`
  - `sockets/connectionEvents.js`
- Updated `User` model with `connectionRequestStatus`, `location`, and `assignedPurifiers` fields

### Notes
- Phase-2 introduces the **Admin ↔ User connection request workflow** with real-time communication.
- Purifier lifecycle management from Phase-1 remains intact.
- System is now ready for **Phase-3 features** (payments).