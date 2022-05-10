import React from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    fade,
    Button,
    FormControl,
    FormControlLabel,
    Checkbox,
    Hidden, 
    IconButton
} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import BuscarPorFechaId from './buscarPorFechaID';
import {AppContext} from '../../appProvider';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import UnidadSelect from '../inputs/unidadSelect';
 


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        alignItems: 'center'
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 70,
        minWidth: '100%',
        padding: theme.spacing(1),
        alignItems: 'middle'

    },
    buscarBtn: {
        maxWidth: '200px',
        minWidth: '150px',
        maxHeight: 35
    },  
    buscarBtnSwap: {
        maxWidth: 35,
        maxHeight: 35,
        marginLeft: 5
    },
    busqueda: {
        marginRight: 50,
        marginTop: 20,
        maxWidth: '400px',
        width: "100%",
        height: 50,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    }
}))






const dateInput = (label, selected, setSelected, marginRight, maxWidth) => (
    <KeyboardDatePicker
        style={{ marginRight: marginRight, maxWidth: maxWidth }}
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        id="date-picker-inline"
        label={label}
        value={selected}
        onChange={setSelected}
        KeyboardButtonProps={{ 'aria-label': 'change date' }}
    />
)

const BarraSuperiorTodos = (props) => {

    const [state] = React.useContext(AppContext);

    const dateTo = new Date()
    const [selectedDateTo, setSelectedDateTo] = React.useState(dateTo);
    const handleDateChangeTo = (date) => setSelectedDateTo(date);

    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate()-3); //3 dias menos
    const [selectedDateFrom, setSelectedDateFrom] = React.useState(dateFrom);
    const handleDateChangeFrom = (date) => setSelectedDateFrom(date);

    const [valorBusqueda, setValorBusqueda] = React.useState('');
    const [buscarPor, setBuscarPor] = React.useState(-1);
    //Incidencia: 0 - Solicitud: 1 - Disco: 2 - Fecha: 3

    const [unidad,setUnidad] = React.useState(state.unidad);
   
    const [buscarPorIDsio,setBuscarPorIDsio] = React.useState(state.operadorCMD);

    const submit = () => {
        props.setBuscarPor(buscarPor);
        props.setUnidadBusqueda(unidad);
        if (buscarPor === 3) {//busqueda por fecha
            props.setFechaDesde(selectedDateFrom);
            props.setFechaHasta(selectedDateTo);
        }
        props.setValorBusqueda(valorBusqueda);
        props.setBuscarPorIDsio(buscarPorIDsio);
        props.setRenderList(true);
    }

    const limpiarBusqueda = () => {
        props.setBuscarPor(-1);
        props.setValorBusqueda("");
        props.setRenderList(true);
    }

    const [buscarEnMiUidad,setBuscarEnMiUidad] = React.useState(true);
    const toogleBuscarEnMiUidad = () => {
        props.setBuscarEnMiUidad(!buscarEnMiUidad);
        setBuscarEnMiUidad(!buscarEnMiUidad); 
    }

    const classes = useStyles();

    const filtroBusqueda = () => {
        const placeholder =
            (buscarPor === 0) ? "Ingrese ID de incidencia..." :
                (buscarPor === 1)  ? "Ingrese ID de solicitud ..." :
                    (buscarPor === 2) ? "Ingrese número de disco..." : "Buscar...";

        return (
            <Box display="flex" flexDirection="column">
            <TextField
                className={classes.busqueda}
                onChange={(e) => setValorBusqueda(e.target.value)}
                onKeyPress= {(e) => e.code === "Enter"  ? submit() : null}
                id="filled-basic"
                variant="outlined"
                placeholder={placeholder}
                type="search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon />
                        </InputAdornment>
                    ),

                }}
            />
            {/* Buscar por nro disco*/}
            { (buscarPor !== 2) ? null :
                <FormControlLabel
                    control={
                        <Checkbox
                            defaultChecked
                            color="default"
                            inputProps={{ 'aria-label': 'checkbox with default color' }}
                            onClick={toogleBuscarEnMiUidad}
                        />
                    }
                        label="Buscar solo en mi unidad"
                />
            }
            
            </Box>
        )
    }

  
    const filtroFechaPC = (
        <Box >

            <FormControl  style={{ width: 400, marginTop: 20}}>
                <UnidadSelect setUnidad={setUnidad}/>
            </FormControl>
            <Box display="flex">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    {dateInput("Desde:", selectedDateFrom, handleDateChangeFrom,40,180)}
                    {dateInput("Hasta:", selectedDateTo, handleDateChangeTo,0,180)}
                </MuiPickersUtilsProvider>
            </Box>
          

        </Box>
    )

   
    const filtroFechaCelular = (  
        <Box display="flex" flexDirection="column" style={{width: 350}}>
            
            <FormControl  style={{ width: 350, marginTop: 20}}>
                <UnidadSelect setUnidad={setUnidad}/>
            </FormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {dateInput("Desde:", selectedDateFrom, handleDateChangeFrom,0,350)}
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {dateInput("Hasta:", selectedDateTo, handleDateChangeTo,0,350)}
            </MuiPickersUtilsProvider>
        
        </Box>
    )

    const filtroFecha = (
        <div>
            <Hidden only="xs">{filtroFechaPC}</Hidden>
            <Hidden smUp>{filtroFechaCelular}</Hidden>
        </div>
    )


    return (
        <Box className={classes.box} >
            <BuscarPorFechaId setBuscarPor={setBuscarPor} limpiarBusqueda={limpiarBusqueda} vistaMovil={props.vistaMovil}/>
            {buscarPor in [0, 1, 2] ? filtroBusqueda() : buscarPor === 3 ? filtroFecha : null}
            {buscarPor in [0, 1, 2, 3] ?
                <Box display="flex" flexDirection="row" style={{marginTop: 20}}>
                    <Button
                        variant="contained"
                        className={classes.buscarBtn}
                        onClick={() => submit()}>
                        {   buscarPor!==1 
                            ? "Buscar" 
                                : buscarPorIDsio
                                    ? "Buscar en SIO"
                                    : "Buscar en GEMA"
                        }
                    </Button>
                    {buscarPor!==1 ? null :
                        <IconButton  className={classes.buscarBtnSwap}  onClick={()=>setBuscarPorIDsio(!buscarPorIDsio)}>
                            <SwapVertOutlinedIcon/>
                        </IconButton>
                    }
                </Box>
                : null}
        </Box>
    )
}

export default BarraSuperiorTodos;