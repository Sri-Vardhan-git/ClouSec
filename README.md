<div align="center">

# 🛡️ ClouSec

### AI-Powered AWS Security Monitoring & Optimization System

*Continuous, event-driven cloud security monitoring with real-time misconfiguration detection*
*and a modern visual risk dashboard — no polling, no delays.*

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=flat&logo=flask)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-CloudTrail%20%7C%20EventBridge-FF9900?style=flat&logo=amazonaws&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-2ea44f?style=flat)

</div>

---

## Overview

ClouSec monitors AWS infrastructure continuously and surfaces security risks through a modern animated dashboard. Built on an **event-driven architecture** using AWS CloudTrail and EventBridge — every risky configuration change is detected instantly, with full lifecycle tracking from discovery to resolution.

---

## Features

### ⚡ Real-Time Event-Driven Detection
No polling or scheduled scans. Events flow from CloudTrail → EventBridge → Flask backend the moment a change occurs, triggering targeted scans only on the affected resource.

### 🔍 Misconfiguration Detection

<details>
<summary><strong>EC2</strong></summary>

- Publicly exposed security groups
- Sensitive ports open (22, 3389)
- Instances with public IP
- IMDSv1 enabled
- Unencrypted EBS volumes

</details>

<details>
<summary><strong>S3</strong></summary>

- Public bucket policies
- Public ACLs
- Block Public Access disabled
- Encryption disabled

</details>

<details>
<summary><strong>IAM</strong></summary>

- Overly permissive policies
- Wildcard permissions (`*`)

</details>

### 🔄 Finding Lifecycle Tracking

Every vulnerability follows a persistent lifecycle — findings are **never deleted**, enabling audit trails, historical risk analysis, and future risk scoring.

```
OPEN → RESOLVED
```

### 📊 Security Dashboard

- Open vs Resolved findings
- Severity distribution & service impact breakdown
- Priority-sorted vulnerability list
- Risk score calculation
- Drill-down modal for deep inspection

### 🗂️ Infrastructure Inventory

Full visibility across EC2 instances, security groups, S3 buckets, IAM users, and IAM roles.

---

## System Architecture

```
AWS API Call
    ↓
CloudTrail  ──  logs event
    ↓
EventBridge Rule
    ↓
API Destination (HTTPS)
    ↓
Flask Backend
    ↓
Targeted Security Scanner
    ↓
MongoDB Atlas  ──  Findings Lifecycle
    ↓
React Dashboard
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python · Flask · Boto3 · MongoDB Atlas |
| **AWS Services** | CloudTrail · EventBridge · API Destinations |
| **Frontend** | React (Vite) · Tailwind CSS · Framer Motion · Recharts · Zustand |

---

## Project Structure

```
clousec/
├── backend/
│   └── app.py
├── clousec/
│   ├── scanners/
│   ├── models/
│   ├── services/
│   └── utils/
└── frontend/
    └── (React App)
```

---

## Getting Started

### Backend

```bash
# 1. Create and activate virtual environment
python -m venv venv

# Mac/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment — create a .env file
MONGO_URI=your_mongodb_connection_string

# 4. Run the backend
set PYTHONPATH=.
python -m backend.app
```

| Endpoint | URL |
|---|---|
| Backend | `http://localhost:5000` |
| Health Check | `http://localhost:5000/health` |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/dashboard` | Summary stats |
| `GET` | `/findings` | All findings |
| `GET` | `/findings?status=OPEN` | Filtered findings |
| `GET` | `/inventory` | Infrastructure inventory |
| `POST` | `/event` | EventBridge event receiver |

---

## Risk Scoring Model

Risk score is computed as a weighted sum across all open findings:

```
Total Risk = Σ (severity_weight × count)
```

| Severity | Weight |
|---|---|
| `CRITICAL` | 5 |
| `HIGH` | 3 |
| `MEDIUM` | 1 |

---

## Key Capabilities

- ☁️ Event-driven cloud security — zero polling overhead
- 🔁 Lifecycle-aware vulnerability tracking with full audit history
- 📈 Priority-based alerting and real-time dashboard insights
- 🧱 Scalable CSPM (Cloud Security Posture Management) foundation

---

<div align="center">

Built by [R Shruthi Yadav](https://linkedin.com/in/rshruthiyadav)

</div>
