import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import CrearPartido from './CrearPartido';
import PartidoComponent from './PartidoComponent';
import UnirsePartido from './UnirsePartido';


function App() {

  return (
    <div className="App">

        <Router>
        		<Routes>
					<Route path="/" element={
						<div className='container rounded p-5' style={{backgroundColor: 'rgba(25,25,25,0.2)'}}>
							<CrearPartido/>
							<br/>
							<br/>
							<div className='border border-2'></div>
							<br/>
							<br/>
							<UnirsePartido/>
						</div>
					} />

					<Route path="/:id" element={<PartidoComponent/>} />

        		</Routes>
    	  </Router>

    </div>
  );
}

export default App;
