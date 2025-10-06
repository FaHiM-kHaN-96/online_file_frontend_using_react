# ☁️ ONLineFile – Secure Cloud Storage Platform

 
> A modern, secure, and responsive cloud storage web application built with React.js and powered by JWT-based authentication.

---

## 🧩 Overview

**ONLineFile** is a cloud-based file management system designed for secure file storage, sharing, and collaboration.  
It provides users with enterprise-level security, elegant UI design, and real-time performance.  

The system allows users to:
- Upload and manage files seamlessly.
- Share documents via time-limited links or QR codes.
- Authenticate securely using JSON Web Tokens (JWT).
- Experience a fully responsive and modern interface built with React.

---

## 🚀 Features

### 🔐 Authentication
- User **signup**, **login**, and **JWT-based** session management.
- Secure local storage for tokens.
- Protected routes using `ProtectedRoute.jsx` validation.

### 📁 File Management
- Upload, download, delete, and preview files.
- Drag-and-drop upload interface with progress tracking.
- File size validation (200MB general / 100MB video).
- Metadata display: filename, size, upload date, download count.
- Search and filter capabilities.

### 🔗 File Sharing
- One-time **120-second** secure share links.
- Built-in **QR code generation** for easy sharing.
- Automatic link expiration and visual countdown timer.

### 🎨 User Interface
- Fully responsive design for desktop and mobile.
- **Glassmorphism** and gradient-based UI theme.
- Animated navigation with smooth transitions.
- Scroll-aware header and dynamic footer.
- Accessible via WCAG 2.1 AA standards.

### 🧠 System Architecture
- **Frontend:** React.js, React Router, Axios  
- **Backend (API):** RESTful architecture using  Spring Boot  
- **Database:** Supports SQL  
- **Security:** JWT, CORS, HTTPS

---




---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React.js (v18), React Router DOM |
| Styling | Bootstrap 5, Custom CSS, React Icons |
| API Communication | Axios |
| Authentication | JWT (JSON Web Tokens) |
| File Handling | Multipart Upload via REST API |
| Security | HTTPS, CORS, Input Validation |
| QR Code | `qrcode.react` |
| State Management | React Hooks (useState, useEffect) |

---

## 🧪 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend API running at: `http://localhost:8080`


