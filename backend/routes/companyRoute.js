import { createCompany, deleteCompany, getUserCompanies, getCompany } from "../controllers/companyController.js";
import express from 'express';

const router = express.Router();


// Create a company
router.post('/:userId', createCompany);
router.delete('/:id', deleteCompany);
router.get('/user/:userId', getUserCompanies);
router.get('/:id', getCompany);

export default router;