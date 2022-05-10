import React from 'react';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchIcon from '@material-ui/icons/Search';
import SidebarItem from './sidebarItem';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';

import { AppContext } from '../../../appProvider';

import {withRouter, useLocation} from "react-router-dom";

import {makeStyles, 
    List,
    Divider,
    Drawer,
    ListSubheader,
    Box,
} from '@material-ui/core';





const Sidebar = (props) => {

const [state, setState] = React.useContext(AppContext);    
const drawerWidth = state.showSidebar ? 240 : 60;

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('sm')]:{
            width: drawerWidth,
         },
        width: "93%",
        flexShrink: 0,
    },
    drawerPaper: {
        [theme.breakpoints.up('sm')]:{
            width: drawerWidth,
         },
        width: "93%",
        overflow: "hidden",
    },
    toolbar: {
        ...theme.mixins.toolbar,
        marginLeft: 10,
        marginTop: 40
    },
    bottomPush: {
        position: "fixed",
        bottom: 0,
        textAlign: "center",
        paddingBottom: 10,
        marginLeft: "10px",
    }
}))


    const formatearNombre = (nombre) => {
        const word = nombre.split(' ')[0];
        const upperedCase = word && word[0] ? word[0].toUpperCase() : "";
        const loweredCase = word && word[1] ? word.toLowerCase().slice(1) : "";
        return (upperedCase + loweredCase);
    }

    
    const location = useLocation();
    const { history } = props;

    const push = (path) => {
        history.push(path);
        if (props.variant==='temporary') //props.close()
            setState({...state, showSidebar: false})
    }

    const items = (
        <List component='nav'
            subheader={
                state.showSidebar 
                ? <ListSubheader component="div" id="nested-list-subheader"> Discos </ListSubheader>
                : null
            }
          >
            
            <SidebarItem 
                selected={location.pathname==="/"}
                name="Activos" 
                icon={<HomeOutlinedIcon/>}
                onClic={ () => {
                    push("/"); 
                    //props.setSection("Discos › Activos")
                }}
               />
            <SidebarItem 
                selected={location.pathname==="/todos"}
                name="Todos" 
                icon={<SearchIcon/>} 
                onClic={ () => {
                    push("/todos");
                   // props.setSection("Discos › Todos")
                }}
            />
              {/*<SidebarItem 
                selected={location.pathname==="/sustituciones"}
                name="Sustituciones" 
                icon={<CachedOutlinedIcon/>}
                onClic={ () => {
                    push("/sustituciones"); 
                    //props.setSection("Discos › Sustituciones")
                }}
            />*/}
            <Divider/>
        </List>
    )

    const iniciales = (nombre) => {
        const str = nombre.toUpperCase().split(' ');
        try {
            return str[0][0] + str[1][0];
          } catch (error) {}
          return "--"
    }
    

    const itemPerfil = (nombre) => (
        <List component='nav' >
            
            <SidebarItem
                iniciales={iniciales(nombre)}
                selected={location.pathname==="/usuario"}
                name={formatearNombre(nombre)}
                icon={<AccountCircleOutlinedIcon/>}
                onClic={ () => {
                    push("/usuario"); 
                }}
               />
           
        </List>
    )


    const menuPAW = (
        <List component='nav' >
        <SidebarItem
            name="PAW" 
            main
            icon={<MenuOutlinedIcon/>}
            onClic={ () => {setState({...state, showSidebar: !state.showSidebar})}}
           />
    </List>
)



    const classes = useStyles();
    const CONFIG = window.data;
    
    const toogleVistaHorizontal = () => {
        const newState = { ...state };
        newState.vistaHorizontal = !state.vistaHorizontal;
        setState(newState)
      }

    if (props.vistaHorizontalSiempre && !state.vistaHorizontal)  toogleVistaHorizontal();

    return ( 
        <Drawer  
            className ={classes.drawer}
            variant={props.variant}
            open = {state.showSidebar}
            onClose={
                props.variant==="temporary"
                ? ()=>setState({...state, showSidebar: false})
                : null
            }
            anchor="left"
            classes={{ paper: classes.drawerPaper}}
        >
            {menuPAW}

            {itemPerfil(state.nombre)}
            {items}
     
           
         
            <Box display="flex" flexDirection="column" justifyContent="flex-start" className={classes.bottomPush}>
        
                <span>{CONFIG.version}</span>
                <span>{CONFIG.entorno}</span>
            </Box>
        </Drawer>
     );
}
 
export default withRouter(Sidebar);