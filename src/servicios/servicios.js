import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";


const CONFIG = window.data;

//SERVICIOS GEMA
const serviciosGEMA = axios.create({
    baseURL: CONFIG.serviciosGEMA.baseURL,
    headers: {'Maxauth': CONFIG.serviciosGEMA.maxauth,}
});


//SERVICIOS GEMA UPDATE
const serviciosGEMA_update = axios.create({
    baseURL: CONFIG.serviciosGEMA.baseURL,
    headers: { 'Maxauth': CONFIG.serviciosGEMA.maxauth, 'patchtype': 'MERGE', 'x-method-override': 'PATCH', }
});


export { serviciosGEMA, serviciosGEMA_update };