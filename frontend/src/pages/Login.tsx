import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GovernmentBar, GovernmentBrand, GovernmentFooter, Icon, Notice, PasswordInput } from '../components/ui'

export function Login() {
  const [error, setError] = useState(false)
  const { register, handleSubmit } = useForm<{ username: string; password: string }>()
  return <div className="login-shell">
    <a className="skip-link" href="#main">Ir para o conteúdo</a>
    <GovernmentBar />
    <header className="login-masthead"><div className="brand"><GovernmentBrand /></div><span className="login-environment"><Icon name="shield" /> Acesso institucional</span></header>
    <main id="main" className="login-page"><div className="login-card">
      <aside className="login-aside">
        <div className="login-intro"><span className="login-kicker"><span aria-hidden="true" /> GESTÃO DE ATENDIMENTOS</span><h2>Mais organização.<br />Melhor atendimento.</h2><p>Um só lugar para organizar solicitações, acompanhar agendamentos e cuidar de cada atendimento.</p></div>
        <div className="login-features"><div><span className="login-feature-icon"><Icon name="calendar" /></span><span><strong>Solicitações organizadas</strong><small>Acompanhe cada etapa da fila.</small></span></div><div><span className="login-feature-icon"><Icon name="shield" /></span><span><strong>Informações centralizadas</strong><small>Mais controle para a sua equipe.</small></span></div></div>
        <div className="login-aside-bottom"><span>SISAGEN</span><small>Conectando gestão e atendimento.</small></div>
        <div className="login-art" aria-hidden="true"><span /><span /><span /></div>
      </aside>
      <section className="login-form">
        <span className="section-icon login-lock"><Icon name="shield" /></span>
        <div className="eyebrow">BEM-VINDO AO SISAGEN</div><h1>Acesse sua conta</h1><p>Entre com suas credenciais para acessar o sistema de agendamento.</p>
        <Notice>O acesso às contas está aguardando habilitação. Entre em contato com o administrador.</Notice>
        {error && <Notice error>Não foi possível autenticar: o serviço de acesso ainda não está disponível.</Notice>}
        <form onSubmit={handleSubmit(() => setError(true))}>
          <label htmlFor="username">Usuário ou matrícula</label><input id="username" autoComplete="username" placeholder="Informe seu usuário ou matrícula" required {...register('username', { required: true })} />
          <label htmlFor="password">Senha de acesso</label><PasswordInput id="password" autoComplete="current-password" placeholder="Informe sua senha" required {...register('password', { required: true })} />
          <button className="primary login-submit" type="submit">Entrar no Sistema <Icon name="arrow" /></button>
        </form>
        <footer><Icon name="shield" /><span>Acesso individual e restrito a usuários autorizados.<small>Precisa de acesso? Procure o administrador do sistema.</small></span></footer>
      </section>
    </div></main><GovernmentFooter />
  </div>
}
