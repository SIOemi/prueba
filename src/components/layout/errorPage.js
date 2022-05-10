import React from 'react';
import {
    Typography,
    Box
} from '@material-ui/core';


const ErrorPage = (props) => {
    return (
        
        <Box display="flex" flexDirection="column" alignItems="center" style={{margin: 20, marginTop: 60}}>
        <img src="/PAW/assets/images/errorFace.png" style={{width: 40, height: 40}} />               
        <div style={{marginTop: 20}}>
            <Typography variant="h6" color="initial">ERROR</Typography>
            <Typography variant="subtitle" color="initial">Comuniquese con la administración.</Typography>
        </div>
    </Box>
    )
}
 
export default ErrorPage;