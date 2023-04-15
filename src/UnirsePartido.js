import React from "react";

function UnirsePartido(){
    return(
        <div className="CrearPartido">

        <form className='formulario m-auto  text-center'>
        
        <label className='h4 text-start' htmlFor='id_partido'>Id partido:</label>
        <br/>
        <input type='text' id='id_partido' placeholder='Escribir aquí' name='id_partido' className='form-control-lg mb-3 '/>

        <div className='mt-3 text-center'>
            <button type='submit' className='btn btn-secondary border border-3 border-dark btn-lg bold px-4'>Unirse a un Partido</button>
        </div>

        </form>

        </div>
    )
}

export default UnirsePartido;