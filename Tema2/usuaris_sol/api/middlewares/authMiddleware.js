import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
    const token = req.cookies.cookie;
    if (!token) {
        return res.status(401).json({ message: "Token not provied" });
    }
    try {
        const payload = jwt.verify(token, secretKey);
        req.correu = payload.correu;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token not valid" });
    }
}

export async function requireAdmin(req, res, next) {
    try {
        if (req.role === 'admin') {
            next();
        } else {
            res.status(403).send('No tienes permisos');
        }
    } catch (err) {
        res.status(500).send(`Error: ${err}`);
    }
}