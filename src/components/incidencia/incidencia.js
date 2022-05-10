import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IncidenciaHeader from './incidenciaHeader';
import DiscoUnidad from '../discoUnidad/discoUnidad';
import { AppContext } from '../../appProvider';
import { Paper, Typography, Button, Box, Hidden } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    marginTop: 10,
    marginBottom: 30,
    clear: "both",
    backgroundColor: '#e0e0e036',
    borderRadius: 10,
    paddingBottom: 5
  },
  simple_root: {
    position: "relative",
    clear: "both",
    border: 0,
    marginTop: 10,
  },
  divider: {
    backgroundColor: '#31abe226',
    height: '2px',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(4)
  },
  contenedor: {
    padding: theme.spacing(2),
    paddingLeft: 0,
    margin: theme.spacing(2),
    border: 0,
  },
  simple_contenedor: {
    padding: theme.spacing(2),
       paddingLeft: 0,
    marginBottom: theme.spacing(2),
    border: 0,
  },
  contenedorNominado: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginTop: 5,
    paddingTop: theme.spacing(0),
    border: 0,
  },
  simple_contenedorNominado: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
    marginLeft: theme.spacing(0),
    paddingTop: 5,
    border: 0,
  },
  filtros: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(3),
    display: 'flex'
  },
  solicitudSelector: {
    width: "180px",
    marginLeft: "10px",
    textTransform: "none"
  },
  solicitudSelectorPC: {
    marginLeft: "10px",
    textTransform: "none"
  },
  solicitudNumero: {
    marginLeft: "10px",
  }
}));



const Incidencia = (props) => {
  const classes = useStyles();

  const [verTodo, setVerTodo] = React.useState(true);
  const toogleVerTodo = () => setVerTodo(!verTodo);

  const [state] = React.useContext(AppContext);
  const vistaCompacta = state.vistaCompacta;

  const styleContenedor = props.vista_consultaDU || props.vista_consultaIncidencia || props.vista_consultaNominado
    ? classes.simple_root
    : classes.root;

  const stylePaper = props.vista_consultaDU || props.vista_consultaIncidencia || props.vista_consultaNominado
    ? classes.simple_contenedor
    : classes.contenedor;

  const stylePaperNominado = props.vista_consultaDU || props.vista_consultaIncidencia || props.vista_consultaNominado
    ? classes.simple_contenedorNominado
    : classes.contenedorNominado;

  //Obtengo la lista de solicitudes ordenadas y sin repetir
  var listaSolicitudes =
    props.discosUnidad
      .concat(props.discosNominados)
      .map(e => e.solicitud)
      .filter(sol => sol !== "0");

  listaSolicitudes = [... new Set(listaSolicitudes)];


  //filtrar por solicitudes
  const [solicitudSeleccionada, setSolicitudSeleccionada] = React.useState(0);

  const discosUnidad = (solicitudSeleccionada==0) 
    ? props.discosUnidad 
    : props.discosUnidad.filter(e => e.solicitud == solicitudSeleccionada);

  const discosNominados = (solicitudSeleccionada==0)  
    ? props.discosNominados
    : props.discosNominados.filter(e => e.solicitud == solicitudSeleccionada);


  const contenido = (vistaCelular) => {
    return (
      <div className={styleContenedor} style={vistaCelular ? {border: '1px solid #86868661'} : {}}>

      { !props.vista_consultaDU && !props.vista_consultaNominado ?
        <IncidenciaHeader
          incidencia={props.incidencia}
          fecha={props.fecha}
          descIncidencia={props.descIncidencia}
          clic={toogleVerTodo}
          verTodo={verTodo}
          vista_consultaIncidencia={props.vista_consultaIncidencia}
        />
        : null}


      <div>
        <Typography variant="h6" color="initial" style={{marginLeft:"10px", paddingTop: "10px"}} >
        
        {/* PC */}
        <Hidden only="xs">
          <Box display="flex" flexWrap="wrap" alignItems="center" style={{marginBottom: "10px"}}>
            {listaSolicitudes.map(e =>
              <Button
                className = {classes.solicitudSelectorPC}
                variant= {solicitudSeleccionada == e ? "contained" : "outlined"}
                style={{marginTop: "5px"}}
                color="default"
                onClick= {solicitudSeleccionada == e ? ()=>setSolicitudSeleccionada(0): ()=>setSolicitudSeleccionada(e)}
                endIcon= {solicitudSeleccionada == e ? <CloseIcon/>: null}>
                 {("Solicitud " + e ) + (props.solicitudesGEMA[e] ? " |" : "")} <b className={classes.solicitudNumero}>{props.solicitudesGEMA[e]}</b> 
              </Button>
            )}
          </Box>
        </Hidden>

        {/* CELULAR */}
        <Hidden smUp>
          <Box display="flex" flexDirection="column" alignItems="center" style={{marginBottom: "10px"}}> 
            {listaSolicitudes.map(e =>
              <Button
                className = {classes.solicitudSelector}
                variant= {solicitudSeleccionada == e ? "contained" : "outlined"}
                style={{margin: "5px", width: "90%"}}
                color="default"
                onClick= {solicitudSeleccionada == e ? ()=>setSolicitudSeleccionada(0): ()=>setSolicitudSeleccionada(e)}
                endIcon= {solicitudSeleccionada == e ? <CloseIcon/>: null}>
                {("Solicitud " + e ) + (props.solicitudesGEMA[e] ? " |" : "")} <b className={classes.solicitudNumero}>{props.solicitudesGEMA[e]}</b> 
              </Button>
            )}
          </Box>
        </Hidden>
          
        </Typography>
        {(verTodo)
          ? discosUnidad.map(du => {
            return (<Paper
              elevation={0} key={du.id}
              className={stylePaper}
              style={{ borderRadius: 10,backgroundColor: 'transparent' }} variant="outlined">
              <DiscoUnidad
                {...du}
                incidencia={props.incidencia}
                accionesDU={props.accionesDU}
                accionesDT={props.accionesDT}
                soloActivos={props.soloActivos}
                todos={props.todos}
                resaltadoFiltro={props.resaltadoFiltro}
              />
            </Paper>)
          })
          : null
        }

        {((!vistaCompacta || !props.soloActivos) && (discosNominados.length > 0) && verTodo)
          ? <Paper  elevation={0} key="nom" className={stylePaperNominado} 
                    style={{ borderRadius: 10,backgroundColor: 'transparent' }} variant="outlined"
            >
            <DiscoUnidad
              id={props.incidencia}
              vista_consultaNominado={props.vista_consultaNominado}
              discosTrabajos={discosNominados}
              incidencia={props.incidencia}
              accionesDT={props.accionesDT}
              soloActivos={props.soloActivos}
              resaltadoFiltro={props.resaltadoFiltro}
              nominado />
          </Paper>
          : null
        }
      </div>
      </div>

    )
  }

  return (
    <div>
      {/* PC */}
      <Hidden only="xs">{contenido(false)}</Hidden>

      {/* CELULAR */}
      <Hidden smUp>{contenido(true)}</Hidden>
    </div> 
  );
}

export default Incidencia;