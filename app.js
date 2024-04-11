import express from'express'
import usuarioRoutes from'./routes/usuarioRoute.js'
import db from './config/db.js'

const app = express();

//habilitar lecturas de datos de form
app.use( express.urlencoded({extended: true}) );

//conexion a la db
try {
    await db.authenticate();
    db.sync();
    console.log("conexion correcta");
} catch (error) {   
       console.log(error); 
}

const PORT = 3000;

//habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//carpeta publica
app.use( express.static('public') );

//routing
app.use('/auth', usuarioRoutes);

app.listen(PORT, ()=>{
    console.log("escuchando en el puerto :", PORT);
})
