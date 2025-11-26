import express from 'express'
import bcrypt from 'bcrypt'
import connection from './db.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
const secretKey = "paella"


const app = express();
const port = 3000;

const endopoint = '/api/users'

app.use(express.json())
app.use(cookieParser())

const requireAdmin = async (req, res, next) => {
    try {
        if (req.role === 'admin') {
            next()
        } else {
            res.status(403).send('No tens permisso')
        }
     }catch (err) {
        errorHandler(err)
    }
}


function verifyToken(req, res, next) {
    const token = req.cookies.cookie;
    if (!token) {
    return res.status(401).json({ message: "Token not provied" });
    }
    try {
    const payload = jwt.verify(token, secretKey);
    req.role = payload.role;
    req.name = payload.name;

    next();
    } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
}
}

app.get(endopoint, verifyToken, requireAdmin ,async (req, res) => {
    try {
        const [results] = await connection.query(
            'SELECT name, role FROM users'
        )
        res.status(200).json(results)
    } catch (err) {
        errorHandler(err)
    }
});

app.post("/login", async (req, res) => {
  try {
        const {name, password} = req.body
        if (!name || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const [login] = await connection.query(
            "select role, password from users where name = ?",[name]
        )
        const role = login[0].role
        const passwordMatched = await bcrypt.compare(password, login[0].password);
        if (login.length === 1){
            if(passwordMatched){
                const token = jwt.sign({ name, role }, secretKey, { expiresIn: "1h" });
                res.cookie('cookie', token, {
                    httpOnly: true,
                    maxAge: 360000
                })
                return res.status(200).json({ message: "Autenticacion correcta" });
            }else{
                return res.status(500),json({message: "La ontraseña no coincide"})
            }
        }else{
            return res.status(401).json({ message: "Authentication failed" });
        }

    }catch(err){
        errorHandler(err)
    }
})

app.post(endopoint,  async(req, res) => {
    try {
        let { name, password, role = 'user' } = req.body
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const [results] = await connection.query(
            'INSERT INTO users(name, password, role) VALUES(?, ?, ?)',
            [name, hashedPassword, role]
        );
        res.status(200).json(results)
    } catch (err) {
        errorHandler(err)
    }
});



const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(`Error al servidor:\n ${err}`)
};



app.listen(port, () => {
    console.log(`http://localhost:${port}${endopoint}`)
});
