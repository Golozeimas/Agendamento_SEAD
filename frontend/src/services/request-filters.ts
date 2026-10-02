import type { Agendamento } from './requests'
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
export function positiveInteger(value: string | null, fallback: number) {
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? number : fallback
}
export function filterRequests(data: Agendamento[], params: URLSearchParams, now = new Date()) {
  const search = normalize(params.get('q') ?? '').trim()
  const period = params.get('period')
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (period === '7' || period === '30') start.setDate(start.getDate() - Number(period) + 1)
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return data.filter(item => {
    const text = normalize([item.id, item.nome, item.telefone, item.rua, item.quadra, item.lote, item.cidade].join(' '))
    const phoneSearch = search.replace(/\D/g, '')
    if (search && !text.includes(search) && !(phoneSearch.length >= 3 && /^[\d\s()+-]+$/.test(search) && item.telefone.replace(/\D/g, '').includes(phoneSearch))) return false
    if (params.get('status') && item.status !== params.get('status')) return false
    if (params.get('city') && item.cidade !== params.get('city')) return false
    const date = new Date(item.dataSolicitacao)
    if (['1', '7', '30'].includes(period ?? '') && (date < start || date >= tomorrow)) return false
    if (period === 'custom') {
      if (params.get('from') && date < new Date(`${params.get('from')}T00:00:00`)) return false
      if (params.get('to') && date > new Date(`${params.get('to')}T23:59:59.999`)) return false
    }
    return !item.arquivadoEm
  }).sort((a, b) => params.get('sort') === 'name' ? a.nome.localeCompare(b.nome, 'pt-BR') : (new Date(b.dataSolicitacao).valueOf() - new Date(a.dataSolicitacao).valueOf()) * (params.get('sort') === 'oldest' ? -1 : 1))
}
