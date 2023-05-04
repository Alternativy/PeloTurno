import React from 'react';
import '../../App.css';


function NavBar(){
    return(
    <nav>
        <h1 className='p-3 m-0'> 
            <span role="img" aria-label='pelota' className='fst-italic'>⚽ </span>
            PeloTurno 
            <span className='fs-5 fst-italic'> beta</span>
        </h1>
    </nav>
    )
}

export default NavBar;