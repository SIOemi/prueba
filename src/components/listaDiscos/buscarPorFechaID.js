import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {
  Typography,
  Box
} from '@material-ui/core';


export default function BuscarPorFechaId(props) {

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = () => props.buscar();

  const handleMenuItemClick = () => {
    props.setBuscarPorId(!props.buscarPorId);
    setOpen(false);
  };

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const [selectedOption,setSelectedOption] = React.useState(-1);
  const seleccionarOpcion = (option) => {
    if (option===selectedOption) {
      setSelectedOption(-1);
      props.setBuscarPor(-1);
      props.limpiarBusqueda();
    } else {
      setSelectedOption(option);
      props.setBuscarPor(option);
    }  
  }

  const button = (label,option) => {
    var variant = selectedOption===option ? "contained": "outlined";
   
    {/* PC */}
    var style = selectedOption===option 
      ? {minWidth: '100px', backgroundColor: "#247DEF", color: 'white', textTransform: 'none'}
      : {minWidth: '100px', textTransform: 'none'};

    {/* CELULAR */}
    style = !props.vistaMovil ? style : selectedOption===option 
      ? {minWidth: '24%', maxWidth: '24%', backgroundColor: "#247DEF", color: 'white', textTransform: 'none'}
      : {minWidth: '24%', maxWidth: '24%', textTransform:'none'};
  
    return (
      <Button 
        style={style}
        variant={variant}
        onClick={()=>seleccionarOpcion(option)}>
        {label}
      </Button>
    )
  }

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle1" color="initial">Buscar por:&nbsp;&nbsp;</Typography>
      <ButtonGroup variant="text" aria-label="outlined primary button group">
        {button("Incidencia",0)}
        {button("Solicitud",1)}
        {button("Disco",2)}
        {button("Fecha",3)}
      </ButtonGroup>
    

      
    </Box>
  );
}