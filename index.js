import express from 'express';

const app = express();


app.get('/', (req, res) =>{
    res.send('Hello World Julius');
})

app.listen(4000, '0.0.0.0', (req, res) =>{
    console.log('listening on port 4000');
})