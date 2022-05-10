import React from 'react';

import Button from '@material-ui/core/Button';
import {makeStyles,
        DialogActions,
        DialogContent,
        TextField,
        DialogTitle,
        Dialog,
        Box
}from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { serviciosGEMA_update } from '../../../servicios/servicios';
import { AppContext } from '../../../appProvider';
import RazonesContingencia from '../../inputs/razonesContingenia';

const useStyles = makeStyles(theme => ({
    burbuja: {
        backgroundColor: '#80808029', 
        padding: 3, 
        borderRadius: 10,
        fontWeight: 400
    }
}))


const Firmar = (props) => {
    const [state] = React.useContext(AppContext);
    const [comentario,setComentario] = React.useState("");
    
    const classes = useStyles();

    const submit = () =>{
        
        //var comentario_ = (!comentario || comentario === "") ? "-" : comentario;

        var body = {
            status: 'FIRMADO',
            changeby: state.ci,
            statusiface: false,
            firmcont: 1,
            np_statusmemo: "Contingencia: " + comentario,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo firmar el disco.\nActualice la lista de discos y compruebe que el disco se encuentre colocado."));
        limpiarForm();
        props.close();
    }

    
    const limpiarForm = () =>{
        setComentario("");
    }

    const cerrar = () => {
        limpiarForm();
        props.close()
    }

    return (
        <div>
            <Dialog 
                open={props.open} 
                onClose={cerrar} 
                aria-labelledby="form-dialog-title"
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">
                    <Box display="flex" flexDirection="column">
                        <span>Firmar disco</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Registro en contingencia de la firma del <span className={classes.burbuja}>Disco {props.numeroDT}</span> por <span className={classes.burbuja}>{props.encargado}</span>
                        </span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                <RazonesContingencia setRazon= {setComentario}/>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cerrar} 
                        color="default" >
                        Cerrar
                    </Button>
                    <Button
                        onClick={()=>submit()}
                        variant="outlined"
                        color="default"
                        startIcon={<EditOutlinedIcon />}>
                        Firmar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Firmar;