import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogTitle,
        Dialog,
        Box,
        makeStyles
}from '@material-ui/core';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import JefesDeTrabajoSelect from '../../inputs/jefesDeTrabajoSelect';
import RazonesContingencia from '../../inputs/razonesContingenia';

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



    
const Sustituir = (props) => {

    const classes = useStyles();
    const [state] = React.useContext(AppContext);
    const [jefeDeTrabajosCI, setSelectedJT_ci] = React.useState("");
    
  
    const submit = () =>{
        //var comentario_ = (!comentario || comentario === "") ? "-" : comentario;
        var body = {
            changeby: state.ci,
            sustituirjt: 1,
            jefetrabajo: jefeDeTrabajosCI,
            np_statusmemo: "Contingencia: " + comentario,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDT+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo sustituir el jefe de trabajos.\nActualice la lista de discos y compruebe que el disco se encuentre colocado."));
        limpiarForm();
        props.close();
    }

    const [comentario,setComentario] = React.useState("");

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
                        <span> Sustituir JT</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Registro en contingencia de sustitución del jefe de trabajos <span className={classes.burbuja}> {props.encargado}</span> en el <span className={classes.burbuja}>Disco {props.numeroDT}</span>
                        </span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <JefesDeTrabajoSelect 
                        close={cerrar}
                        setSelectedJT_ci={setSelectedJT_ci}
                        unidad={props.unidad}
                    />
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
                        disabled={!jefeDeTrabajosCI}
                        startIcon={<SwapVertOutlinedIcon />}>
                        Sustituir
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Sustituir;