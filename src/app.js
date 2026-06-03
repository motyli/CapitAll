import express from 'express';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transaction.routes.js';

// טעינת משתני סביבה (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// גלובל מידלוורס
app.use(express.json());

// הגדרת הראוטים הראשיים של האפליקציה (Base Services Layout)
app.use('/api/v1/transactions', transactionRoutes);

// טיפול בראוטים לא קיימים (404 Global Handler)
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`[CapitAll Backend Engine] Core running smoothly on port ${PORT}`);
});

export default app;
