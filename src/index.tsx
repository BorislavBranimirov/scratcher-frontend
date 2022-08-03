import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/App';
import { store } from './app/store';
import { injectStore } from './axiosApi';
import './index.css';

injectStore(store);

const container = document.getElementById('root');
const root = createRoot(container!);
const StrictModeWrapper = ({ children }: { children: JSX.Element }) => {
  if ((window as any).Cypress) {
    return children;
  }
  return <React.StrictMode>{children}</React.StrictMode>;
};
root.render(
  <StrictModeWrapper>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictModeWrapper>
);
