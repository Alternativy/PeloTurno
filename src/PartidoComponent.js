import React from 'react';
import './App.css';
import firebaseConfig from './firebaseConfig';
import { uid } from 'uid';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import "firebase/auth";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function PartidoComponent() {

    const { id } = useParams();

    return (
    <div>
      <p>La id es: {id}</p>
    </div>

    );
}

export default PartidoComponent;