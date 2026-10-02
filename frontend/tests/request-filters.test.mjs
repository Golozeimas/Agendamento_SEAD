import test from 'node:test'
import assert from 'node:assert/strict'
import { filterRequests, positiveInteger } from '../src/services/request-filters.ts'

const records = [
  { id: '1', nome: 'Álvaro Silva', telefone: '(62) 99999-1234', cidade: 'Goiânia', rua: 'Rua A', status: 'PENDENTE', dataSolicitacao: '2026-10-02T09:00:00', arquivadoEm: null },
  { id: '2', nome: 'Beatriz Lima', telefone: '62988881234', cidade: 'Anápolis', rua: 'Rua B', status: 'CADASTRADO', dataSolicitacao: '2026-09-25T10:00:00', arquivadoEm: null },
  { id: '3', nome: 'Carlos Souza', telefone: '62977771234', cidade: 'Goiânia', rua: 'Rua C', status: 'PENDENTE', dataSolicitacao: '2026-09-01T10:00:00', arquivadoEm: '2026-09-02' },
]
const filter = (params) => filterRequests(records, new URLSearchParams(params), new Date('2026-10-02T14:00:00'))
test('search handles accents, phone formatting, and excludes archived records', () => {
  assert.deepEqual(filter({ q: 'alvaro' }).map(row => row.id), ['1'])
  assert.equal(filter({ q: '62999991234' })[0].id, '1')
  assert.equal(filter({ q: 'goiania' }).length, 1)
  assert.equal(filter({ q: 'missing' }).length, 0)
})
test('city and status filters intersect', () => {
  assert.equal(filter({ city: 'Anápolis', status: 'CADASTRADO' })[0].id, '2')
  assert.equal(filter({ city: 'Anápolis', status: 'PENDENTE' }).length, 0)
})
test('calendar periods and inclusive custom dates', () => {
  assert.equal(filter({ period: '1' }).length, 1)
  assert.equal(filter({ period: '7' }).length, 1)
  assert.equal(filter({ period: '30' }).length, 2)
  assert.equal(filter({ period: 'custom', from: '2026-09-25', to: '2026-09-25' })[0].id, '2')
})
test('sorting does not mutate query data', () => {
  assert.deepEqual(filter({ sort: 'oldest' }).map(row => row.id), ['2', '1'])
  assert.deepEqual(filter({ sort: 'name' }).map(row => row.id), ['1', '2'])
  assert.deepEqual(records.map(row => row.id), ['1', '2', '3'])
})
test('invalid pagination values use a safe default', () => {
  for (const value of [null, '', '0', '-1', '1.5', 'NaN', 'Infinity']) assert.equal(positiveInteger(value, 1), 1)
  assert.equal(positiveInteger('3', 1), 3)
})
