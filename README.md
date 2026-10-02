# Intelligent Dead Reckoning System

IntelliDR is an AI-powered fleet navigation and monitoring prototype designed for real-time vehicle tracking, route visibility, sensor analysis, and operational control. The project presents a modern dashboard experience for fleet managers and monitoring teams.

## Features
- Fleet overview dashboard
- Live navigation and trip monitoring
- Sensor insights and analytics
- Admin login and settings views
- Modern dark-mode UI for operational environments

## Run locally
Double-click the launcher file:

- `Run IntelliDR Prototype.bat`

Or run the following from the project root:

```bash
py -m http.server 8000
```

Then open:

```text
http://localhost:8000/intellidr_admin_dashboard/code.html
```

## Project structure
- `intellidr_admin_dashboard/` - dashboard overview
- `intellidr_live_navigation/` - live navigation view
- `intellidr_sensor_insights/` - sensor analytics
- `intellidr_fleet_analytics/` - fleet-level metrics
- `intellidr_user_login/` and `intellidr_admin_login/` - access screens
- `intellidr_trip_details/` - trip detail views
- `intellidr_admin_settings/` - admin configuration screens

## Notes
This is a static UI prototype focused on product design and operational workflow demonstration.
