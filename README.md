<div align="center">

# 🛡️ ClouSec

### AI-Powered Cloud Security Posture Management (CSPM) Platform

Real-time AWS security monitoring, automated misconfiguration detection, risk scoring, and security posture visualization powered by an event-driven architecture.

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=flat&logo=flask)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-CloudTrail%20%7C%20EventBridge-FF9900?style=flat&logo=amazonaws&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-2ea44f?style=flat)

</div>

---

## 🚀 Overview

ClouSec is a Cloud Security Posture Management (CSPM) platform designed to continuously monitor AWS environments and detect security risks in real time.

Unlike traditional periodic scanners, ClouSec uses an event-driven architecture powered by AWS CloudTrail and EventBridge to identify misconfigurations immediately after infrastructure changes occur.

The platform provides automated vulnerability detection, findings lifecycle management, risk scoring, cloud asset inventory tracking, and an interactive dashboard for monitoring overall cloud security posture.

---

## ✨ Key Features

### ⚡ Real-Time Event-Driven Security Monitoring
- AWS CloudTrail event tracking
- EventBridge-powered automation
- Instant security assessment on resource changes
- No polling or scheduled scans

### 🔍 Automated Misconfiguration Detection

#### EC2 Security Checks
- Publicly exposed Security Groups
- Sensitive ports exposed (22, 3389)
- Public IP exposure
- IMDSv1 enabled
- Unencrypted EBS volumes

#### S3 Security Checks
- Public bucket access
- Public ACLs
- Block Public Access disabled
- Encryption disabled

#### IAM Security Checks
- Wildcard permissions (`*`)
- Overly permissive IAM policies
- Excessive privilege detection

### 🔄 Findings Lifecycle Management
- Persistent vulnerability tracking
- Open → Resolved workflow
- Historical security records
- Audit-ready findings management

### 📊 Security Dashboard
- Open vs Resolved findings
- Severity distribution
- Service-wise risk analysis
- Infrastructure inventory
- Real-time risk score calculation
- Detailed finding inspection

### 🗂️ Cloud Asset Inventory
- EC2 Instances
- Security Groups
- S3 Buckets
- IAM Users
- IAM Roles

---

## 🏗️ Architecture

```text
AWS Resource Change
        │
        ▼
CloudTrail
        │
        ▼
EventBridge Rule
        │
        ▼
API Destination
        │
        ▼
Flask Backend
        │
        ▼
Security Scanner Engine
        │
        ▼
MongoDB Atlas
        │
        ▼
React Dashboard
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---------|-------------|
| Backend | Python, Flask, Boto3 |
| Frontend | React, Vite, Tailwind CSS |
| Database | MongoDB Atlas |
| Cloud Services | AWS CloudTrail, EventBridge, API Destinations |
| Visualization | Recharts, Framer Motion |
| State Management | Zustand |

---

## 📂 Project Structure

```text
clousec/
│
├── backend/
│   └── app.py
│
├── clousec/
│   ├── scanners/
│   ├── models/
│   ├── services/
│   └── utils/
│
└── frontend/
    └── React Application
```

---

## 📈 Risk Scoring

Risk score is calculated using severity-weighted findings.

| Severity | Weight |
|-----------|----------|
| Critical | 5 |
| High | 3 |
| Medium | 1 |

```text
Risk Score = Σ (Severity Weight × Open Findings)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|----------|----------|----------|
| GET | `/health` | Service health check |
| GET | `/dashboard` | Dashboard metrics |
| GET | `/findings` | Retrieve findings |
| GET | `/inventory` | Cloud asset inventory |
| POST | `/event` | EventBridge webhook |

---

## ⚙️ Local Setup

### Backend

```bash
python -m venv venv

# Activate Environment

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

python -m backend.app
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🎯 Key Achievements

- Event-driven AWS security monitoring
- Automated cloud misconfiguration detection
- Real-time security posture visualization
- Lifecycle-aware findings management
- Risk scoring and prioritization
- Scalable CSPM architecture

---

## 🔮 Future Enhancements

- Multi-cloud support (AWS, Azure, GCP)
- AI-powered remediation recommendations
- Compliance monitoring (SOC2, ISO27001, CIS Benchmarks)
- Security alert notifications
- Automated remediation workflows

---

## 👨‍💻 Author

**T. Sri Vardhan**

🔗 LinkedIn: https://www.linkedin.com/in/sri-vardhan-9631322ba/

---

## 📜 License

This project is intended for educational, research, and cloud security learning purposes.
