# Catalogo de prompts recorrentes e agendaveis para Copilot

Gerado em 2026-05-23.

## Visao geral

- Total de prompts: 378
- Areas cobertas: 18
- Prompts agendados nativos: 216
- Prompts sem add-on / com arquivos: 90
- Fontes catalogadas: 24

## Como usar

1. Comece com 1 prompt diario e 1 prompt semanal por usuario.
2. Para usuarios sem add-on, crie lembretes recorrentes no Outlook, Teams ou To Do com o prompt salvo.
3. Para usuarios com Microsoft 365 Copilot, rode o prompt uma vez e depois use a opcao "Schedule this prompt".
4. Para casos em que a saida precisa ser enviada, registrada ou virar tarefa, use Workflows/Power Automate.
5. Para pacotes de trabalho maiores, teste Cowork com checkpoints e revisao humana.

## Arquivos

- `catalogo-prompts-agendados-copilot.xlsx`: workbook completo.
- `prompts-agendados.csv`: base editavel.
- `prompts-agendados-data.json`: base estruturada para dashboard.
- `dashboard-prompts-agendados.html`: dashboard local estatico.

## Regra importante de licenca

Prompts agendados nativos exigem Microsoft 365 Copilot. Sem add-on, o caminho pratico e criar um lembrete recorrente e executar manualmente no Copilot Chat com os arquivos ou contexto certo. Isso ainda e muito util para criar habito e mostrar valor sem depender de Copilot Studio.

## Fontes usadas

- [Microsoft Learn - Manage scheduled prompts](https://learn.microsoft.com/en-us/microsoft-365/copilot/scheduled-prompts) - Prompts agendados automatizam interações do Copilot em Teams, Office.com chat e Outlook; admins controlam disponibilidade e inventário.
- [Microsoft Support - Schedule Copilot prompts](https://support.microsoft.com/en-us/microsoft-365-copilot/schedule-your-most-used-copilot-prompts) - Explica criação, limite de até 10 prompts agendados, notificações e exemplos como briefing das 8h, pendências de quarta e resumo de fim do dia.
- [Microsoft Support - Get started with Copilot Chat](https://support.microsoft.com/en-US/Microsoft-365-Copilot/get-started-with-microsoft-365-copilot-chat) - Copilot Chat pode resumir arquivos e, com assinatura Microsoft 365 Copilot, incorporar chats, emails e arquivos do trabalho.
- [Microsoft Support - Copilot Chat com e sem add-on](https://support.microsoft.com/en-US/Microsoft-365-Copilot/how-copilot-chat-works-in-microsoft-365-apps) - Diferencia capacidades com e sem add-on; Outlook sem add-on permite perguntas limitadas sobre caixa de entrada, calendário e reuniões.
- [Microsoft Learn - Microsoft 365 Copilot overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview) - Descreve Microsoft Graph, Microsoft 365 apps e grounding em emails, chats, documentos e reuniões.
- [Microsoft Support - Workflows in Microsoft 365 Copilot](https://support.microsoft.com/en-US/Microsoft-365-Copilot/get-started-with-workflows-in-microsoft-365-copilot) - Workflows e um agente no Microsoft 365 Copilot para automatizar tarefas em Outlook, SharePoint, Teams e Planner com gatilhos por agenda ou evento.
- [Microsoft Support - Copilot Tasks](https://support.microsoft.com/en-us/microsoft-copilot/using-copilot-tasks) - Tasks permitem execuções uma vez ou em agenda recorrente; destaque para controle do usuário, pausa, edição e exclusão.
- [Microsoft Adoption - Prompt Gallery](https://adoption.microsoft.com/en-us/copilot/prompt-gallery/) - Galeria oficial por função, produto e tarefa; base para transformar prompts isolados em rituais recorrentes.
- [Microsoft Signal - Manager meeting briefing](https://news.microsoft.com/signal/articles/an-easy-way-to-prep-for-a-meeting-with-the-boss/) - Exemplo de briefing semanal que revisa Outlook, calendário e Teams para preparar reunião com gestor.
- [GitHub - awesome-microsoft-copilot-prompts scheduled prompts](https://github.com/kesslernity/awesome-microsoft-copilot-prompts/blob/main/prompts/scheduled-prompts/README.md) - Biblioteca comunitaria com padrões de prompts agendados: briefing matinal, calendário, compromissos, pipeline, projetos, finanças e RH.
- [Reddit - Chief of staff briefing](https://www.reddit.com/r/microsoft_365_copilot/comments/1su626c/ive_been_running_a_chief_of_staff_briefing_in/) - Discussao prática sobre briefing diário, como agendar e limites de entrega/consumo no histórico do Copilot.
- [Reddit - Prompts que usam M365 de verdade](https://www.reddit.com/r/microsoft_365_copilot/comments/1r4dgai/prompts_that_actually_use_copilots_m365/) - Exemplos que aproveitam emails, calendário, Teams e arquivos em vez de prompts genéricos.
- [Zapier - Daily command center with AI](https://zapier.com/templates/details/daily-command-center-ai-briefing) - Padrão de briefing matinal que combina calendário, metas, conversas que exigem resposta, emails urgentes e blocos de foco.
- [Zapier - AI daily email digest in Slack](https://zapier.com/apps/gmail/integrations/slack/255573082/get-an-ai-generated-daily-digest-of-your-emails-in-slack) - Automação que resume emails ao longo do dia, acumula em digest e publica em canal; inspira digest de Outlook/Teams sem abrir caixa de entrada.
- [Slack - AI recaps](https://slack.com/help/articles/25076892548883-Guide-to-AI-features-in-Slack) - Recaps diários automatizados para canais acompanhados sem interrupção; padrão adaptavel a Teams channels.
- [Notion - Daily Standup Bot](https://www.notion.com/en-gb/custom-agent-templates/daily-standuo-bot-every) - Agente de standup com status On track, At risk e Stale, usando projetos, tarefas, responsáveis e última atualização.
- [Needle - Daily Executive Briefing](https://needle.app/workflow-templates/send-daily-executive-briefing) - Workflow diário que coleta email e Slack, produz briefing executivo com riscos, oportunidades, decisões, top 3 prioridades e changelog.
- [MoClaw - Scheduled AI tasks patterns](https://moclaw.ai/blog/scheduled-ai-tasks-2026) - Padrões recorrentes: briefing matinal, triagem de inbox, review de projeto, follow-up de leads, bookkeeping mensal e refresh trimestral.
- [Dify Marketplace - AI News Brief](https://marketplace.dify.ai/template/langgenius/AI%20News%20Brief?creationType=templates&language=en-US&templateId=ecc89f81-d8a9-40af-bfa1-bce7e086c434) - Workflow agendado de busca de noticias, resumo por LLM e postagem em Slack; inspira radar setorial e inteligencia competitiva.
- [Reddit - Claude Cowork scheduled tasks](https://www.reddit.com/r/ClaudeCowork/comments/1rtvndk/share_your_scheduled_tasks/) - Usuários compartilham automações recorrentes: briefing 6h/18h, inbox zero, análise competitiva semanal e assistente que monitora canal de pedidos.
- [Reddit - Notion AI weekly work summaries](https://www.reddit.com/r/Notion/comments/1tb787l/guide_how_i_automated_my_weekly_work_summaries/) - Workflow de resumo semanal a partir de logs diários e notas de reunião, focando wins, marcos, pendências e tom profissional.
- [SurePrompts - Meeting notes patterns](https://sureprompts.com/blog/prompt-patterns-meeting-notes) - Padrões de notas: resumo estruturado, extrator de ações, decision log, follow-up email e briefing para stakeholders.
- [Google Workspace Gemini - Project management prompts](https://workspace.google.com/resources/ai/prompts-for-project-management/) - Prompts de gestão de projetos, issue tracker, UAT, status e comunicação; bons para adaptar a Copilot com arquivos e Planner.
- [Google Gemini - Daily Brief](https://gemini.google/ua/overview/daily-brief/?hl=uk) - Daily Brief usa Gmail, Calendar e chats anteriores para gerar prioridades matinais; reforca o padrão de briefing pessoal recorrente.
