import React from 'react';
import {AppBar,
        Toolbar,
        Typography,
        makeStyles, 
        IconButton,
        Hidden,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogContentText,
        DialogActions,
        Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import { AppContext } from '../../appProvider';


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('xl')]:{
           display: 'none',
        },
    },
    title: {
        flexGrow: 1
    },
    appBar: {
        [theme.breakpoints.up('xl')]:{
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: "white",
        color: "black"
    },
}))

const formatearNombre = (nombre) =>
nombre.split(' ')
    .map(word => {
        const upperedCase = word && word[0] ? word[0].toUpperCase() : "";
        const loweredCase = word && word[1] ? word.toLowerCase().slice(1) : "";
        return (upperedCase + loweredCase)
    })
    .join(" ");

const Navbar = (props) => {

    const classes = useStyles()
    const [state, setState] = React.useContext(AppContext);


    const [openPerfil, setOpenPerfil] = React.useState(false);

    const handleClickOpen = () => {
        setOpenPerfil(true);
    };
  
    const handleClose = () => {
        setOpenPerfil(false);
    };


 
    const title = (!props.section) 
                ? "PAW" 
                : <div>
                    <Hidden only="xs"> {props.section} </Hidden>
                    <Hidden smUp> PAW </Hidden>
                </div>

    const actualizarDatos = () => {
        state.borrarCookies();
    }


    return ( 
        <div>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton 
                    color='inherit' 
                    aria-label='menu' 
                    className={classes.menuButton}
                    onClick={props.toogleSidebar}>
                  <MenuIcon />
                </IconButton> 
                

                <Typography variant="h6" className={classes.title}>{title}</Typography>               
 

               
                    <Button
                        style={{textTransform: "none"}}
                        variant= "text"
                        color="default"
                        onClick= {()=>setOpenPerfil(true)}
                        startIcon= {<PermIdentityOutlinedIcon/>}
                    >
                      
                       {formatearNombre(state.nombre)}
                       
                    </Button>
              
               
               
                
               
            </Toolbar>
            </AppBar>

            <Dialog open={openPerfil} onClose={()=>setOpenPerfil(false)}>
                <DialogTitle>
                    {formatearNombre(state.nombre)}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                            <Typography variant="subtitle1" color="initial">{state.unidadDesc}</Typography>
                            <Typography variant="subtitle1" color="initial">{state.perfilDesc}</Typography>
                    </DialogContentText>
                    <Button  onClick={() => actualizarDatos()} endIcon={ <RefreshIcon/>} color="primary" variant="outlined" > Actualizar datos</Button> <br/><br/>
                    <Button  onClick={() => setOpenPerfil(false)} color="primary" variant="outlined"> Cerrar </Button>
                </DialogContent>
                <DialogActions />
                
                   
            </Dialog>

        </div>
     );
}
 
export default Navbar;