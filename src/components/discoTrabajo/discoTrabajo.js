import React from 'react';
import {
  Typography, Card, makeStyles, Avatar,
  CardHeader, IconButton, Menu, MenuItem,
  Box, CardContent, CardMedia, Paper, 
  Hidden
} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import ConsultaDiscoTrabajo from './consultaDiscoTrabajo';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { AppContext } from '../../appProvider';
import dateFormat, { masks } from "dateformat";

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    maxHeight: 90,
    minHeight: 90,
    maxWidth: 285, //320
    minWidth: 285,
    width: "100%",
    margin: 5,
    marginBottom: 10,
    float: "left",
    borderStyle: 'solid',
    border: 1,
    borderColor: 'white',
    "&:hover, &:focus": {
      cursor: "default",
      backgroundColor: "#efefef",
      borderColor: 'black'
    },
  },
  finalizado: {
    position: 'relative',
    maxHeight: 90,
    minHeight: 90,
    maxWidth: 285,
    minWidth: 285,
    minWidth: 285,
    width: "100%",
    margin: 5,
    float: "left",
    backgroundColor: "#efefef",
    "&:hover, &:focus": {
      cursor: "default",
      backgroundColor: "#efefef",
      borderColor: 'black'
    },
    borderWidth: '0px'
  },
  rootNominado: {
    position: 'relative',
    maxHeight: 160,
    minHeight: 160,
    maxWidth: 285, //320
    minWidth: 285,
    minWidth: 285,
    width: "100%",
    margin: 5,
    marginBottom: 10,
    float: "left",
    borderStyle: 'solid',
    border: 1,
    borderColor: 'white',
    "&:hover, &:focus": {
      cursor: "default",
      backgroundColor: "#efefef",
      borderColor: 'black'
    },
  },
  finalizadoNominado: {
    position: 'relative',
    maxHeight: 160,
    minHeight: 160,
    maxWidth: 285,
    minWidth: 285,
    minWidth: 285,
    width: "100%",
    margin: 5,
    float: "left",
    backgroundColor: "#efefef",
    "&:hover, &:focus": {
      cursor: "default",
      backgroundColor: "#efefef",
      borderColor: 'black'
    },
    borderWidth: '0px'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  resaltado: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    borderColor: '#0678f4',
    borderStyle: "dashed",
    borderWidth: 2,
    padding: 2
  },
  menuLabel: {
    flexGrow: 1,
    marginRight: 20
  },
  menuIcon: {
    width: 10,
  },
}));


const useStylesVertical = makeStyles(theme => ({
 
  disco: {
    maxHeight: 170, 
    minHeight: 170, 
    height: "100%",
    minWidth: 100,
    padding: 12,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor:"white",
    borderStyle:"solid",
    "&:hover, &:focus": {
      cursor: "default",
      backgroundColor: "#efefef",
      borderColor: 'black'
    },
  },
  discoFinalizado: {
    maxHeight: 170, 
    minHeight: 170, 
    height: "100%",
    minWidth: 100,
    padding: 12,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor:"white",
    borderStyle:"solid",
    backgroundColor: "#efefef",
  },
  discoHeader: {
    margin:0,
    padding: 0,
    width: "100%"
  },
  discoContent: {
    margin: 5,
    borderWidth: '0px',
  },
  small: {
    width: 32,
    height: 32
  },
  resaltado: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    borderColor: '#0678f4',
    borderStyle: "dashed",
    borderWidth: 2,
    padding: 2
  },
  menuLabel: {
    flexGrow: 1,
    marginRight: 20
  },
  menuIcon: {
    width: 10,
  },
  etiquetaFinalizado: {
    fontWeight: 800,
    fontFamily: "arial,sans-serif-medium,sans-serif",
    textTransform: "uppercase",
    fontSize: 13,
    marginTop: 10,
    borderStyle: "solid",
    borderRadius: 4,
    borderWidth: 1,
    padding: 2,
    color: "#615c5c",
    borderColor: "#898989"
  }
  
  
}));

const rutaImagenes = "/PAW/assets/images/" ;

const DiscoTrabajo = (props) => {
  const [state, setState] = React.useContext(AppContext);
 /* var resaltarBusqueda = 
    (
      state.numeroDiscoResaltado &&
      props.numero && 
      state.numeroDiscoResaltado.toUpperCase()===props.numero.toUpperCase() 
    ) ;

  const resalatdoFiltro = 
    props.resaltadoFiltro !=="" && 
    (
       props.numero.toLowerCase().includes(props.resaltadoFiltro) ||
       props.nombre.toLowerCase().includes(props.resaltadoFiltro) ||
       (
         props.nominado &&  props.ubicacion.toLowerCase().includes(props.resaltadoFiltro) 
       )
    );
*/
  const resaltarNumero = props.resaltarNumero;
  
  var resaltarPorFechaBusqueda = false;

  if (state.fechaResaltadaDesde && state.fechaResaltadaHasta){
    let desde = dateFormat(new Date(parseInt(state.fechaResaltadaDesde)),"isoUtcDateTime");
    let hasta = dateFormat(new Date(parseInt(state.fechaResaltadaHasta)),"isoUtcDateTime");
    resaltarPorFechaBusqueda = !(desde <= props.fecha && hasta >= props.fecha);
  }
 

  

  //console.log("numero: " + props.numero + " resaltar: " + resaltarPorFechaBusqueda+ " fechaDisco: " +props.fecha +" desde: " + desde + " hasta: " + hasta );

  //mostar nombre completo en tarjeta disco
  const [mouseOverNumero,setMouseOverNumero] = React.useState(0);
  const [mouseOverFecha,setMouseOverFecha] = React.useState(0);
  const [mouseOverTiempo,setMouseOverTiempo] = React.useState(-1);

  const setMouseOver = (numero) => {
      if (mouseOverTiempo==-1){
        setMouseOverNumero(numero);
        setMouseOverFecha(Date.now());
      }

      if (numero==0){
        setMouseOverNumero(0);
        setMouseOverTiempo(-1);
      }
  }

  React.useEffect(() => {
    const interval = setInterval(() => {setMouseOverTiempo(Math.floor((Date.now()- mouseOverFecha) / 1000))}, 1000)
    return () => clearInterval(interval);
  }, [mouseOverNumero]);

  let classes = useStyles();
  let classesHorizontal = useStyles();
  let classesVertical = useStylesVertical();

  //perfil y vista compacta
  const operadorCMD = state.operadorCMD;
  const vistaCompacta= state.vistaCompacta;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null); };

  var datos_disco = {
    ...props,
    numeroDT: props.numero,
    idDU: props.idDU,
    idDT: props.id,
    encargado: props.nombre
  };
 

  //ACCIONES
  
  const ACCION_DESASIGNAR  = 1;
  const ACCION_COMUNICAR  = 2;
  const ACCION_FIRMAR  = 3;
  const ACCION_COLOCAR  = 4;
  const ACCION_SUSTUTUIR_JT  = 5;
  const ACCION_SUSTITUIR_EXT  = 6;

  const action = (accion) => {
    const act = props.accionesDT;
    switch(accion) {
      case ACCION_DESASIGNAR:     act.openDesasignar(datos_disco); break;
      case ACCION_COMUNICAR:      act.openComunicar(datos_disco); break;
      case ACCION_FIRMAR:         act.openFirmar(datos_disco); break;
      case ACCION_COLOCAR:        act.openColocar(datos_disco); break;
      case ACCION_SUSTUTUIR_JT:   act.openSustituir(datos_disco); break;
      case ACCION_SUSTITUIR_EXT:  act.openExtraviado(datos_disco); break;
      default: break;
    }
    handleClose()
  }

  
  const accionComunicar =         {label: "Comunicar",                  action: () => action(ACCION_COMUNICAR),      contingencia: false};
  const accionDesasignar =        {label: "Desasignar",                 action: () => action(ACCION_DESASIGNAR),     contingencia: false};
  const accionColocar =           {label: "Colocar Disco",              action: () => action(ACCION_COLOCAR),        contingencia: true};
  const accionFirmar =            {label: "Firmar",                     action: () => action(ACCION_FIRMAR),         contingencia: true};
  const accionSustituirJT =       {label: "Sustituir Jefe de Trabajos", action: () => action(ACCION_SUSTUTUIR_JT),   contingencia: true};
  const accionSustituirExtravio = {label: "Sustituir por extravío",     action: () => action(ACCION_SUSTITUIR_EXT),  contingencia: true};


  var listaAcciones = [];
  
  if (props.tipo === 'planificado')                                 listaAcciones = [accionComunicar, accionDesasignar]
  if (props.tipo === 'comunicado' && operadorCMD)                   listaAcciones =  [accionColocar, accionDesasignar]
  if (props.tipo === 'comunicado' && !operadorCMD)                  listaAcciones =  [accionDesasignar]
  if (props.tipo === 'colocado' && !props.nominado && operadorCMD)  listaAcciones =  [accionFirmar, accionSustituirJT, accionSustituirExtravio]
  if (props.tipo === 'colocado' && props.nominado && operadorCMD)   listaAcciones =  [accionFirmar, accionSustituirJT]

  // menu con acciones posibles
  const iconContingencia = <SecurityOutlinedIcon fontSize="small" />;
 
  const menu = (
    <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
      {listaAcciones.map(e=><MenuItem key={e.label} onClick={()=>e.action()}> <span className={classes.menuLabel}>{e.label}</span> {e.contingencia ? iconContingencia : null}</MenuItem>)}
    </Menu>
  )

  const mostrarAcciones = !state.usuarioConsulta && ((props.tipo !== 'finalizado' && props.tipo !== 'retirado' && props.tipo !== 'colocado') || (props.tipo === 'colocado' && operadorCMD));
  
  const botonAcciones = (
    <div>
      {mostrarAcciones && <IconButton aria-label="acciones" onClick={handleClick}> <MoreVertIcon /> </IconButton> }
      {menu}
    </div>
  )

  
  const botonAccionesVertical = (
    <div>
      {mostrarAcciones && <IconButton aria-label="acciones" onClick={handleClick}><MoreHorizIcon /></IconButton>}
      {menu}
    </div>
  )

  const truncarString = (str, cantidad) => (str.length > cantidad) ? str.substring(0, cantidad) + "..." : str;
  const truncarNombre = (nombre) =>  (nombre.length > 18)  ? nombre.split(" ")[0][0] + ". " + nombre.split(" ")[1] : nombre
  const truncarUbicacion = (ubicacion) => truncarString(ubicacion,50)
  
  

  const contenido =() => {
  
    classes = classesHorizontal;
    const finalizado = props.tipo==='finalizado' || props.tipo==='retirado';

    var style = finalizado ? classes.finalizado : classes.root;
    style = !props.nominado 
      ? style 
      : finalizado ? classes.finalizadoNominado : classes.rootNominado;
    
    const variant = finalizado ? 'outlined' : 'elevation';
    const numero = !props.numero || props.numero==="" ? "--------" : props.numero; 
    return (
      
     
      <Box flexDirection="row">
        <Card 
          variant={variant} 
          className={style} 
          style={{ borderRadius: 10}}
          onMouseOver={()=>setMouseOver(props.id)}
          onMouseOut={()=>setMouseOver(0)}
          onClick={()=>setMouseOver(0)}
        >
          <CardHeader
            avatar={
                 props.extraviado
                  ?  <AvatarGroup max={2} spacing={20} onClick={handleClickOpen}>
                        <Avatar alt="" src={(props.tipo) ? rutaImagenes +  'sustituidoIcon.svg' : null} className={classes.small} />
                        <Avatar alt="" src={(props.tipo) ? rutaImagenes + props.tipo + 'Icon.svg' : null} className={classes.small} />
                      </AvatarGroup> 
                  : <Avatar onClick={handleClickOpen} alt="" src={(props.tipo) ? rutaImagenes + props.tipo + 'Icon.svg' : null} className={classes.small}/>
            }
            action={<div>{botonAcciones}</div>}
            title={
         
                <Typography 
                onClick={handleClickOpen}
                  variant="h6" 
                  component="h2" 
                  style={
                    resaltarNumero 
                    ? {marginRight: 20, backgroundColor: "#2bff99", width: "fit-content"}
                    : {marginRight: 20 }
                  }
                  >
                  {numero} 
                </Typography>
            
            }
            subheader={
            
                  <Typography color="textPrimary" style={{maxHeight: "20px"}} onClick={handleClickOpen}>
                    {props.nombre
                      ? (mouseOverNumero===props.id && (mouseOverTiempo > 2))
                        ? <marquee><span style={{color: "black"}}>{props.nombreCompleto.concat('   •   ').repeat(10)}</span></marquee>
                        : <span>{truncarNombre(props.nombre)}</span> 
                        : "---"}
                  </Typography>
            
            }
          />
          {props.nominado?
          <CardMedia  onClick={handleClickOpen}>
            <CardContent style={{paddingTop:8, backgroundColor: "#efefef", borderTop: "2px solid #fffdfd"}}>
            {truncarUbicacion(props.ubicacion)}
            </CardContent>
          </CardMedia>
         : null}
        </Card>

      </Box>
     
    )
  };


  const contenidoVertical =() => {
    classes = classesVertical;
    const finalizado = props.tipo==='finalizado' || props.tipo==='retirado';
    const numero = !props.numero || props.numero==="" ? "---" : props.numero;
    var style = finalizado ? classes.discoFinalizado : classes.disco;
    var elevation = finalizado ? 0 : 3;

    var classAvatar = classes.large;

    return(
    <Paper elevation={elevation} className={style} style={resaltarPorFechaBusqueda? {border: "1px dashed gray"}: {}}>
      <Box display="flex" flexDirection="row" justifyContent="center" style={props.nominado ? {width: 300}: {}}  alignItems="center"> 
          <Box display="flex" flexDirection="column" alignItems="center" className={classes.discoContent} 
            style={(props.nominado && (props.tipo!=='retirado'))
                    ? {paddingRight: 25,paddingLeft: 10, borderRight: "1px dashed gray" ,maxWidth:75,minWidth:75}
                    : (props.nominado && (props.tipo==='retirado'))
                      ? {paddingRight: 25,paddingLeft: 10, borderRight: "1px dashed gray" ,maxWidth:80,minWidth:80}
                      : {}
                  }
            >
            
            {props.extraviado
              ? <AvatarGroup max={2} spacing={15} onClick={handleClickOpen}>
                  <Avatar alt="" src={(props.tipo) ? rutaImagenes +  'sustituidoIcon.svg' : null} className={classes.large} />
                  <Avatar alt="" src={(props.tipo) ? rutaImagenes + props.tipo + 'Icon.svg' : null} className={classAvatar} />
                </AvatarGroup> 
              : <Avatar onClick={handleClickOpen} alt="" src={(props.tipo) ? rutaImagenes + props.tipo + 'Icon.svg' : null} className={classAvatar} />
            }
        
              <Typography variant="h6" onClick={handleClickOpen} component="h2" 
                  style={resaltarNumero ? {marginTop: 5, backgroundColor: "#2bff99", width: "fit-content"} : {marginTop: 5 }}
              >  
                {numero }
              </Typography>
          
              <span onClick={handleClickOpen}>{truncarNombre(props.nombre).split(" ")[0]} </span>    
              <span onClick={handleClickOpen}> {truncarNombre(props.nombre).split(" ")[1]}</span> 
            
              {finalizado && 
                  <div style={{marginTop: 5}} onClick={handleClickOpen}>
                    <span className={classes.etiquetaFinalizado}> {props.tipo ==='finalizado' ? "Firmado" :"Retirado"} </span>
                  </div>    
              }
              {botonAccionesVertical}
          </Box>
      
          {props.nominado && <CardContent onClick={handleClickOpen}> {truncarUbicacion(props.ubicacion)} </CardContent>}
      </Box>         
  </Paper>
  )};

  

  const vistaHorizontal = state.vistaHorizontal;
 
  //Consulta disco
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {setOpen(true); };
  const handleCloseConsulta = () => { setOpen(false); };


  const parametrosConsulta = {
    ...props,
    handleClose: handleCloseConsulta,
    jefeDeTrabajosActual: props.nombreCompleto,
    disco: props.numero,
    idDT: props.id,
    open: open,
    handleClickOpen: handleClickOpen,
  };


  return ((vistaCompacta && props.tipo === 'finalizado' && props.soloActivos)
      ? null
      : <div>
            <Hidden only="xs"> {vistaHorizontal? contenido(): contenidoVertical()}</Hidden>
            <Hidden smUp>{contenido()}</Hidden>
            <ConsultaDiscoTrabajo {...parametrosConsulta} />
      </div>);
}

export default DiscoTrabajo;