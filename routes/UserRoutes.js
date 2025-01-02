import express from 'express';
import {updateUserDetails, userLogin, userSignUp} from '../controllers/UserController.js';


const router = express.Router();
router.post('/signup', userSignUp);
router.post('/login',userLogin);
router.put('/:id/update',updateUserDetails)

export default router;