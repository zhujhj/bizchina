import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import theme from '../dashboard/config/theme.ts';
import Dashboard from './Dashboard.tsx';


function ChakraDashBoard() {
  
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <Dashboard />
      </ChakraProvider>
    </React.StrictMode>
  )
    
}

export default ChakraDashBoard;