// Runs against an existing Vite server. Uses Chrome DevTools Protocol without extra dependencies.
// API fixtures exist only in this browser test; they never enter the application bundle.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'

const executable = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync)
if (!executable) throw new Error('Set CHROME_PATH to a Chromium browser executable.')
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5173'
const profile = await mkdtemp(join(tmpdir(), 'sisagen-ui-'))
const output = process.env.UI_ARTIFACT_DIR || join(tmpdir(), 'sisagen-ui-artifacts')
await mkdir(output, { recursive: true })
const child = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
const endpoint = await new Promise((resolve, reject) => {
  let log = ''
  const timer = setTimeout(() => reject(new Error('Browser launch timed out')), 20_000)
  child.once('error', reject)
  child.stderr.on('data', data => { log += data; const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]) } })
})
const socket = new WebSocket(endpoint)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let sequence = 0
const pending = new Map()
const events = []
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 15_000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
}
let mode = 'data'
let writes = 0
const now = new Date().toISOString()
const records = Array.from({ length: 12 }, (_, index) => ({ id: `request-${index + 1}`, nome: index === 0 ? 'Álvaro Silva' : `Solicitante ${index + 1}`, telefone: index === 0 ? '(62) 99999-1234' : '62988880000', cidade: index % 2 ? 'Anápolis' : 'Goiânia', rua: 'Avenida T-63', quadra: '15', lote: '02', status: index % 2 ? 'CADASTRADO' : 'PENDENTE', dataSolicitacao: now, criadoEm: now, atualizadoEm: now, criadoPorId: 'operator-test', observacoes: 'Referência de atendimento.', arquivadoEm: null }))
socket.addEventListener('message', async event => {
  const message = JSON.parse(event.data)
  if (message.id) { const call = pending.get(message.id); if (call) { clearTimeout(call.timer); pending.delete(message.id); if (message.error) call.reject(new Error(JSON.stringify(message.error))); else call.resolve(message.result) } }
  else if (message.method === 'Fetch.requestPaused') {
    const { requestId, request } = message.params
    if (request.method !== 'GET') writes++
    await send('Fetch.fulfillRequest', { requestId, responseCode: mode === 'error' ? 503 : 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: base }, { name: 'Access-Control-Allow-Credentials', value: 'true' }], body: Buffer.from(JSON.stringify(mode === 'empty' ? [] : mode === 'error' ? { message: 'Unavailable' } : records)).toString('base64') }, message.sessionId)
  } else if (message.method === 'Page.javascriptDialogOpening' && message.params.type === 'beforeunload') {
    await send('Page.handleJavaScriptDialog', { accept: true }, message.sessionId)
  } else if (message.method === 'Runtime.exceptionThrown') events.push(message.params.exceptionDetails)
})
const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
await send('Target.activateTarget', { targetId })
const cdp = (method, params) => send(method, params, sessionId)
const evaluate = async expression => { const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value }
const waitFor = async expression => { for (let i = 0; i < 80; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)) } throw new Error(`Condition not met: ${expression}`) }
const navigate = async path => { await cdp('Page.navigate', { url: base + path }); await waitFor('!!document.querySelector("h1")'); }
const click = text => evaluate(`(() => { const el = Array.from(document.querySelectorAll('button,a')).find(el => el.textContent.trim() === ${JSON.stringify(text)}); if (!el) throw new Error('Control not found'); el.focus(); el.click(); })()`)
const fill = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); const setter = Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set; setter.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); })()`)
const screenshot = async name => { const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await writeFile(join(output, name + '.png'), Buffer.from(data, 'base64')) }
try {
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*localhost:3333/api/*' }] })
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await navigate('/login')
  await fill('#username', 'operador')
  await fill('#password', 'test-password')
  await click('Mostrar')
  assert.equal(await evaluate('document.querySelector("#password").type'), 'text')
  await click('Entrar no Sistema')
  await waitFor('!!document.querySelector("[role=alert]")')
  assert.equal(await evaluate('location.pathname'), '/login')
  await screenshot('login-desktop')
  console.log('PASS login validation, password visibility, no simulated authentication')
  await navigate('/solicitacoes')
  await waitFor('document.querySelectorAll("tbody tr").length === 10')
  await screenshot('queue-desktop')
  await click('Próximo')
  await waitFor('document.querySelectorAll("tbody tr").length === 2')
  await fill('input[type=search]', 'alvaro')
  await waitFor('document.querySelectorAll("tbody tr").length === 1')
  await click('Ver Detalhes ›')
  await waitFor('document.querySelector("h1")?.textContent === "Álvaro Silva"')
  await screenshot('details-desktop')
  await click('Histórico de Alterações')
  await waitFor('document.body.textContent.includes("Trilha Completa de Auditoria")')
  await click('Dados da Solicitação')
  await evaluate('document.querySelector(".eyebrow a").click()')
  await waitFor('document.querySelector("input[type=search]")?.value === "alvaro"')
  console.log('PASS queue pagination, accent search, details, history tab, filter restoration')
  await navigate('/solicitacoes/nova')
  await click('Salvar Solicitação')
  await waitFor('document.querySelectorAll(".field-error").length >= 4')
  await fill('input[name=nome]', 'Álvaro Silva')
  await fill('input[name=telefone]', '(62) 99999-1234')
  await fill('input[name=cidade]', 'Goiânia')
  await fill('input[name=rua]', 'Avenida T-63')
  await fill('textarea', 'Ponto de referência')
  await waitFor('document.body.textContent.includes("Alerta Preventivo de Duplicidade")')
  await click('Verificar Registro Existente')
  await waitFor('!!document.querySelector("dialog[open]")')
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
  await waitFor('!document.querySelector("dialog[open]")')
  assert.equal(await evaluate('document.activeElement.textContent'), 'Verificar Registro Existente')
  await click('Salvar como Rascunho')
  await screenshot('form-desktop')
  await evaluate('window.onbeforeunload = null')
  await cdp('Page.navigate', { url: base + '/solicitacoes/nova' })
  await waitFor('document.querySelector("input[name=nome]")?.value === "Álvaro Silva"')
  await click('Cancelar')
  await waitFor('!!document.querySelector("dialog[open]")')
  await click('Continuar Editando')
  console.log('PASS form validation, duplicate dialog, Escape/focus restoration, persistent draft, cancel confirmation')
  await navigate('/usuarios')
  await click('+ Novo Usuário')
  await waitFor('!!document.querySelector("dialog[open]")')
  await screenshot('users-dialog-desktop')
  await fill('#user-name', 'Operador Teste')
  await fill('#user-email', 'operador@example.com')
  await fill('#user-password', 'password-test')
  await click('Salvar Usuário')
  await waitFor('!!document.querySelector("dialog [role=alert]")')
  await click('Cancelar')
  assert.equal(writes, 0)
  console.log('PASS user dialog, missing-service feedback, no unauthorized writes')
  for (const width of [768, 390]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    for (const path of ['/login', '/solicitacoes', '/solicitacoes/nova', '/solicitacoes/request-1', '/usuarios']) {
      await navigate(path)
      await waitFor('document.documentElement.scrollWidth <= innerWidth')
      await screenshot(`${path.split('/').filter(Boolean).join('-')}-${width}`)
    }
  }
  await click('Menu')
  assert.equal(await evaluate('document.querySelector(".mobile-menu").getAttribute("aria-expanded")'), 'true')
  console.log('PASS all five screens at tablet/mobile widths without page overflow; mobile navigation')
  mode = 'empty'
  await navigate('/solicitacoes')
  await waitFor('document.body.textContent.includes("Nenhuma solicitação disponível")')
  mode = 'error'
  await navigate('/solicitacoes')
  await waitFor('!!document.querySelector("[role=alert]")')
  mode = 'data'
  await click('Tentar novamente')
  await waitFor('document.querySelectorAll("tbody tr").length === 10')
  assert.deepEqual(events, [])
  console.log('PASS empty/error/retry states; no runtime exceptions')
  if (process.argv.includes('--references')) {
    await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
    for (const name of ['login', 'usuarios', 'cadastro', 'dados_do_usuario', 'admin']) {
      await cdp('Page.navigate', { url: new URL(`../../references/${name}.html`, import.meta.url).href })
      await waitFor('document.readyState === "complete" && !!document.querySelector("h1")')
      await evaluate('document.fonts.ready')
      await screenshot(`reference-${name}`)
    }
    console.log('PASS reference screenshots captured for visual comparison')
  }
  console.log(`Screenshots: ${output}`)
} finally {
  await send('Browser.close').catch(() => {})
  socket.close()
  child.kill()
  const resolvedProfile = resolve(profile)
  if (resolvedProfile.startsWith(resolve(tmpdir()) + sep) && resolvedProfile.split(sep).at(-1).startsWith('sisagen-ui-')) {
    await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {})
  }
}
