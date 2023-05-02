import React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../../App.css';
import { coloresCSS } from '../../store/colors';

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



function PartidoComponent() {
  
  // obtener :id desde la url
  const { id } = useParams();
  const dbRef = ref(database, "partido/" + id); 
  const [data, setData] = useState("");
  const [hasUserCookies, setHasUserCookies] = useState(null);
  const messagesRef = useRef(null);
  // Configuración de la solicitud con la clave secreta
  const config = {
    queryParams: {
      clave_secreta: 'asd'
    }
  };

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
              console.log('No existe el usuario en las cookies');
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

    get(ref(database, `partido/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const users_get = snapshot.val().usuarios;
        const partido_url = snapshot.val().url;
        const numUsuarios = Object.keys(users_get).length;
        const timestamp = new Date().getTime();
        if (numUsuarios < 30) {
          const user_id = uid(8);
          update(ref(database, `partido/${id}/usuarios`), {
                  [user_id]: {
                  "user_id": user_id,
                  "username": event.target[0].value,
                  "color": coloresCSS[numUsuarios-1],
                  "order": timestamp,
                  "equipo": 0,
                  "positionX": 0,
                  "positionY": 0
                  }
          }).then(() => {
              console.log('Los datos se han actualizado correctamente');
              // crear cookie con id del  partido y usuario
              Cookies.set(id, user_id, { expires: 90 });
              // redirigir al PartidoComponent
              window.location.replace(partido_url);
          });
        }
        else {
          alert('El partido está lleno');
        }
      }
    }).catch((error) => {
      console.error('Error al obtener los datos del partido: ', error);
    });

  }


  // copiar link al portapapeles
  const copiarLink = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(event.target.id);
  }

  const cambiarEquipo = (event) => {
    event.preventDefault();
    const value = Number(event.target.id);
    const user_id = event.target.name;
    console.log(user_id);
    console.log(value);

    update(ref(database, `partido/${id}/usuarios/${user_id}`), {
      "equipo": value,
    }, config).then(() => {
      console.log('Los datos se han actualizado correctamente');
    }).catch((error) => {
      console.error('Error al escribir los datos: ', error);
    });
  
  }


  const mensajeChat = (event) => {
    event.preventDefault();
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
        "color":  user_data.color,
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
        const numUsuarios = Object.keys(data.usuarios).length;
        return (

          <div className='container-fluid'>

            <div className='sub-container rounded-top mt-5 text-white pt-3 pb-3 ps-4 fs-4 lh-lg text-center justify-content-center align-items-center'>
              <span>
                <b>ID:</b> &nbsp;
                <a className='text-warning'>{data.id}</a> &nbsp;
                <button id={data.id} onClick={copiarLink} className='btn border border-1 border-dark btn-warning fs-6 btn-sm'>Copiar</button>
              </span>
            </div>

            <div className='sub-container text-white pb-3 pt-3 ps-4 fs-4 lh-lg'>

                <div className="row align-items-center mt-2">
                    <div className="col-3 fw-bold form-labels" >Fecha:</div>
                    <div className="col-6">
                      <input readOnly type="date" value={data.fecha} name="fecha" className="form-control fs-5 p-1" autoComplete='off' required />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-3 fw-bold form-labels" >Hora:</div>
                    <div className="col-6">
                      <input readOnly type="time" value={data.hora} name="hora" className="form-control fs-5 p-1" autoComplete="off" required />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-3 fw-bold form-labels" >Lugar:</div>
                    <div className="col-6">
                      <input readOnly type="text" value={data.lugar} name='lugar' placeholder='Escribir aqui' className="form-control fs-5 p-1" autoComplete="off" required />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-3 fw-bold form-labels" >Precio:</div>
                    <div className="col-6">
                      <input readOnly type="number" value={data.precio} name='precio' placeholder='Escribir aqui' className="form-control fs-5 p-1" autoComplete="off" required />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-3 fw-bold form-labels" >Alquilado:</div>
                    <div className="col-6">
                     &nbsp; <input readOnly type="checkbox" checked={data.alquilado} name="alquilado" autoComplete="off" required />
                    </div>
                </div>



              </div>


              <div className='sub-container rounded-bottom pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='text-center justify-content-center align-items-center fw-bold'>Jugadores: ({numUsuarios}) </div>
                <div className=''>

                    {data.usuarios && Object.values(data.usuarios)
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div className='row me-2' key={usuario.user_id}>

                          <div className='col-7 border-bottom' key={usuario.user_id} style={{color: usuario.color}}>
                          ⚽ <b>{usuario.username}</b> - {usuario.is_admin ? 'admin' : 'user'}
                          </div>

                          <div className='col-5 text-end'>
                            <button name={usuario.user_id} id='1' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-4 px-3 py-0'>1</button>
                              &nbsp;&nbsp;
                            <button name={usuario.user_id} id='2' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-4 px-3 py-0'>2</button>
                          </div>

                        </div>
                      ))
                    }
                </div>
              </div>

              <div className='sub-container rounded-bottom pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='fw-bold'>Equipo 1:</div>
                <ul>
                    {data.usuarios && Object.values(data.usuarios)
                      .filter(usuario => usuario.equipo === 1) // filtrar por equipo 1
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div key={usuario.user_id}>
                          <li key={usuario.user_id} style={{color: usuario.color}}><b>{usuario.username}</b> </li>
                        </div>
                      ))
                    }
                </ul>
              </div>

              <div className='sub-container rounded-bottom pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='fw-bold'>Equipo 2:</div>
                <ul>
                    {data.usuarios && Object.values(data.usuarios)
                      .filter(usuario => usuario.equipo === 2) // filtrar por equipo 1
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div key={usuario.user_id}>
                          <li key={usuario.user_id} style={{color: usuario.color}}><b>{usuario.username}</b></li>
                        </div>
                      ))
                    }
                </ul>
              </div>

{ 
              <div className='sub-container rounded mt-5 mb-3 pb-3 pt-3 ps-4 fs-4 lh-lg'>
                <span className='text-white'><b>Chat </b></span>

                <div className='border rounded me-5 overflow-auto bg-white mb-3'>
                  <ul ref={messagesRef} className='overflow-auto' style={{height: '270px', maxWidth: '450px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}> 
                    {data.chat && Object.values(data.chat)
                      .sort((a, b) => a.timestamp - b.timestamp) // ordenar por timestamp
                      .map((mensaje) => (
                        <div key={mensaje.message_id}>
                          <b style={{color: mensaje.color}}>{mensaje.sender_username}: </b> {mensaje.text}
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

}

          </div>

        );
      }
      else if (hasUserCookies === false){
        return (
          <div className='sub-container text-white mt-5 mb-3 pb-3 pt-3 ps-4 fs-4 lh-lg'>
            <form onSubmit={unirsePartido}>
              <input type="text" placeholder="Nombre de usuario" required/>
              <button className='btn btn-primary btn-lg' type="submit">Unirse al partido</button>
            </form>
          </div>
        );
      }
      
    }
    else{
      return (<div className='m-2 h5'>Cargando...</div>);
    }

}

export default PartidoComponent;