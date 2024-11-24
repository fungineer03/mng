import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  user: null,
  isLoggedIn: false,
  userToken: null,
  username: '',
  qrCode: '',
};

type State = typeof initialState;

type Action = { type: 'SET_USER' | 'SET_ACTIVATION_DATA' | 'SET_QR_CODE'; payload: any } | { type: 'LOGOUT' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'SET_ACTIVATION_DATA':
      return { ...state, userToken: action.payload.token, username: action.payload.name };
    case 'SET_QR_CODE':
      return { ...state, qrCode: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const AppProvider: React.FC = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
