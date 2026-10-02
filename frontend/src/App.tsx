import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom'
import { Layout } from './components/ui'
import { Login } from './pages/Login'
import { Queue } from './pages/Queue'
import { RequestForm } from './pages/RequestForm'
import { RequestDetails } from './pages/RequestDetails'
import { Users } from './pages/Users'
import './App.css'
const client = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 15_000 } } })
export default function App() {
  return <QueryClientProvider client={client}><BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route element={<Layout />}>
      <Route path="/solicitacoes" element={<Queue />} />
      <Route path="/solicitacoes/nova" element={<RequestForm />} />
      <Route path="/solicitacoes/:id" element={<RequestDetails />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="*" element={<section className="card empty"><h1>P?gina n?o encontrada</h1><Link to="/solicitacoes">Voltar para a fila</Link></section>} />
    </Route>
  </Routes></BrowserRouter></QueryClientProvider>
}
