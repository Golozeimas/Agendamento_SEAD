import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Notice, PageHeader, Section, StatusBadge, Unavailable } from '../components/ui'
import { formatDate, useRequests } from '../services/requests'

export function RequestDetails() {
  const { id } = useParams()
  const location = useLocation()
  const query = useRequests()
  const [history, setHistory] = useState(false)
  const item = query.data?.find(record => record.id === id)
  const back = typeof location.state?.back === 'string' && location.state.back.startsWith('/solicitacoes?') ? location.state.back : '/solicitacoes'
  if (query.isPending) return <div className="card empty" role="status">Carregando solicitação…</div>
  if (query.isError) return <Notice error>Não foi possível consultar a solicitação. <button onClick={() => void query.refetch()}>Tentar novamente</button></Notice>
  if (!item) return <div className="card empty"><h1>Solicitação não encontrada</h1><p>O registro não está na fila ativa ou não está disponível.</p><Link to={back}>Voltar para a Fila</Link></div>
  return <><PageHeader eyebrow={<Link to={back}>← Voltar para a Fila / Solicitações / #{item.id.slice(0, 8)}</Link>} title={item.nome} description="Dados da solicitação na fila operacional."><StatusBadge status={item.status} /></PageHeader><div className="detail-actions actions"><button disabled title="Edição ainda não disponível no serviço">Editar Dados</button><button className="primary" disabled title="Alteração de status ainda não disponível no serviço">Marcar como Cadastrado</button><button disabled title="Arquivamento ainda não disponível no serviço">Arquivar</button></div>
    <Unavailable>A edição, a alteração de status e o arquivamento ainda não estão disponíveis.</Unavailable>
    <div className="tabs detail-tabs" aria-label="Seções da solicitação"><button className={!history ? 'selected' : ''} aria-pressed={!history} onClick={() => setHistory(false)}>Dados da Solicitação</button><button className={history ? 'selected' : ''} aria-pressed={history} onClick={() => setHistory(true)}>Histórico de Alterações</button></div>
    {history ? <Section title="Trilha Completa de Auditoria" subtitle="Registro cronológico das alterações da solicitação" icon="shield"><Unavailable>O histórico estará disponível quando o serviço de auditoria e as permissões administrativas forem habilitados.</Unavailable><button disabled>Exportar Log</button></Section> : <div className="two-columns"><div className="stack"><Section title="Dados do Solicitante e Contato" icon="person"><dl className="data-grid"><div><dt>Nome Completo</dt><dd>{item.nome}</dd></div><div><dt>Data da Solicitação</dt><dd>{formatDate(item.dataSolicitacao)}</dd></div><div><dt>Telefone Principal</dt><dd><a href={`tel:${item.telefone.replace(/[^+\d]/g, '')}`}>{item.telefone}</a></dd></div><div><dt>Identificador</dt><dd className="mono">{item.id}</dd></div></dl></Section><Section title="Endereço do Agendamento / Imóvel" icon="location"><dl className="data-grid"><div><dt>Logradouro / Rua</dt><dd>{item.rua}</dd></div><div><dt>Quadra & Lote</dt><dd>QD {item.quadra || '—'} / LT {item.lote || '—'}</dd></div><div><dt>Cidade</dt><dd>{item.cidade}</dd></div></dl><div className="address-strip"><span>{item.rua} · {item.cidade}</span></div></Section><Section title="Observações Operacionais"><div className="observations">{item.observacoes || 'Nenhuma observação registrada.'}</div></Section></div><aside className="stack"><Section title="Rastreabilidade" icon="shield"><dl className="timeline"><div><dt>Criado em</dt><dd>{formatDate(item.criadoEm)}</dd></div><div><dt>Última Modificação</dt><dd>{formatDate(item.atualizadoEm)}</dd></div><div><dt>Status atual</dt><dd><StatusBadge status={item.status} /></dd></div></dl></Section><Section title="Instruções para o Cadastrador"><ul className="checklist"><li>Conferir os dados de identificação e contato.</li><li>Verificar o endereço, a quadra e o lote informados.</li><li>Consultar as observações antes do atendimento.</li></ul></Section></aside></div>}
  </>
}
