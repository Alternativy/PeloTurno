import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import firebaseConfig from './firebaseConfig';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, update } from "firebase/database";
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
// En este componente PartidoComp, se checkea si la /id: existe y si el usuario posee cookies correctas, si no posee cookies se le muestra un <div/> para que ingrese su nombre  




function PartidoComponent() {
  
  // obtener :id desde la url
  const { id } = useParams();
  const dbRef = ref(database, "partido/" + id); 
  const [data, setData] = useState("");
  let hasUserCookies = false;
  const cookie = getCookies(id);

    useEffect(() => {
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        }
      });
    }, []);



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




    // obtener datos del usuario a partir de la cookie
    function get_user(){
      // verificar si existe el partidocn esa ID
      get(ref(database, `partido/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data_get = snapshot.val();

          // por cada usuario en la data, chekear si coincide la cookie.value con el id del usuario
          for (const userId in data_get.usuarios) {
            const user = data_get.usuarios[userId];
            // buscar si el id de usuario en la db coincide con el valor de la cookie
            if (cookie && user.user_id === cookie.value) {
              console.log('El usuario posee cookies guardadas con username: ' + user.username);
                if (user.is_admin) {
                    console.log('es admin: ' + user.is_admin);
                }
                hasUserCookies = true;   
                return true;
            }
            else{
                hasUserCookies = false;
            }
        }
        if (!hasUserCookies) {
          console.log('no tienes cookies... modal-box ingrese su nombre');
        }

        }
        else {
          console.log('No existe el partido, ID incorrecta');
          window.location.replace('http://localhost:3000');
        }

      }).catch((error) => {
        console.log('Error al obtener los datos del partido: ', error);
      });
    }

    // si existe data con el id de la url
    if (data !== null && data !== ""){
      get_user();

      return (
      <div>
        <span>Id del partido: {data.id}</span>
        <br/>
        <span>Lugar: {data.lugar}</span>
        <br/>
        <span>Hora: {data.hora}</span>
        <br/>
        <span>Fecha: {data.fecha}</span>
        <br/>
        <span>Precio: {data.precio}</span>
        <br/>
        <span>Usuarios: </span>
        <ul>
          {data.usuarios && Object.keys(data.usuarios).map(function(key) {
            const usuario = data.usuarios[key];
            return <li key={usuario.user_id}>{usuario.username} - {usuario.user_id} - {usuario.is_admin ? 'admin' : 'user'} </li>;
          })}
        </ul>
        
      </div>

      );
    }

    else{
      
      return (
        <div>
          
        </div>
      );
    }

}

export default PartidoComponent;