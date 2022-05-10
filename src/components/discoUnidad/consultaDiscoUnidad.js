import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import unidades from '../../datos/unidades.json';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import { AppContext } from '../../appProvider';
import {obtenerNombrePersona, formatearNombre, formatDate} from '../../utils/utils';
import SendToMobileOutlinedIcon from '@mui/icons-material/SendToMobileOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HelpIcon from '@mui/icons-material/Help';

import { serviciosGEMA } from '../../servicios/servicios';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
    SwipeableDrawer, 
    Tooltip
} from '@material-ui/core';


const BlackTooltip = withStyles({
    tooltip: {
      color: "white",
      backgroundColor: "black",
      fontSize: 16
    }
  })(Tooltip);


const useStyles = makeStyles((theme) => ({

    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    table: {
        padding: theme.spacing(4),
        paddingTop: 0,
        marginTop: theme.spacing(2)
    },
    actions: {
        marginTop: 10,
        marginLeft: 10
    },
    cell100: {
        width: 100,
        maxWidth: 100,
    },
    cell300: {
        width: 300,
        maxWidth: 300,
    },
    boxEstado: {
        margin: 20, 
        marginBottom: 0, 
        padding: 10, 
        borderRadius: 10,
        backgroundColor: "#cebcbc2b"
    },
    boxEstadoOpen: {
        margin: 20,
        marginBottom: 0,
        padding: 10,
        backgroundColor: "#706d6d24",
        borderLeft: "3px solid #767676",
        "&:hover": {cursor: 'pointer'}
    },
    unidad: {
        backgroundColor: "#ededed",
        padding: 2,
        borderRadius: 5,
        fontWeight: 500
    },
    footerAcciones: {
        [theme.breakpoints.up('lg')]: {
            marginLeft: 56,
        },
        marginLeft: 16,
        paddingBottom: 25
    },
    consultaDisco: {
        width: 400,
        marginLeft: 50
    },
    discoSustituidoBox: {
        backgroundColor: "white", 
        padding: 5, 
        borderRadius: 10, 
        width: 80, 
        borderWidth: 1,
        borderColor: "#6a6868",
        borderStyle: "solid"
    },
}));


var comentarioColocacionSIO = "";

export default function ConsultaDiscoUnidad(props) {

    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);


    var unidad = unidades.filter(u => u.id == props.unidad);
    unidad = unidad && unidad.length > 0
        ? unidad[0].desc
        : "unidad destinataria";


    const crearHistorico = (historico, jefeDeTrabajosActual) => {

        var datos = [];
        var estadoAnterior = "";

        historico.map(e => {
            var row = {};
            row.rowId = e._rowstamp;

            //usuario (registrado por)
            row.usuario = obtenerNombrePersona(e.changeby, e.person, true);

            //comentario
            row.comentario = e.memo;

            //estado - mostrar jefe de trabajos
            var estado = e.status;
            row.mostrarJefeDeTrabajos = (estado === "FIRMPLA") || (estado === "FIRM_SOL") || (estado === "FIRMADO");

            if (estado === "COLOCADO") estado = "Colocado en SIO";
            if (estado === "ENVIADO") estado = "Disponible en PAW";
            if (estado === "FIRMPLA") estado = "Planificación de firma";
            if (estado === "FIRM_SOL") estado = "Solicitud de firma";
            if (estado === "RETIRADO") estado = "Retirado en SIO";
            if (estado === "EXTRAVIADO") estado = "Sustituido por extravío";
            if (estado === "FIRMADO") estado = "Firmado";
            estadoAnterior = estado;

            row.estado = estado;



            //jefe de trabajos
            row.jefeDeTrabajos = obtenerNombrePersona(e.jefetrabajo, e.person, true);

            //fecha
            var fecha = formatDate(e.changedate)
            row.fecha = fecha.d + " " + fecha.m + " " + fecha.y + "   " + fecha.hh + ":" + (fecha.mm < 10 ? '0' : '') + fecha.mm;

            //contingencia
            row.accionEncontingencia = row.comentario.startsWith("Contingencia: ");
            row.discoSustituido = row.estado === "Sustituido por extravío";

            datos.push(row);
        });

        datos.sort((a, b) => (a.rowId > b.rowId) ? 1 : ((a.rowId < b.rowId) ? -1 : 0));

        //recorro los datos y le asigno a cada registro el JT siguiente
        for (var i = 0; i < datos.length - 1; i++)
            datos[i].jefeDeTrabajos = (datos[i].estado === "Disponible en PAW" || datos[i].estado === "Colocado en SIO" || datos[i].estado === "Retirado en SIO")
                ? "---"
                : datos[i + 1].jefeDeTrabajos;


        //el último JT es el actual
        var estado = datos[datos.length - 1].estado;
        datos[datos.length - 1].jefeDeTrabajos =
            ((estado === "Solicitud de firma") || (estado === "Planificación de firma") || (estado === "Firmado"))
                ? formatearNombre(jefeDeTrabajosActual)
                : "---";

        //descripciones segun estado
        var estadoAnterior = null;

        datos.map(e => {
            if (!estadoAnterior)
                e.desc = "Disco ingresado en SIO"
            else if (estadoAnterior === "Colocado en SIO") {
                e.desc = "Disco enviado a unidad destinataria";
                comentarioColocacionSIO = e.comentario;
            }
            else if (e.estado === "Firmado")
                e.desc = "Disco firmado"
            else if (e.estado === "Retirado")
                e.desc = "Disco retirado en SIO"
            else if (estadoAnterior === "Planificación de firma" && e.estado === "Disponible en PAW")
                e.desc = "Desasignación de persona para firmar el disco"
            else if (estadoAnterior === "Disponible en PAW" && e.estado === "Planificación de firma")
                e.desc = "Designación de persona para firmar el disco"
            else if (estadoAnterior === "Disponible en PAW" && e.estado === "Solicitud de firma")
                e.desc = "Designación de persona para firmar el disco"
            else if (estadoAnterior === "Planificación de firma" && e.estado === "Solicitud de firma")
                e.desc = "Automático: discos nominados asociados firmados"
            else if (estadoAnterior === "Solicitud de firma" && e.estado === "Planificación de firma")
                if (e.comentario === "Cambio automático. Nueva Asignacion de jefe de trabajo.")
                    e.desc = "Automático: nueva asigación de jefe de trabajo"
                else
                    e.desc = "Cancelación de solicitud de firma"
            else if (e.estado === "Retirado en SIO")
                e.desc = "Disco retirado en SIO"
            else if (estadoAnterior === "Solicitud de firma" && e.estado === "Disponible en PAW")
                e.desc = "Cancelación de solicitud de firma"
            else if (e.estado==="Sustituido por extravío")
                e.desc="Se coloca un nuevo disco"
            estadoAnterior = e.estado;

        })
        return datos
    };


    var datos = [];
    React.useEffect(() => {
        if (props.open) {
            setLoading(true);
            serviciosGEMA.get('/utd_nardisdisco/' + props.idDU + '/utd_hstatusnardisdisco?lean=1&oslc.select=*&_dropnulls=0')
                .then(response => {
                    datos = crearHistorico(response.data.member, props.jefeDeTrabajosActual);
                    setRows(datos);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    console.log("Error cargar las actividades del disco a unidad")
                })
        }
    }, [props.open])

    //ocultar/mostrar contenido en vista celular
    const [showMoreContent, setshowMoreContent] = React.useState({});

    //perfil
    const [state,] = React.useContext(AppContext);

    const CONFIG = window.data;
 
    const panel = (
        <div style={{maxWidth: 400}}>
              <AppBar className={classes.appBar} color="transparent" elevation={0}>
                        <Toolbar style={{ minHeight: 90 }}>
                            <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close" style={{ marginRight: 10 }}>
                                <CloseIcon />
                            </IconButton>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <img
                                    style={{ height: 50 }}
                                    alt=""
                                    src={(!props.finalizado)
                                        ? "/PAW/assets/images/unidadIcon.svg"
                                        : "/PAW/assets/images/unidadGrisIcon.svg"}
                                />
                                <Box display="flex" flexDirection="column" className={classes.title}>
                                    <Typography variant="h6">
                                        {props.numero}
                                    </Typography>
                                    <span className={classes.unidad}>{unidad}</span>
                                </Box>
                            </Box>

                        </Toolbar>
                    </AppBar>
          
                    <Box display="flex" flexDirection="column" style={{ margin: 20, marginBottom: 0, marginTop: 5, padding: 10 }}>
                            <Typography variant="body1">
                                {props.ubicacion}
                            </Typography>
                          {
                                !state.operadorCMD &&
                                <Box display="flex" flexDirection="row" alignItems="left" style={{marginTop: 5}} >
                                <a  href={CONFIG.localizar_GOOGLE(props.latitud,props.longitud)} 
                                    target="_blank" 
                                    style={{ textDecoration: 'none' }}>
                                    <Button  variant='contained' color="secondary" endIcon={<LaunchOutlinedIcon />}>
                                        Google Maps
                                    </Button>
                                </a>
                                <a  href={CONFIG.localizar_EGEO(props.latitud,props.longitud)} 
                                    target="_blank" 
                                    style={{ textDecoration: 'none' }}>
                                    <Button  variant='contained' color="secondary" endIcon={<LaunchOutlinedIcon />} style={{ marginLeft: 10 }}>
                                        EGEO WEB
                                    </Button>

                                </a>
                                
                            </Box> 
                          }
                           

                        </Box>
           
         
                {!loading ?

                    rows.map((row) => (
                        <Box display="flex" flexDirection="column" className={classes.boxEstado}>
                            <Box display="flex" flexDirection="row" justifyContent="space-between"  style={{ marginBottom: 15 }} flex="1">
                                   
                                   
                                   <Typography variant="body1" style={{width: 190}}>
                                    <BlackTooltip title={row.desc} placement="left">
                                        <span >
                                            
                                                <b >{row.estado} </b> 
                                                <HelpIcon style={{width: 17, margin: 1, color:"gray", verticalAlign: "bottom"}} />
                                            
                                        </span>
                                    </BlackTooltip>    <br/>
                                   {"por " + row.usuario}
                                    </Typography>
                                    

                                   <Typography variant="body1" align="right">
                                           {row.fecha}<br/>
                                           {row.accionEncontingencia && 
                                              <Box display="flex" flexDirection="row"justifyContent="center"  style={{backgroundColor: "#d5d5d5", padding: 3, borderRadius: 5}}>
                                                   <span style={{fontWeight: 500}}>{(row.comentario.slice(14)==="Otros" || row.comentario.slice(14)==="") ? "Contingencia" : row.comentario.slice(14)}</span>
                                                   <SecurityOutlinedIcon style={{width: 17, marginLeft: 5}}/>                                               
                                               </Box>
                                           }
                                   </Typography>
                                           
                               </Box>

                            {row.mostrarJefeDeTrabajos && 
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <PersonOutlinedIcon />
                                    <Typography variant="body1" style={{ marginLeft: 10 }}>
                                        <b>Encargado de firma:</b> <br /> {row.jefeDeTrabajos}
                                    </Typography>
                                </Box>
                            }


                            {row.discoSustituido &&
                                <Box display="flex" flexDirection="row" justifyContent="space-evenly">
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        <Typography variant="body1" style={{ borderStyle: "dashed" }} align ="center" className={classes.discoSustituidoBox}>
                                            <b>Extraviado </b><br /> 
                                            {row.comentario.slice(14).split(", realizado")[0].split(" ")[1]} 
                                        </Typography>
                                    
                                        <ArrowForwardOutlinedIcon style={{ margin: 10 }}/>
                                        
                                        <Typography variant="body1" align ="center" className={classes.discoSustituidoBox} >
                                            <b>Nuevo </b><br />
                                            {row.comentario.slice(14).split(", realizado")[0].split(" ")[4]} 
                                        </Typography>
                                    </Box>
                                </Box>             
                                }

                        </Box>



                    ))
                    :
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <img alt="cargando-icon" src="/PAW/assets/images/loading.gif" width="60px" />
                        <Typography variant="subtitle1" color="initial">Cargando actividades</Typography>
                    </Box>
                }
                <Box style={{ marginBottom: 20, height: 20 }}> </Box>

            </div>
    )

    return ( 
        props.open &&
        <SwipeableDrawer
            anchor={'right'}
            open={props.open}
            onClose={props.handleClose}
            >
            {panel}
        </SwipeableDrawer>
    )
}
