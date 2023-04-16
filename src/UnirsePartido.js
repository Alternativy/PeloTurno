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


const unirsePartido = (event) => {
    event.preventDefault();
    
    const id = event.target[0].value;	
    
        const user_id = uid(8);
        set(ref(database, `partido/${id}`), {
            usuarios: {
                [user_id]: {
                "user_id": user_id,
                "username": event.target[1].value,
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


function UnirsePartido(){
    return(
        <div className="UnirsePartido">

        <form className='formulario m-auto  text-center'>
        
        <label className='h4 text-start' htmlFor='id_partido'>Id partido:</label>
        <br/>
        <input type='text' id='id_partido' placeholder='Escribir aquí' name='id_partido' className='form-control-lg mb-3 '/>
        
        <label className='h4 text-start' htmlFor='new_name'>Nombre:</label>
        <br/>
        <input type='text' id='new_name' placeholder='Escribir aquí' name='new_name' className='form-control-lg mb-3 '/>

        <div className='mt-3 text-center'>
            <button type='submit' className='btn btn-secondary border border-3 border-dark btn-lg bold px-4'>Unirse a un Partido</button>
        </div>

        </form>


        </div>
    )
}


export default UnirsePartido;