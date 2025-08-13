require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger.js');

const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const { AppError } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

// Middleware de tratamento de erros
app.use(AppError);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
