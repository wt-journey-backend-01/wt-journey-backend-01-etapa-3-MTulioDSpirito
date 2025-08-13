class AppError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        // O Zod lança um erro com a propriedade `issues`, então precisamos adaptar
        // para garantir que a mensagem de erro seja formatada corretamente.
        if (errors.length === 0 && message.includes('Validation error')) {
            try {
                const zodIssues = JSON.parse(message.split('at JSON.parse (<anonymous>)')[0].trim());
                this.errors = zodIssues.map(issue => issue.message);
            } catch (e) {
                this.errors = [message];
            }
        } else {
            this.errors = errors.map((err) => err.msg || err);
        }
    }
}

const errorHandler = (err, req, res, next) => {
    // Tratamento específico para erros de validação do Zod
    if (err.name === 'ZodError') {
        const issues = err.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
        return res.status(400).json({
            status: 400,
            message: 'Erro de validação nos dados fornecidos.',
            errors: issues,
        });
    }

    // Tratamento para AppError e outros erros
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';
    const errors = err.errors || [];

    res.status(statusCode).json({
        status: statusCode,
        message,
        errors,
    });
};

module.exports = {
    errorHandler,
    AppError,
};