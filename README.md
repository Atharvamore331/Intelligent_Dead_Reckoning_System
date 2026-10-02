# IntelliDR – AI-ML Based Intelligent Dead Reckoning System

IntelliDR is a dark-themed, map-centric web application functional prototype for real-time Dead Reckoning, GNSS signal loss simulation, sensor telemetry, and fleet management.

---

## 🚀 Quick Start Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (comes bundled with Node.js)

---

### Step 1: Install Dependencies
Open your terminal (Command Prompt, PowerShell, or Terminal) in the project directory and run:

```bash
npm install
```

---

### Step 2: Start Development Server
Run the following command to launch the app:

```bash
npm run dev
```

After running `npm run dev`, open your web browser and navigate to:
```
http://localhost:5173
```

---

### Step 3: Production Build (Optional)
To test or build the production bundle:

```bash
npm run build
```

---

## 🔑 Login Credentials

The app includes two predefined roles with quick-fill buttons on the login screen:

| Role | Username / Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **User** | `user@intellidr.demo` | `user123` | User Navigation Portal (Live map, speed, ETA, GNSS outage toggle, IMU sensor telemetry graphs, drift reduction metrics) |
| **Admin** | `admin@intellidr.demo` | `admin123` | Admin Fleet Console (Fleet overview, live map tracking 12 vehicles, vehicle/user management tables, navigation engine monitor, system health, settings) |

---

## ⚙️ Project Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Google Material Symbols
- **Maps**: Leaflet + CartoDB Dark Tiles
- **Charts**: Recharts
- **State Management**: Zustand
