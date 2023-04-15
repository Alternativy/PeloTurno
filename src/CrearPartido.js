import React from "react";
import firebaseConfig from './firebaseConfig';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import "firebase/auth";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const writeToDatabase = (event) => {
    event.preventDefault();
    
    const id = uid(8);
    const user_id = uid(8);
    set(ref(database, `partido/${id}`), {
        id : id,
        url: "http://localhost:3000/" + id,
        lugar: "mi lugar",
        fecha: "una fecha",
        hora: "una hora",
        cantidadJugadores: "",
        precio: "1500",
        equipo1: "",
        equipo2: "",
        alquilado: false,
        usuarios: {
            [user_id]: {
              "user_id": user_id,
              "username": event.target[0].value,
              "color": "red",
              "is_admin": true,
              "positionX": 0,
              "positionY": 0
            }
          }
    }).then(() => {
        console.log('Los datos se han escrito correctamente');
        const partidoRef = ref(database, `partido/${id}`);
        get(partidoRef).then((snapshot) => {
            const partido = snapshot.val();
            console.log('Partido creado correctamente: ', partido);
            // crear cookie con id del  partido y usuario
            Cookies.set(id, user_id, { expires: 60 });
            // redirigir al PartidoComponent
            window.location.replace(partido.url);
        }).catch((error) => {
            console.error('Error al obtener los datos del partido: ', error);
        });
    }).catch((error) => {
        console.error('Error al escribir los datos: ', error);
    });
};


function CrearPartido() {
    return (
        <div className="CrearPartido">

        <form className='formulario m-auto text-center' onSubmit={writeToDatabase}>
        
        <label className='h4 text-start' htmlFor='username'>Tu nombre:</label>
        <br/>
        <input type='text' id='username' placeholder='Escribir aquí' name='username' className='form-control-lg mb-3'/>

        <div className='mt-3 text-center'>
            <button type='submit' className='btn btn-warning border border-3 border-dark btn-lg bold px-4'> Crear un Partido</button>
        </div>

        </form>

        </div>
    );
}

export default CrearPartido