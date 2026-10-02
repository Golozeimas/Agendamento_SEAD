import { useEffect, useId, useRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export function Icon({ name }: { name: 'calendar' | 'person' | 'location' | 'note' | 'shield' | 'arrow' | 'plus' }) {
  const paths = { calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z M7 14h3m4 0h3m-10 3h3', person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3', location: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', note: 'M5 3h14v14l-4 4H5V3Zm3 5h8m-8 4h8m-8 4h4', shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6', arrow: 'M4 12h16m-6-6 6 6-6 6', plus: 'M12 4v16M4 12h16' }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
export function Layout() {
  const [open, setOpen] = useState(false)
  return <><a className="skip-link" href="#main">Ir para o conteúdo</a><header className="topbar">
    <Link className="brand" to="/solicitacoes"><span className="brand-icon"><Icon name="calendar" /></span><span>Sistema de Agendamento<small>Operações & Registro</small></span></Link>
    <button className="mobile-menu" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>Menu</button>
    <nav id="main-nav" aria-label="Navegação principal" className={open ? 'open' : ''}>
      <NavLink to="/solicitacoes" onClick={() => setOpen(false)}>Solicitações</NavLink><NavLink to="/usuarios" onClick={() => setOpen(false)}>Usuários <span className="mini">Admin</span></NavLink>
    </nav><Link className="session-link" to="/login">Acessar conta</Link>
  </header><main id="main" className="page"><Outlet /></main></>
}
export function PageHeader({ eyebrow, title, description, children }: { eyebrow: ReactNode; title: string; description: string; children?: ReactNode }) {
  return <header className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="actions">{children}</div></header>
}
export function Section({ title, subtitle, icon = 'note', children }: { title: string; subtitle?: string; icon?: Parameters<typeof Icon>[0]['name']; children: ReactNode }) {
  return <section className="card section"><div className="section-heading"><span className="section-icon"><Icon name={icon} /></span><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>{children}</section>
}
export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`notice ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{children}</div>
}
export function Unavailable({ children }: { children?: ReactNode }) {
  return <Notice>{children ?? 'Esta operação ainda não está disponível. Aguarde a habilitação do serviço pelo administrador.'}</Notice>
}
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${status === 'CADASTRADO' ? 'registered' : 'pending'}`}>{status === 'CADASTRADO' ? 'Cadastrado' : 'Pendente'}</span>
}
export function Stats({ items }: { items: { label: string; value: string | number; hint: string; tone?: string }[] }) {
  return <div className="stats">{items.map(item => <section className={`card stat ${item.tone ?? ''}`} key={item.label}><p>{item.label}</p><strong>{item.value}</strong><small>{item.hint}</small></section>)}</div>
}
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement as HTMLElement | null; dialog?.showModal(); return () => { dialog?.close(); previous?.focus() } }, [])
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}><div className="modal-heading"><h2 id={titleId}>{title}</h2><button type="button" aria-label="Fechar diálogo" onClick={onClose}>×</button></div>{children}</dialog>
}
export function PasswordInput({ id, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false)
  return <div className="password"><input {...props} id={id} type={visible ? 'text' : 'password'} /><button type="button" aria-controls={id} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button></div>
}
