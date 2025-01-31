import express from 'express';
import commandRoutes from '../routes/comandoRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', commandRoutes);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


export default app;