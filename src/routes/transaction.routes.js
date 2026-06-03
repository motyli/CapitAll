import { Router } from 'express';
import { createTransaction } from '../controllers/transaction.controller.js';
import { withSupabaseAuth } from '../middleware/supabase.middleware.js';

const router = Router();

// כל הראוטים בקובץ זה דורשים אימות מול Supabase RLS
router.use(withSupabaseAuth);

// POST /api/v1/transactions
router.post('/', createTransaction);

export default router;
