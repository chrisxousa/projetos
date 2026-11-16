# Rota PL-300

Organizador pessoal de preparação para a certificação PL-300. Interface em português com calendário, exercícios, simulados, revisões e checklist.

## Sincronização

A interface HTML/CSS/JavaScript original foi preservada. O servidor usa o starter Vinext de Sites e um banco Cloudflare D1 provisionado pela hospedagem. O acesso permanece privado, com identidade fornecida por Sign in with ChatGPT. Não há integração independente de OAuth Google.

`GET /api/state` e `PATCH /api/state` exigem a identidade autenticada fornecida pela plataforma. Os registros são isolados pelo identificador estável do usuário neste Site. Requisições de escrita exigem mesma origem. Não envie cabeçalhos de identidade criados pelo cliente; eles são responsabilidade da camada de autenticação da hospedagem.

Alterações são enviadas automaticamente. O painel consulta atualizações a cada 15 segundos e ao retornar à aba. Operações com comparação do valor anterior preservam alterações independentes; mudanças concorrentes no mesmo item exigem resolução explícita. A atualização no banco usa revisão otimista para evitar perda de gravações simultâneas.

Uma cópia local por usuário preserva alterações aguardando conexão. Ao trocar de dispositivo, aguarde “Salvo na nuvem”. A primeira carga exige conexão e sessão válida. O aplicativo não promete funcionamento totalmente offline.

## Migração

No navegador que possui dados antigos em `rota-pl300-v1`, o painel oferece importação única para a conta atual. A importação combina registros por ID, preserva dados diferentes e mantém uma cópia de itens divergentes. Os dados antigos não são apagados. Exportar/importar JSON continua opcional.

## Desenvolvimento

Use os helpers Sites para instalar dependências, prévia, build e publicação. `npm run db:generate` gera migrações de esquema. A publicação aplica as migrações ao D1 hospedado. Testes: `node --test tests/sync.test.mjs`.

Não inclua credenciais, código do voucher, backups pessoais ou bancos locais no Git.


## Executar e testar

Requer Node.js 22.13 ou superior. Dentro da pasta `rota-pl300`:

```sh
npm ci
npm run dev
```

A prévia local inicia pelo servidor do projeto. A sincronização exige a configuração do banco D1 e uma identidade autenticada. O modo de desenvolvimento portátil possui simulação de identidade somente local; em produção, a identidade deve vir da camada confiável da hospedagem. Nunca publique confiando em cabeçalhos de identidade enviados diretamente por visitantes.

```sh
node --test tests/sync.test.mjs
npm run build
```

O manifesto foi exportado sem o identificador do Site original. Configure um Site próprio antes de implantar esta cópia. GitHub Pages sozinho não executa o servidor nem o banco desta aplicação.

## Organização

- `public/app.js`, `style.css`: interface e funcionalidades do painel.
- `public/sync.js`: fila de salvamento, recuperação e resolução de conflitos.
- `lib/sync-core.mjs`, `state-api.mjs`: regras de validação, comparação e armazenamento.
- `app/api/state/route.ts`: API autenticada.
- `db/`, `drizzle/`: esquema e migração do banco.
- `tests/`: testes automatizados da sincronização.

## Próximas melhorias

- Login Google direto, após configuração de um provedor de autenticação compatível.
- Validação ponta a ponta em dois dispositivos autenticados.
- Publicação contínua a partir do GitHub, após definir a hospedagem de destino.

Desenvolvido com auxílio de IA. Nenhum resultado de simulado ou estudo foi preenchido como concluído automaticamente.
