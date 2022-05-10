import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogTitle,
        Dialog,
}from '@material-ui/core';

import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';


import { serviciosGEMA_update } from '../../../servicios/servicios';
import { AppContext } from '../../../appProvider';


const Eliminar = (props) => {
    const [state] = React.useContext(AppContext);

    const submit = () =>{
        var body = {
            status: 'ELIMINADO',
            changeby: state.ci,
            statusiface: false,
            np_statusmemo: '...',
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDU+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo eliminar el disco.\nActualice la lista de discos y compruebe el estado del disco."));
        props.close();
    }

    return (
        <div>
            <Dialog 
                open={props.open} 
                onClose={props.close} 
                aria-labelledby="form-dialog-title"
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">
                    Eliminar disco a unidad {props.numeroDU}
                </DialogTitle>
                <DialogActions>
                    <Button 
                        onClick={props.close} 
                        color="default" >
                        Cerrar
                    </Button>
                    <Button
                        onClick={()=>submit()}
                        variant="outlined"
                        color="default"
                        startIcon={<DeleteOutlineOutlinedIcon/>}>
                        Eliminar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Eliminar;