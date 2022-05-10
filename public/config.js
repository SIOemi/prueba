entorno = "Pre" //"Test" - "Pre" - "Prod"
version = "1.0.0"



xmls_obtenerPersona = (ut) => 
    "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>\
        <soap:Body>\
            <ObtenerPersonaSAPPorUT xmlns='http://tempuri.org/'>\
            <utPersonaSAP>" + ut + "</utPersonaSAP>\
            </ObtenerPersonaSAPPorUT>\
        </soap:Body>\
    </soap:Envelope>";

xmls_incidenciaPorFecha = (desde,hasta,unidad) =>
    "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>\
        <soap:Body>\
        <CargarIncidenciasPorRangoFechasConDiscoAsociadoYUnidad xmlns='http://tempuri.org/'>\
            <vdtFechaIni>" + desde + "</vdtFechaIni>\
            <vdtFechaFin>" + hasta + "</vdtFechaFin>\
            <idUnidad>" + unidad + "</idUnidad>\
        </CargarIncidenciasPorRangoFechasConDiscoAsociadoYUnidad>\
        </soap:Body>\
    </soap:Envelope>";

localizar_GOOGLE = (latitud, longitud) => "https://www.google.com/maps?q="+ longitud + "," + latitud,
localizar_EGEO = (latitud,longitud) => "http://svwegeonvprd/network_viewer/#/map/" + longitud + "," + latitud +",18z";

razonesContingencia = ["Celular sin conexión", "Celular sin batería", "Hurto o extravío", "Otros"];



datos = (entorno) => {


    if (entorno == "Test") {
        SIO_Server = "http://siotst";
        SIO_Server_auth = "http://siotst"; 
        GEMA_Server = "http://gematstif";
        maxauth = "bWF4YWRtaW46bWF4YWRtaW4="
    }

    if (entorno == "Pre") {
        SIO_Server = "http://siotst";
        SIO_Server_auth = "http://sioapp";
        GEMA_Server = "http://sgdgemaif";
        maxauth = "TkFSRElTV0VCOmVOVUIqUDdv"
    }

    if (entorno == "Prod") {
        SIO_Server = "http://sioapp";
        SIO_Server_auth = "http://sioapp";
        GEMA_Server = "http://sgdgemaif";
        maxauth = "TkFSRElTV0VCOmVOVUIqUDdv"
    }

    return {
        version: version,
        entorno: entorno,
        autenticacionSIO: SIO_Server_auth + "/PAW/Autenticacion/home/login?returnPath=",
        servicetopaw: SIO_Server + "/sioservweb/servicetopaw.asmx",
        serviciosGEMA: { maxauth: maxauth, baseURL:  GEMA_Server + "/maxrest/oslc/os/"},
        consultaIncidenciaSIO : SIO_Server + "/sioweb/Incidencias/Consulta?id=",
        url_incidenciaPorFecha :SIO_Server + "/sioservweb/servicetopaw.asmx?op=CargarIncidenciasPorRangoFechasConDiscoAsociadoYUnidad",
        localizar_GOOGLE : localizar_GOOGLE,
        localizar_EGEO: localizar_EGEO,
        xmls_obtenerPersona : xmls_obtenerPersona,
        razonesContingencia : razonesContingencia,
        xmls_incidenciaPorFecha : xmls_incidenciaPorFecha,
        cantidadDiasHistDiscos: 7
    }
}

data = datos(entorno)
