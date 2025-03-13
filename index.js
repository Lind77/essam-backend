import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors({
    origin: 'http://essam.fun:3000',
    credentials: true
}))

app.get('/', (req, res) =>{
    res.send('Hello World Lind');
})

app.post('/login', (req, res) =>{
   const {email, password} = req.body;
   console.log('Datos recibidos:', { email, password });
   if (email === 'usuario@example.com' && password === 'contraseña') {
     // Si las credenciales son válidas, enviar una respuesta exitosa
     res.status(200).json({ message: 'Login exitoso' });
   } else {
     // Si las credenciales son inválidas, enviar un error
     res.status(401).json({ message: 'Credenciales incorrectas' });
   }
})

app.listen(4000, '0.0.0.0', (req, res) =>{
    console.log('listening on port 4000');
})