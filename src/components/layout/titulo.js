
import React from 'react';
import {
    Typography,
    Box,
    Button,
    Hidden
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import { AppContext } from '../../appProvider';

const Titulo = (props) => {

    const [state, setState] = React.useContext(AppContext);  

    const logo = (
        <Hidden smUp>
             <Box display="flex" alignItems="center">
                <img alt="" src="/PAW/assets/images/PAWlogo.png" width="120" />
            </Box>
        </Hidden>
    )

    const logoSm = (
        <Box display="flex" alignItems="center">
             <img alt="" src="/PAW/assets/images/PAWlogoNav.png" width="80" />
        </Box>
    )

    const separador = (
        <Box display="flex" alignItems="center">
            <img alt="" src="/PAW/assets/images/separador.png" width="120" />
        </Box>
    )

    const title = (
        <Box display="flex" flexDirection="column">
            {!props.subtitulo ?
                <div>
                    <Typography variant="h6" style={{margin: 10}} color="initial">
                    {props.titulo}
                </Typography>
                </div>
            
            :
                <div>
                    <Typography variant="h6" style={{margin: 10, marginBottom:0}} color="initial">
                        {props.titulo}
                    </Typography>
                    <Typography variant="subtitle1" style={{margin: 10, marginTop:0}} color="initial">
                        {props.subtitulo}
                    </Typography>
                </div>
            }
        </Box>
    )

    const menuButton = (
        <Button variant="text" color="default" 
                style={{marginBottom: 10}} 
                onClick={ () => setState({...state, showSidebar: !state.showSidebar})}
                >

            <MenuIcon />
        </Button>
    )

    return ( 
        <div>
         
            {/* PC */}
            <Hidden only="xs">
                <Box display="flex" flexDirection="row" alignItems="center">{title}</Box> 
                 {separador}
            </Hidden>
        
            {/* Celular */}
            <Hidden smUp>
                <Box display="flex" flexDirection="row" alignItems="flex-end" justifyContent="space-between">    
                    {title}   
                    {menuButton}
                </Box>
                {separador}
            </Hidden>
        </div>
     );
}
 
export default Titulo;