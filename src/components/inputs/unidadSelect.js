import React from 'react';
import {
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import unidades from '../../datos/unidades.json';

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


export default function UnidadSelect(props) {

  const classes = useStyles();
  
  return (
      <Autocomplete
        onChange={(event, value) => props.setUnidad("")}
        onBlur={(event, value) => props.setUnidad("")}
        key="unidades"
        id="unidades"
        options={unidades}
        classes={{ option: classes.option, }}
        autoHighlight
        noOptionsText={"No se encontraron coincidencias."}
        getOptionLabel={(option) => {
          props.setUnidad(option.id);
          return option.id  +" - "+ option.desc 
        }}
        renderOption={(option) => (
          <React.Fragment>
            <span>{option.id  +" - "+ option.desc }</span>
          </React.Fragment>
        )}
      
        renderInput={(params) => (
            <TextField
              placeholder= "Buscar unidad ..."
              {...params}
              variant="outlined"
            />

            
        )}
      />
  );
}