import React from "react";
import firebaseConfig from './firebaseConfig';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import "firebase/auth";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function getCookies(id_partido) {
    const id  = id_partido;
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes(id)) {
            const [name, value] = cookies[i].split('=');
            return { name, value };
        }
    }
    return null;
}

///// CAMBIOS /////
// En este componente UnirsePArtido, solo se le pide el id del partido y se verifica si este id existe, si es asi se lo envia al PartidoComp  


// la idea de unirse a partido, es: 
// primero verificar si el usuario posee cookies del partido al cual se intenta unir,
// si este no posee cookies entonces pedirle que ingrese un nombre para unirse y guardarlo en la db
// si posee ya una cookie y coincide el id del partido y usuario del mismo, entonces ingresa directamente con esos datos.


const unirsePartido = (event) => {
    event.preventDefault();
    const id = event.target[0].value;	
    let hasUserCookies = false;
    const cookies = getCookies(id);

        // verificar si existe el partidocn esa ID
        get(ref(database, `partido/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(data.id);
                if (cookies && cookies.name === data.id){
                    
                    // por cada usuario en la data, chekear si coincide la cookie.value con el id del usuario
                    for (const userId in data.usuarios) {
                        const user = data.usuarios[userId];
                        // buscar si el id de usuario en la db coincide con el valor de la cookie
                        if (cookies && user.user_id === cookies.value) {
                          console.log('El usuario posee cookies guardadas con username: ' + user.username);
                            if (user.is_admin) {
                                console.log('es admin: ' + user.is_admin);
                            }
                            hasUserCookies = true;    
                            break;
                        }
                        else{
                            hasUserCookies = false;
                        }
                    }
                }

                // el usuario no posee cookies guardadas 
                if (!hasUserCookies){
                    // si no coincide el valor de la cookie con un usuario en la db
                    console.log('El usuario no existe ... abrir modal-box input de ingrese su nombre');
                    const user_id = uid(8);
                    update(ref(database, `partido/${id}/usuarios`), {
                            [user_id]: {
                            "user_id": user_id,
                            "username": event.target[1].value,
                            "color": "red",
                            "positionX": 0,
                            "positionY": 0
                            }
                    }).then(() => {
                        console.log('Los datos se han actualizado correctamente');
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
                }

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