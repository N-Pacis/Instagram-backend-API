const express= require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')
const bodyParser = require("body-parser")

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',  'Content-Type');
     next();
  })
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    limit: '50mb', 
    extended: true
}));

app.use(require("./routes/registerUserRoute"))  
app.use(require("./routes/loginUserRoute"))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
if(!config.get("DATABASE")){
    console.error("Fatal Error:Undefined connection to the database")
    process.exit(-1)
}
if(!config.get("PORT")){
    console.error("Fatal Error:Undefined application port")
    process.exit(-1)
}
mongoose.connect(config.get("DATABASE"),{useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=>{console.log("Connected to database successfully...")})
  .catch(err=>{console.log("Could not connect to the database due to ",err)})

const port = config.get("PORT")
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})