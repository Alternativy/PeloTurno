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

            <label className='dark h4 text-start' for='lugar'>Lugar:</label>
            <br/>
            <input type='text' id='lugar' placeholder='Escribir aquí' name='lugar' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <label className='dark h4' for='fecha'>Fecha:</label>
            <br/>
            <input type='date' id='fecha' placeholder='Escribir aquí' name='fecha' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <label className='dark h4' for='hora'>Hora:</label>
            <br/>
            <input type='time' id='hora' name='hora' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <label className='dark h4'>Cantidad de jugadores:</label>

            <div className='row'>
              <div className='col-2'>
                <label className='dark h4' for='10jugadores'>10</label>
              </div>
              <div className='col-2'>
                <label className='dark h4' for='14jugadores'>14</label>              
              </div>
              <div className='col-2'>
                <label className='dark h4' for='18jugadores'>18</label>
              </div>
              <div className='col-2'>
                <label className='dark h4' for='22jugadores'>22</label>
              </div>
            </div>
            <div className='row mb-2'>
              &nbsp;
              <div className='col-2'>
              <input type="radio" className='form-check-input' id='10jugadores' value="10" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" className='form-check-input' id='14jugadores' value="14" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" className='form-check-input' id='18jugadores' value="18" name="cantidadJugadores" /> 
              </div>
              <div className='col-2'>
              <input type="radio" className='form-check-input' id='22jugadores' value="22" name="cantidadJugadores" /> 
              </div>
            </div>


            <label className='dark h4' for='precio'>Precio:</label>
            <br/>
            <input type='number' id='precio' name='precio' placeholder='$' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <label className='dark h4 text-start' for='equipo1'>Nombre Equipo 1:</label>
            <br/>
            <input type='text' id='equipo1' name='equipo1' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <label className='dark h4 text-start' for='equipo2'>Nombre Equipo 2:</label>
            <br/>
            <input type='text' id='equipo2' name='equipo2' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'/>
            <br/>
            <input type='checkbox' id='alquilado' name='alquilado' className='bg-dark mb-5 form-check-input'/>&nbsp; &nbsp;
            <label className='dark h4 pt-1' for='alquilado'>Alquilado</label> 
            <br/>
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
