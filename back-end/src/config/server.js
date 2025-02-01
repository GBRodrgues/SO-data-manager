import express from 'express';
import cors from 'cors'; 
import commandRoutes from '../routes/comandoRoutes.js';



const app = express();
const port = 5174;

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS'],  
    allowedHeaders: ['Content-Type'],  
  };

app.use(cors(corsOptions));

// Middleware para permitir leitura do corpo da requisição como JSON
app.use(express.json());

// Configuração da rota base
app.use('/api', commandRoutes);  // Defina o prefixo "/api" para as rotas

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



export default app;