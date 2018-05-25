import mongoose from 'mongoose';
import * as UserValidator from './validate';
import { Character } from '../character';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true,
    validate: [{ validator: UserValidator.validateUsername, msg: 'Invalid username' }],
  },
  password: {
      type: String,
      validate: [{ validator: UserValidator.validatePassword, msg: 'Invalid password' }],
  },
  characters : {
      type: [Character]
  }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;