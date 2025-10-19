import { User } from "./user.schema.js";

export default class UserRepository {
  async add(data) {
    const newUser = new User(data);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
}
