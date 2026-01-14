// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// import { getUser, getUserName, insertUser } from '../models/userModel.js';

// const secretKey = process.env.JWT_SECRET;


// export async function getUsuarios(req, res) {
//     try {
//         const results = await getUser();
//         res.status(200).json(results);
//     } catch (err) {
//         console.error(err.stack);
//         res.status(500).send(`Error al servidor:\n ${err}`);
//     }
// }


// export async function login(req, res) {
//     try {
//         const {name, password} = req.body;
//         if (!name || !password) {
//             return res.status(400).json({ message: "Usuario y contraseña requeridos" });
//         }
        
//         // Usamos la función del modelo
//         const login = await getUserName(name);
        
//         // Si no existe el usuario
//         if (login.length === 0) {
//              return res.status(401).json({ message: "Autenticación fallida" });
//         }

//         const role = login[0].role;
//         const passwordMatched = await bcrypt.compare(password, login[0].password);

//         if(passwordMatched){
//             const token = jwt.sign({ name, role }, secretKey, { expiresIn: "1h" });
//             res.cookie('cookie', token, {
//                 httpOnly: true,
//                 maxAge: 360000
//             });
//             return res.status(200).json({ message: "Autenticacion correcta" });
//         } else {
//             return res.status(500).json({message: "La ontraseña no coincide"});
//         }

//     } catch(err){
//         console.error(err.stack);
//         res.status(500).send(`Error: ${err}`);
//     }
// }


// export async function registrar(req, res) {
//     try {
//         // Recogemos los datos. Si no envían rol, asignamos 'user' por defecto.
//         let { name, password, role = 'user' } = req.body;

      
//         // Si intentas crear un admin y no eres admin, error
//         if (role === 'admin' && req.role !== 'admin') {
//             return res.status(403).json({ message: "Solo un administrador puede crear a otro administrador" });
//         }
        
//         // Si pasa el filtro, creamos el usuario
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(password, salt);
        
//         const results = await insertUser(name, hashedPassword, role);
        
//         res.status(200).json(results);

//     } catch (err) {
//         console.error(err.stack);
//         res.status(500).send(`Error: ${err}`);
//     }
// }