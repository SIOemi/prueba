import React from 'react';

import Button from '@material-ui/core/Button';
import {DialogActions,
        DialogContent,
        DialogTitle,
        Dialog,
        Box,
}from '@material-ui/core';


const ContenedorImagen = (props) => {
 
    return (
        <div>
            <Dialog 
                open={props.open} 
                onClose={props.close} 
                aria-labelledby="form-dialog-title"
                maxWidth={"md"}
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">
                    <Box display="flex" flexDirection="column">
                        <span>{props.titulo}</span>
                        <span style={{fontSize: 16, fontWeight: 200}}>{props.desc}</span>
                    </Box>
                    <hr />
                   </DialogTitle>
                
                <DialogContent >
                   <img src={props.imagen} style={{height: "fit-content"}}/>     
                </DialogContent>
              
                <DialogActions>
                    <Button 
                        onClick={props.close} 
                        color="default" >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default ContenedorImagen;