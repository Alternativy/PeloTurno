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


function PartidoComponent() {

    // obtener :id desde la url
    const { id } = useParams();
    const dbRef = ref(database, "partido/" + id); 
    const [data, setData] = useState("");
    

    useEffect(() => {
  
      onValue(dbRef, (snapshot) => {
        setData(snapshot.val());
        console.log(snapshot.val());
      });
    }, []);

    return (
    <div>
      <p>La id es: {id} </p>
      <span>Id: {data.id}</span>
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
        return <li key={usuario.user_id}>{usuario.username}</li>;
      })}
    </ul>
    </div>

    );
}

export default PartidoComponent;