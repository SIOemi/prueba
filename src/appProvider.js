import React from 'react';
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
import { decode } from 'js-base64';
import * as moment from 'moment';
import unidades from './datos/unidades.json';
import { Typography, Box } from '@material-ui/core';

import axios from 'axios';

const CONFIG = window.data;

const doLogin = () =>
    window.location.href = CONFIG.autenticacionSIO + window.location.href;


const AppProvider = (props) => {

    const [cookies, setCookie, removeCookie] = useCookies(["token"]);



    var initial_state = {
        vistaCompacta: true,
        reloadListaDiscos: 0,
        jefesDeTrabajosUnidad: {},
        cargaFinalizada: false,
        unidadDesc: "",
        perfilDesc: "",
        error: false,
        shoswSidebar: true,
        borrarCookies: () => {
            window.location.href = "/PAW";
        }
    }

  
console.log(cookies)

    //guarda VALOR en la cookie NOMBRE por una hora
    const guardarCookie = (nombre, valor) => {
        setCookie(nombre, valor, { path: "/", maxAge: 3600 });
        var newState = { ...initial_state };
        newState[nombre] = valor;
        initial_state = newState;
    }


    React.useEffect(() => {
        removeCookie('token');
        // cookie con token que contienen usuario encriptado
        let params = queryString.parse(window.location.search);
        if (
            !state.cargaFinalizada && cookies.token && cookies.nombre && cookies.ci && cookies.unidadDesc &&
            cookies.unidad && cookies.perfilDesc && cookies.operadorCMD && cookies.cargaFinalizada
        ) {

            console.log(cookies)
            initial_state = {
                ...initial_state,
                nombre: cookies.nombre,
                ut: cookies.token,
                ci: cookies.ci,
                unidadDesc: cookies.unidadDesc,
                unidad: cookies.unidad,
                perfilDesc: cookies.perfilDesc,
                operadorCMD: cookies.operadorCMD === "true",
                responsableUnidad: cookies.responsableUnidad === "true",
                usuarioConsulta: cookies.usuarioConsulta === "true",
                cargaFinalizada: cookies.cargaFinalizada === "true",
                error: cookies.error === "true"
            }

            setState(initial_state);
        }
        else if (
            params.usuario == null
        ) {
            doLogin();
        }
        else { //Obtener usuario de URL y registrar cookie


            let data = decode(params.usuario).split("|", 4); // obtengo datos de la url

            //control de antiguedad
            let fechaServidor = data[3];
            let fechaCliente = (moment(Date.now())).format('YYYYMMDDHHmm');
            if (fechaCliente - fechaServidor > 5) doLogin();

            //Guardo el UT data[0]
            guardarCookie("token", data[0]);

            //Guardo el PERFIL  
            let operadorCMD = data[1].includes("OPERADOR_DE_CMD");
            let responsableUnidad = data[1].includes("RESPONSABLE_DE_UNIDAD");
            let usuarioConsulta = data[1].includes("CONSULTA") && !operadorCMD && !responsableUnidad;

            let perfilDesc = operadorCMD
                ? "Operador de CMD"
                : responsableUnidad
                    ? "Resposanble de Unidad"
                    : usuarioConsulta
                        ? "Consulta"
                        : "";


            guardarCookie("operadorCMD", operadorCMD);
            guardarCookie("responsableUnidad", responsableUnidad);
            guardarCookie("usuarioConsulta", usuarioConsulta);
            guardarCookie("perfilDesc", perfilDesc);



            //Guardo la UNIDAD data[2]

            let unidad = data[2];
            console.log("estoy")
            console.log(unidad);
            var unidadDesc = unidades.filter(u => u.id === unidad);
            console.log(unidadDesc);
            unidadDesc = !unidad || unidad === ""
                ? ""
                : unidadDesc.length > 0
                    ? unidadDesc[0].desc
                    : "Unidad desconocida";

            //Asigno la unidad 6300 por defecto para todos los operadores de CMD
            if (operadorCMD && (!unidad || unidad == "")) {
                unidad = 6300;
                unidadDesc = "Mantenimiento Montevideo"
            }

            guardarCookie("unidad", unidad);
            guardarCookie("unidadDesc", unidadDesc);





            //Guardo el NOMBRE y CI
            let xmls = CONFIG.xmls_obtenerPersona(data[0]);

            axios.post(CONFIG.servicetopaw, xmls, { headers: { 'Content-Type': 'text/xml' } })
                .then(res => {


                    if (unidadDesc === "" && perfilDesc === "")
                        throw 'Usuario sin unidad ni perfil asignado';
                    else if (perfilDesc === "")
                        throw 'Usuario sin perfil asignado';
                    else if (unidadDesc === "")
                        throw 'Usuario sin unidad asignada';

                    let token = res.data.split('<?xml version="1.0"')[0];
                    let data = JSON.parse(token);

                    //CI y NOMBRE
                    guardarCookie("ci", data.NumeroDocumento);
                    guardarCookie("nombre", data.Nombres.split(" ")[0] + " " + data.PrimerApellido);

                    let nuevaURL = `${window.location.href}`.replace(/(\?usuario=)[^#]*/g, "");
                    window.location.href = nuevaURL; //`${window.location.href}`;

                    //Craga Finalizada
                    guardarCookie("cargaFinalizada", true);
                    guardarCookie("error", unidadDesc === "" || perfilDesc === "");
                    setState(initial_state);


                })
                .catch(error => { alert("No se pudieron cargar los datos del usuario.\n" + error); });

        }



    }, []);


    const [state, setState] = React.useState(initial_state);



    const mensajeError = state.error && (
        <Box display="flex" flexDirection="column" alignItems="center" style={{ margin: 20, marginTop: 60 }}>
            <img src="/PAW/assets/images/errorFace.png" style={{ width: 40, height: 40 }} />
            <div style={{ marginTop: 20 }}>
                <Typography variant="h6" color="initial">"Error!"</Typography>
                <Typography variant="subtitle" color="initial">Comuniquese con la administración.</Typography>
            </div>
        </Box>
    )



    return (
        <div>
            <AppContext.Provider value={[state, setState]}>

                {state.cargaFinalizada
                    ? props.children
                    : <Box display="flex" flexDirection="row" alignItems="center" style={{ marginLeft: 20 }}>
                        <Typography variant="subtitle1" color="initial">Abriendo PAW</Typography>
                        <img alt="" src="/PAW/assets/images/wait.gif" width="100px" />
                    </Box>
                }
            </AppContext.Provider>
        </div>
    );

}

export default AppProvider;
export const AppContext = React.createContext();