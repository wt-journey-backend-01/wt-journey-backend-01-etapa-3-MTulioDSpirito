const { z } = require('zod');

const casoSchema = z.object({
    titulo: z.string().min(1, 'O título é obrigatório.'),
    descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres.'),
    status: z.enum(['aberto', 'solucionado']),
    agenteId: z.number().int().nonnegative('O ID do agente deve ser um número inteiro positivo.'),
});

module.exports = { casoSchema };