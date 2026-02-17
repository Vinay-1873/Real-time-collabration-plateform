# Collaborative Docs - Backend Server

Express.js backend server with Socket.io for real-time collaboration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collaborative-docs
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

3. Start MongoDB

4. Run the server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Auth middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── sockets/         # Socket.io handlers
├── utils/           # Utility functions
└── server.js        # Main server file
```

## API Endpoints

See main README.md for full API documentation.

## Models

- **User**: Authentication and user data
- **Document**: Document content and metadata
- **Version**: Version history snapshots
