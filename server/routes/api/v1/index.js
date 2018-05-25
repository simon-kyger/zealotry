import express from 'express';
import userRoute from './user';


let router = express.Router();

router.use('/user', userRoute);

export default router;