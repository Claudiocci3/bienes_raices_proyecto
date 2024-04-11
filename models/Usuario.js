import {DataTypes} from 'sequelize'
import db from '../config/db.js'
import bcrypt from 'bcrypt'
const usuario = db.define('usuarios',{
    //aca definimos la estructura que va a tener la tabla, con sus estructuras y tipos de datos
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function (usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
        }
    }
})

export default usuario;