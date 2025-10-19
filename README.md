# TaskPro - Real-Time Task Management Application

A modern, full-stack task management application built with React, Node.js, and Socket.IO, featuring real-time collaboration and drag-and-drop functionality.

## 🚀 Features

- **Real-Time Collaboration**: Live updates across all connected users using Socket.IO
- **Drag & Drop Interface**: Intuitive task movement between columns (Inbox, To Do, Completed)
- **User Authentication**: Secure JWT-based authentication system
- **Board Management**: Create and manage multiple project boards
- **Task Organization**: Organize tasks in customizable lists/columns
- **Role-Based Access**: Admin and user roles with different permissions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RESTful API**: Well-structured backend API with proper error handling

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **React DnD** - Drag and drop functionality
- **Socket.IO Client** - Real-time communication
- **React Toastify** - User notifications
- **Vite** - Fast build tool and development server
- **Bootstrap** - CSS framework for styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TaskPro-2/
├── taskpro-client/           # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── BoardView.jsx
│   │   │   ├── ListColumn.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Socket.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── reducer/         # Redux store and slices
│   │   │   ├── authReducer.jsx
│   │   │   ├── boardReducer.jsx
│   │   │   ├── taskReducer.jsx
│   │   │   └── store.jsx
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── taskpro-server/          # Node.js backend application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   │   ├── board/       # Board management
│   │   │   ├── tasks/       # Task management
│   │   │   └── user/        # User authentication
│   │   └── middlewares/     # Express middlewares
│   ├── config/
│   │   └── mongoose.js      # Database configuration
│   ├── index.js             # Server entry point
│   └── package.json
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagar-nautiyal/TaskPro-2.git
   cd TaskPro-2
   ```

2. **Setup Backend Server**
   ```bash
   cd taskpro-server
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your MongoDB URL and JWT secrets
   
   # Start the development server
   npm run dev
   ```

3. **Setup Frontend Client**
   ```bash
   cd ../taskpro-client/taskpro-client
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the `taskpro-server` directory:

```env
DATABASE_URL=mongodb://localhost:27017/taskpro
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
```

For production, use MongoDB Atlas:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/taskpro
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` files to version control
- Use strong, randomly generated secrets (64+ characters)
- Generate secure secrets using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- For production, use environment variables or secure secret management services

Create a `.env` file in the `taskpro-client/taskpro-client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

For production:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_SOCKET_URL=https://your-api-domain.com
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Board Endpoints (Authenticated)
- `GET /api/board` - Get user boards
- `POST /api/board` - Create new board
- `GET /api/board/:boardId` - Get board details
- `PUT /api/board/:boardId` - Update board
- `DELETE /api/board/:boardId` - Delete board
- `PUT /api/board/:boardId/move` - Move task between lists

### Task Endpoints (Authenticated)
- `GET /api/task` - Get all user tasks
- `POST /api/task` - Create new task
- `PUT /api/task/:taskId` - Update task
- `DELETE /api/task/:taskId` - Delete task

## 🔄 Real-Time Features

The application uses Socket.IO for real-time features:

- **Live Task Updates**: When a user moves a task, all connected users see the change instantly
- **Board Synchronization**: Multiple users can collaborate on the same board simultaneously
- **Connection Management**: Automatic reconnection handling for network interruptions

### Socket Events
- `joinBoard` - User joins a specific board room
- `taskMoved` - Broadcast task movement to all board members

## 🎯 Usage Guide

### Getting Started
1. **Register/Login**: Create an account or log in with existing credentials
2. **Create Board**: Click "New Board" to create your first project board
3. **Add Tasks**: Use the inbox form to add new tasks
4. **Organize Tasks**: Drag and drop tasks between columns (Inbox → To Do → Completed)
5. **Collaborate**: Invite team members to see real-time updates

### User Roles
- **Admin**: Can create boards and add all users as members automatically
- **User**: Can create personal boards and be added to other boards

## 🔧 Development

### Available Scripts

**Frontend (`taskpro-client`)**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend (`taskpro-server`)**
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Code Organization
- **Feature-based structure**: Each feature (users, boards, tasks) has its own controller, repository, routes, and schema
- **Separation of concerns**: Business logic separated from data access layer
- **Middleware pattern**: Authentication and error handling through Express middlewares

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Update API base URL in production

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using your platform's deployment method

### Environment Setup
- Update CORS settings for production domains
- Use production MongoDB cluster
- Set secure JWT secrets
- Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request

### Development Guidelines
- Follow existing code structure and naming conventions
- Add proper error handling for new features
- Test real-time functionality across multiple browser tabs
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

**Socket.IO Connection Issues**
- Ensure both frontend and backend are running
- Check CORS configuration in server
- Verify Socket.IO versions match between client and server

**Authentication Problems**
- Check JWT secret configuration
- Ensure Authorization header format: `Bearer <token>`
- Verify token expiration

**Database Connection**
- Confirm MongoDB is running (local) or accessible (Atlas)
- Check network connectivity and firewall settings
- Verify connection string format

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sagar Nautiyal**
- GitHub: [@sagar-nautiyal](https://github.com/sagar-nautiyal)

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- Socket.IO for real-time communication capabilities
- MongoDB for flexible data storage
- All contributors and testers

---

**Happy Task Managing! 🎉**