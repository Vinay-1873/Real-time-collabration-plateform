# Collaborative Docs - Frontend Client

React + Vite application with TipTap editor and Socket.io.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/            # API client (axios)
├── components/     # React components
├── context/        # React context (Auth)
├── pages/          # Page components
├── sockets/        # Socket.io client
└── utils/          # Utility functions
```

## Pages

- `/login` - User login
- `/register` - User registration
- `/dashboard` - Document list
- `/editor/:id` - Collaborative editor

## Features

- Real-time collaborative editing
- Rich text formatting
- Auto-save functionality
- Version history
- Active users indicator
