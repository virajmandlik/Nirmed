
---

# 🏥 Waste Wise Healthcare Hub

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

### 🔹 Backend

* **Node.js**
* **Express.js**
* **MongoDB** (via Mongoose)
* **Dotenv**
* **CORS**
* **Helmet**
* **Morgan**

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd waste-wise-healthcare-hub
```

---

### 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install    # or yarn install or bun install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend server:

```bash
node server.js
```

---

### 3. Frontend Setup

Navigate to the project root:

```bash
cd ..
```

Install frontend dependencies:

```bash
npm install    # or yarn install or bun install
```

Start the frontend development server:

```bash
npm run dev    # or yarn dev or bun dev
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
* Track status of previously submitted requests

### 🧹 Disposal Staff

* Log in to view pending and in-progress requests
* Mark requests as "In Process"
* Complete disposal with relevant details

---

## 🤝 Contributing

> Contribution guidelines will be added soon. Stay tuned!

---

## 📄 License

> License information to be updated here.

---
