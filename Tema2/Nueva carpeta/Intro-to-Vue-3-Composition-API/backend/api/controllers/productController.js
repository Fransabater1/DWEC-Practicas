import { getDetails, getVariants } from "../models/productModel.js";

export async function listarProducto(req, res) {
    try{
        const variants = await getVariants();
        const detailsData = await getDetails();

        const details = detailsData.map((row) => row.detail);
        res.status(200).json({
            variants: variants,
            details: details
        });

    }catch(err){
       console.error(err);
       res.status(500).json({ message: "Error al obtener datos", error: err });
    }
}
