import React, { useContext } from 'react';
import { AppContext } from '../../appProvider';
import {
    Typography,
    Box
} from '@material-ui/core';



const mensaje = (mensaje) => (
    <Box display="flex" flexDirection="column" alignItems="center" style={{margin: 20, marginTop: 60}}>
        <img src="/PAW/assets/images/errorFace.png" style={{width: 40, height: 40}} />               
        <div style={{marginTop: 20}}>
            <Typography variant="h6" color="initial">{mensaje}</Typography>
            <Typography variant="subtitle" color="initial">Comuniquese con la administración.</Typography>
        </div>
    </Box>
)

const Wrapper = (props) => {
    const [state,] = useContext(AppContext);

    const sinUnidad = !state.unidadDesc ||state.unidadDesc==="";
    const sinPerfil = !state.perfilDesc || state.perfilDesc==="";
    const sinPerfilNiUnidad = sinUnidad && sinPerfil;


    const contenido = sinPerfilNiUnidad  
                    ?  mensaje("El usuario " + state.ci + " no tiene perfil ni unidad asignada.")
                    :   sinPerfil
                        ? mensaje("El usuario " + state.ci + " no tiene ningun perfil asignado.")
                        : sinUnidad
                            ? mensaje("El usuario " + state.ci + " no tiene ninguna unidad asignada.")
                            : props.children 
    return contenido
}
 
export default Wrapper;