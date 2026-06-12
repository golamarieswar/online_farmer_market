# Online Farmer Market

Full-stack MERN-style app for customers to buy non-perishable farm products, farmers to list products, and admins to approve farmers/products.

## Requirements

- Node.js 18+
- MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online_farmer_market
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

Create or update the admin user:

```bash
npm run seed:admin
```

Start the API:

```bash
npm start
```

The API runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

If the backend runs somewhere else, update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Main Flows

- Customer: register, login, browse/search approved products, add to cart, place COD orders, view orders.
- Farmer: register with documents, wait for admin approval, login, add products, view/update orders.
- Admin: login, approve/reject pending farmers, approve/reject pending products, view dashboard counts.

## Useful Commands

Backend:

```bash
npm start
npm run dev
npm run seed:admin
```

Frontend:

```bash
npm run dev
npm run build
```
