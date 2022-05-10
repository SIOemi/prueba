import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import unidades from '../../datos/unidades.json';
import { serviciosGEMA } from '../../servicios/servicios';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import { AppContext } from '../../appProvider';
import {obtenerNombrePersona, formatearNombre, formatDate} from '../../utils/utils';
import SendToMobileOutlinedIcon from '@mui/icons-material/SendToMobileOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import HelpIcon from '@mui/icons-material/Help';


import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Button,SwipeableDrawer, 
    Tooltip
} from '@material-ui/core';
import { SpaceContext } from 'antd/lib/space';



const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1)
    },
    unidad: {
        backgroundColor: "#ededed",
        padding: 2,
        borderRadius: 5,
        fontWeight: 500
    },
    discoSustituido: {
        backgroundColor: "#f7e5e5",
        margin: 20, 
        marginBottom: 0, 
        padding: 10, 
        borderRadius: 10,
    },
    table: {
        minWidth: 100,
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
    footerAcciones: {
        [theme.breakpoints.up('lg')]:{
            marginLeft: 56,
         },
         marginLeft: 16,
         paddingBottom: 25
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


const BlackTooltip = withStyles({
    tooltip: {
      color: "white",
      backgroundColor: "black",
      fontSize: 16
    }
  })(Tooltip);


const CONFIG = window.data;



const crearHistorico = (historico, jefeDeTrabajosActual, nominado) => {

    var datos = [];

    var estadoAnterior = null;

    historico.map(e => {
        var row = {};
        row.rowId = e._rowstamp;

        //usuario (registrado por)
        row.usuario = obtenerNombrePersona(e.changeby, e.person, true);
      
        row.comentario = e.memo;



        //estado
        var estado = e.status;

     
        if (estado === "PLANIFICADO") {
            estado = "Asignado";
            row.desc = "Asignación de jefe de trabajos"
        }

        if (estado === "COMUNICADO") {
            estado = "Comunicado";
            row.desc = (estadoAnterior===null)
                ? "Envio de disco a jefe de trabajos"
                : "Envio de disco a jefe de trabajos"//"Asignación y envio de discos a jefe de trabajos"
        }

        if ((estado === "SUSTITUIRJT") && (row.comentario==="Contingencia: Sustitucion automatica de jefe de trabajo por extravío de disco.")) {
            estado = "Sustitución de jefe de trabajos";
            row.desc = "Sustitucion automatica de jefe de trabajo por extravío de disco."
        }

        if ((estado === "SUSTITUIRJT") && (row.comentario!=="Contingencia: Sustitucion automatica de jefe de trabajo por extravío de disco.")) {
            estado = "Sustitución de jefe de trabajos";
            row.desc = "Sustitución de jefe de trabajos"
        }
        if (estado === "COLOCADO") {
            estado = "Colocado";
            row.desc = "Colocación de disco"
        }
        if (estado === "FIRMADO") {
            estado = "Firmado";
            row.desc = "Firma del disco"
        }
        if (estado === "RETIRADO") {
            estado = "Retirado en SIO";
            row.desc = "Retiro en SIO"
        }
        if (estado === "COLOCADO" && nominado) {
            estado = "Colocado en SIO";
            row.desc = "Colocación en SIO";

        }
        if (estado === "ENVIADO" && nominado) {
            estado = "Comunicado";
            row.desc = "Envío a JT desde SIO";
            comentarioColocacionSIO = row.comentario;
        }
        if (estado === "EXTRAVIADO") {
            estado = "Sustituido por extravío";
            row.desc = "Sustitución de disco por extravío";

        }
        row.estado = estado;

        
        //contingencia
        row.accionEncontingencia = row.comentario.startsWith("Contingencia: ") && (row.comentario.slice(14) !== "Sustituido por extravío") && ( estado !== "Sustituido por extravío") && (row.comentario!=="Contingencia: Sustitucion automatica de jefe de trabajo por extravío de disco.");
        row.discoSustituido = row.estado === "Sustituido por extravío";

        //jefe de trabajos
        row.jefeDeTrabajos = obtenerNombrePersona(e.jefetrabajo, e.person, true);

        //fecha
        var fecha = formatDate(e.changedate)
        row.fecha = fecha.d + " " + fecha.m + " " + fecha.y + "   " + fecha.hh + ":" + (fecha.mm < 10 ? '0' : '') + fecha.mm;


        estadoAnterior = estado;
        datos.push(row);
    });

   
    datos.sort((a, b) => (a.rowId > b.rowId) ? 1 : ((a.rowId < b.rowId) ? -1 : 0));

    //recorro los datos y le asigno a cada registro el JT siguiente
    for (var i = 0; i < datos.length - 1; i++)
        datos[i].jefeDeTrabajos = datos[i + 1].jefeDeTrabajos

    //el último JT es el actual
    datos[datos.length - 1].jefeDeTrabajos = formatearNombre(jefeDeTrabajosActual);

   
    return datos
};


var comentarioColocacionSIO = "";

export default function ConsultaDiscoTrabajo(props) {

    //perfil
    const [state,] = React.useContext(AppContext);

    var unidad = unidades.filter(u => u.id == props.unidad);
    unidad = unidad && unidad.length > 0
        ? unidad[0].desc
        : "unidad destinataria";

    const classes = useStyles();
    const [rows, setRows] = React.useState([]);




    const [loading, setLoading] = React.useState(true);
    
    var datos = [];

    React.useEffect(() => {
        if (props.open) {
            setLoading(true);
            serviciosGEMA.get('/utd_nardisdisco/' + props.idDT + '/utd_hstatusnardisdisco?lean=1&oslc.select=*&_dropnulls=0')
                .then(response => {
                    datos = crearHistorico(response.data.member, props.jefeDeTrabajosActual, props.nominado);
                    setRows(datos);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    console.log("Error cargar las actividades del disco de Trabajos")
                })
        }
    }, [props.open])


    //ocultar/mostrar contenido en vista celular
    const [showMoreContent, setshowMoreContent] = React.useState({});


        
    const panel = (
        <div style={{maxWidth: 400}}>
                <AppBar className={classes.appBar} color="transparent" elevation={0}>
                    <Toolbar style={{ minHeight: 90 }}>
                        <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close" style={{marginRight: 10}}>
                            <CloseIcon/>
                        </IconButton>

                        <Box display="flex" flexDirection="row" alignItems="center">
                            <img style={{ height: 50 }} alt="" src={(props.tipo) ? "/PAW/assets/images/" + props.tipo + 'Icon.svg' : null}/>

                            <Box display="flex" flexDirection="column" className={classes.title}>
                                <Typography variant="h6">
                                    {props.tipo === "planificado"
                                        ? "Planificado"
                                        : props.tipo === "comunicado"
                                            ? "Comunicado"
                                            : props.disco
                                    }
                                </Typography>
                                <span className={classes.unidad}>{unidad}</span>
                            </Box>
                        </Box>



                    </Toolbar>
                </AppBar>


              
                {props.disco && props.nominado &&
                    <Box display="flex" flexDirection="column" style={{ margin: 20, marginBottom: 0, marginTop: 5, padding: 10 }}>
                    <Typography variant="body1">
                        {props.ubicacion}
                    </Typography>
                   
                    {
                       !state.operadorCMD &&
                              
                    <Box display="flex" flexDirection="row" alignItems="left" style={{marginTop: 5}} >
                        <a href={CONFIG.localizar_GOOGLE(props.latitud,props.longitud)} target="_blank" style={{ textDecoration: 'none' }}>
                            <Button  variant='contained' color="secondary" endIcon={<LaunchOutlinedIcon />}>
                                Google Maps
                            </Button>
                        </a>
                        <a  href={CONFIG.localizar_EGEO(props.latitud,props.longitud)} target="_blank" style={{ textDecoration: 'none' }}>
                            <Button  variant='contained' color="secondary" endIcon={<LaunchOutlinedIcon />} style={{ marginLeft: 10 }}>
                                EGEO WEB
                            </Button>
                        </a>
                    </Box> 
                    }

                    </Box>
                }


                    {!loading ?

                        rows.map((row) => (
                            <Box display="flex" flexDirection="column" className={classes.boxEstado}>

                                <Box display="flex" flexDirection="row" justifyContent="space-between"  style={{ marginBottom: 15 }} flex="1">
                                   
                                    <Typography variant="body1" style={{width: 160}}>
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
                                               <Box display="flex" flexDirection="row" justifyContent="center" style={{backgroundColor: "#d5d5d5", padding: 3, borderRadius: 5}}>
                                                    <span style={{fontWeight: 500}}>{(row.comentario.slice(14)==="Otros" || row.comentario.slice(14)==="") ? "Contingencia" : row.comentario.slice(14)}</span>
                                                    <SecurityOutlinedIcon style={{width: 17, marginLeft: 5}}/>                                               
                                                </Box>
                                            }
                                    </Typography>                                          
                                </Box>

                                {(row.estado=="Comunicado" || row.estado=="Sustitución de jefe de trabajos" || row.estado ==="Asignado" || row.estado === "Colocado en SIO") &&
                                <Box display="flex" flexDirection="row" alignItems="center" className={classes.jefeDeTrabajoBox}>
                                    {(row.estado=="Comunicado" || row.estado=="Sustitución de jefe de trabajos") ?
                                        <SendToMobileOutlinedIcon />
                                        :  (row.estado ==="Asignado" || row.estado === "Colocado en SIO") ?
                                        <PersonAddAltOutlinedIcon />
                                        : null}
                                    {(row.estado=="Comunicado" || row.estado=="Sustitución de jefe de trabajos" || row.estado ==="Asignado" || row.estado === "Colocado en SIO") &&   
                                    <Typography variant="body1" style={{ marginLeft: 10 }}>
                                        <b>Encargado de firma: </b><br /> {row.jefeDeTrabajos}
                                    </Typography>}
                                </Box>}
                                

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


                                {row.estado === "Colocado en SIO"  &&
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        <CommentOutlinedIcon />
                                        <Typography variant="body1" style={{ margin: 10 }}>
                                            {comentarioColocacionSIO ? comentarioColocacionSIO : <i>No se ingresaron comentarios</i>}
                                        </Typography>
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
    );  
        
    return (
        props.open && 
        <SwipeableDrawer anchor={'right'} open={props.open} onClose={props.handleClose}>
            {panel}
        </SwipeableDrawer>
    );
}
