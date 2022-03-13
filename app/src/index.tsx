import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <section id="amis-moeditor">
        <App />
      </section>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
