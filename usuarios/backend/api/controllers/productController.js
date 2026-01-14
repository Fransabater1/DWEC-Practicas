import { getProduct, postProduct, putProduct, deleteProduct } from "../models/productModel.js";


export async function getProductos(req, res, next) {
    try{
        const result = await getProduct();
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

export async function insertProductos(req, res, next) {
    try{
        const {nom, quantitat, preu, descripcio} = req.body;

        if (!nom || !descripcio){
            return res.status(400).json({ message: 'Faltan campos de nombre o la descripcion está vacía' });
        }

        const precioFloat = parseFloat(preu);
        const stockInt = parseInt(quantitat)

        if (isNaN(precioFloat) || precioFloat < 0) {
            return res.status(400).json({ message: 'El precio debe ser un número positivo' });
        }

        if (isNaN(stockInt) || stockInt < 0) {
            return res.status(400).json({ message: 'El stock debe ser un número positivo' });
        }
        const result = await postProduct(nom, quantitat, preu, descripcio);
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

export async function updateProductos(req, res, next) {
    try{
        const {nom, quantitat, preu, descripcio} = req.body;

        const {id} = req.params;

        if (!nom || !descripcio){
            return res.status(400).json({ message: 'Faltan campos de nombre o la descripcion está vacía' });
        }

        const precioFloat = parseFloat(preu);
        const stockInt = parseInt(quantitat)

        if (isNaN(precioFloat) || precioFloat < 0) {
            return res.status(400).json({ message: 'El precio debe ser un número positivo' });
        }

        if (isNaN(stockInt) || stockInt < 0) {
            return res.status(400).json({ message: 'El stock debe ser un número positivo' });
        }

        const result = await putProduct(nom, quantitat, preu, descripcio, id);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

export async function deleteProducto(req, res, next) {
    try{
        const {id} = req.params;
        const result = await deleteProduct(id);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    }catch(error){
        next(error);
    }
}
