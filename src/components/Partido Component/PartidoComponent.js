import React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../../App.css';

import firebaseConfig from '../../store/Firebase/firebaseConfig';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import Cookies from 'js-cookie';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, update } from "firebase/database";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let user_data;

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
  const [hasUserCookies, setHasUserCookies] = useState(null);
  const messagesRef = useRef(null);


  useEffect(() => {
    
    const cookie = getCookies(id);
    // obtener datos del usuario a partir de la cookie
    function get_user(){
      // verificar si existe el partidocn esa ID
      get(ref(database, `partido/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // por cada usuario en la data, chekear si coincide la cookie.value con el id del usuario
          for (const userId in data.usuarios) {
            const user = data.usuarios[userId];
            // buscar si el id de usuario en la db coincide con el valor de la cookie
            if (cookie && user.user_id === cookie.value) {
              user_data = user;
              console.log(user);
              console.log('El usuario posee cookies guardadas con username: ' + user.username);
              setHasUserCookies(true); 
              console.log(hasUserCookies);
              if (user.is_admin) {
                console.log('es admin: ' + user.is_admin);
              }
              break;
            }
            else{
              setHasUserCookies(false); 
              console.log('No existe el usuario');
            }
          }
        }
        else {
          console.log('No existe el partido, ID incorrecta');
          window.location.replace('/');
        }

      }).catch((error) => {
        console.log('Error al obtener los datos del partido: ', error);
      });
    }

    get_user();

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
      else{
        console.log("No existe el partido");
          window.location.replace("/");
      }
    });

  }, [id]);




const unirsePartido = (event) => {
  event.preventDefault();

    const user_id = uid(8);
    update(ref(database, `partido/${id}/usuarios`), {
            [user_id]: {
            "user_id": user_id,
            "username": event.target[0].value,
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
            Cookies.set(id, user_id, { expires: 90 });
            // redirigir al PartidoComponent
            window.location.replace(partido.url);
        }).catch((error) => {
            console.error('Error al obtener los datos del partido: ', error);
        });
    }).catch((error) => {
        console.error('Error al escribir los datos: ', error);
      });
  }


  const mensajeChat = (event) => {
    event.preventDefault();
    const cookie = getCookies(id);
    const msg_id = uid(6);
    const input_txt = event.target[0].value;
    const timestamp = new Date().getTime();
    // Accede al elemento de entrada de texto y restablece su valor a una cadena vacía
    event.target[0].value = '';
    update(ref(database, `partido/${id}/chat`), {
      [msg_id]:{
        "message_id": msg_id,
        "user_id": user_data.user_id,
        "sender_username" : user_data.username,
        "text": input_txt,
        "timestamp": timestamp
      }
    }).then(() => {
      console.log('Los datos se han actualizado correctamente');
      const partidoRef = ref(database, `partido/${id}`);
      get(partidoRef).then((snapshot) => {
          const partido = snapshot.val();
          console.log('Partido actualizado correctamente: ', partido);
      }).catch((error) => {
          console.error('Error al obtener los datos del partido: ', error);
      });

    // Actualiza la propiedad scrollTop para mantener el scroll abajo cada vez que se actualiza la lista de mensajes
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }

    }).catch((error) => {
      console.error('Error al escribir los datos: ', error);
    });
  }



    // si existe data con el id de la url
    if (data !== null && data !== ""){

      if (hasUserCookies === true){
        return (
          <div className='container-fluid'>

              <div className='sub-container mt-5 text-white pt-3 pb-3 ps-4 fs-4 lh-lg'>
                <span><b>Link:</b> <a className='text-white' href={data.url}>{data.url}</a> </span>
              </div>

              <div className='sub-container text-white pb-3 pt-3 ps-4 fs-4 lh-lg'>
                <span><b>Lugar: </b>{data.lugar}</span>
                <br/>
                <span><b>Hora:</b> {data.hora}</span>
                <br/>
                <span><b>Fecha:</b> {data.fecha}</span>
                <br/>
                <span><b>Precio:</b> {data.precio}</span>
                <br/>
              </div>

              <div className='sub-container text-white pt-3 pb-3 ps-4 fs-4 lh-lg'>
                <span> <b>Usuarios: </b></span>
                <ul>
                  {data.usuarios && Object.keys(data.usuarios).map(function(key) {
                    const usuario = data.usuarios[key];
                    return <li key={usuario.user_id}>{usuario.username} - {usuario.is_admin ? 'admin' : 'user'} </li>;
                  })}
                </ul>
              </div>

              <div className='sub-container text-white mt-5 mb-3 pb-3 pt-3 ps-4 fs-4 lh-lg'>
                <span><b>Chat </b></span>

                <div className='border p-4 me-4 overflow-auto'>
  <ul ref={messagesRef} className='overflow-auto' style={{height: '280px'}}> 
    {data.chat && Object.values(data.chat)
      .sort((a, b) => a.timestamp - b.timestamp) // ordenar por timestamp
      .map((mensaje) => (
        <div key={mensaje.message_id}>
          <b>{mensaje.sender_username}: </b> {mensaje.text}
        </div>
      ))
    }
  </ul>
</div>

                <span> 
                <form onSubmit={mensajeChat}>
                <input className='' type="text" placeholder="Escribe tu mensaje" required/>
                  <button type='submit' className='btn btn-primary btn-lg'>Enviar</button>
                </form>
                </span>
              </div>

          </div>
        );
      }
      else if (hasUserCookies === false){
        return (
          <div>
            <form onSubmit={unirsePartido}>
              <input type="text" placeholder="Nombre de usuario" required/>
              <button type="submit">Unirse al partido</button>
            </form>
          </div>
        );
      }
      
    }
    else{
      return (<div>Cargando...</div>);
    }

}

export default PartidoComponent;