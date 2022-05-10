import React from 'react';
import {
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Hidden,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../../appProvider';
import {serviciosGEMA} from '../../servicios/servicios';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { formatearNombre } from '../../utils/utils';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  link: {
    cursor: "pointer",
    color: "black"
  }
});


export default function JefesDeTrabajoSelect(props) {


  //Error al cargar los Jefes de Trabajo desde GEMA
  const [errorAlCargar, setErrorAlCargar] = React.useState(false);

  const handleClose = () => {
    setErrorAlCargar(false);
    props.close()
  }

  const errorAlCargarDialog = (
    <Dialog  
        open={errorAlCargar}
        onClose={handleClose}
        aria-labelledby="error-dialog-title"
    >
        <DialogTitle style={{ cursor: 'move' }} id="error-dialog-title">
            Algo ha ocurrido...
        </DialogTitle>
    
        <DialogContent>
            <DialogContentText>
                No se pudieron cargar los jefes de trabajo. Intente luego de unos momentos y 
                si el error persiste comuniquese con la administración.
            </DialogContentText>
        </DialogContent>
    
        <DialogActions>
            <Button onClick={handleClose} color="primary"> Cerrar </Button>
        </DialogActions>
    </Dialog>
)


  const classes = useStyles();

  const [jtDeMiUnidad, setJtDeMiUnidad] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [state, setState] = React.useContext(AppContext);


  React.useEffect(() => {
    
    limpiarJT();
    
    //controlo cuales JT tebgo que cargar y verifico que no esten precargados
    const todosLosJT = !jtDeMiUnidad;
    
    const cargarUnidad = jtDeMiUnidad && !state.jefesDeTrabajosUnidad[props.unidad]; 
    const cargarTodos = todosLosJT && !state.jefesDeTrabajos;
   

    if (cargarUnidad || cargarTodos) {
      setDisabled(true);
      var url = (cargarUnidad) 
          ?'/utd_nardisjt?lean=1&oslc.select=centro, personid, person{*} &oslc.where=centro=' + props.unidad
          :'/utd_nardisjt?lean=1&oslc.select=centro, person{*}';

      if (cargarUnidad &&props.unidad===6300)
          url = '/utd_nardisjt?lean=1&oslc.select=centro, personid, person{*} &oslc.where=centro in [631,632,633]'
      
          
          var jts = [];
          var cedulas = [];
          serviciosGEMA.get(url)
            .then(function (response) {
              response.data.member
                .map(e => {
                  if (e.person) {
                    var person = e.person[0];
                    var jt = {};
                    jt.ci = person.personid;
                    jt.ut = (person.utd_nrounico)? person.utd_nrounico : "";
                    jt.nombre = person.firstname + " " + person.lastname;
                    if (jt.ci && !cedulas[jt.ci]) {
                      jts.push(jt);
                      cedulas[jt.ci] = true;
                    }
                  }
                });
          if (cargarUnidad) {
            var jefesDeTrabajosUnidad_ = {...state.jefesDeTrabajosUnidad};
            jefesDeTrabajosUnidad_[props.unidad] = jts
            setState({ ...state, jefesDeTrabajosUnidad: jefesDeTrabajosUnidad_ });
          }
          else setState({ ...state, jefesDeTrabajos: jts });
          setDisabled(false);
        })
        .catch(error => setErrorAlCargar(true))
    }
  }, [jtDeMiUnidad]);



  const toogleJtDeMiUidad = () => {
    setJtDeMiUnidad(!jtDeMiUnidad);
  }


  const jefesDeTrabajos = (jtDeMiUnidad) 
    ? state.jefesDeTrabajosUnidad[props.unidad] 
    : state.jefesDeTrabajos;


  const limpiarJT = (event, value) => {
    props.setSelectedJT_ci("");
  }

  
  const contenido = (
    <Box style={{width:"100%"}}>
    <Autocomplete
      onChange={(event, value) => limpiarJT(event,value)}
      onBlur={(event, value) => limpiarJT(event,value)}
      key="jefes-de-trabajo"
      id="jefes-de-trabajo"
      options={jefesDeTrabajos}
      classes={{ option: classes.option, }}
      autoHighlight
      noOptionsText={"No se encontraron coincidencias."}
      disabled={disabled}
      getOptionLabel={(option) => {
        props.setSelectedJT_ci(option.ci);
        return formatearNombre(option.nombre) + " (" + option.ci + ") (" + option.ut + ")"
      }}
      renderOption={(option) => (
        <React.Fragment>
          <span>{formatearNombre(option.nombre)}</span>
        </React.Fragment>
      )}
    
      renderInput={(params) => (
        disabled 
          ?
          
          <TextField
              placeholder="Cargando datos ..."
              {...params}
              variant="outlined"
              id="jts"
              InputProps={{
                  style: {color: 'black'},
                  endAdornment: (
                    <InputAdornment position="start">
                      <img alt="cargando datos..." src="/PAW/assets/images/loading.gif" width="60px" />
                    </InputAdornment>
                  ),
              }}
          />
         :     
          <TextField
            placeholder= "Buscar por nombre, CI o UT ..."
            {...params}
            variant="outlined"
          />

          
      )}
    />


    <FormControlLabel
      control={
        <Checkbox
          defaultChecked
          color="default"
          inputProps={{ 'aria-label': 'checkbox with default color' }}
          onClick={toogleJtDeMiUidad}
          disabled={disabled}
        />
      }
      label="Ver solo personas de mi unidad"
    />

    {errorAlCargarDialog}
  </Box>
  )
  
  return (
    <div style={{marginBottom: 10}}>
      <Hidden only="xs">
      <Box display="flex" flexDirection="row" justifyContent="left">
          <Box>
          <img
              alt=""
              src="/PAW/assets/images/user.svg"
              style={{height: 35, width: 35, marginRight: 15, marginTop: 10}}
            />
          </Box>
        {contenido}
      </Box>
    </Hidden>
     <Hidden smUp>
       {contenido}
   </Hidden>
    </div>
  );
}