import React, { useEffect } from 'react';
import queryString from 'query-string';
import configData from "../config.json";
import { useCookies } from 'react-cookie';
import { decode } from 'js-base64';
import * as moment from 'moment';
import { AppContext } from '../appProvider';

import axios from 'axios';


const obtenerDatosPorUt = (ut) => {
  let datosPorUt = {

    ci:"48964228",
    Nombres:"Emiliano",
    PrimerApellido:"Rialan",
  };

  ut={
    
  }
  let xmls="<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>\
    <soap:Body>\
      <ObtenerPersonaSAPPorUT xmlns='http://tempuri.org/'>\
        <utPersonaSAP>" + ut + "</utPersonaSAP>\
      </ObtenerPersonaSAPPorUT>\
    </soap:Body>\
  </soap:Envelope>";

  axios.post('http://siotst/sioservweb/servicetopaw.asmx',
    xmls,
    {headers:
      {'Content-Type': 'text/xml'}
    }).then(res=>{
      let data = JSON.parse(res.data.split('<?xml version="1.0"')[0]);
      datosPorUt.ci = data.NumeroDocumento;
      datosPorUt.nombre = data.Nombres.split(" ")[0] + " " + data.PrimerApellido;
    }).catch(err=>{console.log(err)});
    console.log(datosPorUt);
    return datosPorUt;
}



function doLogin(){
  window.location.href = configData.LOGIN_URL + window.location.href;
}

const Login = () => {
    const [state, setState] = React.useContext(AppContext);
    console.log(state);
    //cookie con token que contienen usuario encriptado
    const[cookies, setCookie, removeCookie] = useCookies(["token"]);
    let usuario = "";
    let params = queryString.parse(window.location.search);
    if (!cookies.token && params.usuario == null)  //sin usuario en cookie ni en url
      doLogin();
      //Usuario en URL, remover usuario del la URL y registrar cookie
    else if (params.usuario != null) {
      // obtengo datos de la url
      let data = decode(params.usuario).split("|",2 );
      usuario = data[0];
      let fechaServidor = data[1];
      let fechaCliente = (moment(Date.now())).format('YYYYMMDDHHmm');
  
      //control de antiguedad
      if(fechaCliente-fechaServidor > 5) doLogin();
      setCookie("token", usuario, {path: "/", maxAge : 3600}); // 1 hora de validez 
      window.location.href = `${window.location.href}`;      
  
    }
   

    useEffect(()=>{
      let newState = null;
      if (state.logged) newState = state
      else {
        let datosPorUt = obtenerDatosPorUt(usuario);
        let nombre = datosPorUt.nombre;
        console.log(nombre);
        
        newState = { 
          ...state, 
          ci: "20158776", //datosPorUt.ci
          nombre: datosPorUt.nombre,
          ut: usuario,
          logged: true
        }
      }
      setState(newState);
    })

    return null;
}
 
export default Login;