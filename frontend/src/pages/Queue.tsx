import { Link, useSearchParams } from 'react-router-dom'
import { Icon, Notice, PageHeader, Stats, StatusBadge, Unavailable } from '../components/ui'
import { formatDate, useRequests } from '../services/requests'
import { filterRequests, positiveInteger } from '../services/request-filters'

export function Queue() {
  const query = useRequests()
  const [params, setParams] = useSearchParams()
  const data = query.data ?? []
  const archived = params.get('view') === 'archived'
  const update = (key: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); if (key !== 'page') next.delete('page'); return next }, { replace: true })
  const filtered = filterRequests(data, params)
  const size = [10, 25, 50, 100].includes(Number(params.get('size'))) ? Number(params.get('size')) : 10
  const pages = Math.max(1, Math.ceil(filtered.length / size))
  const page = Math.min(positiveInteger(params.get('page'), 1), pages)
  const shown = filtered.slice((page - 1) * size, page * size)
  const cities = [...new Set(data.map(item => item.cidade))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const count = (status?: string) => query.isSuccess ? data.filter(item => !status || item.status === status).length : '—'
  return <><PageHeader eyebrow="Módulo Operacional" title="Fila de Solicitações" description="Acompanhe, filtre e gerencie as solicitações com integridade de dados.">
    <button disabled title="A exportação depende da habilitação das permissões de acesso.">Exportar (.CSV)</button><Link className="button primary" to="/solicitacoes/nova"><Icon name="plus" /> Nova Solicitação</Link>
  </PageHeader><Stats items={[{ label: 'Total de Solicitações', value: count(), hint: 'registros na fila ativa' }, { label: 'Pendentes', value: count('PENDENTE'), hint: 'aguardando triagem', tone: 'amber' }, { label: 'Cadastrados', value: count('CADASTRADO'), hint: 'finalizados', tone: 'green' }]} />
  <section className="card queue-card" aria-label="Fila de solicitações"><div className="tabs"><button className={!archived ? 'selected' : ''} aria-pressed={!archived} onClick={() => update('view', '')}>Ativos {query.isSuccess && <span className="mini">{data.length}</span>}</button><button className={archived ? 'selected' : ''} aria-pressed={archived} onClick={() => update('view', 'archived')}>Arquivados</button><small className="sync">{query.isFetching ? 'Atualizando…' : 'Atualização a cada 30 segundos'}</small></div>
  {archived ? <div className="section"><Unavailable>A consulta de arquivados depende do serviço administrativo, ainda indisponível.</Unavailable></div> : <>
    <div className="filters"><input aria-label="Pesquisar solicitações" type="search" placeholder="Buscar por nome, telefone ou endereço…" value={params.get('q') ?? ''} onChange={e => update('q', e.target.value)} />
      <select aria-label="Filtrar por status" value={params.get('status') ?? ''} onChange={e => update('status', e.target.value)}><option value="">Status: Todos</option><option value="PENDENTE">Pendente</option><option value="CADASTRADO">Cadastrado</option></select>
      <select aria-label="Filtrar por cidade" value={params.get('city') ?? ''} onChange={e => update('city', e.target.value)}><option value="">Cidade: Todas</option>{cities.map(city => <option key={city}>{city}</option>)}</select>
      <select aria-label="Filtrar por período" value={params.get('period') ?? ''} onChange={e => update('period', e.target.value)}><option value="">Todo o período</option><option value="30">Últimos 30 dias</option><option value="7">Últimos 7 dias</option><option value="1">Hoje</option><option value="custom">Personalizado</option></select>
      <button onClick={() => setParams({})}>Limpar</button>
      {params.get('period') === 'custom' && <><label>De<input type="date" aria-label="Data inicial" max={params.get('to') ?? undefined} value={params.get('from') ?? ''} onChange={e => update('from', e.target.value)} /></label><label>Até<input type="date" aria-label="Data final" min={params.get('from') ?? undefined} value={params.get('to') ?? ''} onChange={e => update('to', e.target.value)} /></label></>}
    </div>
    {query.isError && <div className="section"><Notice error>Não foi possível atualizar a fila. Verifique a conexão e tente novamente. <button onClick={() => void query.refetch()}>Tentar novamente</button></Notice></div>}
    {query.isPending ? <div className="empty" role="status">Carregando solicitações…</div> : <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela de solicitações, role horizontalmente em telas pequenas"><table><thead><tr><th>ID</th><th aria-sort={params.get('sort') === 'name' ? 'ascending' : 'none'}><button className="sort" onClick={() => update('sort', params.get('sort') === 'name' ? '' : 'name')}>Solicitante / Nome ↕</button></th><th>Telefone / Contato</th><th>Endereço Operacional</th><th aria-sort={params.get('sort') === 'oldest' ? 'ascending' : params.get('sort') === 'name' ? 'none' : 'descending'}><button className="sort" onClick={() => update('sort', params.get('sort') === 'oldest' ? '' : 'oldest')}>Data Solicitação ↕</button></th><th>Status</th><th>Última Atualização</th><th>Ações</th></tr></thead><tbody>{shown.map(item => <tr key={item.id}><td className="mono" title={item.id}>#{item.id.slice(0, 8)}</td><td><strong>{item.nome}</strong></td><td><a href={`tel:${item.telefone.replace(/[^+\d]/g, '')}`}>{item.telefone}</a></td><td>{item.rua}<small>{[item.quadra && `QD ${item.quadra}`, item.lote && `LT ${item.lote}`, item.cidade].filter(Boolean).join(' · ')}</small></td><td>{formatDate(item.dataSolicitacao)}</td><td><StatusBadge status={item.status} /></td><td>{formatDate(item.atualizadoEm)}</td><td><Link className="detail-link" to={`/solicitacoes/${encodeURIComponent(item.id)}`} state={{ back: `/solicitacoes?${params}` }}>Ver Detalhes ›</Link></td></tr>)}</tbody></table>{shown.length === 0 && <div className="empty"><Icon name="calendar" /><h2>{data.length ? 'Nenhuma solicitação encontrada' : 'Nenhuma solicitação disponível'}</h2><p>{data.length ? 'Ajuste os filtros para encontrar outros registros.' : 'As solicitações cadastradas aparecerão aqui.'}</p></div>}</div>}
    <div className="pagination"><span>Mostrando {filtered.length ? (page - 1) * size + 1 : 0}–{Math.min(page * size, filtered.length)} de {filtered.length} solicitações</span><label>Exibir: <select aria-label="Solicitações por página" value={size} onChange={e => update('size', e.target.value)}>{[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} por página</option>)}</select></label><div className="actions"><button disabled={page <= 1} onClick={() => update('page', String(page - 1))}>Anterior</button><span aria-live="polite">{page} / {pages}</span><button disabled={page >= pages} onClick={() => update('page', String(page + 1))}>Próximo</button></div></div>
  </>}</section></>
}
