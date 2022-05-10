import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogTitle,
        Dialog,
        TextField,
        Hidden,
        Box,
        MenuItem,
        makeStyles
}from '@material-ui/core';
import {Alert, AlertTitle} from '@material-ui/lab';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import JefesDeTrabajoSelect from '../../inputs/jefesDeTrabajoSelect';

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

const Extraviado = (props) => {
    
    const classes = useStyles();
    const [state] = React.useContext(AppContext);
    const [jefeDeTrabajosCI, setSelectedJT_ci] = React.useState("");

    const [numeroDisco,setNumeroDisco] = React.useState("");
    const validarNumero = (valor) => {
        setNumeroDisco(valor.toUpperCase());
        setValido(valor.length>0 && valor.length<8 && valor.match(/^[0-9a-zA-Z]+$/) );
    }


    const [valido,setValido] = React.useState(false);

    const [sustituirJT, setSustituirJT] = React.useState(false);

    const submitSustituirJT  = () =>{
            const body = {
                changeby: state.ci,
                sustituirjt: 1,
                jefetrabajo: jefeDeTrabajosCI,
                np_statusmemo: "Contingencia: Sustitucion automatica de jefe de trabajo por extravío de disco.",
                action: 'Change'
            }
            serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
            .then(response => {
                submit(false);
            } )
            .catch(error =>alert("No se pudo sustituir el jefe de trabajos.\nActualice la lista de discos y compruebe que el disco se encuentre colocado."));
        }
    
    
    const submit = (sustituirJTS) =>{
    
    if (sustituirJTS)
        submitSustituirJT()
    else{
       const body = {
            changeby: state.ci,
            extraviado: 1,
            nrodisco: numeroDisco,
            np_statusmemo: "Contingencia: Disco " + props.numeroDT + " sustituido por " + numeroDisco,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo sustituir."));
        limpiarForm();
        props.close();
    }
    }



    const limpiarForm = () =>{
        setNumeroDisco("");
        setSustituirJT(false);
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
                        <span> Sustituir disco</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Registro en contingencia de sustitución por extravío del <span className={classes.burbuja}> Disco {props.numeroDT}</span>
                        </span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                   
                    <TextField
                        style={{width: "100%"}}
                        value={sustituirJT}
                        onChange={e=>setSustituirJT(e.target.value)}
                        variant="outlined"
                        label="Acción"
                        select
                        >
                        <MenuItem value={false}>Sustituir disco en nombre de {props.encargado}</MenuItem>
                        <MenuItem value={true}>Sustituir disco en nombre de otro jefe de trabajos.</MenuItem>
                    </TextField>

                    <div style={{marginTop: 20}}>
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

               
                   {sustituirJT && 
                        <div style={{marginTop: 20}}>
                            <JefesDeTrabajoSelect 
                                close={cerrar}
                                setSelectedJT_ci={setSelectedJT_ci}
                                unidad={props.unidad}
                            />
                        </div>
                    }

                {sustituirJT && 
                        <Alert severity="info" style={{marginTop: 20}}>
                            <AlertTitle>Información:</AlertTitle>
                            Primero se realizará la sustitución del jefe de trabajos y luego de la sustitución del disco.
                        </Alert>
                    }
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cerrar} 
                        color="default" >
                        Cerrar
                    </Button>
                    <Button
                        onClick={()=>submit(sustituirJT)}
                        variant="outlined"
                        color="default"
                        startIcon={<SwapVertOutlinedIcon />}
                        disabled={!valido || (valido && sustituirJT && !jefeDeTrabajosCI)}>
                        Sustituir
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Extraviado;