import React from "react";
import firebaseConfig from '../../store/Firebase/firebaseConfig';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const url_local = "http://localhost:3000/";
const url_prod =  'https://peloturno-e8bc6.web.app/';

const writeToDatabase = (event) => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    const id = uid(8);
    const user_id = uid(8);
    set(ref(database, `partido/${id}`), {
        id : id,
        url: url_local + id,
        lugar: "mi lugar",
        fecha: "2023-04-28",
        hora: "18:00",
        precio: 1500,
        alquilado: true,
        usuarios: {
            [user_id]: {
              "user_id": user_id,
              "username": event.target[0].value,
              "color": "#FF0000",
              "is_admin": true,
              "order": timestamp,
              "equipo": 0,
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
        console.error('Error al escribir los datos: ', error.message);
    });
};


function CrearPartido() {
    return (
        <div className="CrearPartido">

        <form className='formulario m-auto text-center' onSubmit={writeToDatabase}>
        
            <label className='h4 text-light' htmlFor='username'>Tu nombre:</label>
            <br/>
            <input className='form-control-lg mb-3' type='text' id='username' placeholder='Escribir aquí' name='username' required/>

            <div className='mt-3 pb-3 text-center'>
                <button type='submit' className='btn btn-warning border border-3 border-dark btn-lg bold px-4'> Crear un Partido</button>
            </div>

        </form>

        </div>
    );
}

export default CrearPartido