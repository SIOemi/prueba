import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { ClassTwoTone } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    boxIncidencia: {
        backgroundColor: "#f8f8f8", 
        marginRight: 10, 
        marginLeft: 10, 
        marginBottom: 10, 
        padding: 5,
        borderRadius: 10,
        cursor: "pointer"
    },
    boxIncidenciaActual: {
        backgroundColor: "#0678f43b", 
        marginRight: 10, 
        marginLeft: 10, 
        marginBottom: 10, 
        padding: 5,
        borderRadius: 10,
        cursor: "pointer"
    },
    container: {
        width: 360,
        maxWidth: 360, 
        height: 1000
    }
}))


const ResumenIncidencias = (props) => {
    const classes =  useStyles();
    const [incidenciaActual,setIncienciaActual] = React.useState(null);

    const clicHandler = (inc) => {
        const incidencia = incidenciaActual===inc? "" : inc;
        props.setFiltro(incidencia);
        setIncienciaActual(incidencia);
    }

    return (  
       
        <Box display="flex" flexDirection="column" flexWrap="wrap" className={classes.container}>
        
        {props.lista.map(inc => {
            const cantDiscosUnidad = inc.discosUnidad.length;
            const cantDiscosNominado = inc.discosNominados.length;
            const clase = incidenciaActual===inc.incidencia ? classes.boxIncidenciaActual : classes.boxIncidencia;

            return (
              <Box display="flex" flexDirection="column" className={clase} alignItems="left" onClick={()=>clicHandler(inc.incidencia)}>
                    <span style={{fontWeight: 500}} >
                        {inc.incidencia}
                    </span>
                    <span>{cantDiscosUnidad} DU - {cantDiscosNominado} DN</span>
              </Box>
            )
        })}
    </Box>
    );
}
 
export default ResumenIncidencias;