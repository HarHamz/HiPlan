# HiPlan Backend

Backend API untuk aplikasi HiPlan - Platform pendakian gunung Indonesia.

## 🚀 Fitur

- **Authentication & Authorization**
  - Register pengguna baru
  - Login dengan email dan password
  - JWT token untuk autentikasi
  - Profile pengguna

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Hapi.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation

## 📦 Installation

1. Clone repository ini
2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup database PostgreSQL dan buat database `hiplan_db`

4. Copy file environment:

   ```bash
   copy .env.example .env
   ```

5. Update file `.env` dengan konfigurasi database Anda:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hiplan_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your-super-secret-jwt-key
   ```

6. Jalankan migrasi database:

   ```bash
   npm run migrate
   ```

7. Jalankan server:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

Server akan berjalan di `http://localhost:3001`

## 📚 API Endpoints

### Authentication

#### Register User

```http
POST /api/register
Content-Type: application/json

{
  "nama": "John Doe",
  "tanggal": "1990-01-01",
  "alamat": "Jakarta, Indonesia",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile (Protected)

```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  birth_date DATE,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

Untuk development, gunakan:

```bash
npm run dev
```

Server akan restart otomatis ketika ada perubahan file.

## 📝 Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Error message"
}
```

## 🔐 Security

- Passwords di-hash menggunakan bcryptjs
- JWT tokens untuk autentikasi
- Input validation menggunakan Joi
- CORS enabled untuk frontend integration

## 📄 License

MIT License
