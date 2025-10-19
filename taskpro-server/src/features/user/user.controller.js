import dotenv from "dotenv";
dotenv.config();

import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(req, res) {
    try {
      console.log("Registration request received:", req.body);
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      // For development without MongoDB, create a mock user response
      if (!mongoose.connection.readyState) {
        console.log(
          "No database connection - returning mock success for development"
        );
        const mockUser = {
          _id: "dev-user-" + Date.now(),
          name,
          email,
          role: role || "user",
          createdAt: new Date(),
        };
        console.log("Mock user created:", mockUser._id);
        return res.status(201).json({
          message: "User created successfully (development mode)",
          newUser: mockUser,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await this.userRepository.add({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });
      console.log("User created successfully:", newUser._id);
      res.status(201).json({ message: "user Created successfully", newUser });
    } catch (err) {
      console.error("Registration error:", err.message);
      res
        .status(500)
        .json({ message: "Failed to register user", error: err.message });
    }
  }

  async signIn(req, res) {
    try {
      console.log("Login request received:", req.body);
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      if (!process.env.JWT_ACCESS_SECRET) {
        console.error("JWT_ACCESS_SECRET not configured");
        return res.status(500).json({ message: "Server configuration error" });
      }

      // For development without MongoDB, create a mock login
      // if (!mongoose.connection.readyState) {
      //   console.log("No database connection - returning mock login for development");
      //   const token = jwt.sign(
      //     { userId: "dev-user-123" },
      //     process.env.JWT_ACCESS_SECRET,
      //     { expiresIn: "1h" }
      //   );
      //   console.log("Mock login successful for:", email);
      //   return res.status(200).json({
      //     message: "Welcome to taskPro (development mode)",
      //     token
      //   });
      // }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User Not found, please signUp first" });
      }

      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return res.status(403).json({ message: "Incorrect Password" });
      }
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );

      console.log("Login successful for user:", user.email);
      return res.status(200).json({ message: "Welcome to taskPro", token });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ message: "Failed to login", error: err.message });
    }
  }
}
