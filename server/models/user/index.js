import mongoose from 'mongoose';
import * as UserValidator from './validate';
import { Character } from '../character';

let User;
try {
  // Check to see if the schema has already been instantiated
  User = mongoose.model('User');
} catch (error) {
  const userSchema = new mongoose.Schema({
    username: { 
      type: String, 
      unique: true,
      validate: [{ validator: UserValidator.validateUsername, msg: 'Invalid username' }]
    },
    password: {
        type: String,
        validate: [{ validator: UserValidator.validatePassword, msg: 'Invalid password' }]
    },
    realm : {
        type : String,
        validate: [{ validator: UserValidator.validateRealm, msg: 'Invalid Realm' }]
    },
    characters : {
        type: [mongoose.Schema.ObjectId]
    }
  }, { timestamps: true });
  User = mongoose.model('User', userSchema);
}

export default User;