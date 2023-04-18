import React from "react";
import firebaseConfig from './firebaseConfig';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


///// CAMBIOS /////
// En este componente UnirsePArtido, solo se le pide el id del partido y se verifica si este id existe, si es asi se lo envia al PartidoComp  

const unirsePartido = (event) => {
    event.preventDefault();
    const id = event.target[0].value;	

        // verificar si existe el partidocn esa ID
        get(ref(database, `partido/${id}`)).then((snapshot) => {
            const partido = snapshot.val();
            if (snapshot.exists()) {
                window.location.replace(partido.url);
            }
            else {
                console.log('No existe el partido, ID incorrecta');
            }
        }).catch((error) => {
            console.log('Error al obtener los datos del partido: ', error);
        });
};


function UnirsePartido(){
    return(
        <div className="UnirsePartido">

            <form className='formulario m-auto  text-center' onSubmit={unirsePartido}>
            
            <label className='h4 text-start' htmlFor='id_partido'>Id partido:</label>
            <br/>
            <input type='text' id='id_partido' placeholder='Escribir aquí' name='id_partido' className='form-control-lg mb-3 '/>

            <div className='mt-3 text-center'>
                <button type='submit' className='btn btn-secondary border border-3 border-dark btn-lg bold px-4'>Unirse a un Partido</button>
            </div>

            </form>

        </div>
    )
}


export default UnirsePartido;