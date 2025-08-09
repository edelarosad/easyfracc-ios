import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from 'react-native-paper';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = (msg) => {
    setMessage(msg);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000} // Duración de 3 segundos
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
