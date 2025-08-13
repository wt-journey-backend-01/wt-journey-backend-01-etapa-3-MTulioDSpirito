const { z } = require('zod');

const agenteSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.').max(50, 'Nome deve ter no máximo 50 caracteres.'),
    dataDeIncorporacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use YYYY-MM-DD.'),
    cargo: z.string().min(1, 'O cargo é obrigatório.'),
});

module.exports = { agenteSchema };