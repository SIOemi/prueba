import React from 'react';
import {
  TextField,
  IconButton,
  Hidden,
  Box
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Battery20Icon from '@material-ui/icons/Battery20';
import SignalCellularConnectedNoInternet0BarIcon from '@material-ui/icons/SignalCellularConnectedNoInternet0Bar';
import PhonelinkEraseOutlinedIcon from '@material-ui/icons/PhonelinkEraseOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';

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
const CONFIG = window.data;

const opciones = CONFIG.razonesContingencia;


const getIcon = (option) => {
  var icon = null;
  switch (option) {
    case "Celular sin conexión":
      icon = <SignalCellularConnectedNoInternet0BarIcon />
      break;
    case "Celular sin batería":
      icon = <Battery20Icon />
      break;
    case "Hurto o extravío":
      icon = <PhonelinkEraseOutlinedIcon />
      break;
    case "Otros":
      icon = <HelpOutlineOutlinedIcon />
      break;
    default:
      icon = <HelpOutlineOutlinedIcon />
      break;
  }
  return icon
}



export default function RazonesContingencia(props) {

  const [razon, setRazon] = React.useState("");

  const setOption = (option) => {
    props.setRazon(option);
    setRazon(option);
  }

  const classes = useStyles();

  const contenido = (
    <Box style={{ width: "100%" }}>
      <Autocomplete
        onChange={(event, value) => { setOption("") }}
        onBlur={(event, value) => { setOption("") }}
        key="unidades"
        id="unidades"
        options={opciones}
        classes={{ option: classes.option, }}
        autoHighlight
        noOptionsText={"No se encontraron coincidencias."}
        getOptionLabel={(option) => {
          setOption(option);
          return option
        }}
        renderOption={(option) => (
          <React.Fragment>
            <IconButton color="primary">
              {getIcon(option)}
            </IconButton>
            <span>{option}</span>
          </React.Fragment>
        )}



        renderInput={(params) => (
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                transform: "translateY(50%)",
                marginLeft: "10px"
              }}
            >
              {razon ? getIcon(razon) : null}
            </span>
            <TextField
              onClick={() => setOption("")}
              {...params}
              label="Motivo de la contingencia"
              placeholder="Motivo de la contingencia"
              variant="outlined"
              inputProps={{ ...params.inputProps, style: { paddingLeft: "30px" } }}
            />
          </div>
        )}
      />
    </Box>
  )

  return (
    <div>
      <Hidden only="xs">
        <Box display="flex" flexDirection="row" justifyContent="left">
          <Box>
            <img
              alt=""
              src="/PAW/assets/images/comentario.svg"
              style={{ height: 35, width: 35, marginRight: 15, marginTop: 10 }}
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