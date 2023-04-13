import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes, Switch} from 'react-router-dom';
import CrearPartido from './CrearPartido';
import FormularioPartido from './FormularioPartido';
import PartidoComponent from './PartidoComponent';


function App() {

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
					  <Route path="/:id" element={<PartidoComponent/>} />
        		</Routes>
      		</div>
    	  </Router>


    </div>
  );
}

export default App;
