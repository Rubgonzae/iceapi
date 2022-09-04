var Express = require("express");
var bodyParser = require("body-parser");
const { response, request } = require("express");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var MongoClient = require("mongodb").MongoClient;
var CONECTION_STRING = "mongodb+srv://iceadmin:OKvbWLqh4ooXsIDO@cluster0.0nqjfr9.mongodb.net/?retryWrites=true&w=majority"

var fileUpdload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpdload());
app.use('/Photos', Express.static(__dirname+'/Photos'));

var cors = require('cors')
app.use(cors())

var DATABASE = "icedb";
var database;

app.listen(49146, ()=>{});

    MongoClient.connect(CONECTION_STRING, {useNewUrlParser:true}, (error, client) =>{
        database=client.db(DATABASE);
        console.log("mongo db collection Succesfull")
    } )

app.get('/', (request, response)=>{
    response.json('Hello World ')
})

app.get('/iceapi/usuarios',(request, response) => {

    database.collection("Usuarios").find({}).toArray((error, result) => {
        if(error){
            console.log(error);
        }

        response.json(result);
    })
});

app.get('/iceapi/usuarios/:id',(request, response) => {

    database.collection("Usuarios").find({identificacion:request.params.id}).toArray((error, result) => {
        if(error){
            console.log(error);
        }

        response.json(result);
    })
});

app.post('/iceapi/usuarios', (request, response) => {
    database.collection("Usuarios").count({}, function(error, numOfDocs){
        if(error){
            console.log(error);
        }

        database.collection("Usuarios").insertOne({

            identificacion : request.body['identificacion'],
            tipoId : request.body['tipoId'],
            Nombres : request.body['Nombres'],
            apellidos : request.body['apellidos'],
            correo : request.body['correo'],
            usuario : request.body['usuario'],
            contraseña : request.body['contraseña']
        });

        response.json("Added Succesfully");
    })
});

app.put('/iceapi/usuarios', (request, response) => {
    database.collection("Usuarios").updateOne(
        //Filter Critaria
        {
            identificacion : request.body['identificacion']
        },
        //Update
        {$set:
            {
                "Nombres" :  request.body['Nombres'] 
            }

        }
    );

        response.json("Updated Succesfully");
    
})

app.delete('/iceapi/usuarios/:id', (request, response) => {
    database.collection("Usuarios").deleteOne({
       identificacion : parseInt(request.params.id)

    });

        response.json("Deleted Succesfully");
    
})

app.post('/iceapi/productos/savefile', (request, response) => {
    fs.writeFile("./Photos/"+request.files.file.name, 
    request.files.file.data, function(error){
        if(error){
            console.log(error);
        }

        response.json(request.files.file.name);
    })
})

app.post('/iceapi/productos', (request, response) => {
    database.collection("Productos").count({}, function(error, numOfDocs){
        if(error){
            console.log(error);
        }

        database.collection("Productos").insertOne({

            nombre : request.body['nombre'],
            descripcion : request.body['descripcion'],
            valor : request.body['valor'],
            apellidos : request.body['apellidos'],
            correo : request.body['correo'],
            usuario : request.body['usuario'],
            contraseña : request.body['contraseña']
        });

        response.json("Added Succesfully");
    })
});