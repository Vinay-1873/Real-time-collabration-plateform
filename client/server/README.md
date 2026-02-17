# Real-time Collaboration Platform - Backend

A robust backend API for a real-time collaboration platform with document editing, version control, file sharing, and live chat.

## Features

- ✅ **User Authentication** - JWT-based authentication with bcrypt password hashing
- ✅ **Document Management** - Create, read, update, and delete documents
- ✅ **Real-time Collaboration** - Socket.io for live document editing
- ✅ **Version Control** - Track document versions and restore previous versions
- ✅ **Collaborator Management** - Add/remove collaborators with different permission levels
- ✅ **File Upload** - Cloudinary integration for file storage
- ✅ **Live Chat** - Real-time messaging within documents
- ✅ **Cursor Tracking** - See collaborators' cursors in real-time

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Cloudinary (File Storage)
- Multer (File Upload)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update `.env` with your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
```

4. Start the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description         | Auth Required |
| ------ | ----------- | ------------------- | ------------- |
| POST   | `/register` | Register new user   | No            |
| POST   | `/login`    | Login user          | No            |
| GET    | `/me`       | Get current user    | Yes           |
| PUT    | `/profile`  | Update user profile | Yes           |

### Documents (`/api/documents`)

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/`                  | Create new document    | Yes           |
| GET    | `/`                  | Get all user documents | Yes           |
| GET    | `/:id`               | Get single document    | Yes           |
| PUT    | `/:id`               | Update document        | Yes           |
| DELETE | `/:id`               | Delete document        | Yes           |
| POST   | `/:id/collaborators` | Add collaborator       | Yes           |
| DELETE | `/:id/collaborators` | Remove collaborator    | Yes           |
| GET    | `/:id/versions`      | Get document versions  | Yes           |
| POST   | `/:id/restore`       | Restore version        | Yes           |

### Files (`/api/files`)

| Method | Endpoint  | Description    | Auth Required |
| ------ | --------- | -------------- | ------------- |
| POST   | `/upload` | Upload file    | Yes           |
| GET    | `/`       | Get user files | Yes           |
| DELETE | `/:id`    | Delete file    | Yes           |

### Messages (`/api/messages`)

| Method | Endpoint       | Description           | Auth Required |
| ------ | -------------- | --------------------- | ------------- |
| GET    | `/:documentId` | Get document messages | Yes           |
| DELETE | `/:id`         | Delete message        | Yes           |

## Socket.io Events

### Client → Server

| Event             | Payload                                   | Description            |
| ----------------- | ----------------------------------------- | ---------------------- |
| `join-document`   | `{ documentId, username }`                | Join document room     |
| `leave-document`  | `{ documentId, username }`                | Leave document room    |
| `document-change` | `{ documentId, content, cursorPosition }` | Update document        |
| `cursor-position` | `{ documentId, position, username }`      | Update cursor position |
| `text-selection`  | `{ documentId, selection, username }`     | Update text selection  |
| `send-message`    | `{ documentId, content }`                 | Send chat message      |
| `typing`          | `{ documentId, username }`                | User is typing         |
| `stop-typing`     | `{ documentId }`                          | User stopped typing    |

### Server → Client

| Event              | Payload                               | Description             |
| ------------------ | ------------------------------------- | ----------------------- |
| `active-users`     | `[{ userId, username, socketId }]`    | List of active users    |
| `user-joined`      | `{ userId, username, socketId }`      | User joined document    |
| `user-left`        | `{ userId, username, socketId }`      | User left document      |
| `document-update`  | `{ content, userId, cursorPosition }` | Document updated        |
| `cursor-update`    | `{ userId, username, position }`      | Cursor position changed |
| `selection-update` | `{ userId, username, selection }`     | Text selection changed  |
| `new-message`      | `Message object`                      | New chat message        |
| `user-typing`      | `{ userId, username }`                | User is typing          |
| `user-stop-typing` | `{ userId }`                          | User stopped typing     |
| `error`            | `{ message }`                         | Error occurred          |

## Database Models

### User

- username (unique)
- email (unique)
- password (hashed)
- avatar
- timestamps

### Document

- title
- content
- owner (User reference)
- collaborators (array with permissions: view, edit, admin)
- versions (array of previous versions)
- currentVersion
- isPublic
- timestamps

### Message

- document (Document reference)
- sender (User reference)
- content
- type (text/system)
- timestamps

### File

- filename
- originalName
- fileUrl
- publicId (Cloudinary)
- fileType
- fileSize
- uploadedBy (User reference)
- document (Document reference)
- timestamps

## Permission Levels

- **Owner**: Full control (edit, delete, manage collaborators)
- **Admin**: Can edit and manage collaborators
- **Edit**: Can edit document content
- **View**: Read-only access

## Version Control

Documents automatically save versions when content changes. Users with edit permissions can:

- View all previous versions
- Restore any previous version
- See who made each change

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- File type validation
- File size limits
- CORS configuration
- Input validation with express-validator

## Development

```bash
# Start with nodemon for auto-reload
npm run dev

# Start normally
npm start
```

## Project Structure

```
server/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── database.js        # MongoDB connection
│   └── multer.js          # File upload config
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── documentController.js
│   ├── fileController.js
│   └── messageController.js
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js
│   ├── Document.js
│   ├── Message.js
│   └── File.js
├── routes/
│   ├── authRoutes.js
│   ├── documentRoutes.js
│   ├── fileRoutes.js
│   └── messageRoutes.js
├── socket/
│   └── socketHandler.js   # Socket.io event handlers
├── .env.example
├── server.js              # Main application file
└── package.json
```

## License

ISC
