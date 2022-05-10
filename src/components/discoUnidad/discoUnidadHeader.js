import React from 'react';

import {makeStyles } from '@material-ui/core/styles';
import { Button, Typography,Hidden, Box,Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import ConsultaDiscoUnidad from './consultaDiscoUnidad';
import { AppContext } from '../../appProvider';


const useStyles = makeStyles(theme => ({

    root: {
      padding: theme.spacing(2),
      clear: "both",
      position: 'relative',
    },
    simple_root: {
      clear: "both",
      position: 'relative',
    },
    text: {
      color: 'black',
      verticalAlign: 'middle',
      display: 'inline',
      cursor: 'pointer',
    },
    numero: {
      color: 'black',
      verticalAlign: 'middle',
      display: 'inline-block',
      cursor: 'pointer',
      
    },
    ubicacion: {
      display: 'inline',
      color: 'black',
      verticalAlign: 'middle',
      width: "100%",
    },
    icon: {
      verticalAlign: 'bottom'
    },
    botonAcciones: {
        marginRight: 10,
        marginTop: 5,
    },
    iconImage: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      verticalAlign: 'middle',
      marginLeft: 5,
    },
    iconImageResaltado: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      verticalAlign: 'middle',
      marginLeft: 5,
      borderColor: '#0678f4',
      borderStyle: "dashed",
      borderWidth: 2,
      padding: 2
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
    small: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  }));

  

const useStylesVertical = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    clear: "both",
    position: 'relative',
  },
  simple_root: {
    clear: "both",
    position: 'relative',
  },
  text: {
    color: 'black',
    verticalAlign: 'middle',
    display: 'inline',
    cursor: 'pointer',
  },
  numero: {
    color: 'black',
    verticalAlign: 'middle',
    display: 'inline-block',
    cursor: 'pointer',
    
  },
  ubicacion: {
    display: 'inline',
    color: 'black',
    verticalAlign: 'middle',
    width: "100%",
  },
  icon: {
    verticalAlign: 'bottom'
  },
  botonAcciones: {
      marginLeft: 0,
      marginTop: 5
  },
  iconImage: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    verticalAlign: 'middle',
    marginLeft: 5,
  },
  iconImageResaltado: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    verticalAlign: 'middle',
    marginLeft: 5,
    borderColor: '#0678f4',
    borderStyle: "dashed",
    borderWidth: 2,
    padding: 2
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
}));


const DiscoUnidadHeader = (props) => {
  const [state, setState] = React.useContext(AppContext);
  
  const resaltadoFiltro = 
    !props.nominado && 
    props.resaltadoFiltro !=="" && 
    (
      props.numero.toLowerCase().includes(props.resaltadoFiltro) ||
      props.ubicacion.toLowerCase().includes(props.resaltadoFiltro)
    );

    const resaltarBusqueda = 
    state.numeroDiscoResaltado &&
    props.numero && 
    state.numeroDiscoResaltado.toUpperCase()===props.numero.toUpperCase();

    const  resaltarNumero = resaltadoFiltro || resaltarBusqueda;

    var datos_disco = {...props};

    //ver/ocultar discos finalizados
    const [verFinalizados, setVerFinalizados] = React.useState(false);
    const switchVerFinalizados = () => {
      setVerFinalizados(!verFinalizados);
      props.setVerFinalizados(!verFinalizados);
    }

    //Consulta disco
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const classesHoprizontal = useStyles();
    const classesVertical = useStylesVertical();
    const classes = (state.vistaHorizontal) ? classesHoprizontal : classesVertical;
  


    const contenido = props.nominado ?
    props.vista_consultaNominado ? null : 
    <div style={!props.vistaCelular ? {paddingLeft: 70}: {}}> 
      <Typography
        variant="h5" 
        color="initial" 
        className={classes.text}
        onClick={handleClickOpen}>
          <strong>Nominados</strong><br/>
          {props.soloActivos 
            ? <Typography variant="subtitle1">No firmados y sin disco a unidad asociados</Typography> 
            : <Typography variant="subtitle1">Sin disco a unidad asociados</Typography> 
          }
      </Typography>
     
    </div>
  
    : props.estado==="finalizado" || props.estado==="retirado"  ?
        <div>
          
            <Typography  
            variant="h5" 
            color="initial" 
            className={classes.numero}
            onClick={handleClickOpen}>
              <strong 
                style={
                  resaltarNumero 
                  ? {marginRight: 10, backgroundColor: "#2bff99", width: "fit-content"}
                  : {marginRight: 10 }
                }
              >
                {props.numero}
            
              </strong>
            </Typography>
            <Typography onClick={handleClickOpen} className={classes.ubicacion}><br/>{props.ubicacion}</Typography><br/>

            {props.todos && state.vistaHorizontal 
            ? <Button 
                  startIcon = {
                  verFinalizados 
                  ? <VisibilityOffOutlinedIcon />
                  : <VisibilityOutlinedIcon />}
                  variant='contained' 
                  color="secondary"
                  style={{marginLeft: 0, textTransform: 'none'}}
                  className={classes.botonAcciones}
                  disabled={props.cantidadDiscos===0}
                  onClick={()=>switchVerFinalizados()}> 
                  {verFinalizados 
                    ? props.cantidadDiscos + (props.cantidadDiscos===1 ? " Disco" : " Discos")
                    : props.cantidadDiscos + (props.cantidadDiscos===1 ? " Disco" : " Discos")
                  } 
                </Button>
            : null }
            
            

            
            
        </div> 


    : ( <div>
            
            <Typography 
              variant="h5" 
              color="initial" 
              className={classes.numero}
              onClick={handleClickOpen}>
                 <strong 
                    style={
                      resaltarNumero 
                      ? {marginRight: 10, backgroundColor: "#2bff99", width: "fit-content"}
                      : {marginRight: 10 }
                    }
                  >
                {props.numero}
              </strong>
            </Typography>

           
            <Typography onClick={handleClickOpen}  className={classes.ubicacion}><br/>{props.ubicacion}</Typography><br/>

            <Box display="flex" flexDirection="column" alignItems="start">        
            {!state.usuarioConsulta && 
              <Button 
                style={{textTransform: 'none'}}
                startIcon={<GroupAddOutlinedIcon/>} 
                variant='contained' 
                color="secondary"
                className={classes.botonAcciones}
                onClick={()=>props.accionesDU.openAsignar(datos_disco)}> 
                Asignar JT 
              </Button> 
            } 
            {!state.usuarioConsulta && props.sePuedeSolicitarFirma  && !props.firmaSolicitada && !props.firmaPlanificada ?
                <Button  
                  style={{textTransform: 'none'}}
                  startIcon={<EditOutlinedIcon/>}
                  variant='contained' 
                  color="secondary"
                  className={classes.botonAcciones}
                  onClick={()=>props.accionesDU.openSolicitarFirma(datos_disco)}> 
                   Solicitar Firma
                </Button> 
                : null}

            {!state.usuarioConsulta && props.firmaSolicitada?  
                <Button  
                  style={{textTransform: 'none'}}
                  startIcon={<CancelOutlinedIcon/>} 
                  variant='contained' 
                  color="secondary" 
                  className={classes.botonAcciones}
                  onClick={()=>props.accionesDU.openCancelarFirma(datos_disco)}>
                  Cancelar Firma
                </Button>
                : null}

            {!state.usuarioConsulta && props.firmaPlanificada?  
                <Button  
                  startIcon={<CancelOutlinedIcon/>} 
                  variant='contained' 
                  color="secondary"
                  style={{textTransform: 'none'}}
                  className={classes.botonAcciones}
                  onClick={()=>props.accionesDU.openCancelarFirma(datos_disco)}>
                  <Hidden xsDown>Cancelar planificación de firma de {props.encargadoFirma}</Hidden>
                  <Hidden only="sm">Cancelar Pla.</Hidden>
                </Button>
                : null}

            {!state.usuarioConsulta && props.sePuedeSolicitarFirma && state.operadorCMD ?  
                <Button  
                  startIcon={<SecurityOutlinedIcon/>}
                  variant='contained' 
                  color="secondary"
                  style={{textTransform: 'none'}}
                  className={classes.botonAcciones}
                  onClick={()=>props.accionesDU.openFirmarDU(datos_disco)}>
                    Firmar
                </Button> 
            : null}
            </Box>
       
        </div>    
        ); 
    
    const style = props.vista_consultaNominado ? classes.simple_root : classes.root;    
    var classAvatar = classes.large;
    return (

        <Box display="flex" flexDirection="row" style={props.resaltarPorFechaBusqueda? {borderLeft: "1px dashed gray"}: {}}>
          {props.nominado || props.vistaCelular
          ? null
          : <Box className={style} style={{paddingRight:0}} alignItems="center">
             


              {props.extraviado
                  ?  <AvatarGroup max={2} spacing={18} onClick={handleClickOpen}>
                      
                      <Avatar
                        alt=""
                        src={"/PAW/assets/images/" + 'sustituidoIcon.svg'}
                        className={classes.small}
                      />
                        <Avatar
                        alt=""
                        src={props.estado==="finalizado" || props.estado==="retirado"
                              ? "/PAW/assets/images/unidadGrisIcon.svg" 
                              : "/PAW/assets/images/unidadIcon.svg"}
                        className={classAvatar}
                      />
                      </AvatarGroup> 
                  :
                    <Avatar
                        alt=""
                        src={props.estado==="finalizado" || props.estado==="retirado"
                              ? "/PAW/assets/images/unidadGrisIcon.svg" 
                              : "/PAW/assets/images/unidadIcon.svg"}
                        className={classAvatar}
                        onClick={handleClickOpen}
                      />
                    
                 }






            </Box>
          }
          <Box className={style}>
         {contenido}
            {!props.nominado
              ?
              <ConsultaDiscoUnidad 
                {...props}
                jefeDeTrabajosActual={props.jefeDeTrabajosCompleto}
                eliminar={()=>props.accionesDU.openEliminar(datos_disco)}
                firmar={()=>props.accionesDU.openFirmarDU(datos_disco)}
                handleClickOpen={handleClickOpen}
                handleClose={handleClose}
                open={open} />
              : null}
          </Box>
        </Box>
      );
}
 
export default DiscoUnidadHeader;
