import React from 'react';
import {
  Switch,
  FormControlLabel,
  Box,
  TextField,
  InputAdornment,
  fade,
  Hidden,
  Tooltip
} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { AppContext } from '../../appProvider';
import { withStyles } from '@material-ui/core/styles';

import { makeStyles } from '@material-ui/core/styles';


const BlackTooltip = withStyles({
  tooltip: {
    color: "white",
    backgroundColor: "black",
    fontSize: 16
  }
})(Tooltip);



const BarraSuperior = (props) => {

  const useStyles = makeStyles(theme => ({
    box: {
      display: 'flex',
      padding: theme.spacing(1)
    },
    busqueda: {
      width: props.vistaCelular? "100%" : 360,
      verticalAlign: 'middle',
      backgroundColor:
        fade(theme.palette.common.white, 0.15),
      '&:hover': { backgroundColor: fade(theme.palette.common.white, 0.25) },
    }
  }))

  
  const classes = useStyles();
  const [state, setState] = React.useContext(AppContext);

  const toogleVistaCompacta = () => {
    const newState = { ...state };
    newState.vistaCompacta = !state.vistaCompacta;
    setState(newState)
  }


  
  const setVistaCompacta = (valor) => {
    const newState = { ...state };
    newState.vistaCompacta = valor;
    setState(newState)
  }

  //si estoy en la vista de celular
  if (!props.vistaCelular && state.vistaCompacta) toogleVistaCompacta();

  const RedSwitch = withStyles({
    switchBase: {
      color: '#0678f4',
      '&$checked': {
        color: '#0678f4',
      },
      '&$checked + $track': {
        backgroundColor: '#0678f4',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  return (

    <div>

      {/* CELULAR */}  
      <Hidden smUp>
        <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="flex-end" className={classes.box} >
          <TextField
            className={classes.busqueda}
            onChange={(e) => props.setFiltro(e.target.value)}
            defaultValue={props.filtro}
            id="filled-basic"
            variant="outlined"
            placeholder="Filtrar ..."
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

            <FormControlLabel
              style={{ marginLeft: 0 }}
              control={<RedSwitch></RedSwitch>}
              label="Vista compacta"
              labelPlacement="start"
              checked={state.vistaCompacta}
              onClick={toogleVistaCompacta}
            />
        
        </Box>
      </Hidden> 

      {/* PC */}  
      <Hidden only="xs">
      <Box display="flex" flexDirection="row" flexWrap="wrap" className={classes.box} >
      <BlackTooltip title="Escribe para filtrar discos por número, ubicación, jefe de trabajo o incidencia." placement="left">
          <TextField
          
            className={classes.busqueda}
            onChange={(e) => props.setFiltro(e.target.value)}
            defaultValue={props.filtro}
            id="filled-basic"
            variant="outlined"
            placeholder="Incidencia ..."
            type="search"
            InputProps={{
              endAdornment: (
                  <InputAdornment position="end" style={{paddingLeft: 10}}>
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
      </BlackTooltip>
      </Box>
    </Hidden>      
    </div>

  );
}

export default BarraSuperior;