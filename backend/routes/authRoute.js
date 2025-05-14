import express from 'express';
import { register, login, logout, profile, verifyToken, updateProfile, deleteProfile } from '../controllers/authController.js';
import { authRequired, authAdminRequired } from '../middlewares/validateToken.js';



const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authAdminRequired, profile);
router.get('/verify', verifyToken)
router.put('/update/:id',updateProfile);
router.delete('/delete/:id', deleteProfile);
export default router;