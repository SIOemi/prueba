import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';  
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {Box,
        IconButton,
        Typography} from '@material-ui/core';
import {formatDate} from '../../utils/utils';

const CONFIG = window.data;

const IncidenciaHeader = (props) => {
  
const useStyles = makeStyles(theme => ({
  root: {
    clear: "both",
    position: 'relative',
    width: 260
  },
  rootWithFecha: {
    clear: "both",
    position: 'relative',
    width: 340
  },
  link: {
    textDecoration: 'none',
    margin: '10px',
    color: 'white',
    verticalAlign: 'middle',
  },
  title: {
      color: "white",
      backgroundColor: "#0678f4",
         
    borderTopLeftRadius: 10,
    borderBottomRightRadius:10
    
  },
  descripcion: {
    marginLeft: '60px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  fecha: {
    verticalAlign: 'middle',
    padding: '0px',
    border: '0px',
    margin: '0px'
  },
  fechaIcon: {
    verticalAlign: 'middle',
    padding: '0px',
    border: '0px',
    marginBottom: '4px'
  },
}));

    const classes = useStyles();

    var fecha = null;
    if (props.fecha){
      fecha = formatDate(props.fecha);
      fecha = fecha.d + " " + fecha.m  + " " + fecha.y;
    }

    return (

      props.vista_consultaIncidencia 
      ? null 
      :
        <div className={props.fecha ? classes.rootWithFecha : classes.root} onClick={props.clic}>
          <Box className={classes.title} >
           
            <Typography variant="h6" color="initial" style={{fontSize: 18, fontWeight: 400}}>
                
                <IconButton aria-label="expandir" color="secondary">
                  {(props.verTodo)?<ExpandLessIcon/>:<ExpandMoreIcon/>}
                </IconButton>

                {fecha && <span className={classes.fecha}> <CalendarTodayIcon className={classes.fechaIcon}/> {fecha} </span>}
                {fecha && <span className={classes.bullet}>•</span>}

                  <a  href={CONFIG.consultaIncidenciaSIO + props.incidencia}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className={classes.link}> 
                      {fecha ? "Inc " + props.incidencia : "Incidencia " + props.incidencia}
                  </a> 
            </Typography>
          </Box>
       </div>
      );
}
 
export default IncidenciaHeader;