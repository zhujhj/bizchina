import { ChakraProvider } from '@chakra-ui/react';
import React = require('react');
import ReactDOM = require('react-dom/client');
import App from './App';
import theme from './config/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
