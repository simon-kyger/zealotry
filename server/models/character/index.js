import mongoose from 'mongoose';
import { validateCharacter } from './validate';


let Character;
try {
    // Check to see if the schema has already been instantiated
    Character = mongoose.model('Character');
} catch (error) {
    const characterSchema = new mongoose.Schema({
        name: { 
            type: String, 
            unique: true,
            validate: [{ validator: validateCharacter, msg: 'Invalid name' }],
        },
        class: {
            type: String      
        },
        move : {
            type: Map,
            of: Boolean
        },
        x : {
            type: Number
        },
        y : {
            type: Number
        },
        velocity: {
            type: Object
        },
        currenthp: {
            type: Number
        },
        maxhp: {
            type: Number
        },
        currentend: {
            type: Number
        },
        maxend: {
            type: Number
        },
        currentmana: {
            type: Number
        },
        maxmana: {
            type: Number
        },
        speed: {
            type: Number
        },
        abilities: {
            type: Array,
            of: String
        },
        currentqueue: String,
        user_id : {
            type: mongoose.Schema.ObjectId
        }
    }, { timestamps: true });
    Character = mongoose.model('Character', characterSchema);
}
export default Character;