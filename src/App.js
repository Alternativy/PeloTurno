import './App.css';
function App() {
  return (
    <div className="App">
      <header>
        <h1>PeloTurno</h1>
        </header>
        {/* <main>
          <h3>Los Salchipapas</h3>
          </main> */}
        <div className="background">
          <div class='container border border-5 rounded p-5 text-start mt-5'>
            <div class='formulario border justify-content-center align-items-center text-left'>

            <label class='dark h4 text-start'>Lugar</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4'>Fecha</label>
            <br></br>
            <input type='date' placeholder='Escribir aquí' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4'>Hora</label>
            <br></br>
            <input type='time' placeholder='Escribir aquí' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4'>Cantidad de jugadores</label>
            <br></br>
            <input type='number' placeholder='Escribir aquí' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4'>Precio</label>
            <br></br>
            <input type='number' placeholder='$' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4 text-start'>Nombre Equipo 1</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' class='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label class='dark h4 text-start'>Nombre Equipo 2</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' class='form-control-lg bg-dark mb-3'></input>
            <br></br>
            <input type='checkbox' class='bg-dark mb-5 form-check-input'></input>&nbsp; &nbsp;
            <label class='dark h4 pt-1'>Alquilado</label> 
            <br></br>
            
          <button type='submit' class='btn btn-dark btn-lg me-2 px-5'>Armar doparti</button>
            </div>

            </div>
          
        </div>
    </div>
  );
}

export default App;
