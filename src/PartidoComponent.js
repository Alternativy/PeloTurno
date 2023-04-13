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
    // obtener datos del partido
    const [data, setData] = useState({});

    useEffect(() => {
      const dbRef = ref(database);
      onValue(dbRef, (snapshot) => {
        const partidoRef = ref(database, `partido/${id}`);
        get(partidoRef).then((snapshot) => {
            const partido = snapshot.val();
            console.log(partido);
        }).catch((error) => {
            console.error('Error al obtener los datos del partido: ', error);
        });
      });
    }, []);

    return (
    <div>
      <p>La id es: {id} </p>
    </div>

    );
}

export default PartidoComponent;