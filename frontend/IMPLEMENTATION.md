# Reference screen implementation

The application uses the existing React 19, TypeScript, React Router, TanStack Query,
React Hook Form and Axios dependencies. Styling remains plain CSS. No dependencies
were added. The starter had no reusable application components, routes or product
design tokens; the new shared primitives use the references' navy, slate, white,
amber and green palette.

| Reference | Component | Route |
| --- | --- | --- |
| `references/login.html` | `Login` | `/login` (also the `/` destination) |
| `references/usuarios.html` | `Queue` | `/solicitacoes` |
| `references/cadastro.html` | `RequestForm` | `/solicitacoes/nova` |
| `references/dados_do_usuario.html` | `RequestDetails` | `/solicitacoes/:id` |
| `references/admin.html` | `Users` | `/usuarios` |

## Running and checking

Run `npm run dev` in `frontend`. The API defaults to `http://localhost:3333/api`;
set `VITE_API_URL` to change it. Run `npm run build`, `npm run lint`, and `npm test`.
Tests require Node 22.18+ (native TypeScript stripping).

With Vite running, `npm run test:ui` launches headless Chrome and exercises all five
screens. Set `CHROME_PATH` for a browser outside the default Windows locations,
`UI_BASE_URL` for a different Vite origin, and `UI_ARTIFACT_DIR` for screenshots.
The default screenshot directory is `sisagen-ui-artifacts` in the OS temporary
directory. API responses in this test are intercepted fixtures, not live database
validation. No test records are written to the backend.

## Data and interactions

- The queue uses `GET /api/agendamentos` and refreshes every 30 seconds. Search,
  city/status/date filters, sorting and pagination operate on its returned active
  records. Parameters are kept in the URL and restored when returning from details.
- Pagination is currently client-side because the endpoint has no paging contract.
- Details find the selected ID in the same query cache, including after a direct
  route load. Missing records, failed requests, empty results and loading are shown.
- Form validation checks required fields and a 10–11 digit Brazilian phone number.
  A possible-duplicate warning compares normalized phone and city against the active
  list. This is a frontend advisory, not authoritative backend duplicate detection.
- Drafts are explicitly saved in browser local storage; storage failures are surfaced.
  The cancel confirmation can discard both the current form and the saved draft.
- Native dialogs provide focus containment, Escape dismissal and focus restoration.
  Tables scroll within their container on small screens; mobile navigation has an
  explicit menu. Layouts adapt at 1100, 900 and 640px.

## Backend boundaries — required before production rollout

The current backend only exposes GET and POST for agendamentos. Its Prisma models
are not evidence of usable authentication, authorization or administration APIs.

- There is no authentication/session contract or route guard to preserve. Login
  validates input and reports unavailability; it never establishes a pretend session.
  Direct application routes are reachable, as is the backend's existing listing
  endpoint. Authenticated access is **not implemented** and must be supplied by the
  backend before operational deployment.
- The existing POST requires `criadoPorId`. The typed creation service is retained,
  but form submission cannot call it until an authenticated operator is available.
  No user ID is hardcoded, inferred from another request, or accepted as a workaround.
- User listing/creation/editing/activation, request editing/status/archive/restore,
  archived listing, audit history, export authorization and login reports have no
  API contracts. Their screens and dialogs expose explicit unavailable states and
  perform no simulated mutations or speculative endpoint calls.
- No fake operator, statistics, audit events, CPF, map, capacity limit, SLA, security
  guarantee, push notification or session timeout from the reference is represented
  as real data. The architecture document excludes maps and messaging. Form context
  shows the entered address and real pending counts instead.
- History stays inside request details; archives stay inside the queue. There is no
  separate history route, consistent with the architecture document.
- Inter uses the reference's Google Fonts URL with system-font fallbacks. Generic
  identity/calendar SVG icons replace external reference profile and logo images;
  no third-party portrait or location image is needed at runtime.

The screens do not load `references/`, Tailwind CDN scripts or reference JavaScript
at runtime. Reference files are unchanged.
