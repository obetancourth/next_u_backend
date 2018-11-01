let http        = require('http'),
    express     = require('express'),
    path        = require('path'),
    bodyParser  = require('body-parser');

let app         = express(),
    Server      = http.createServer(app),
    port        = process.env.port || 3000
    bienes      = require('../src/bienes');


console.log(__dirname);
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'));
app.use('/bienes', bienes);
app.all('*', (req, res)=>{
  res.status(400).send({"message":"Recurso No encontrado"});
});


Server.listen(port, ()=>{
  console.log(`Server Started on port ${port}`);
});
