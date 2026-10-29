# Arquitetura

Três vistas do sistema, cada uma numa notação padrão.

| Vista | Notação | Responde |
|---|---|---|
| 1. Casos de uso | UML | Quem usa e para quê |
| 2. Processo | BPMN 2.0 | Como o trabalho anda, com uma raia para cada quem executa |
| 3. Arquitetura | C4, nível 2 | De que partes o sistema é feito e com quem conversa |

## Site JMS Refrigeração · página que leva ao WhatsApp

Site institucional de uma página da JMS Refrigeração e Gelo. Estático, sem backend nem banco: todo botão e formulário abre o WhatsApp da JMS com a mensagem já escrita.

### 1. Quem usa e para quê

![Casos de uso de Site JMS Refrigeração](./site-jms-refrigeracao-1-casos-de-uso.svg)

### 2. Da visita à conversa no WhatsApp

![Processo de Site JMS Refrigeração](./site-jms-refrigeracao-2-processo.svg)

### 3. Arquitetura

![Arquitetura de Site JMS Refrigeração](./site-jms-refrigeracao-3-arquitetura.svg)

Para editar: [site-jms-refrigeracao.excalidraw](./site-jms-refrigeracao.excalidraw), que abre em [excalidraw.com](https://excalidraw.com) ou na extensão Excalidraw do VS Code.

## De onde vêm

Os diagramas são gerados a partir do Sinapse, o vault onde o Pedro organiza notas e projetos. Mudança feita direto aqui some na próxima publicação: o lugar de mudar é a especificação no Sinapse.
