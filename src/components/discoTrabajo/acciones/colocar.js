import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import {makeStyles,
        DialogActions,
        DialogContent,
        DialogTitle,
        Dialog, TextField,
        Box,
        Hidden
}from '@material-ui/core';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';

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

const Colocar = (props) => {
 
    const classes = useStyles();

    const [state] = React.useContext(AppContext);
    const [procesando,setProcesando] = React.useState(false);

    const submit = () =>{
        setProcesando(true);
        //var comentario_ = (!comentario || comentario === "") ? "-" : comentario;

        var body = {
            status: 'COLOCADO',
            changeby: state.ci,
            statusiface: false,
            firmcont: 1,
            nrodisco: numeroDisco,
            np_statusmemo: "Contingencia: " + comentario,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo colocar el disco.\nActualice la lista de discos y compruebe que el número no corresponda a un disco activo."));
        limpiarForm();
        props.close();
    }


   
  
    const [numeroDisco,setNumeroDisco] = useState("");
    const validarNumero = (valor) => {
        setNumeroDisco(valor.toUpperCase());
        setValido(valor.length>0 && valor.length<8 && valor.match(/^[0-9a-zA-Z]+$/) );
    }

    const [comentario,setComentario] = useState("");
    const [valido,setValido] = useState(false);

    const limpiarForm = () =>{
        setNumeroDisco("");
        setComentario("");
        setValido(false);
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
                        <span>Colocar disco</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Registro en contingencia de la colocación de un disco asociado al <br/><span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span> por <span className={classes.burbuja}>{props.encargado}</span>
                        </span>
                    </Box>
                   </DialogTitle>
                
                <DialogContent>
                   
                <div>
                <Hidden only="xs">
                    <Box display="flex" flexDirection="row" justifyContent="left">
                    <Box>
                        <img
                        alt=""
                        src="/PAW/assets/images/colocadoIcon.svg"
                        style={{ height: 40, width: 40, marginRight: 10, marginTop: 5}}
                        />
                    </Box>
                    <TextField
                            id="numero"
                            inputProps={{style: {fontSize: 'large', fontWeight: 900,  textTransform: 'uppercase'}}} 
                            variant= "outlined"
                            type="text"
                            fullWidth
                            label="Número"
                            value={numeroDisco}
                            onChange={(e)=>validarNumero(e.target.value)}
                        />  
                    </Box>
                </Hidden>
                <Hidden smUp>
                <TextField
                            id="numero"
                            inputProps={{style: {fontSize: 'large', fontWeight: 900,  textTransform: 'uppercase'}}} 
                            variant= "outlined"
                            type="text"
                            fullWidth
                            label="Número"
                            value={numeroDisco}
                            onChange={(e)=>validarNumero(e.target.value)}
                        />  
                </Hidden>
                </div>
                       
                        <div style={{marginTop: 20}}>
                            <RazonesContingencia  setRazon={setComentario}/>
                        </div>
                       
                </DialogContent>
              
                <DialogActions>
                    <Button 
                        onClick={cerrar} 
                        color="default" >
                        Cerrar
                    </Button>
                    <Button
                        onClick={()=>submit()}
                        variant="contained"
                        color="default"
                        startIcon={<DoneOutlineOutlinedIcon />}
                        disabled={!valido}>
                        Colocar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Colocar;