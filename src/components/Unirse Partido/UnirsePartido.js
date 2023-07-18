import React from "react";
import firebaseConfig from '../../store/Firebase/firebaseConfig';
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup} from '@fortawesome/free-solid-svg-icons'
import { faAngleRight} from '@fortawesome/free-solid-svg-icons'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


///// CAMBIOS /////
// En este componente UnirsePArtido, solo se le pide el id del partido y se verifica si este id existe, si es asi se lo envia al PartidoComp  

const unirsePartido = (event) => {
    event.preventDefault();
    const id = event.target[0].value;	

        // verificar si existe el partidocn esa ID
        get(ref(database, `partido/${id}`)).then((snapshot) => {
            const partido = snapshot.val();
            if (snapshot.exists()) {
                window.location.replace(partido.url);
            }
            else {
                console.log('No existe el partido, ID incorrecta');
            }
        }).catch((error) => {
            console.log('Error al obtener los datos del partido: ', error);
        });
};


function UnirsePartido(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className="UnirsePartido">

            <button className="btn border border-3 rounded-4 p-2 py-3" style={{border:'rgb(215, 215, 215)'}} onClick={handleShow}>
                <h3 className="text-center text-light mb-2">Unirse <FontAwesomeIcon className="text-light fs-3 ms-1 p-0" icon={faPeopleGroup} />.</h3>
                <p className="text-center text-light px-4 mx-1 pt-1">
                 Únete a un partido existente utilizando el ID proporcionado por el organizador.
                </p>
            </button>

            <Modal show={show} onHide={handleClose} style={{marginTop: '150px'}}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                    <label htmlFor='username'>Ingresa la ID:</label>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={unirsePartido}>
                        <input className='form-control-lg my-2 w-100' type='text' id='username' placeholder='Escribir aquí' name='username' required/>
                        <div className='mt-3 mb-2 text-center'>
                            <button type='submit' className='btn btn-secondary border border-3 border-dark btn-lg bold px-4'>Unirse <FontAwesomeIcon className="ms-1" style={{position:'relative', top:'1px'}}  icon={faAngleRight}/> </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </div>
    )
}


export default UnirsePartido;