import mongoose from 'mongoose';
import { validateCharacter } from './validate';

const characterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    unique: true,
    validate: [{ validator: validateCharacter, msg: 'Invalid name' }],
  },
  class: {
      type: String      
  },
  pos : {
      type: Map,
      of: Number
  },
  move : {
      type: Map,
      of: Boolean
  },
  dir: {
      type: String
  },
  speed: {
      type: Number
  }
}, { timestamps: true });
const Character = mongoose.model('Character', characterSchema);
export default Character;