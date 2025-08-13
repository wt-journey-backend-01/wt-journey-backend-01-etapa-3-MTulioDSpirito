const express = require('express');
const cors = require('cors'); // Adicionando cors de volta, pois é comum para APIs
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Usando cors para permitir requisições de outras origens

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor da Delegacia rodando em http://localhost:${PORT}`);
});