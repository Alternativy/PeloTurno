import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import CrearPartido from './CrearPartido';
import FormularioPartido from './FormularioPartido';


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
          			<Route path="/" element={<FormularioPartido/>} />
          			<Route path="/contact" element={<CrearPartido/>} />
        		</Routes>
      		</div>
    	  </Router>

    </div>
  );
}

export default App;
