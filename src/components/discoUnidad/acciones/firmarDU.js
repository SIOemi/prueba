import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogTitle,
        Dialog,
        TextField,
        Box,
        makeStyles,
        MenuItem
}from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import JefesDeTrabajosSelect from '../../inputs/jefesDeTrabajoSelect';
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


const FirmarDU = (props) => {
    
    const classes = useStyles();
    const [state] = React.useContext(AppContext);
    const [jefeDeTrabajosCI, setSelectedJT_ci] = React.useState(null);
    const [nuevoJefeTrabajos, setNuevoJefeTrabajos] = React.useState(false);

    React.useEffect(()=>{
       limpiarForm();
    },[])

  
    const submit = () =>{
        var comentario_ = (!comentario || comentario === "") ? "-" : comentario;

        const jefeDeTrabajos = (props.encargadoFirma && !nuevoJefeTrabajos) 
            ? props.encargadoFirmaCI
            : jefeDeTrabajosCI;

        var body = {
            status: 'FIRMADO',
            changeby: state.ci,
            statusiface: false,
            firmcont: 1,
            np_statusmemo: "Contingencia: " + comentario_,
            jefetrabajo: jefeDeTrabajos,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDU+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo firmar el disco.\nActualice la lista de discos y compruebe el estado del disco."));
        limpiarForm();
        props.close();
    }

    const [comentario,setComentario] = React.useState("");
    
    const limpiarForm = () =>{
        setComentario("");
        setSelectedJT_ci(null);
        setNuevoJefeTrabajos(false);
        return true;
    }


  
    const cerrar = () => {
        limpiarForm();
        props.close();
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
                            Registro en contingencia de la firma del <span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span>
                        </span>
                    </Box>
                </DialogTitle>
                <DialogContent>

                  {props.encargadoFirma && 
                   <TextField
                        style={{width: "100%"}}
                        value={nuevoJefeTrabajos}
                        onChange={e=>setNuevoJefeTrabajos(e.target.value)}
                        variant="outlined"
                        label="Acción"
                        select
                    >
                        <MenuItem value={false}>Firmar en nombre de {props.encargadoFirma}</MenuItem>
                        <MenuItem value={true}>Firmar en nombre de otro jefe de trabajos.</MenuItem>
                    </TextField> }
              
                    {props.encargadoFirma && <div style={{marginTop: 20}} />}
               

                    {(!props.encargadoFirma  || nuevoJefeTrabajos) &&
                        <JefesDeTrabajosSelect
                            close={cerrar}
                            setSelectedJT_ci={setSelectedJT_ci}
                            unidad={props.unidad}
                        /> 
                     }
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
                        disabled={  (!nuevoJefeTrabajos && !jefeDeTrabajosCI && !props.encargadoFirma) ||
                                    (props.encargadoFirma && nuevoJefeTrabajos && !jefeDeTrabajosCI) }
                        color="default"
                        startIcon={<EditOutlinedIcon />}>
                        Firmar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default FirmarDU;

