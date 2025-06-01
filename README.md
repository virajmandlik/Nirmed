# 🏥 Nirmed

A modern healthcare waste management system designed to streamline the lifecycle of medical waste — from request to disposal. The platform supports two core user roles:

* **Medical Staff** – Create and manage waste disposal requests.
* **Disposal Staff** – View, process, and complete disposal operations.

---

## 🚀 Technologies Used

### 🔹 Frontend

* **React** with **TypeScript**
* **React Router**
* **React Query**
* **Context API**
* **Shadcn UI** (Headless React components)
* **Tailwind CSS** for styling
* **Vite** as build tool

### 🔹 Backend

* **Node.js**
* **Express.js**
* **MongoDB** (via Mongoose)
* **Dotenv** for environment variables
* **CORS** for cross-origin requests
* **Helmet** for security headers
* **Morgan** for HTTP request logging
* **Multer** for file uploads
* **AWS SDK** for S3 integration
* **Groq AI** for waste classification

---

## 🌟 Key Features

### 🔹 Waste Classification
* AI-powered waste type classification using Groq AI
* Image upload and processing
* Automatic categorization into waste types:
  - Infectious Waste
  - Sharps Waste
  - Pathological Waste
  - Pharmaceutical Waste
  - Chemical Waste
  - Radioactive Waste
  - Non-Hazardous General Waste

### 🔹 File Management
* Secure file uploads to AWS S3
* Automatic MIME type detection
* Unique file naming to prevent collisions

### 🔹 User Management
* Authentication system
* Role-based access control
* Secure session management

### 🔹 Waste Request Management
* Create and track waste disposal requests
* Real-time status updates
* Detailed treatment recommendations

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd waste-wise-healthcare-hub
```

### 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_bucket_name
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
node server.js
```

### 3. Frontend Setup

Navigate to the project root:

```bash
cd ..
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

---

### 🔗 URLs

* **Frontend:** `http://localhost:8080`
* **Backend:** `http://localhost:5000` (or your specified port)

---

## 👥 User Roles & Access

### 👨‍⚕️ Medical Staff

* Log in to the dashboard
* Submit new waste disposal requests
* Upload images for waste classification
* Track status of previously submitted requests
* View treatment recommendations

### 🧹 Disposal Staff

* Log in to view pending and in-progress requests
* Mark requests as "In Process"
* Complete disposal with relevant details
* Access waste classification results
* View treatment guidelines

---

## 🔒 Security Features

* CORS protection
* Helmet security headers
* Secure file upload handling
* Environment variable protection
* Role-based access control

---

## 🤝 Contributing

> Contribution guidelines will be added soon. Stay tuned!

---

## 📄 License

> License information to be updated here.

---
