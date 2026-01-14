import { getProduct, postProduct, putProduct, deleteProduct} from "../models/productModel.js"
import { getUserCorreu } from "../models/productModel.js";
const secretKey = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";


export async function getProductes(req, res) {
  try {
    const results = await getProduct();
    res.status(200).json(results);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send(`Error al servidor:\n ${err}`);
  }
}

export async function postProductes(req, res) {
  try {
    const {nom, quantitat, preu, descripcio} = req.body
    const create_at = new Date();
    const results = await postProduct(nom, quantitat, preu, descripcio, create_at);
    
    res.status(200).json(results);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send(`Error al servidor:\n ${err}`);
  }
}

export async function putProductes(req, res) {
  try {
    const id = req.params.id
    const { nom, quantitat, preu, descripcio } = req.body;
    const results = await putProduct(nom, quantitat, preu, descripcio, id);
    res.status(200).json(results);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send(`Error al servidor:\n ${err}`);
  }
}

export async function deleteProductes(req, res) {
  try {
    const id = req.params.id;
    const results = await deleteProduct(id);
    res.status(200).json(results);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send(`Error al servidor:\n ${err}`);
  }
}


export async function login(req, res) {
    try {
        const {correu, contrasenya} = req.body;
        if (!correu || !contrasenya) {
            return res.status(400).json({ message: "Usuario y contraseña requeridos" });
        }
        
        // Usamos la función del modelo
        const login = await getUserCorreu(correu);
        
        // Si no existe el usuario
        if (login.length === 0) {
             return res.status(401).json({ message: "Autenticación fallida" });
        }
        const token = jwt.sign({ correu, contrasenya}, secretKey, { expiresIn: "1h" });
        res.cookie('cookie', token, {
            httpOnly: true,
            maxAge: 360000
        });
        return res.status(200).json({ message: "Autenticacion correcta" });
        

    } catch(err){
        console.error(err.stack);
        res.status(500).send(`Error: ${err}`);
    }
}