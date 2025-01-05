import express from 'express';
import { addNewTable, getAllTables } from '../controllers/TableController.js';

const router = express.Router();
router.post("/add",addNewTable);
router.get("/all",getAllTables);

export default router;  