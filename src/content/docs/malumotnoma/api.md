---
title: API ma'lumotnomasi
description: Barcha HTTP sirtlari — servis, yo'l, metod. Spetsifikatsiyalardan generatsiya qilinadi.
sidebar:
  order: 4
holat: ishlaydi
holatIzoh: Ro'yxat OpenAPI spetsifikatsiyalaridan generatsiya qilinadi — qo'lda tahrirlanmaydi.
---

:::caution[Bu sahifa QO'LDA tahrirlanmaydi]
U `docs-site/scripts/gen-api-reference.mjs` bilan repodagi OpenAPI
spetsifikatsiyalaridan generatsiya qilinadi. Qo'lda yozilgan ro'yxat
birinchi relizdayoq eskirardi va integrator mavjud bo'lmagan
endpointni chaqirib, sababni o'z kodida izlardi.
:::

Ulanishning **amaliy** yo'li — [O'z platformangizni ulash](/integrator/platformani-ulash/).
Bu sahifa esa to'liq ro'yxat: qaysi sirt bor va u qayerda.

## Auth — qisqacha

| Sirt | Auth |
|---|---|
| platform-core `/api/admin/*` | `X-API-Key` (qamrov bilan) yoki inson sessiyasi |
| platform-core `/api/internal/*` | servis kaliti — ⛔ tashqi mijoz uchun emas |
| agent-runtime `/v1/*` | `Authorization: Bearer` (chat tokeni) |
| integration-hub | `X-Service-Key` — ⛔ ichki |
| knowledge-runtime | `X-Service-Key` — platform-core proksisi orqali |

⛔ `/api/internal/*` yo'llari servislararo. Ular ro'yxatda **ko'rinadi**,
lekin tashqi integratsiya uchun mo'ljallanmagan.


## platform-core

Boshqaruv sirti: agentlar, konnektorlar, kalitlar, bilim, audit.

**266 amal.**


### `agent-permissions`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/internal/agent-permissions` | List Agent Permissions |


### `agents`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/agents` | List Agents |
| GET PUT | `/api/admin/agents/{agent_id}/rollout` | Get Rollout |
| POST | `/api/admin/agents/{agent_id}/rollout/promote` | Promote Rollout |
| POST | `/api/admin/agents/{agent_id}/rollout/rollback` | Rollback Rollout |
| GET | `/api/admin/agents/{agent_id}/versions` | List Agent Versions |
| GET | `/api/admin/agents/{agent_id}/versions/{version}` | Get Agent Version |
| POST | `/api/admin/agents/{agent_id}/versions/{version}/publish` | Publish Agent Version |
| GET | `/api/internal/agents/{agent_id}` | Get Agent For Runtime |
| GET | `/api/internal/agents/{agent_id}/rollout` | Get Rollout For Runtime |


### `api`

| Metod | Yo'l | |
|---|---|---|
| POST | `/api/auth/accept-invite` | Accept Invite |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Me |


### `api-keys`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/api-keys` | List Api Keys |
| POST | `/api/admin/api-keys/{key_id}/revoke` | Revoke Api Key |


### `approvals`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/approvals` | List Approvals |
| POST | `/api/admin/approvals/{approval_id}/decide` | Decide Approval |
| POST | `/api/internal/approvals` | Register Approval |


### `artifacts`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/artifacts` | List Artifacts |
| GET DELETE | `/api/admin/artifacts/{artifact_id}` | Get Artifact |
| POST | `/api/internal/artifacts` | Register Artifact |
| PATCH | `/api/internal/artifacts/{artifact_id}` | Finalize Artifact |


### `audit`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/audit` | List Audit Records |
| GET | `/api/admin/audit/verify` | Verify Audit Chain |


### `background-agents`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/background-agents` | List Background Agents |
| GET PUT | `/api/admin/background-agents/{agent_key}` | Get Background Agent |
| POST | `/api/admin/background-agents/{agent_key}/pause` | Pause Background Agent |
| POST | `/api/admin/background-agents/{agent_key}/resume` | Resume Background Agent |
| GET | `/api/internal/background-agents` | List Active Background Agents |
| GET | `/api/internal/background-agents/{agent_key}` | Get Background Agent For Worker |


### `balance`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/balance` | Get Balance |
| GET | `/api/admin/balance/entries` | List Entries |
| POST | `/api/admin/balance/topup` | Top Up |


### `billing`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/internal/billing/credit` | Get Credit |


### `calendar`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/calendar` | Get Calendar |
| GET POST | `/api/admin/calendar/milestones` | List Milestones |
| GET PATCH DELETE | `/api/admin/calendar/milestones/{milestone_id}` | Get Milestone |


### `calls`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/calls` | List Calls |
| GET | `/api/admin/calls/{call_id}` | Get Call |
| DELETE | `/api/admin/calls/{call_id}/recordings/{recording_id}` | Delete Recording |
| POST | `/api/admin/calls/{call_id}/recordings/{recording_id}/access` | Open Recording |
| POST | `/api/admin/calls/{call_id}/recordings/{recording_id}/legal-hold` | Set Legal Hold |
| POST | `/api/internal/calls` | Register Call |
| PATCH | `/api/internal/calls/{call_id}` | Patch Call State |
| POST | `/api/internal/calls/{call_id}/events` | Add Event |
| POST | `/api/internal/calls/{call_id}/recording` | Add Recording |
| POST | `/api/internal/calls/{call_id}/transcript` | Add Transcript |


### `campaigns`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/campaigns` | List Campaigns |
| GET PATCH | `/api/admin/campaigns/{campaign_id}` | Get Campaign |
| POST | `/api/admin/campaigns/{campaign_id}/approve` | Approve Campaign |
| GET | `/api/admin/campaigns/{campaign_id}/attempts` | List Attempts |
| POST | `/api/admin/campaigns/{campaign_id}/cancel` | Cancel Campaign |
| GET | `/api/admin/campaigns/{campaign_id}/contacts` | List Contacts |
| POST | `/api/admin/campaigns/{campaign_id}/contacts:import` | Import Contacts |
| POST | `/api/admin/campaigns/{campaign_id}/pause` | Pause Campaign |
| POST | `/api/admin/campaigns/{campaign_id}/reject` | Reject Campaign |
| POST | `/api/admin/campaigns/{campaign_id}/resume` | Resume Campaign |
| GET | `/api/admin/campaigns/{campaign_id}/stats` | Get Stats |
| POST | `/api/admin/campaigns/{campaign_id}/submit` | Submit Campaign |
| GET | `/api/admin/campaigns/agent-options` | List Agent Options |
| POST | `/api/internal/campaigns/{campaign_id}/attempts` | Create Attempt |
| POST | `/api/internal/campaigns/{campaign_id}/lease` | Lease Contacts |
| POST | `/api/internal/campaigns/{campaign_id}/pause` | Pause By Engine |
| POST | `/api/internal/campaigns/{campaign_id}/release` | Release Contacts |
| GET | `/api/internal/campaigns/attempts/{attempt_id}` | Get Attempt Status |
| POST | `/api/internal/campaigns/attempts/{attempt_id}/complete` | Complete Attempt |
| POST | `/api/internal/campaigns/attempts/{attempt_id}/dispatch` | Dispatch Attempt |
| GET | `/api/internal/campaigns/runnable` | List Runnable |


### `capabilities`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/internal/capabilities` | Read Capabilities |


### `channels`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/channels` | List Channels |
| GET PATCH DELETE | `/api/admin/channels/{channel_id}` | Get Channel |
| POST | `/api/admin/channels/{channel_id}/disable` | Disable Channel |
| POST | `/api/admin/channels/{channel_id}/enable` | Enable Channel |
| GET | `/api/admin/channels/catalog` | Channel Catalog |
| GET | `/api/internal/channels/gateway` | Gateway Channels |


### `connectors`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/connectors` | List Connectors |
| GET PUT DELETE | `/api/admin/connectors/{connector_id}` | Get Connector |
| POST | `/api/admin/connectors/{connector_id}/disable` | Disable Connector |
| POST | `/api/admin/connectors/{connector_id}/enable` | Enable Connector |
| POST | `/api/admin/connectors/{connector_id}/test` | Test Connector |
| GET | `/api/admin/connectors/catalog` | Get Catalog |
| GET | `/api/internal/connectors` | List Enabled Connectors |


### `consents`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/consents` | List Consents |
| POST | `/api/admin/consents/{consent_id}/revoke` | Revoke Consent |


### `conversations`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/conversations` | List Conversations |
| GET | `/api/admin/conversations/{conversation_id}` | Get Conversation |
| POST | `/api/admin/conversations/{conversation_id}/claim` | Claim Conversation |
| POST | `/api/admin/conversations/{conversation_id}/reassign` | Reassign Conversation |
| POST | `/api/admin/conversations/{conversation_id}/reply` | Reply Conversation |
| POST | `/api/admin/conversations/{conversation_id}/resolve` | Resolve Conversation |
| POST | `/api/admin/conversations/{conversation_id}/return-to-agent` | Return Conversation To Agent |
| POST | `/api/internal/conversations/{conversation_id}/customer-message` | Add Customer Message |
| POST | `/api/internal/conversations/{conversation_id}/deliveries/{message_id}/ack` | Ack Delivery |
| GET | `/api/internal/conversations/{conversation_id}/pending-deliveries` | Pending Deliveries |
| POST | `/api/internal/conversations/activity` | Record Activity |
| POST | `/api/internal/conversations/handoff` | Handoff |
| GET | `/api/internal/conversations/operator-active` | Operator Active |
| GET | `/api/internal/conversations/pending-deliveries` | Pending Deliveries Sweep |
| GET | `/api/internal/conversations/resolve` | Resolve Conversation Ref |


### `costs`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/costs` | Get Costs |
| GET | `/api/admin/costs/breakdown` | Get Cost Breakdown |
| GET | `/api/admin/costs/daily` | Get Cost Daily |
| GET | `/api/admin/costs/summary` | Get Cost Summary |


### `dnc`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/dnc` | List Dnc |


### `employees`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/employees` | List Employees |
| GET PUT | `/api/admin/employees/{employee_key}` | Get Employee |
| POST | `/api/admin/employees/{employee_key}/lifecycle` | Transition Employee Lifecycle |
| GET | `/api/internal/employees` | List Deployed Employees |
| GET | `/api/internal/employees/{employee_key}` | Get Employee For Worker |


### `endpoints{rest}`

| Metod | Yo'l | |
|---|---|---|
| GET POST PUT PATCH DELETE | `/api/admin/endpoints{rest}` | Proxy |


### `feature-flags`

| Metod | Yo'l | |
|---|---|---|
| GET PUT | `/api/admin/feature-flags` | List Feature Flags |


### `goals`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/goals` | List Goals |
| GET | `/api/admin/goals/{goal_id}` | Get Goal |
| GET | `/api/admin/goals/{goal_id}/tree` | Get Goal Tree |


### `graphs`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/graphs` | List Graphs |
| GET | `/api/admin/graphs/{graph_id}/versions` | List Graph Versions |
| GET | `/api/admin/graphs/{graph_id}/versions/{version}` | Get Graph Version |
| POST | `/api/admin/graphs/{graph_id}/versions/{version}/publish` | Publish Graph Version |
| PUT | `/api/admin/graphs/{graph_id}/versions/{version}/ui-meta` | Put Graph Ui Meta |
| GET | `/api/internal/graphs/{graph_id}` | Get Graph For Runtime |


### `health`

| Metod | Yo'l | |
|---|---|---|
| GET | `/health` | Health |


### `invocations`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/invocations` | List Invocations |
| GET | `/api/admin/invocations/{invocation_row_id}` | Get Invocation |
| GET | `/api/admin/invocations/by-agent` | Invocations By Agent |
| GET | `/api/admin/invocations/summary` | Invocations Summary |
| GET | `/api/admin/invocations/tool-usage` | Invocations Tool Usage |
| POST | `/api/internal/invocations` | Record Invocation |


### `knowledge`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/knowledge/bases` | List Bases |
| GET | `/api/admin/knowledge/bases/{base_id}` | Get Base |
| GET | `/api/admin/knowledge/documents` | List Documents |
| GET | `/api/admin/knowledge/documents/{document_id}` | Get Document |
| GET | `/api/admin/knowledge/jobs` | List Jobs |
| POST | `/api/internal/knowledge/ingestion-report` | Record Ingestion Report |


### `maintenance`

| Metod | Yo'l | |
|---|---|---|
| POST | `/api/internal/maintenance/approvals/expire` | Expire Approvals |
| POST | `/api/internal/maintenance/conversations/retention` | Purge Conversation Retention |
| POST | `/api/internal/maintenance/encryption/re-encrypt` | Re Encrypt |
| POST | `/api/internal/maintenance/events/outbox/retention` | Purge Event Retention |
| GET | `/api/internal/maintenance/events/parked` | List Parked Events |
| POST | `/api/internal/maintenance/events/parked/replay` | Replay Parked Events |
| POST | `/api/internal/maintenance/sessions/purge` | Purge Sessions |


### `marketplace`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/marketplace/catalog` | Get Catalog |
| POST | `/api/admin/marketplace/install` | Install Pack |
| GET | `/api/admin/marketplace/installs/{pack_id}` | Get Install Status |
| POST | `/api/admin/marketplace/installs/{pack_id}/instances` | Add Pack Instance |
| DELETE | `/api/admin/marketplace/installs/{pack_id}/instances/{instance_key}` | Retire Pack Instance |
| GET POST | `/api/admin/marketplace/packs/{pack_id}/grants` | List Pack Grants |
| DELETE | `/api/admin/marketplace/packs/{pack_id}/grants/{grantee_id}` | Delete Pack Grant |
| GET | `/api/admin/marketplace/packs/{pack_id}/setup` | Get Pack Setup |
| POST | `/api/admin/marketplace/packs/{pack_id}/upgrades` | Create Pack Upgrade |
| GET | `/api/admin/marketplace/packs/{pack_id}/upgrades/{upgrade_id}` | Get Pack Upgrade |
| POST | `/api/admin/marketplace/packs/{pack_id}/upgrades/{upgrade_id}/advance` | Advance Pack Upgrade |
| POST | `/api/admin/marketplace/packs/{pack_id}/upgrades/{upgrade_id}/rollback` | Rollback Pack Upgrade |


### `metering`

| Metod | Yo'l | |
|---|---|---|
| POST | `/api/internal/metering/service-usage` | Ingest Service Usage |
| POST | `/api/internal/metering/usage` | Ingest Usage |


### `model-profiles{rest}`

| Metod | Yo'l | |
|---|---|---|
| GET POST PUT PATCH DELETE | `/api/admin/model-profiles{rest}` | Proxy |


### `operations`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/operations` | List Operations |
| GET | `/api/admin/operations/{operation_id}` | Get Operation |
| POST | `/api/admin/operations/{operation_id}/assign` | Assign Operation |
| POST | `/api/admin/operations/{operation_id}/transition` | Transition Operation |
| GET | `/api/internal/operations` | List Execution Operations |


### `projects`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/projects` | List Projects |
| GET PATCH DELETE | `/api/admin/projects/{project_id}` | Get Project |
| POST | `/api/admin/projects/{project_id}/agents` | Link Agent |
| DELETE | `/api/admin/projects/{project_id}/agents/{agent_id}` | Unlink Agent |
| POST | `/api/admin/projects/{project_id}/goals` | Link Goal |
| DELETE | `/api/admin/projects/{project_id}/goals/{goal_id}` | Unlink Goal |
| POST | `/api/admin/projects/{project_id}/status` | Change Project Status |
| POST | `/api/admin/projects/{project_id}/tasks` | Link Task |
| DELETE | `/api/admin/projects/{project_id}/tasks/{task_id}` | Unlink Task |


### `prompts`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/prompts` | List Prompts |
| GET | `/api/admin/prompts/{prompt_key}` | Get Prompt |
| POST | `/api/admin/prompts/{prompt_key}/versions` | Save Prompt Version |


### `providers{rest}`

| Metod | Yo'l | |
|---|---|---|
| GET POST PUT PATCH DELETE | `/api/admin/providers{rest}` | Proxy |


### `releases`

| Metod | Yo'l | |
|---|---|---|
| POST | `/api/admin/releases` | Compile Release |
| GET | `/api/admin/releases/{release_id}` | Get Release |
| POST | `/api/admin/releases/{release_id}/activate` | Activate Release |
| GET | `/api/internal/releases/active` | Resolve Active Release |


### `retention`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/internal/retention/enforcement` | Read Enforcement Status |


### `tasks`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/tasks` | List Tasks |
| GET PATCH | `/api/admin/tasks/{task_id}` | Get Task |
| POST | `/api/admin/tasks/{task_id}/replan` | Replan Task |
| GET | `/api/admin/tasks/{task_id}/replan-logs` | List Replan Logs |
| POST | `/api/admin/tasks/{task_id}/submit` | Submit Task |
| PATCH | `/api/internal/tasks/{task_id}/progress` | Update Task Progress |
| PATCH | `/api/internal/tasks/{task_id}/workflow-status` | Update Task Workflow Status |
| POST | `/api/internal/tasks/batch` | Create Task Batch |


### `teams`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/teams` | List Teams |
| GET PUT | `/api/admin/teams/{team_key}` | Get Team |
| POST | `/api/admin/teams/{team_key}/publish` | Publish Team |
| POST | `/api/admin/teams/{team_key}/validate` | Validate Team |


### `tenants`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/tenants` | List Tenants |
| GET PATCH DELETE | `/api/admin/tenants/{tenant_id}` | Get Tenant |
| GET | `/api/internal/tenants/{tenant_id}/retention` | Read Retention Mode |


### `users`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/users` | List Users |
| GET PATCH DELETE | `/api/admin/users/{user_id}` | Get User |
| POST | `/api/admin/users/{user_id}/reset-password` | Reset Password |


### `voice`

| Metod | Yo'l | |
|---|---|---|
| POST | `/api/internal/voice/inbound-route` | Get Inbound Route |


### `voice-numbers`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/voice-numbers` | List Numbers |
| PATCH | `/api/admin/voice-numbers/{number_id}` | Update Number |


### `workflows`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/workflows` | List Workflows |
| GET | `/api/admin/workflows/{workflow_key}/versions` | List Workflow Versions |
| GET PUT | `/api/admin/workflows/{workflow_key}/versions/{version}` | Get Workflow Version |
| POST | `/api/admin/workflows/{workflow_key}/versions/{version}/publish` | Publish Workflow Version |
| POST | `/api/admin/workflows/{workflow_key}/versions/{version}/validate` | Validate Workflow Version |
| GET | `/api/internal/workflows/published` | List Published Workflows |


### `workspaces`

| Metod | Yo'l | |
|---|---|---|
| GET POST | `/api/admin/workspaces` | List Workspaces |
| GET PATCH | `/api/admin/workspaces/{workspace_id}` | Get Workspace |
| POST | `/api/admin/workspaces/{workspace_id}/archive` | Archive Workspace |
| POST | `/api/admin/workspaces/{workspace_id}/members` | Add Member |
| DELETE | `/api/admin/workspaces/{workspace_id}/members/{member_id}` | Remove Member |


## agent-runtime

Ijro sirti: suhbat, ijro, interrupt.

**19 amal.**


### `chat`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/chat` | Chat |
| POST | `/v1/chat/{thread_id}/continue` | Continue Chat |
| POST | `/v1/chat/{thread_id}/resume` | Resume Chat |
| POST | `/v1/chat/stream` | Chat Stream |


### `executions`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/executions` | Create Execution |
| GET | `/v1/executions/{execution_id}` | Get Execution |
| POST | `/v1/executions/{execution_id}/cancel` | Cancel Execution |
| GET | `/v1/executions/{execution_id}/events` | List Execution Events |
| POST | `/v1/executions/{execution_id}/feedback` | Submit Execution Feedback |
| POST | `/v1/executions/{execution_id}/handoff` | Handoff Execution |
| POST | `/v1/executions/{execution_id}/resume` | Resume Execution |
| GET | `/v1/executions/{execution_id}/stream` | Stream Execution Events |


### `healthz`

| Metod | Yo'l | |
|---|---|---|
| GET | `/healthz` | Healthz |


### `interrupts`

| Metod | Yo'l | |
|---|---|---|
| GET | `/v1/interrupts` | List Interrupts |


### `maintenance`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/maintenance/encryption/re-encrypt` | Re Encrypt |
| POST | `/v1/maintenance/interrupts/close-expired` | Close Expired Interrupts |
| POST | `/v1/maintenance/interrupts/purge` | Purge Interrupts |
| POST | `/v1/maintenance/memory/purge` | Purge Memory |


### `memory`

| Metod | Yo'l | |
|---|---|---|
| DELETE | `/v1/memory` | Forget Memory |


## integration-hub

Konnektor ijrosi — odatda bevosita chaqirilmaydi.

**7 amal.**


### `connectors`

| Metod | Yo'l | |
|---|---|---|
| GET | `/api/admin/connectors` | LEGACY konsol sirti — bu yerda TO'LIQ tavsiflanmagan |
| GET | `/v1/connectors` | Tenant KO'RA OLADIGAN konnektorlar |
| GET PUT | `/v1/connectors/{id}` | Manifest + config sxemasi + tenant instansi |
| POST | `/v1/connectors/{id}/probe` | Ulanishni tekshirish |


### `healthz`

| Metod | Yo'l | |
|---|---|---|
| GET | `/healthz` | Liveness — autentifikatsiyaSIZ |


### `invoke`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/invoke` | Konnektor amalini bajarish |


## knowledge-runtime

Bilim ijrosi — platform-core proksisi orqali ishlatiladi.

**11 amal.**


### `documents`

| Metod | Yo'l | |
|---|---|---|
| GET | `/v1/documents/{document_id}` | Get Document |
| POST | `/v1/documents/{document_id}/status` | Set Document Status |


### `healthz`

| Metod | Yo'l | |
|---|---|---|
| GET | `/healthz` | Healthz |


### `ingest`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/ingest` | Ingest Document |


### `memory`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/memory/candidates` | Propose Candidate |
| POST | `/v1/memory/commit` | Commit Candidate |
| POST | `/v1/memory/forget` | Forget Memory |
| POST | `/v1/memory/query` | Query Memory |
| POST | `/v1/memory/reject` | Reject Candidate |


### `resolve`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/resolve` | Resolve |


### `search`

| Metod | Yo'l | |
|---|---|---|
| POST | `/v1/search` | Search |


## To'liq sxema

Har endpointning so'rov/javob sxemasi repodagi spetsifikatsiyalarda:

```
agent-os/docs/api/platform-core.openapi.json
agent-os/docs/api/agent-runtime.openapi.json
integration-hub/docs/api/integration-hub.openapi.json
knowledge-runtime/docs/api/knowledge-runtime.openapi.json
```

⚠ Serverdagi `/openapi.json` va `/docs` **ataylab yopiq**: FastAPI
ularni marshrut qo'riqchilaridan OLDIN beradi, ya'ni ular
autentifikatsiyasiz ochiq bo'lardi.
