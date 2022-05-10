import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogTitle,
        Dialog,
        Box,
        makeStyles
}from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


import { serviciosGEMA_update } from '../../../servicios/servicios';
import { AppContext } from '../../../appProvider';

const useStyles = makeStyles(theme => ({
    burbuja: {
        backgroundColor: '#80808029', 
        padding: 3, 
        borderRadius: 10,
        fontWeight: 400,
    }
}))


const CancelarFirma = (props) => {

    const [state] = React.useContext(AppContext);
    const classes = useStyles();
    
    const submit = () =>{
        var body = {
            status: 'ENVIADO',//props.firmaPlanificada ?'ENVIADO' : 'FIRMPLA',
            changeby: state.ci,
            statusiface: false,
            np_statusmemo: '...',
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDU+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo cancelar la firma del disco.\nActualice la lista de discos y compruebe el estado del disco."));
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
                    <Box display="flex" flexDirection="column">
                        <span>Cancelar firma</span>
                        <span style={{fontSize: 16, fontWeight: 200, lineHeight: 2}}>
                        Se notificará a <span className={classes.burbuja}>{props.encargadoFirma}</span> que no debe firmar el <span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span>
                        </span>
                    </Box>
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
                        startIcon={<CancelOutlinedIcon/>}>
                        Cancelar firma
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default CancelarFirma;