
---

# Updated `CHANGELOG.md` (Phase-1)

```md
# Changelog

All notable changes to this project will be documented here.  
Format: [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 26-09-2025
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
