import React from 'react';
import './App.css';
import {ThemeProvider} from '@material-ui/core';
import theme from './themeConfig';
import Contenedor from './components/layout/contenedor';
import AppProvider from './appProvider';

const App = () => {
  return(
    <ThemeProvider theme={theme}>
      <AppProvider >
        <Contenedor />
      </AppProvider>
    </ThemeProvider> 
  )
}
  
export default App;






