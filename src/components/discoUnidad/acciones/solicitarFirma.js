import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogTitle,
        Dialog,
        Box,
        makeStyles
}from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import JefesDeTrabajosSelect from '../../inputs/jefesDeTrabajoSelect';

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


    
const SolicitarFirma = (props) => {

    const classes = useStyles();
    const [state] = React.useContext(AppContext);
    const [jefeDeTrabajosCI, setSelectedJT_ci] = React.useState("");
   

    const submit = () =>{
        var body = {
            status: props.sePuedeSolicitarFirma? 'FIRM_SOL': 'FIRMPLA',
            changeby: state.ci,
            statusiface: false,
            np_statusmemo: "",
            jefetrabajo: jefeDeTrabajosCI,
            action: 'Change'
        }
        serviciosGEMA_update.post('/utd_nardisdisco/'+props.idDU+'?lean=1',body)
        .then(response =>  props.setRenderList(true))
        .catch(error =>alert("No se pudo solicitar la firma del disco.\nActualice la lista de discos y compruebe el estado del disco."));
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
                    Solicitar firma
                    <Box display="flex" flexDirection="column">
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Solicitar a un jefe de trabajos la firma del <span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span>
                        </span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                <JefesDeTrabajosSelect
                        close={props.close}
                        setSelectedJT_ci={setSelectedJT_ci}
                        unidad={props.unidad}
                />   
                </DialogContent>
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
                        disabled={!jefeDeTrabajosCI }
                        startIcon={<EditOutlinedIcon />}>
                        Solicitar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default SolicitarFirma;