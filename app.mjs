
import express from 'express';
import 'dotenv/config';
const app = express()
const port = process.env.PORT || 3000;
import router from './routes/grades.mjs';

app.use(express.json())

app.use('/grades', router);

app.get('/home', (req, res) =>{
  res.send('Welcome to our web page');
})






app.get((error, req, res, next) =>{
  res.status(500).send("Seems like we messed up somewhere...");
})

app.listen(port, ()=>{
  console.log('you are listening to port:' , port);
})