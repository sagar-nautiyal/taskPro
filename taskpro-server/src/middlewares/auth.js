import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // const token = req.headers["authorization"];
  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  // console.log("token", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.userId;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  next();
};
