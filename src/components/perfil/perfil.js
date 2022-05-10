import React from 'react';

import { AppContext } from '../../appProvider';
import {
    Typography,
    Box,
    Button
} from '@material-ui/core';

import ContenedorImagen from '../inputs/contenedorImagen';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Titulo from '../layout/titulo';

import { makeStyles } from '@material-ui/core/styles';

const formatearNombre = (nombre) =>
    nombre.split(' ')
        .map(word => {
            const upperedCase = word && word[0] ? word[0].toUpperCase() : "";
            const loweredCase = word && word[1] ? word.toLowerCase().slice(1) : "";
            return (upperedCase + loweredCase)
        })
        .join(" ");


const useStyles = makeStyles(theme => ({
    card: {
     width: 300,
     [theme.breakpoints.up('sm')]:{
        width: 300,
     },
     padding: 20,
     border: "1px solid grey",
     borderRadius: 10,
     margin: 10,
    },
    label: {
        maxWidth: 100,
        width: "100%",     
        color: "black",
        textAlign: "right",
        marginRight: 10
    },
    valor: {
        display: 'block',
        marginTop: 10,
        color: "#000000ba",
    },
    value: {
        fontWeight: 400
    },
    contenido: {
        height: 140
    }
}))
    



const Perfil = (props) => {

    const classes = useStyles();

    const [state, setState] = React.useContext(AppContext);
    
    const valor = (label, value, end) => (
        <Typography variant="subtitle1" color="initial" className={classes.valor}>
            <Box display="flex" flexDirection="row">
                <span className={classes.label}>{label}</span>
                <span className={classes.value}>{value}</span>
            </Box> 
        </Typography>
        
    );

  
    const descargar = () => {
        const link = document.createElement("a");
        link.download = `ayuda.pdf`;
        link.href = "/PAW/assets/ayuda.pdf";
        link.click();
    };

    const rutaImagenes = "/PAW/assets/images/" ;

    const [mostrarImagen, setMostrarImagen] = React.useState("");
    const [tituloImagen, setTituloImagen] = React.useState("");
    const [descImagen, setDescImagen] = React.useState("");

    const cargarImagen = (imagen,titulo,desc) =>{
        setTituloImagen(titulo);
        setDescImagen(desc);
        setMostrarImagen(imagen);
    }

    

    return ( 
        <div>
            <ContenedorImagen
                titulo={tituloImagen}
                desc={descImagen}
                close = {() => cargarImagen("","","")}
                open = {mostrarImagen!==""}
                imagen= {mostrarImagen}
            />

         <Titulo titulo={formatearNombre(state.nombre)} subtitulo={state.ci} />

            <Box display="flex" flexDirection="row" flexWrap="wrap">
          
            {/* ¿Qué hay de nuevo? */}
            <Box className={classes.card} style={{borderStyle: "dashed", backgroundColor: "#e0e0e038"}}>
                <div className={classes.contenido}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <NewReleasesOutlinedIcon/>    
                        <Typography variant="h6" color="initial" style={{marginLeft: 10}}>¿Qué hay de nuevo?</Typography>
                    </Box>
                    <hr/>
                    <br/>
                    <span>Ahora puedes filtrar los discos activos por número, ubicación, jefe de trabajo o incidencia.</span>
                </div>    
                <Button 
                    style={{marginTop: 20, width:"100%"}} 
                    onClick={()=>cargarImagen(rutaImagenes + "filtro_discos.png","Filtro en Discos Ativos","Ahora puedes filtrar los discos activos por número, ubicación, jefe de trabajo o incidencia.")} 
                    endIcon={ <ImageOutlinedIcon/>}  variant="contained" > 
                    VER
                </Button>         
            </Box>  

            

             
            {/* Ayuda en linea */}
            <Box className={classes.card}>
            <div className={classes.contenido}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <HelpOutlineOutlinedIcon/>    
                    <Typography variant="h6" color="initial" style={{marginLeft: 10}}>Ayuda en linea</Typography>
                </Box>
                <hr/>
                <br/>
                
                <span>Obtenga la última version del manual de PAW Discos.</span> 
            </div>
            <Button  style={{marginTop: 20, width:"100%"}} onClick={() => descargar()} endIcon={ <FileDownloadOutlinedIcon/>}  variant="contained" > DESCARGAR</Button>
                   
            </Box>  
         
          {/* Datos de Discos*/}
          <Box className={classes.card} >
            <div className={classes.contenido}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <SettingsOutlinedIcon/>    
                    <Typography variant="h6" color="initial" style={{marginLeft: 10}}>Configuración</Typography>
                </Box>
                <hr/>
                {valor("Unidad:", state.unidadDesc, false)}
                {valor("Perfil:", state.perfilDesc, true)}
            </div>
            <Button  style={{marginTop: 20, width:"100%"}} onClick={() => state.borrarCookies()} endIcon={ <RefreshIcon/>}  variant="contained" > Actualizar datos</Button> 
                   
            </Box>   

        
           
         
         
        
        </Box>
        </div>
       
    );
}
 
export default Perfil;