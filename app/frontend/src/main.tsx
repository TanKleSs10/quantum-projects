import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryProvider } from './app/providers/Queryprovider.tsx'
import AuthBootstrap from './app/providers/AuthBootstrap.tsx'

const root = document.getElementById('root')

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </BrowserRouter>
    </QueryProvider>
  </ StrictMode>
);
