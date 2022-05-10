
/*  Devueleve el nombre con cada inicial en mayuscula */
export function formatearNombre (nombre) {
   return nombre.split(' ')
        .map(word => {
            const upperedCase = word && word[0] ? word[0].toUpperCase() : "";
            const loweredCase = word && word[1] ? word.toLowerCase().slice(1) : "";
            return (upperedCase + loweredCase)
        })
        .join(" ");
}


/*  Obtiene el nombre formateado de la pesona con personid en persons
    Completo = TRUE -> Delvuelve el nombre completo con cada inicial en mayuscula  
    Completo = FALSE -> Delvuelve el primer nombre y el primer apellido con cada inicial en mayuscula   */
/*  Si listar_discos= true y no encuentro la persona, deuelvo "---" */     
export function obtenerNombrePersona  (personid, persons, completo,listar_discos = false) {
    var person = !persons ? null : persons.filter(p => p.personid === personid);
    var nombre = '';
    if (!person)
        nombre = personid;
    if (!person && listar_discos)
        return "---"
    else if (person && person.length > 0)
        nombre = completo
            ? person[0].firstname + " " + person[0].lastname
            : person[0].firstname.split(" ")[0] + " " + person[0].lastname.split(" ")[0]
    else
        nombre = personid;
    return formatearNombre(nombre);
}

export function obtenerNombrePersonaLstDiscos  (personid, persons, completo) {
    return  obtenerNombrePersona  (personid, persons, completo, true) ;
}


/*  Devuelve la fecha date con formato
    Ej: 01 oct 2021 13:16 */
export function formatDate (date) {
    var date2 = new Date(date);
    var fecha = {};
    fecha.hh = new Intl.DateTimeFormat('es', { hour: 'numeric' }).format(date2);
    fecha.mm = new Intl.DateTimeFormat('es', { minute: 'numeric' }).format(date2);
    fecha.ss = new Intl.DateTimeFormat('es', { second: 'numeric' }).format(date2);
    fecha.y = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(date2);
    fecha.m = new Intl.DateTimeFormat('es', { month: 'short' }).format(date2);
    fecha.d = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(date2);
    return fecha;
}

