import './App.css';
function App() {
  return (
    <div className="App">
      <header>
        <h1 className='p-3 m-0'>PeloTurno</h1>
      </header>

        <div className="background">
          <div className='container border border-1 rounded p-5 p-relative '>
            <form className='formulario m-auto '>

            <label className='dark h4 text-start'>Lugar:</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Fecha:</label>
            <br></br>
            <input type='date' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Hora:</label>
            <br></br>
            <input type='time' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Cantidad de jugadores:</label>

            <div className='row'>
              <div className='col-2'>
                <label className='dark h4'>10</label>
              </div>
              <div className='col-2'>
                <label className='dark h4'>14</label>              
              </div>
              <div className='col-2'>
                <label className='dark h4'>18</label>
              </div>
              <div className='col-2'>
                <label className='dark h4'>22</label>
              </div>
            </div>
            <div className='row mb-2'>
              &nbsp;
              <div className='col-2'>
              <input type="radio" value="10" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" value="14" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" value="18" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" value="2" name="cantidadJugadores" /> 
              </div>
            </div>


            
            <label className='dark h4'>Precio:</label>
            <br></br>
            <input type='number' placeholder='$' className='form-control-lg bg-dark text-light mb-3'/>
            <br></br>
            <label className='dark h4 text-start'>Nombre Equipo 1:</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'/>
            <br></br>
            <label className='dark h4 text-start'>Nombre Equipo 2:</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark mb-3'/>
            <br></br>
            <input type='checkbox' className='bg-dark mb-5 form-check-input'/>&nbsp; &nbsp;
            <label className='dark h4 pt-1'>Alquilado</label> 
            <br></br>
            <div className='text-center mt-3'>
              <button type='submit' className='btn btn-light border border-3 border-dark btn-lg bold px-5'> Armar doparti</button>
            </div>
            </form>

            </div>
          
        </div>





    </div>
  );
}

export default App;
