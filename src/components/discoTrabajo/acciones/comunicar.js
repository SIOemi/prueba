import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogContentText,
        DialogTitle,
        Dialog,
        Box,
        makeStyles
}from '@material-ui/core';
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined';
import { serviciosGEMA_update } from '../../../servicios/servicios';
import { AppContext } from '../../../appProvider';

const useStyles = makeStyles(theme => ({
    burbuja: {
        backgroundColor: '#80808029', 
        padding: 3, 
        borderRadius: 10,
        fontWeight: 400
    }
}))


const Comunciar = (props) => {

    const [state] = React.useContext(AppContext);

    const classes = useStyles();

    const submit = () =>{
        var body = {
            status: 'COMUNICADO',
            changeby: state.ci,
            statusiface: false,
            np_statusmemo: '---',
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo comunicar el disco.\nActualice la lista de discos y compruebe que el disco se encuentre asignado."));
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
                        <span>Comunicar</span>
                        <span style={{fontSize: 16, fontWeight: 200, lineHeight: 2}}>
                            <span className={classes.burbuja}>{props.encargado}</span> podrá colocar en AMIGO discos nominados asociados al <br/><span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span>.
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
                        onClick={submit}
                        variant="outlined"
                        color="default"
                        startIcon={<PhoneAndroidOutlinedIcon />}>
                        Comunicar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Comunciar;