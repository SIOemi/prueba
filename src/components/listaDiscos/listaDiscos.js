import React from 'react';
import BarraSuperiorActivos from './barraSuperiorActivos';
import BarraSuperiorTodos from './barraSuperiorTodos';
import Incidencia from '../incidencia/incidencia';
import { serviciosGEMA } from '../../servicios/servicios';
import { AppContext } from '../../appProvider';
import { Box, Button, Hidden, Fab, Tooltip} from '@material-ui/core';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import Titulo from '../layout/titulo';
//import axios from 'axios';
import dateFormat, { masks } from "dateformat";
import ResumenIncidencias from './resumenIncidencias';

//Acciones sobre DU
import Asignar from '../discoUnidad/acciones/asignar';
import SolicitarFirma from '../discoUnidad/acciones/solicitarFirma';
import FirmarDU from '../discoUnidad/acciones/firmarDU';
import CancelarFirma from '../discoUnidad/acciones/cancelarFirma';
import Desasignar from '../discoUnidad/acciones/desasignar';
import Eliminar from '../discoUnidad/acciones/eliminar';


//Acciones sobre DT
import Comunicar from '../discoTrabajo/acciones/comunicar';
import Firmar from '../discoTrabajo/acciones/firmar';
import Sustituir from '../discoTrabajo/acciones/sustituir';
import Colocar from '../discoTrabajo/acciones/colocar';
import Extraviado from '../discoTrabajo/acciones/extraviado';

import {obtenerNombrePersonaLstDiscos as obtenerNombrePersona} from '../../utils/utils';

import Typography from '@material-ui/core/Typography';

import { useParams } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(4),
      },
}))


const BlackTooltip = withStyles({
    tooltip: {
      color: "white",
      backgroundColor: "black",
      fontSize: 16
    }
  })(Tooltip);

const ListaDiscos = (props) => {

    const classes = useStyles();

    const [state, setState] = React.useContext(AppContext);
    const [renderList, setRenderList] = React.useState(true);
    const [loading, setLoading] = React.useState(true);

    //Error al cargar
    const [errorAlCargar, setErrorAlCargar] = React.useState(false);

    //Incidencias
    const [incidencias, setIncidencias] = React.useState([]);
    const [fechasIncidencias, setFechasIncidencias] = React.useState(null);

    //solicitudes GEMA
    const [solicitudesGEMA, setSolicitudesGEMA] = React.useState([]);
    const asociarSolicitud = (solicitudSIO, solicitudGEMA) => {
        let solicitudes = solicitudesGEMA;
        solicitudes[solicitudSIO] = solicitudGEMA;
        setSolicitudesGEMA(solicitudes);
    }

    //Busqueda
    const [buscarPor, setBuscarPor] = React.useState(-1);
    const [valorBusqueda, setValorBusqueda] = React.useState(null);
    const [fechaDesde, setFechaDesde] = React.useState(null);
    const [fechaHasta, setFechaHasta] = React.useState(null);
    const [unidadBusqueda, setUnidadBusqueda] = React.useState("0");
    const [infoFechas, setInfoFechas] = React.useState(null);


    //ultima actualización de datos
    const [ultimaActualizacion, setUltimaActualizacion] = React.useState(Date.now());
    const [diferenciaFechas, setDiferenciaFechas] = React.useState("");

    //Carga de datos

    const convertirEstado = (estadoGEMA) => {
        if (estadoGEMA === 'PLANIFICADO') return "planificado";
        if (estadoGEMA === 'COMUNICADO') return "comunicado";
        if (estadoGEMA === 'COLOCADO') return "colocado";
        if (estadoGEMA === 'ENVIADO') return "colocado"; //para discos nominados
        if (estadoGEMA === 'FIRMADO') return "finalizado";
        if (estadoGEMA === 'DESASIGNADO') return "desasignado";
        if (estadoGEMA === 'RETIRADO') return "retirado";
        if (estadoGEMA === 'ELIMINADO') return "eliminado";
        return ""
    }


    const formatearUbicacion = (ubicacion) => ubicacion.split("|").join("❭");
   
    const procesarMembers = (members, tipo, ids) => {

        //Recorro todos los members para obtener la relacion entre las solicitudes de SIO y GEMA
        members.map(e => {
            if (e.ticket){
                let solicitudGEMA = e.ticket && e.ticket[0] ? e.ticket[0].ticketid : null;
                asociarSolicitud(e.solicitud,solicitudGEMA);
            }
        })

        const procesarDT = (members) => {
            var discos_trabajos = {}; //(key, value) = (id DU padre, DT)
            members.map(e => {
                if (e.tipo === "DT" && e.status !== "DESASIGNADO") {
                    var dt = {};
                    dt.fecha = e.statusdate;
                    dt.id = e.utd_nardisdiscoid;
                    dt.extraviado=e.extraviado;
                    dt.unidad = e.unidad;
                    dt.solicitud= e.solicitud ? e.solicitud : "0";
                    dt.numero = (e.status !== "PLANIFICADO" && e.status !== "COMUNICADO") ? e.nrodisco : "";
                    dt.nombre = obtenerNombrePersona(e.jefetrabajo, e.person, false);
                    dt.nombreCompleto = obtenerNombrePersona(e.jefetrabajo, e.person, true);
                    dt.estado = e.status ? convertirEstado(e.status) : "";
                    dt.historico = [];
                    if (!discos_trabajos[e.padre]) discos_trabajos[e.padre] = [];
                    discos_trabajos[e.padre].push(dt);
                }
            })
            return discos_trabajos;
        }

        const procesarDU = (members, discos_trabajos) => {
            var incidencias_ = [];
            members.map(e => {
                if (e.tipo === "DU" && e.status !== "ELIMINADO" && e.status !== "COLOCADO") {
                    var inc = e.incidencia;
                    var sol = e.solicitud ? e.solicitud : "0";
                    var key = inc; //+ "-" + sol;
                    if (!incidencias_[key]) {
                        var inc_ = {};
                        inc_.discosUnidad = [];
                        inc_.discosNominados = [];
                        incidencias_[key] = inc_;
                    }
                    incidencias_[key].incidencia = inc;
                    incidencias_[key].solicitud = sol;
                    incidencias_[key].descIncidencia = '';
                    var discoUnidad = {};
                    discoUnidad.fecha = e.statusdate;
                    discoUnidad.historico = [];
                    discoUnidad.firmaSolicitada = e.status === 'FIRM_SOL';
                    discoUnidad.firmaPlanificada = e.status === 'FIRMPLA';
                    discoUnidad.encargadoFirma = '';
                    discoUnidad.latitud = e.latitud;
                    discoUnidad.longitud = e.longitud;
                    discoUnidad.encargadoFirmaCI = e.jefetrabajo;
                    if ((e.status === 'FIRM_SOL' || e.status === 'FIRMPLA') && e.person)
                        discoUnidad.encargadoFirma = obtenerNombrePersona(e.jefetrabajo, e.person, false);

                    discoUnidad.id = e.utd_nardisdiscoid;
                    discoUnidad.extraviado= e.extraviado;
                    discoUnidad.numero = e.nrodisco;
                    discoUnidad.unidad = e.unidad;
                    discoUnidad.ubicacion = formatearUbicacion(e.ubicacion);
                    discoUnidad.solicitud =  e.solicitud ? e.solicitud : "0";

                    //nombre del JT
                    discoUnidad.jefeDeTrabajos = obtenerNombrePersona(e.jefetrabajo, e.person, false);
                    discoUnidad.jefeDeTrabajosCompleto = obtenerNombrePersona(e.jefetrabajo, e.person, true);

                    discoUnidad.estado = convertirEstado(e.status);

                    //agrego los DT y le asigno a cada DT la unicacion de su DU padre
                    var discosTrabajo = discos_trabajos[e.utd_nardisdiscoid];
                    if (discosTrabajo)
                        discosTrabajo = discosTrabajo.map(e => {
                            e.ubicacion = formatearUbicacion(discoUnidad.ubicacion);
                            return e
                        });

                    discoUnidad.discosTrabajos = discosTrabajo ? discosTrabajo : [];
                    incidencias_[key].discosUnidad.push(discoUnidad);
                }
            });
            return incidencias_;

        }


      
        if (tipo === "NUMEROS") {
            
            //En member se obtienen todos los discos con el numero pasado por parametro
            //Se agrega a members los discos faltantes para completar la visualizacion
            //Si es un DT, se carga su DU padre y sus hermanos
            //Si es es un DN no se carga nada mas
            //Si es un DU, se carga todos los DT hijos

            //1) se obtienen todos los id de los DU a mostrar y secargan en members_
            var members_id = [];

            for (let i in members) {
                var disco = members[i];
                if ((disco.tipo === "DT") && (!members_id.includes(disco.padre)))
                    members_id.push(disco.padre);
                if ((disco.tipo === "DU") && (!members_id.includes(disco.utd_nardisdiscoid)))
                    members_id.push(disco.utd_nardisdiscoid);
            }
         
            var members_ = [];
            if (members_id.length === 0) { //entra aca cuando en members solo hay DN

                var incidencias_ = [];

                //obtengo todos los DN de members
                //a priori son todos
                var discos_nominados_members = [];
                for (let i in members) {
                    if (members[i].tipo === "DN")
                        discos_nominados_members.push(members[i]);
                }

                //agrego los DN a las incidencias_
                for (let i in discos_nominados_members) {
                    var dn = {};
                    var e = discos_nominados_members[i];
                    dn.fecha = e.statusdate;
                    dn.id = e.utd_nardisdiscoid;
                    dn.ubicacion = formatearUbicacion(e.ubicacion);
                    dn.extraviado=e.extraviado;
                    dn.unidad = e.unidad;
                    dn.latitud = e.latitud;
                    dn.longitud = e.longitud;
                    dn.numero = e.nrodisco;
                    dn.nombre = obtenerNombrePersona(e.jefetrabajo, e.person, false);
                    dn.nombreCompleto = obtenerNombrePersona(e.jefetrabajo, e.person, true);
                    dn.estado = e.status ? convertirEstado(e.status) : "";
                    dn.solicitud= e.solicitud ? e.solicitud : "0";
                    dn.historico = [];
                    var inc = e.incidencia;
                    var sol = e.solicitud ? e.solicitud : "0";
                    var key = inc; //+ "-" + sol;
                    if (!incidencias_[key])
                        incidencias_[key] = { discosUnidad: [], incidencia: inc, solicitud: sol, descIncidencia: "" };

                    if (!incidencias_[key].discosNominados) incidencias_[key].discosNominados = [];
                    incidencias_[key].discosNominados.push(dn);
                }

                

                var listaIncidencias = [];
                var ids_ = {}; //diccionario (id DU, indice en listaIncidencias del DU)
                var indx = 0;
                for (var e in incidencias_) {
                    listaIncidencias.push(incidencias_[e]);
                    ids_[incidencias_[e].id] = indx;
                    indx = indx + 1;
                }

                setIncidencias(listaIncidencias);
                setLoading(false);
                return

            }
            else {
                
                var url = baseUrl(query_params) + "utd_nardisdiscoid in [" + members_id + "]";
                serviciosGEMA.get(url)
                    .then(response => {
                        members_ = response.data.member;
                       //2) se obtienen todos los DT que tienen como padre alguno 
                        //de los DU en members_ y se agregan a members
                        url = baseUrl(query_params) + "padre in [" + members_id + "]";
                        serviciosGEMA.get(url)
                            .then(response => {
                                var membersDT_ = response.data.member;
                                members_ = [...members_, ...membersDT_];

                                //Discos de Trabajo
                                var discos_trabajos = procesarDT(members_);

                                //Discos a Unidad
                                var incidencias_ = procesarDU(members_, discos_trabajos);

                                //3) por ultimo se agregan a members_ los DN de members
                                var discos_nominados_members = [];

                                for (let i in members) {
                                    if (members[i].tipo === "DN")
                                        discos_nominados_members.push(members[i]);
                                }

                                //agrego los DN a las incidencias_
                                for (let i in discos_nominados_members) {
                                    var dn = {};
                                    var e = discos_nominados_members[i];
                                    dn.fecha = e.statusdate;
                                    dn.id = e.utd_nardisdiscoid;
                                    dn.ubicacion = formatearUbicacion(e.ubicacion);
                                    dn.unidad = e.unidad;
                                    dn.extraviado=e.extraviado;
                                    dn.latitud = e.latitud;
                                    dn.longitud = e.longitud;
                                    dn.numero = e.nrodisco;
                                    dn.nombre = obtenerNombrePersona(e.jefetrabajo, e.person, false);
                                    dn.nombreCompleto = obtenerNombrePersona(e.jefetrabajo, e.person, true);
                                    dn.estado = e.status ? convertirEstado(e.status) : "";
                                    dn.solicitud= e.solicitud ? e.solicitud : "0";
                                    dn.historico = [];
                                    var inc = e.incidencia;
                                    var sol = e.solicitud ? e.solicitud : "0";
                                    var key = inc; //+ "-" + sol;
                                    if (!incidencias_[key])
                                        incidencias_[key] = { discosUnidad: [], incidencia: inc, solicitud: sol, descIncidencia: "" };

                                    if (!incidencias_[key].discosNominados) incidencias_[key].discosNominados = [];
                                    incidencias_[key].discosNominados.push(dn);
                                }



                                var listaIncidencias = [];
                                var ids_ = {}; //diccionario (id DU, indice en listaIncidencias del DU)
                                var indx = 0;
                                for (var e in incidencias_) {
                                    listaIncidencias.push(incidencias_[e]);
                                    ids_[incidencias_[e].id] = indx;
                                    indx = indx + 1;
                                }

                                setIncidencias(listaIncidencias);
                                setLoading(false);
                                return
                            }
                            )
                            .catch(error => {
                                setIncidencias([]);
                                setLoading(false);
                                setErrorAlCargar(true);
                                alert("Error al procesar members. (2): " + error)
                            })

                    })
                    .catch(error => {
                        setIncidencias([]);
                        
                        setErrorAlCargar(true);
                        setLoading(false);
                        alert("Error al procesar members. (1): " + error)
                    })
            }

        }
        else if (tipo === "DISCOUNIDAD") {
            //Discos de Trabajo
            var discos_trabajos = procesarDT(members);

            //Discos a Unidad
            var incidencias_ = procesarDU(members, discos_trabajos);

            var listaIncidencias = [];
            var ids_ = {}; //diccionario (id DU, indice en listaIncidencias del DU)
            var indx = 0;
            for (var e in incidencias_) {
                listaIncidencias.push(incidencias_[e]);
                ids_[incidencias_[e].id] = indx;
                indx = indx + 1;
            }

            setIncidencias(listaIncidencias);
            setLoading(false);
            return

        }
        else {
            var url = "";
            if (tipo === "TODOS") var url = "unidad=" + state.unidad + " and tipo=\"DN\""
            else if (tipo === "ACTIVOS") url = "unidad=" + state.unidad + " and status=\"ENVIADO\" and tipo=\"DN\""
            else if (tipo === "INCIDENCIA") url = "incidencia=\"" + ids + "\" and tipo=\"DN\""
            else if (tipo === "NOMINADOS") url = "incidencia=\"" + ids + "\" and tipo=\"DN\""
            else if (tipo === "NOMINADO") url = "utd_nardisdiscoid=" + ids + " and tipo=\"DN\""
            else if (tipo === "SOLICITUD" ) url = "solicitud=\"" + ids + "\" and tipo=\"DN\""
            //else if (tipo === "FECHA") url = "statusdate>=\""+ ids.f_desde + "\" and statusdate<=\""+ ids.f_hasta + "\" and unidad=" + ids.unidadBusqueda +" and tipo=\"DN\"";
            else if (tipo === "FECHA") url = "incidencia in [" + ids + "] and tipo=\"DN\""

            url = baseUrl(query_params) + url;

            if (tipo !== "ACTIVOS") url += " and status in [\"ENVIADO\",\"FIRMADO\",\"RETIRADO\"]";

            serviciosGEMA.get(url)
                .then(response => {
                    var listaIncidencias = [];
                    if (members.length !== 0) {
                        //Discos de Trabajo
                        var discos_trabajos = procesarDT(members);
                        //Discos a Unidad
                        var incidencias_ = procesarDU(members, discos_trabajos);
                    } else {
                        //Discos a Unidad
                        var incidencias_ = [];
                    }


                    var discos_nominados_members = response.data.member;
                    //agrego los DN a las incidencias_
                    for (let i in discos_nominados_members) {
                        var dn = {};
                        var e = discos_nominados_members[i];
                        dn.id = e.utd_nardisdiscoid;
                        dn.ubicacion = formatearUbicacion(e.ubicacion);
                        dn.unidad = e.unidad;
                        dn.extraviado=e.extraviado;
                        dn.latitud = e.latitud;
                        dn.fecha = e.statusdate;
                        dn.longitud = e.longitud;
                        dn.numero = e.nrodisco;
                        dn.nombre = obtenerNombrePersona(e.jefetrabajo, e.person, false);
                        dn.nombreCompleto = obtenerNombrePersona(e.jefetrabajo, e.person, true);
                        dn.estado = e.status ? convertirEstado(e.status) : "";
                        dn.solicitud= e.solicitud ? e.solicitud : "0";
                        dn.historico = [];
                        var inc = e.incidencia;
                        var sol = e.solicitud ? e.solicitud : "0";
                        var key = inc; //+ "-" + sol;
                        if (!incidencias_[key])
                            incidencias_[key] = { discosUnidad: [], incidencia: inc, solicitud: sol, descIncidencia: "" };

                        if (!incidencias_[key].discosNominados) incidencias_[key].discosNominados = [];
                        incidencias_[key].discosNominados.push(dn);
                    }

                    var ids_ = {}; //diccionario (id DU, indice en listaIncidencias del DU)
                    var indx = 0;
                    for (var e in incidencias_) {
                        listaIncidencias.push(incidencias_[e]);
                        ids_[incidencias_[e].id] = indx;
                        indx = indx + 1;
                    }

                    setIncidencias(listaIncidencias);
                    setLoading(false);
                })
                .catch(error => {
                    setIncidencias([]);     
                    setErrorAlCargar(true);
                    setLoading(false);
                    alert("Error al procesar members..: " + error)
                })

        }




    }


    const { id } = useParams();

    const CONFIG = window.data;

    var query_params = "status,ticket, status_description, tipo, changeby, incidencia, jefetrabajo, nrodisco, padre, unidad, solicitud, utd_nardisdiscoid, person, ubicacion, extraviado, latitud, longitud, statusdate  ";
    const baseUrl = (query_params) => "/utd_nardisdisco?lean=1&oslc.select=" + query_params + "&_dropnulls=0&oslc.where=";

    const cargarDu = (idDU, numeroDU) => {
        var url = (idDU)
            ? baseUrl(query_params) + "UTD_NARDISDISCOID=" + idDU
            : baseUrl(query_params) + "nrodisco=\"" + numeroDU + "\"";
        serviciosGEMA.get(url)
            .then(response => {
                var du = response.data.member;
                url = baseUrl(query_params) + "padre=" + du[0].utd_nardisdiscoid;
                serviciosGEMA.get(url)
                    .then(response => {
                        var members = response.data.member;
                        members.push(du[0]);
                        procesarMembers(members, "DISCOUNIDAD", null)
                    })
                    .catch(error => alert("Error al cargar DT asociados al DU: " + error))
            })
            .catch(error => alert("Error al cargar el DU: " + error))
    }

    const cargarDisco = (id, numero) => {
        var url = (id)
            ? baseUrl(query_params) + "UTD_NARDISDISCOID=" + id
            : baseUrl(query_params) + "nrodisco=\"" + numero + "\"";

        if (!numero || numero === "") procesarMembers([], "DISCO", null); //solucion a problema a discos que quedaron sin numero
        else {
            serviciosGEMA.get(url)
                .then(response => {
                    var member = response.data.member;
                    if (member && member.length > 0) {
                        if (member[0].tipo === "DT") cargarDu(member[0].padre, false)
                        else if (member[0].tipo === "DN") cargarNominado(member[0].utd_nardisdiscoid);
                        else cargarDu(id, numero);
                    } else procesarMembers([], "DISCO", null)
                })
                .catch(error => {
                    setIncidencias([]);
                    
                    setErrorAlCargar(true);
                    setLoading(false);
                    alert("Error al cargar el Disco..: " + error)
                })
        }

    }

    const cargarDiscosPorNumero = (numero, buscarEnMiUidad) => {

        setState((state)=> { return { ...state, numeroDiscoResaltado: numero }});
        var url = baseUrl(query_params) + "nrodisco=\"" + numero + "\"";
        if (buscarEnMiUidad)
            url = url + " and unidad=" + state.unidad;

        serviciosGEMA.get(url)
            .then(response => {
                var member = response.data.member;
                    //en member se cargan todos los discos con el numero pasado por parametro
                    procesarMembers(member, "NUMEROS", null)
            })
            .catch(error => {
                setIncidencias([]);
                
                setErrorAlCargar(true);
                setLoading(false);
                alert("Error al cargar los discos con numero " + numero + ": " + error)
            })
    }

    const cargarNominado = (id) => {
        procesarMembers([], "NOMINADO", id)
    }

    const cargarPorSolicitud = (idSol) => {


        var url = buscarPorIDsio 
            ? baseUrl(query_params) + "solicitud=" + idSol
            : baseUrl(query_params) + 'UTD_SOLGEMA.ticketid=' + idSol;

        serviciosGEMA.get(url)
            .then(response => {
                const id = buscarPorIDsio ? idSol : response.data.member[0].solicitud;
                procesarMembers(response.data.member, "SOLICITUD", id)
            })
            .catch(error => {
                setIncidencias([]);
                
                setErrorAlCargar(true);
                setLoading(false);
                alert("Error al cargar discos de una solicitud: " + error)
            })
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }



    const validarEstado = (tipo,estado) => {
            
        let statusDT = ["COMUNICADO","PLANIFICADO","COLOCADO","FIRMADO"];
        let statusDN = ["ENVIADO","FIRMADO","RETIRADO"];
        let statusDU = ["ENVIADO","FIRM_SOL","FIRMPLA","FIRMADO","RETIRADO"];

        return  (tipo==="DT" && statusDT.includes(estado)) ||
                (tipo==="DN" && statusDN.includes(estado)) ||
                (tipo==="DU" && statusDU.includes(estado)) 
    }
    

    const cargarPorFecha = (desde, hasta, unidadBusqueda) => {
        
        setIncidencias([]);
        setFechasIncidencias({});

        const f_desde =  dateFormat(new Date(parseInt(desde)),"isoUtcDateTime");
        const f_hasta =  dateFormat(new Date(parseInt(hasta)),"isoUtcDateTime");

        let url = baseUrl(query_params) + "statusdate>=\""+ f_desde + "\" and statusdate<=\""+ f_hasta + "\" and unidad=" + unidadBusqueda; // + " and status in " + status;
        setFechasIncidencias({});
        serviciosGEMA.get(url)
            .then(response => {
                let incidencias  = [];
                console.log(response.data.member);
                response.data.member.map(e=> {
                    if (!incidencias.includes(e.incidencia) && validarEstado(e.tipo,e.status))
                        incidencias = incidencias.concat(e.incidencia); 
                })
                
                let url = baseUrl(query_params) + "incidencia in [" + incidencias + "] and unidad=" + unidadBusqueda;
               
                serviciosGEMA.get(url)
                    .then(response => procesarMembers(response.data.member, "FECHA", incidencias))
                    .catch(error => {
                        setIncidencias([]);
                        setErrorAlCargar(true);
                        setLoading(false);
                        alert("Error al cargar discos de una incidencia, intenta nuevamente: " + error)
                    })

        })
        .catch(error => {
            setIncidencias([]);
            setErrorAlCargar(true);
            setLoading(false);
            alert("Error al cargar discos de una incidencia, intenta nuevamente: " + error)
        })
    }
  
    const cargarIncidencia = (idInc) => {

        if (props.nominados) procesarMembers([], "NOMINADOS", idInc)
        else {
            var url = baseUrl(query_params) + "incidencia=" + idInc;
            serviciosGEMA.get(url)
                .then(response => procesarMembers(response.data.member, "INCIDENCIA", idInc))
                .catch(error => {
                    setIncidencias([]);
                    setErrorAlCargar(true);
                    setLoading(false);
                    alert("Error al cargar discos de una incidencia: " + error)
                })
        }

    }

    const cargarListaDiscos = () => {
        //Cargo los DU y los guardo en members
        var members = null;
        var statusActivos = "[\"ENVIADO\",\"FIRM_SOL\",\"FIRMPLA\"]";
        var statusTodos = "[\"ENVIADO\",\"FIRM_SOL\",\"FIRMPLA\",\"FIRMADO\",\"RETIRADO\"]";
        var status = props.soloActivos ? statusActivos : statusTodos;
        var url = baseUrl(query_params) + "unidad=" + state.unidad + " and tipo=\"DU\" and status in " + status + "&collectioncount=1";

        serviciosGEMA.get(url)
            .then(response => {
                members = response.data.member;
                if (members.length !== 0) {
                    //obtengo los id de los DU y cargo los DT
                    var ids_du = members.map(e => e.utd_nardisdiscoid);
                    url = baseUrl(query_params) + "padre in [" + ids_du + "]&collectioncount=1";
                    serviciosGEMA.get(url)
                        .then(response => {
                            members = members.concat(response.data.member);
                            procesarMembers(members, props.soloActivos ? "ACTIVOS" : "TODOS", null);
                        })
                        .catch(error => {
                            alert("Error al cargar los discos de trabajo: " + error)
                            setErrorAlCargar(true);
                            setLoading(false);
                        })
                } else procesarMembers([], props.soloActivos ? "ACTIVOS" : "TODOS", null);
            })
            .catch(error => {
                alert("Error al cargar discos activos: " + error)
                setErrorAlCargar(true);
                setLoading(false);
            })
    }

   
    const sumarDias = (fecha, dias) => fecha.setDate(fecha.getDate() + dias);


    //Filtrado de incidencias
    const [filtro, setFiltro] = React.useState('');
    const cantidad_filtros =  filtro==="" ? 0 : filtro.split(",").length;
    const resaltadoFiltro = cantidad_filtros === 1 ? filtro.toLocaleLowerCase() : "";

    const cantDiasHist = CONFIG.cantidadDiasHistDiscos;

    //RENDER
    React.useEffect(() => {
       
        if (renderList) {
            setDiferenciaFechas("");
            setFechasIncidencias(null);

            let historial =  
                !(buscarPor === 0 ||  buscarPor === 1 || buscarPor === 2 || buscarPor === 3 || 
                props.discounidad || props.incidencia || props.nominado || props.soloActivos);

            const f_desde = (buscarPor === 3)  
                ? sumarDias(new Date(fechaDesde), 0)
                : historial 
                    ? sumarDias(new Date(), -(cantDiasHist-1))
                    : null;

            const f_hasta = (buscarPor === 3)
                ? sumarDias(new Date(fechaHasta), 1)
                : historial
                    ? sumarDias(new Date(), 1)
                    : null;



            setState((state) => {
                return {  ...state, 
                            idDU_UltimaAccion: parametros ? parametros.idDU : null,
                            numeroDiscoResaltado: "",
                            fechaResaltadaDesde: f_desde, 
                            fechaResaltadaHasta: f_hasta
                        }
                }
            );

            

            setInfoFechas(null);
            setLoading(true);
            setErrorAlCargar(false);
            if (buscarPor === 0) cargarIncidencia(valorBusqueda)
            else if (buscarPor === 1) cargarPorSolicitud(valorBusqueda)
            else if (buscarPor === 2) cargarDiscosPorNumero(valorBusqueda, buscarEnMiUidad);
            else if (buscarPor === 3) cargarPorFecha(f_desde, f_hasta, unidadBusqueda)
            else if (props.discounidad) cargarDu(id, false)
            else if (props.incidencia) cargarIncidencia(id)
            else if (props.nominado) cargarNominado(id)
            else if (props.soloActivos) cargarListaDiscos()
            else if (props.todos) {
                cargarPorFecha(f_desde, f_hasta, state.unidad);
                setInfoFechas("Incidencias con discos modificados en los últimos "+ cantDiasHist + " dias");
            }
            setUltimaActualizacion(Date.now())
            setRenderList(false);
        }
    }, [renderList])







    var lista = incidencias;
    if (filtro!=="") {
        lista = incidencias.filter(inc => 
            filtro.split(",")
                .map( f_ => {
                    let f = f_.toLowerCase();
                    //ID incidencia
                    let res_inc = 
                        f!=="" && 
                        inc.incidencia.toLowerCase().includes(f);
                    
                    //Nro | nombre | ubicacion DN
                    let res_dn = 
                        inc.discosNominados.map(dn => 
                            f!=="" && 
                            (
                                dn.numero.toLowerCase().includes(f) ||
                                dn.nombre.toLowerCase().includes(f) ||
                                dn.ubicacion.toLowerCase().includes(f) 
                            )
                        ).includes(true);
                    
                    //Nro | ubicacion DU
                    let res_du = 
                        inc.discosUnidad.map(du => 
                                f!=="" &&  
                                (
                                    du.numero.toLowerCase().includes(f) ||
                                    du.ubicacion.toLowerCase().includes(f) ||
                                    
                                    //Nro | nombre DT
                                    du.discosTrabajos.map(dt =>
                                        dt.numero.toLowerCase().includes(f) ||
                                        dt.nombre.toLowerCase().includes(f)
                                    ).includes(true)
                                   
                                )
                        ).includes(true);
                    
                    return (res_inc || res_dn || res_du)
                })
                .includes(true)   
            )
    }
       
        

    //Si fechasIncidencias (bsuqueda por fecha) 
    //agrego el parametro fecha a las incidencias y las ordeno por fecha
    lista = lista.map(inc =>
        fechasIncidencias
            ? { ...inc, fecha: fechasIncidencias[inc.incidencia] }
            : inc)

    lista = lista.sort((a, b) => {
        if (a.incidencia > b.incidencia) return -1;
        if (a.incidencia < b.incidencia) return 1;
        if (a.solicitud > b.solicitud) return 1;
        return -1;
    });

    //PARAMETROS / MODALES

    const NINGUN_MODAL = 0;
    const MODAL_ASIGNAR = 1;
    const MODAL_ELIMINAR = 2;
    const MODAL_SOLICITAR_FIRMA = 3;
    const MODAL_FIRMAR_DU = 4;
    const MODAL_CANCELAR_FIRMA = 5;
    const MODAL_DESASIGNAR = 6;
    const MODAL_FIRMAR_DT = 7;
    const MODAL_SUSTITUIR = 8;
    const MODAL_COLOCAR = 9;
    const MODAL_COMUNICAR = 10;
    const MODAL_EXTRAVIADO = 11;

    const [parametros, setParametros] = React.useState(null);
    const [modalOpened, setModalOpened] = React.useState(NINGUN_MODAL);

  

   
    const openModal = (modal, datos_disco) =>{
        setParametros(datos_disco);
        setModalOpened(modal);
    }

    const parametrosModal = (modal) => {
         return {
            ...parametros,
            close : () => setModalOpened(NINGUN_MODAL),
            open: modalOpened===modal,
            setRenderList: setRenderList
        }
    }

    
    const accionesDU = {
        openAsignar:        (datos_disco) => openModal(MODAL_ASIGNAR,datos_disco),
        openSolicitarFirma: (datos_disco) => openModal(MODAL_SOLICITAR_FIRMA,datos_disco),
        openFirmarDU:       (datos_disco) => openModal(MODAL_FIRMAR_DU,datos_disco),
        openCancelarFirma:  (datos_disco) => openModal(MODAL_CANCELAR_FIRMA,datos_disco),
        openEliminar:       (datos_disco) => openModal(MODAL_ELIMINAR,datos_disco)
    }

    const accionesDT = {
        ...accionesDU,
        openDesasignar:     (datos_disco) => openModal(MODAL_DESASIGNAR,datos_disco),
        openComunicar:      (datos_disco) => openModal(MODAL_COMUNICAR,datos_disco),
        openFirmar:         (datos_disco) => openModal(MODAL_FIRMAR_DT,datos_disco),
        openColocar:        (datos_disco) => openModal(MODAL_COLOCAR,datos_disco),
        openSustituir:      (datos_disco) => openModal(MODAL_SUSTITUIR,datos_disco),
        openExtraviado:     (datos_disco) => openModal(MODAL_EXTRAVIADO,datos_disco)
    }


  const modales = (
      <React.Fragment>
        <Asignar {...parametrosModal(MODAL_ASIGNAR)} />
        <Eliminar {...parametrosModal(MODAL_ELIMINAR)} />
        <SolicitarFirma {...parametrosModal(MODAL_SOLICITAR_FIRMA)} />
        <FirmarDU {...parametrosModal(MODAL_FIRMAR_DU)} />
        <CancelarFirma {...parametrosModal(MODAL_CANCELAR_FIRMA)} />
        <Desasignar {...parametrosModal(MODAL_DESASIGNAR)} />
        <Comunicar {...parametrosModal(MODAL_COMUNICAR)} />
        <Firmar {...parametrosModal(MODAL_FIRMAR_DT)} />
        <Sustituir {...parametrosModal(MODAL_SUSTITUIR)} />
        <Colocar {...parametrosModal(MODAL_COLOCAR)} />
        <Extraviado {...parametrosModal(MODAL_EXTRAVIADO)} />
      </React.Fragment>
  )

    const [buscarEnMiUidad, setBuscarEnMiUidad] = React.useState(true);
    const [buscarPorIDsio,setBuscarPorIDsio] = React.useState(true);

    const barraTodos = () => {
        var params = {};
        params.setRenderList = setRenderList;
        params.setBuscarPor = setBuscarPor;
        params.setValorBusqueda = setValorBusqueda;
        params.setFechaDesde = setFechaDesde;
        params.setFechaHasta = setFechaHasta;
        params.setUnidadBusqueda = setUnidadBusqueda;
        params.setBuscarEnMiUidad = setBuscarEnMiUidad;
        params.setBuscarPorIDsio = setBuscarPorIDsio;
        
        return (
            <div>
                <Hidden only="xs"> <BarraSuperiorTodos  {...params} /> </Hidden>
                <Hidden smUp> <BarraSuperiorTodos {...params} vistaMovil/> </Hidden>
            </div> 
        )}


    const calcularDiferenciaFechas = (fecha_1, fecha_2) => {
        var seconds = Math.floor((fecha_2 - (fecha_1)) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        hours = hours - (days * 24);
        minutes = minutes - (days * 24 * 60) - (hours * 60);
        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
        var res = hours === 1
            ? " | hace una hora"
            : hours > 1
                ? " | hace " + hours + " horas"
                : minutes === 1
                    ? " | hace 1 minuto"
                    : minutes > 1
                        ? " | hace " + minutes + " minutos"
                        : " | hace menos de un minuto";
        setDiferenciaFechas(res);
    }

    React.useEffect(() => {
        const interval = setInterval(() => { calcularDiferenciaFechas(ultimaActualizacion, new Date); }, 1000)
        return () => clearInterval(interval);
    }, [ultimaActualizacion]);



    const titulo = props.soloActivos
        ?  "Discos Activos"
        : props.todos 
            ? "Todos los discos"
            : "";

    const subtitulo = props.soloActivos && state.unidadDesc;

    const resumen = <ResumenIncidencias lista={incidencias} setFiltro={setFiltro}/>;

    return (

        

        <div>

           
                {(props.soloActivos || props.todos) && <Titulo titulo={titulo} subtitulo={subtitulo}/>}
                {props.soloActivos && !loading && <BarraSuperiorActivos setFiltro={setFiltro} filtro={filtro} vistaCelular={props.vistaCelular} />}
                {props.todos && barraTodos()}


            {  loading
                ? <Box display="flex" flexDirection="row" alignItems="center">
                    <img alt="" src="/PAW/assets/images/loading.gif" width="60px" />
                    <Typography variant="subtitle1" color="initial">Obteniendo discos</Typography>
                </Box>
                : errorAlCargar ?
                    <Button
                        variant="text"
                        border="0px"
                        style={{ textTransform: 'none', width: "fit-content" }}
                        color="default"
                        onClick={() => setRenderList(true)}
                        startIcon={<RefreshOutlinedIcon />}
                    >
                        Reintentar | No pudimos conectarnos con la base de discos
            </Button>
                    : !lista || lista.length === 0 ?
                        <Button
                            variant="text"
                            border="0px"
                            style={{ textTransform: 'none', width: "fit-content" }}
                            color="default"
                            onClick={() => setRenderList(true)}
                            startIcon={<RefreshOutlinedIcon />}
                        >
                            Actualizar | No se obtuvieron datos
                            </Button>

                        :
                        <div>

                            {!infoFechas ?
                                <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                                    <Button
                                        variant="text" border="0px" style={{ textTransform: 'none' }} color="default" onClick={() => setRenderList(true)}
                                        startIcon={<RefreshOutlinedIcon />}
                                    >
                                        Actualizar {diferenciaFechas}
                                    </Button>

                                </Box>
                                :
                                <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                                  <BlackTooltip title="Los discos con bordes punteados no fueron modificados en el periodo seleccionado." placement="left">
                                        <Button
                                            variant="text" border="0px" style={{ textTransform: 'none', textAlign: "left" }} color="default" onClick={() => setRenderList(true)}
                                            startIcon={<RefreshOutlinedIcon />}
                                        >
                                            {infoFechas}
                                        </Button>
                                    </BlackTooltip>
                                </Box>

                            }


                            <Box display="flex" flexDirection="column">   
                                {/*props.soloActivos && resumen*/}
                                
                                    {lista.map(inc =>{
                                        return (
                                        <Incidencia
                                            {...inc}
                                            {...props}
                                            incidencia={inc.incidencia}
                                            solicitudesGEMA={solicitudesGEMA}
                                            key={inc.incidencia}
                                            accionesDT={accionesDT}
                                            accionesDU={accionesDU}
                                            resaltadoFiltro={resaltadoFiltro}
                                        />
                                        )
                                    }
                                    )}
                            </Box>


                       

                      
                        </div>

            }
            <Fab className={classes.fab} color="primary"  onClick={() => setRenderList(true)} style={{backgroundColor: "#0678f4"}}>
                <RefreshOutlinedIcon/>
            </Fab>


           

           {modales}
            
        </div>
    );
}

export default ListaDiscos;