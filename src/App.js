import './App.css';
function App() {
  return (
    <div className="App">
      <header>
        <h1 className='p-3 m-0'>PeloTurno</h1>
        </header>

        <div className="background">
          <div className='container border border-1 rounded p-5 p-relative mt-5'>
            <form className='formulario m-auto'>

            <label className='dark h4 text-start'>Lugar</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Fecha</label>
            <br></br>
            <input type='date' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Hora</label>
            <br></br>
            <input type='time' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Cantidad de jugadores</label>
            <br></br>
            <input type='number' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4'>Precio</label>
            <br></br>
            <input type='number' placeholder='$' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4 text-start'>Nombre Equipo 1</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark text-light mb-3'></input>
            <br></br>
            <label className='dark h4 text-start'>Nombre Equipo 2</label>
            <br></br>
            <input type='text' placeholder='Escribir aquí' className='form-control-lg bg-dark mb-3'></input>
            <br></br>
            <input type='checkbox' className='bg-dark mb-5 form-check-input'></input>&nbsp; &nbsp;
            <label className='dark h4 pt-1'>Alquilado</label> 
            <br></br>
            
          <button type='submit' className='btn btn-light border border-3 border-dark btn-lg m-auto ms-4 bold px-5'> Armar doparti</button>
            </form>

            </div>
          
        </div>





    </div>
  );
}

export default App;
