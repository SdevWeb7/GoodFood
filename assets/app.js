import React from "react";
import ReactDOM from 'react-dom/client'
import './styles/app.scss';
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const client = new QueryClient()

ReactDOM.createRoot(document.querySelector('#react')).render(
   <QueryClientProvider client={client}>
   <React.StrictMode>
      <App />
      <ReactQueryDevtools />
   </React.StrictMode>
   </QueryClientProvider>
)