import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CrearPartido from './components/Crear Partido/CrearPartido';
import PartidoComponent from './components/Partido Component/PartidoComponent';
import UnirsePartido from './components/Unirse Partido/UnirsePartido';
//import TableroDinamico from './components/Tablero Dinamico/TableroDinamico';

function App() {

  return (
    <div className="App">

        <Router>
        		<Routes>
					<Route path="/" element={
							  
					<div className="background">
						<header>
							<h1 className='p-3 m-0'> 
							<span role="img" aria-label='pelota' className='fst-italic'>⚽</span> PeloTurno <span className='fs-5 fst-italic'>beta</span>
							</h1>
						</header>
							<div className='container p-5 p-relative '>
								<CrearPartido/>
								<br/>
								<br/>
								<div className='border border-2'></div>
								<br/>
								<br/>
								<UnirsePartido/>
							</div>
						</div>
					} />

					<Route path="/:id" element={<PartidoComponent/>} />


        		</Routes>
    	  </Router>

    </div>
  );
}

export default App;
