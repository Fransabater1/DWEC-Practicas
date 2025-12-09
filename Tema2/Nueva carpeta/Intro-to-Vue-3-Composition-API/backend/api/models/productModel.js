import connection from "../config/db.js";

export async function getVariants() {
    const [results] = await connection.query(
        'select id, color, image, quantity from product'
    )
    return results;
}

export async function getDetails() {
    const [results] = await connection.query(
        'select detail from product_details'
    )
    return results;
}