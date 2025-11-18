# Social Blog

A full-stack blogging platform built with **Node.js**, **Express**, and **PostgreSQL**. This application allows users to register, write rich-text stories with cover images, and view a global feed of posts.

## 🚀 Features

* **User Authentication:** Secure Registration and Login using JWT (stored in HTTP-only cookies) and Bcrypt.
* **Create Stories:** Rich-text editor (Quill.js) for writing posts.
* **Image Uploads:** Integration with Cloudinary for hosting blog post cover images.
* **Global Feed:** View all latest stories in a responsive grid layout.
* **Read Mode:** Dedicated page for reading individual stories.
* **Security:** Protected routes middleware and secure password hashing.

## 🛠️ Tech Stack

**Backend**
* Node.js & Express.js
* PostgreSQL (Database)
* JSON Web Tokens (JWT) for Auth
* Cloudinary (Image Storage)

**Frontend**
* HTML5, CSS3, Vanilla JavaScript
* Quill.js (Rich Text Editor)

## ⚙️ Prerequisites

Before running this project, ensure you have the following:
* [Node.js](https://nodejs.org/) (v14+ recommended)
* A PostgreSQL Database (e.g., local or [Neon](https://neon.tech))
* A [Cloudinary](https://cloudinary.com/) account for image hosting

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd social-blog
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=4000
    NODE_ENV=development
    
    # Database Connection
    NEON_POSTGRES_URL=postgres://user:password@host:port/database?sslmode=require
    
    # Security
    JWT_SECRET=your_super_secret_jwt_key
    
    # Cloudinary (Image Uploads)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Database Setup**
    Run the following SQL commands in your PostgreSQL database to create the required tables:

    ```sql
    -- Users Table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Posts Table
    CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(50),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories Table
    CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
    );

    -- Seed some categories
    INSERT INTO categories (name) VALUES ('Technology'), ('Lifestyle'), ('Travel'), ('Food');
    ```

5.  **Start the Server**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:4000`.

## 📂 Project Structure

```text
social-blog/
├── public/                 # Static Frontend Assets
│   ├── css/                # Stylesheets
│   ├── js/                 # Frontend Logic (Auth, Feed, Editor)
│   ├── index.html          # Home Page
│   ├── login.html          # Auth Page
│   ├── create.html         # Write Story Page
│   └── post.html           # Single Story View
├── server/                 # Backend Logic
│   ├── config/             # DB & Cloudinary Config
│   ├── controllers/        # Request Handlers
│   ├── middleware/         # Auth Middleware
│   ├── routes/             # API Routes
│   └── server.js           # Entry Point
├── .env                    # Environment Variables
├── .gitignore
└── package.json