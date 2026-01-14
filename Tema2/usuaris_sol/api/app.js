import 'dotenv/config'; // Carga el .env lo primero
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/productRouter.js'; // Traemos las rutas

const app = express();
// Cogemos el puerto del .env o usamos el 3000
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Usamos el archivo de rutas
app.use(router);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});