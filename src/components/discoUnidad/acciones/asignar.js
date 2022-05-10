import React from 'react';

import Button from '@material-ui/core/Button';
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    Box,
    makeStyles
} from '@material-ui/core';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined';
import { serviciosGEMA } from '../../../servicios/servicios';
import { AppContext } from '../../../appProvider';
import JefesDeTrabajosSelect from '../../inputs/jefesDeTrabajoSelect';


const useStyles = makeStyles(theme => ({
    burbuja: {
        backgroundColor: '#80808029', 
        padding: 3, 
        borderRadius: 10,
        fontWeight: 400
    }
}))


const Asignar = (props) => {
    const classes = useStyles();
    const [state] = React.useContext(AppContext);
    const [jefeDeTrabajosCI, setSelectedJT_ci] = React.useState("");

    const submit = (planificar) => {
        if (jefeDeTrabajosCI !== "") {

            var body = {
                status: planificar ? 'PLANIFICADO' : 'COMUNICADO',
                tipo: 'DT',
                createby: state.ci,
                changeby: state.ci,
                unidad: parseInt(props.unidad),
                padre: props.idDU,
                incidencia: props.incidencia,
                solicitud: props.solicitud,
                jefetrabajo: jefeDeTrabajosCI,
            };
            serviciosGEMA.post('/utd_nardisdisco?lean=1', body)
                .then(response => props.setRenderList(true))
                .catch(error =>alert("No se pudo asignar el jefe de trabajos.\nActualice la lista de discos y compruebe el estado del disco."));
        }
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
                        <span>Asignar JT</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>
                            Asignación de jefe de trabajos al <span className={classes.burbuja}>Disco a Unidad {props.numeroDU}</span>
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
                        onClick={() => submit(true)}
                        variant="outlined"
                        color="default"
                        disabled={jefeDeTrabajosCI === ""}
                        startIcon={<GroupAddOutlinedIcon />}>
                        Asignar
                     </Button>
                    <Button
                        onClick={() => submit(false)}
                        variant="outlined"
                        color="default"
                        disabled={jefeDeTrabajosCI === ""}
                        startIcon={<PhoneAndroidOutlinedIcon />}>
                        Comunicar
                     </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default Asignar;