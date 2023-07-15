import React from 'react';
import { useState, useEffect, useRef } from 'react';
import '../../App.css';
import { coloresCSS } from '../../store/colors';

import firebaseConfig from '../../store/Firebase/firebaseConfig';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import Cookies from 'js-cookie';
import NavBar from '../Nav bar/NavBar';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, update } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let user_data;
let UserId ;

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
  const dbRef = ref(database, `partido/${id}`); 
  const [data, setData] = useState("");
  const [hasUserCookies, setHasUserCookies] = useState(null);
  const [formData, setFormData] = useState({});
  const messagesRef = useRef(null);
  // Configuración de la solicitud con la clave secreta


  useEffect(() => {
    
    const cookie = getCookies(id);
    // obtener datos del usuario a partir de la cookie
    function get_user(){
      // verificar si existe el partidocn esa ID
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // por cada usuario en la data, chekear si coincide la cookie.value con el id del usuario
          for (const userId in data.usuarios) {
            const user = data.usuarios[userId];
            // buscar si el id de usuario en la db coincide con el valor de la cookie
            if (cookie && user.user_id === cookie.value) {
              user_data = user;
              UserId = user.user_id;
              console.log('El usuario posee cookies guardadas con username: ' + user.username);
              setHasUserCookies(true); 
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

  useEffect(() => {
    // Referencia a la ubicación en la base de datos donde se encuentra el registro a modificar
    // Realizar el update con los nuevos valores del formulario
    update(dbRef, formData);
  }, [formData]);


const unirsePartido = (event) => {
    event.preventDefault();

    get(dbRef).then((snapshot) => {
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

    update(ref(database, `partido/${id}/usuarios/${user_id}`), {
      "equipo": value,
    }, ).then(() => {
      console.log('Los datos se han actualizado correctamente');
    }).catch((error) => {
      console.error('Error al escribir los datos: ', error);
    });
  }

  const darAdmin = (event) => {
    event.preventDefault();
    const value = true;
    const user_id = event.target.name;

    update(ref(database, `partido/${id}/usuarios/${user_id}`), {
      "is_admin": value,
    }, ).then(() => {
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

        <div>

            <NavBar/>
          <div className='partido-bck'>

          <div className='sub-container mt-4 text-white pt-3 pb-3 ps-4 fs-4 lh-lg text-center justify-content-center align-items-center'
              style={{borderRadius:"20px 20px 0px 0px"}}>
            {
            //<h1 className='p-2 m-0'>⚽ PeloTurno</h1>
            }
              <span>
                <b>ID:</b> &nbsp;
                <a className='text-light'>{data.id}</a> &nbsp;
                <button id={data.id} onClick={copiarLink} className='btn border border-1 border-dark btn-warning fs-6 btn-sm'>Copiar</button>
              </span>
                   
          </div>

          <div className='sub-container text-white pb-3 pt-3 ps-4 fs-4 lh-lg'>


            <form>
                <div className="row align-items-center mt-2">
                    <label className="col-4 fw-bold form-labels" htmlFor="fecha">Fecha:</label>
                    <div className="col-6">
                      <input type="date" value={data.fecha} id="fecha"
                       className="form-control fs-5 p-1" autoComplete='off' required
                       onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <label className="col-4 fw-bold form-labels" >Hora:</label>
                    <div className="col-6">
                      <input  type="time" value={data.hora} id="hora" className="form-control fs-5 p-1" autoComplete="off" required
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })} />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <label className="col-4 fw-bold form-labels" >Lugar:</label>
                    <div className="col-6">
                      <input type="text" value={data.lugar} id='lugar' placeholder='Escribir aqui' className="form-control fs-5 p-1" autoComplete="off" required
                      onChange={(e) => setFormData({ ...formData, lugar: e.target.value })} />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <label className="col-4 fw-bold form-labels" htmlFor="precio" >Precio:</label>
                    <div className="col-6">
                      <input type="number" value={data.precio} id='precio' name='precio' placeholder='$' className="form-control fs-5 p-1" autoComplete="off" required 
                      onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })} />
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <label className="col-4 fw-bold form-labels" >Alquilado:</label>
                    <div className="col-6 ">
                     <input type="checkbox" className="form-check-input fs-6 ms-0 ps-0 border border-dark " style={{ cursor: 'pointer' }} checked={data.alquilado} id="alquilado" autoComplete="off" required
                     onChange={(e) => setFormData({ ...formData, alquilado: e.target.checked })} />
                    </div>
                </div>
            </form>

          </div>


              <div className='sub-container pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='text-center justify-content-center align-items-center fw-bold'>Jugadores: ({numUsuarios}) </div>
                <div className=''>

                    {data.usuarios && Object.values(data.usuarios)
                    .filter(usuario => usuario.equipo === 0) // filtrar por equipo 1
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div className='row me-2' key={usuario.user_id}>

                          <div className='col-7 pb-1' key={usuario.user_id} style={{color: usuario.color}}>
                          <b>{usuario.username}</b> <span role="img" aria-label='pelota'>- {usuario.is_admin ? '⚽' : ''} </span>
                          </div>
                          
                          {data.usuarios[UserId].is_admin ? 
                          <div className='col-5 text-end pe-0'>
                            <button name={usuario.user_id} title='Equipo 1' id='1' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-5 px-2 py-0'>1</button>
                              &nbsp;&nbsp;
                            <button name={usuario.user_id} title='Equipo 2' id='2' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-5 px-2 py-0'>2</button>
                              &nbsp;&nbsp;
                            <button name={usuario.user_id} title='Dar admin' id='2' onClick={darAdmin} className='btn btn-outline-info border border-dark border-2 fs-6 px-1 py-1'>⚽</button>
                          </div> :
                            null
                          }

                        </div>
                      ))
                    }
                </div>
              </div>

              <div className='sub-container pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='fw-bold'>Equipo 1:</div>
                <ol>
                    {data.usuarios && Object.values(data.usuarios)
                      .filter(usuario => usuario.equipo === 1) // filtrar por equipo 1
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div className='row me-2' key={usuario.user_id}>
                          <div className='col-7 pb-1'  key={usuario.user_id}>
                            <li key={usuario.user_id} style={{color: usuario.color}}><b>{usuario.username}</b> <span role="img" aria-label='pelota'>{usuario.is_admin ? '⚽' : ''} </span> </li>
                          </div>

                          {data.usuarios[UserId].is_admin ? 
                          <div className='col-5 text-end pe-0'>
                            <button name={usuario.user_id} title='Equipo 2' id='2' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-5 px-1 py-0'>⬇</button>
                              &nbsp;&nbsp;
                            <button name={usuario.user_id} title='Dar admin' id='2' onClick={darAdmin} className='btn btn-outline-info border border-dark border-2 fs-6 px-1 py-1'>⚽</button>
                          </div> :
                            null
                          }
                        </div>
 
                      ))
                    }
                </ol>
              </div>

              <div className='sub-container pt-3 pb-3 ps-4 fs-4 lh-lg bg-white'>
                <div className='fw-bold'>Equipo 2:</div>
                <ol>
                    {data.usuarios && Object.values(data.usuarios)
                      .filter(usuario => usuario.equipo === 2) // filtrar por equipo 1
                      .sort((a, b) => a.order - b.order) // ordenar por timestamp
                      .map((usuario) => (
                        <div className='row me-2' key={usuario.user_id}>
                          <div className='col-7 pb-1'  key={usuario.user_id}>
                            <li key={usuario.user_id} style={{color: usuario.color}}><b>{usuario.username}</b> <span role="img" aria-label='pelota'> {usuario.is_admin ? '⚽' : ''} </span></li>
                          </div>

                          {data.usuarios[UserId].is_admin ? 
                          <div className='col-5 text-end pe-0'>
                            <button name={usuario.user_id} title='Equipo 1' id='1' onClick={cambiarEquipo} className='btn btn-light border border-dark border-2 fs-5 px-1 py-0'>⬆</button>
                              &nbsp;&nbsp;
                            <button name={usuario.user_id} title='Dar admin' id='2' onClick={darAdmin} className='btn btn-outline-info border border-dark border-2 fs-6 px-1 py-1'>⚽</button>
                          </div> :
                            null
                          }
                        </div>
                      ))
                    }
                </ol>
              </div>

            <div className='sub-container pt-3 pb-3 ps-4 fs-4 lh-lg'
              style={{borderRadius:"0px 0px 20px 20px", backgroundColor: "rgb(240, 240, 240)"}}>
              <div className='text-center justify-content-center align-items-center'>
                  <button className='btn btn-secondary btn-lg'>Mezclar</button>
              </div>
            </div>


              <div className='sub-container mt-5 mb-3 pb-3 pt-3 ps-4 fs-4 lh-lg'
               style={{borderRadius:"20px 20px 20px 20px"}}>
                <span className='text-white'><b>Chat</b></span>

                <div className='border rounded me-4 overflow-auto bg-white mb-3'>
                  <ul ref={messagesRef} className='overflow-auto' style={{height: '300px', maxWidth: '494px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}> 
                    <div className='text-black-50'>
                      {data.chat ? '' : 'No hay mensajes...'} 
                    </div>

                    {data.chat && Object.values(data.chat)
                      .sort((a, b) => a.timestamp - b.timestamp) // ordenar por timestamp
                      .map((mensaje) => (
                        <div key={mensaje.message_id}>
                          <b style={{color: mensaje.color}}>{mensaje.sender_username}: </b>
                           {mensaje.text}
                        </div>
                      ))
                    }
                  </ul>
                </div>


                <form onSubmit={mensajeChat}>
                  <div className='row me-4'>
                    <div className='col'>
                      <input className="form-control fs-5 p-1 py-2" type="text" placeholder="Escribe tu mensaje" required/>
                    </div>
                    <div className='col-4 justify-content-start align-items-center text-start'>
                      <button type='submit' className='btn btn-primary btn-lg '> Enviar </button>
                    </div>
                  </div>
                </form>

              </div>

          </div>
        </div>

        );
      }
      else if (hasUserCookies === false){
        return (
          <div>
            <NavBar/>

            <div className='sub-container text-white mt-5 mb-3 pb-3 pt-3 ps-4 fs-4 lh-lg'
              style={{borderRadius:"20px 20px 20px 20px"}}>
              <form onSubmit={unirsePartido}>
                <div className='row me-4'>
                      <div className='col'>
                        <input className="form-control fs-5 p-1 py-2" type="text" placeholder="Ingresa tu nombre" required/>
                      </div>
                      <div className='col-3 justify-content-center align-items-center'>
                        <button className='btn btn-primary btn-lg' type="submit">Unirse</button>
                      </div>
                </div>
              </form>
            </div>

          </div>
        );
      }
      
    }
    else{
      return (<div className='m-3 h5'>Cargando...</div>);
    }

}

export default PartidoComponent;