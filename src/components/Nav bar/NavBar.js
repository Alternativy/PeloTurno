import React from 'react';
import '../../App.css';


function NavBar(){
    return(
    <nav>
        <a href='/' className='nav-link'>
            <h1 className='p-3 m-0'> 
                <span role="img" aria-label='pelota' className='fst-italic'>⚽ </span>
                <span className='nav-link-title'>FulboLista</span>  
                <span className='fs-5 fst-italic'> beta</span>
            </h1>
        </a>
    </nav>
    )
}

export default NavBar;