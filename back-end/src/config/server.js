const express = require('express');
const commandRoutes = require('../routes/comandoRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', commandRoutes);

// Iniciar o servidor apenas se não for importado em outro arquivo (exemplo: testes)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Exporta o app para testes
