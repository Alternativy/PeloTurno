import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import firebaseConfig from './firebaseConfig';
import { useParams } from 'react-router-dom';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import "firebase/auth";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function getCookies() {
  const { id } = useParams();
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
    const cookie = getCookies();
    console.log(cookie);

    useEffect(() => {
  
      onValue(dbRef, (snapshot) => {
        setData(snapshot.val());
        console.log(snapshot.val());
      });
    }, []);

    function get_user(){
      for (let i = 0; i < data.usuarios.length; i++) {
        if (data.usuarios[i].user_id === cookie.value) {
          return data.usuarios[i].is_admin;
        }
      }
      return false;
    }

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
        return <li key={usuario.user_id}>{usuario.username} - {usuario.user_id}</li>;
      })}
    </ul>
      
    </div>

    );
}

export default PartidoComponent;