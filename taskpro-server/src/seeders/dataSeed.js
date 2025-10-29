import bcrypt from 'bcrypt';
import { User } from '../features/user/user.schema.js';
import Board from '../features/board/board.schema.js';
import Task from '../features/tasks/task.schema.js';

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return;
    }

    // 1. Create Sample Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
      }
    ]);
    // 2. Create Sample Boards first (since tasks need boardId)
    const boards = await Board.insertMany([
      {
        title: 'Product Development',
        owner: users[0]._id,
        lists: [
          {
            title: 'inbox',
            tasks: []
          },
          {
            title: 'todo',
            tasks: []
          },
          {
            title: 'completed',
            tasks: []
          }
        ]
      },
      {
        title: 'Marketing Campaign',
        owner: users[0]._id,
        lists: [
          {
            title: 'inbox',
            tasks: []
          },
          {
            title: 'todo',
            tasks: []
          },
          {
            title: 'completed',
            tasks: []
          }
        ]
      },
      {
        title: 'Personal Projects',
        owner: users[0]._id,
        lists: [
          {
            title: 'inbox',
            tasks: []
          },
          {
            title: 'todo',
            tasks: []
          },
          {
            title: 'completed',
            tasks: []
          }
        ]
      }
    ]);
    // 3. Create Sample Tasks with correct field names
    const tasks = await Task.insertMany([
      // Inbox Tasks
      {
        title: 'Welcome to TaskPro!',
        description: 'This is your first task. You can drag and drop tasks between columns to update their status.',
        userId: users[0]._id,
        status: 'inbox',
        boardId: boards[0]._id,
      },
      {
        title: 'Explore the Dashboard',
        description: 'Check out the modern dashboard with statistics and task overview.',
        userId: users[0]._id,
        status: 'inbox',
        boardId: boards[0]._id,
      },
      {
        title: 'Try Theme Toggle',
        description: 'Click the theme toggle button in the navbar to switch between light and dark modes.',
        userId: users[0]._id,
        status: 'todo',
        boardId: boards[0]._id,
      },
      {
        title: 'Create Your First Project',
        description: 'Set up a new board for your upcoming project and organize your workflow.',
        userId: users[0]._id,
        status: 'todo',
        boardId: boards[1]._id,
      },
      {
        title: 'Setup Complete',
        description: 'TaskPro is now ready to use with modern design and cloud database!',
        userId: users[0]._id,
        status: 'completed',
        boardId: boards[0]._id,
      }
    ]);
  } catch (error) {
    throw error;
  }
};

// Utility function to clear all data (useful for development)
export const clearDatabase = async () => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Task.deleteMany({}),
      Board.deleteMany({})
    ]);
  } catch (error) {
    throw error;
  }
};

// Function to reset and reseed database
export const resetAndSeed = async () => {
  await clearDatabase();
  await seedDatabase();
};