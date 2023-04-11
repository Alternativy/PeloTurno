import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import firebaseConfig from './firebaseConfig';
import { uid } from 'uid';
import CrearPartido from './CrearPartido';
import FormularioPartido from './FormularioPartido';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function HomePage() {
  return <h1>¡Bienvenido a la página de inicio!</h1>;
}

function App() {

  /*
  const [data, setData] = useState("");
  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      setData(snapshot.val());
      console.log(snapshot.val());
    });
  }, []);
*/

const writeToDatabase = (event) => {
    event.preventDefault();
    const uuid = uid();
    set(ref(database, `partido/${uuid}`), {
        uuid : uuid,
        lugar: event.target[0].value,
        fecha: event.target[1].value,
        hora: event.target[2].value,
        cantidadJugadores: document.querySelector('input[name="cantidadJugadores"]:checked').value,
        precio: event.target[8].value,
        equipo1: event.target[9].value,
        equipo2: event.target[10].value,
        alquilado: event.target[11].checked,
    });
}
  
  return (
    <div className="App">


        <Router>
      		<div>
        		<nav>
          			<ul>
            			<li>
              				<Link to="/">Home</Link>
            			</li>
            			<li>
              				<Link to="/contact">Crear Partido</Link>
            			</li>
          			</ul>
        		</nav>

        		<Routes>
          			<Route path="/" element={<FormularioPartido/>} />
          			<Route path="/contact" element={<CrearPartido/>} />
        		</Routes>
      		</div>
    	  </Router>


    </div>
  );
}

export default App;
