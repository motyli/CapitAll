import { z } from 'zod';

const createTransactionSchema = z.object({
  department_id: z.string().uuid({ message: "Invalid department UUID" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  type: z.enum(['expense', 'refund', 'budget_increase', 'budget_decrease'], {
    message: "Invalid transaction type"
  }),
  description: z.string().optional(),
});

export const createTransaction = async (req, res) => {
  try {
    // 1. ולידציית קלט
    const validatedData = createTransactionSchema.parse(req.body);
    const supabase = req.supabase; // נלקח מה-Middleware

    // 2. שליפת ה-company_id המאובטח מה-RPC ב-DB
    const { data: companyId, error: companyError } = await supabase.rpc('get_auth_company_id');

    if (companyError || !companyId) {
      return res.status(403).json({ 
        error: 'Forbidden: User is not associated with an active company.',
        details: companyError?.message 
      });
    }

    // 3. ביצוע ה-Insert (הטריגר ב-DB יטפל באטומיות של ה-spent/budget)
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert([
        {
          ...validatedData,
          company_id: companyId
        }
      ])
      .select()
      .single();

    // 4. טיפול בשגיאות DB קצה (כגון חריגת תקציב או כשל RLS)
    if (insertError) {
      if (insertError.code === '23503' && insertError.message.includes('Security Integrity Violation')) {
        return res.status(400).json({ error: insertError.message });
      }
      return res.status(400).json({ 
        error: 'Transaction rejection: Policy constraints or budget overflow.', 
        details: insertError.message 
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction processed successfully.',
      data: transaction
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', issues: error.errors });
    }
    console.error('Critical Controller Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
