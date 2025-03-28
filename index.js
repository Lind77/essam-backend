import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import { connectDB } from './db.js';
import dotenv from "dotenv"
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import areaRoutes from './src/routes/areas.routes.js';
import permissionRoutes from './src/routes/permissions.routes.js';
import rolesRoutes from './src/routes/roles.routes.js'
import businnesRoutes from './src/routes/businnes.routes.js'
import headquartersRoutes from './src/routes/headquarters.routes.js'
import mineRoutes from './src/routes/mines.routes.js'
import unitRoutes from './src/routes/unit.routes.js'
import cafeRoutes from './src/routes/cafes.routes.js'
import businnesClientRoutes from './src/routes/businnesClient.routes.js'
import dinerRoutes from './src/routes/diner.routes.js'
import uploadRoutes from './src/routes/upload.routes.js'
import serviceRoutes from './src/routes/service.routes.js'
import saleRoutes from './src/routes/sales.routes.js'
import businnesContractRoutes from './src/routes/businnesContract.routes.js'

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

dotenv.config()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

connectDB();

app.get('/', (req, res) =>{
    res.send('Backend isAlive');
})


app.use('/api', authRoutes)

app.use('/api', userRoutes)

app.use('/api', areaRoutes)

app.use('/api', permissionRoutes)

app.use('/api', rolesRoutes)

app.use('/api', businnesRoutes)

app.use('/api',headquartersRoutes)

app.use('/api',mineRoutes)

app.use('/api',unitRoutes)

app.use('/api',cafeRoutes)

app.use('/api',businnesClientRoutes)

app.use('/api',dinerRoutes)

app.use('/api', uploadRoutes)

app.use('/api', serviceRoutes)

app.use('/api', saleRoutes)

app.use('/api',businnesContractRoutes)



app.listen(4000, '0.0.0.0', (req, res) =>{
    console.log('listening on port 4000');
})