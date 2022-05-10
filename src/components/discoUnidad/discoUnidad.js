import React from 'react';
import DiscoUnidadHeader from './discoUnidadHeader';
import { makeStyles } from '@material-ui/core/styles';
import DiscoTrabajo from '../discoTrabajo/discoTrabajo';
import { Box, Hidden, Fab } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ClearIcon from '@material-ui/icons/Clear';
import BookmarkBorderSharpIcon from '@material-ui/icons/BookmarkBorderSharp';
import { AppContext } from '../../appProvider';
import { ContactsOutlined } from '@material-ui/icons';
import dateFormat, { masks } from "dateformat";



const DiscoUnidad = (props) => {

  
    //ver/ocultar discos finalizados
    //si estoy en la lista de todos no los muestro
    const [verFinalizados, setVerFinalizados] = React.useState(!props.todos);
    const [state, setState] = React.useContext(AppContext);
    const [mostrarControles, setMostrarControles] = React.useState(props.soloActivos);

    const [ocultarFinalizadosVertical, setOcultarFinalizadosVertical] = React.useState(props.soloActivos);


    const useStyles = makeStyles(theme => ({
        root: {
            position: 'relative',
        },
        rootResltado: {
            position: 'relative',
            backgroundColor: '#0678f40f',
            borderStyle: 'solid',
            borderColor: 'gray',
            borderWidth: 2,
            borderColor: "#92979c33",
            borderRadius: 10,
            paddingTop: 20,
            paddingBottom: 20
        },
        ultimo: {
            padding: 7,
            paddingRight: 10,
            fontWeight: 500,
            backgroundColor: "#92979c33",
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            width: 'fit-content'

        }
    }));

    const classes = useStyles();
    const sePuedeSolicitarFirma = () => {
        if (props.estado === "finalizado" || props.estado === "retirado") return false;
        for (var dtidx in props.discosTrabajos) {
            var estado = props.discosTrabajos[dtidx].estado;
            if (estado !== "finalizado" && estado !== "desasignado") return false;
        }
        return true;
    }


    var resaltarPorFechaBusqueda = false;

    if (state.fechaResaltadaDesde && state.fechaResaltadaHasta){
      let desde = dateFormat(new Date(parseInt(state.fechaResaltadaDesde)),"isoUtcDateTime");
      let hasta = dateFormat(new Date(parseInt(state.fechaResaltadaHasta)),"isoUtcDateTime");
      resaltarPorFechaBusqueda = !(desde <= props.fecha && hasta >= props.fecha);
    }
   

    const sePuedeEliminar = () =>
        props.discosTrabajos.length === 0 &&
        !props.firmaSolicitada
        && !props.firmaPlanificada
        && props.estado !== "finalizado"
        && props.estado !== "retirado";

    const finalizado = props.estado === "finalizado" || props.estado === "retirado";

    const vistaHorizontal = state.vistaHorizontal;

    let mostrarFinalizados = false; 
    
    const discoDeTrabajo = (dt) => {

        const resaltarBusqueda = 
            (
                state.numeroDiscoResaltado &&
                dt.numero &&  
                state.numeroDiscoResaltado.toUpperCase()===dt.numero.toUpperCase() 
            );

        const resalatdoFiltro = 
            props.resaltadoFiltro !=="" && 
                (
                    dt.numero.toLowerCase().includes(props.resaltadoFiltro) ||
                    dt.nombre.toLowerCase().includes(props.resaltadoFiltro) ||
                (
                    dt.nominado &&  dt.ubicacion.toLowerCase().includes(props.resaltadoFiltro) 
                )
            );

        const resaltarNumero = resaltarBusqueda || resalatdoFiltro;

        if (resaltarNumero) 
            mostrarFinalizados = true;

        const parametrosDT = (dt) => ({
            ...dt,
            idDU: props.id,
            key: dt.id,
            fecha: dt.fecha,
            numeroDU: props.numero,
            soloActivos: props.soloActivos,
            accionesDT: props.accionesDT,
            nominado: props.nominado,
            incidencia: props.incidencia,
            tipo: dt.estado,
            resaltadoFiltro: props.resaltadoFiltro,
            resaltarNumero: resaltarNumero
        })
        return <DiscoTrabajo {...parametrosDT(dt)} />
    }


    

    const header = (vistaCelular) => (props.nominado)
        ? !vistaHorizontal
            ?
            <DiscoUnidadHeader
                {...props}
                vistaCelular={vistaCelular}
                idDU={props.id}
                nominado
            />
            : null
        : <DiscoUnidadHeader
            {...props}
            vistaCelular={vistaCelular}
            resaltarPorFechaBusqueda={resaltarPorFechaBusqueda}
            setVerFinalizados={setVerFinalizados}
            cantidadDiscos={props.discosTrabajos.length}
            finalizado={finalizado}
            sePuedeSolicitarFirma={sePuedeSolicitarFirma()}
            idDU={props.id}
            sePuedeEliminar={sePuedeEliminar()}
            resaltadoFiltro={props.resaltadoFiltro}
        />;

    const discosDeTrabajo =
        props.discosTrabajos.map(dt => !(vistaHorizontal && !verFinalizados && dt.estado === "finalizado" && finalizado) && discoDeTrabajo(dt))


    const discosDeTrabajoNoFinalizados =
        props.discosTrabajos.map(dt => !(dt.estado === "finalizado" || dt.estado === "retirado") && discoDeTrabajo(dt))


    const discosDeTrabajoFinalizados =
        props.discosTrabajos.map(dt =>!(dt.estado !== "finalizado" && dt.estado !== "retirado") && discoDeTrabajo(dt))

    const cantidadDiscosFirmados =
        props.discosTrabajos.filter(e => (e.estado === "finalizado" || e.estado === "retirado") ? e : null).length;

    return (
        <Box display="flex" flexDirection="column" className={props.id === state.idDU_UltimaAccion ? classes.rootResltado : classes.root}>

            {(props.id === state.idDU_UltimaAccion) &&
                <Box display="flex" flexDirection="row" alignItems="center" className={classes.ultimo}>
                    <BookmarkBorderSharpIcon style={{ width: 20, height: 20, marginRight: 5 }} />
                    <span>Última acción</span>
                </Box>
            }

            {/*Celular*/}
            <Hidden smUp>
                {header(true)}
                <Box display="flex" flexWrap="wrap">
                    {discosDeTrabajo}
                </Box>
            </Hidden>

            {/*PC*/}
            <Hidden xsDown>
                {vistaHorizontal
                    ? <div>
                        {header(false)}
                        <Box display="flex" flexWrap="wrap" style={!props.nominado ? { marginLeft: 85 } : {}}>
                            {discosDeTrabajoNoFinalizados}
                            {!props.verFinalizados && discosDeTrabajoFinalizados}
                        </Box>
                    </div>
                    : <div>
                        <Box display="flex" flexWrap="noWrap" flexDirection="row" alignItems="top" style={!props.nominado ? { marginLeft: 0, } : {}}>
                            <div style={{ maxWidth: 300, minWidth: 300, marginTop: 0 }}> {header(false)}</div>
                            <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center">
                                {discosDeTrabajoNoFinalizados}
                                {(!ocultarFinalizadosVertical || mostrarFinalizados) && discosDeTrabajoFinalizados}
                                {!mostrarFinalizados && mostrarControles && (cantidadDiscosFirmados > 0) &&
                                    <Fab color="secondary" style={{ marginLeft: 20, marginTop: 20 }} color="default" onClick={() => setOcultarFinalizadosVertical(!ocultarFinalizadosVertical)}>
                                        { !ocultarFinalizadosVertical ? <ClearIcon /> : <ChevronRightIcon />}
                                    </Fab>
                                }
                            </Box>
                        </Box>
                    </div>
                }
            </Hidden>
        </Box>);
}

export default DiscoUnidad;