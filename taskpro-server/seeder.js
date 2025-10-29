import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Import models directly
import { User } from './src/features/user/user.schema.js';
import Board from './src/features/board/board.schema.js';
import Task from './src/features/tasks/task.schema.js';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    // Clear existing data
    await User.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});
    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12);
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@taskpro.com',
      password: hashedPassword
    });
    await demoUser.save();
    // Create sample board
    const sampleBoard = new Board({
      title: 'My Task Board',
      description: 'Welcome to TaskPro! This is your sample board.',
      userId: demoUser._id,
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
    });
    await sampleBoard.save();
    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Welcome to TaskPro!',
        description: 'This is your first task. You can edit or delete it.',
        priority: 'high',
        category: 'Getting Started',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'inbox',
        userId: demoUser._id,
        boardId: sampleBoard._id
      },
      {
        title: 'Explore the features',
        description: 'Try dragging tasks between columns, editing them, and creating new ones.',
        priority: 'medium',
        category: 'Tutorial',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'todo',
        userId: demoUser._id,
        boardId: sampleBoard._id
      },
      {
        title: 'Set up your workspace',
        description: 'Customize your board and create your own tasks.',
        priority: 'low',
        category: 'Setup',
        status: 'todo',
        userId: demoUser._id,
        boardId: sampleBoard._id
      },
      {
        title: 'Read the documentation',
        description: 'Learn more about TaskPro features and capabilities.',
        priority: 'low',
        category: 'Learning',
        status: 'completed',
        userId: demoUser._id,
        boardId: sampleBoard._id
      }
    ];

    const createdTasks = await Task.insertMany(sampleTasks);
    // Update board with task references
    const inboxTasks = createdTasks.filter(task => task.status === 'inbox');
    const todoTasks = createdTasks.filter(task => task.status === 'todo');
    const completedTasks = createdTasks.filter(task => task.status === 'completed');

    sampleBoard.lists[0].tasks = inboxTasks.map(task => task._id);
    sampleBoard.lists[1].tasks = todoTasks.map(task => task._id);
    sampleBoard.lists[2].tasks = completedTasks.map(task => task._id);
    
    await sampleBoard.save();
    // Generate demo token for easy access
    const token = jwt.sign(
      { userId: demoUser._id, email: demoUser.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();