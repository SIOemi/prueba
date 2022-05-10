import React from 'react';


import Sidebar from '../layout/sidebar/sidebar';
import ListaDiscos from '../listaDiscos/listaDiscos';
import Perfil from '../perfil/perfil';
import Wrapper  from './wrapper';
import ErrorPage from './errorPage';

import {
    makeStyles,
    Hidden
} from '@material-ui/core';

import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";




const Contenedor = (props) => {

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        minWidth: 400,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}))


    //No mostrar sidebar y navbar
    const [noBars, setNoBars] = React.useState(false);

    const classes = useStyles();

    const selector = (vistaCelular) => {


        return (
            <div className={classes.content}>
                <Switch>
                    <Route
                        exact
                        component={() => <ListaDiscos todos  vistaCelular= {vistaCelular}/>}
                        path="/todos" />
                    <Route
                        exact
                        component={() => <ListaDiscos soloActivos  vistaCelular= {vistaCelular}/>}
                        path="/" />
                    <Route
                        exact
                        component={() => <ListaDiscos incidencia noBars={setNoBars(true)}  vistaCelular= {vistaCelular}/>}
                        path="/incidencia/:id" />
                    <Route
                        exact
                        component={() => <ListaDiscos incidencia nominados noBars={setNoBars(true)}  vistaCelular= {vistaCelular}/>}
                        path="/incidencia/:id/nominados" />
                    <Route
                        exact
                        component={() => <ListaDiscos nominado noBars={setNoBars(true)}  vistaCelular= {vistaCelular}/>}
                        path="/nominado/:id" />
                    <Route
                        exact
                        component={() => <ListaDiscos discounidad noBars={setNoBars(true)}  vistaCelular= {vistaCelular}/>}
                        path="/discounidad/:id" />

                    <Route
                        exact
                        component={() => <Perfil />}
                        path="/usuario" />

                    <Route
                        exact
                        component={() => <ErrorPage  noBars={setNoBars(true)} />}
                        path="/error" />
                </Switch>
            </div>
        )
    }
    return (
             <div className={classes.root}>
                <Router>
                    
                    {/* PC */}
                    <Hidden only="xs">
                        {!noBars ?  <Sidebar variant="permanent" /> : null}
                        {selector(false)}
                    
                    </Hidden>

                    {/* CELULAR */}
                    <Hidden smUp>
                        {!noBars ?  <Sidebar variant="temporary" vistaCelular /> : null}
                        {selector(true)}
                    </Hidden>                

                </Router>
            </div>
   
       
    );
}

export default Contenedor;