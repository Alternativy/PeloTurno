import React from "react";

import firebaseConfig from './firebaseConfig';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
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
        lugar: "",
        fecha: "",
        hora: "",
        cantidadJugadores: "",
        precio: "",
        equipo1: "",
        equipo2: "",
        alquilado: false,
        usuarios: [{"user_id": user_id, "username": event.target[0].value, "color": "red", "is_admin": true, "positionX": 0, "positionY": 0}],
    });
};


function CrearPartido() {
    return (
        <div className="CrearPartido">

        <form className='formulario m-auto' onSubmit={writeToDatabase}>
        
        <label className='h4 text-start' htmlFor='lugar'>Tu nombre:</label>
        <br/>
        <input type='text' id='lugar' placeholder='Escribir aquí' name='lugar' className='form-control-lg mb-3'/>

        <div className='mt-3 text-center'>
            <button type='submit' className='btn btn-primary border border-3 border-dark btn-lg bold px-5'> Crear un Partido</button>
        </div>

        </form>

        </div>
    );
}

export default CrearPartido