# RN Informática — guia visual

## Direção

Site de assistência local em Igarassu. Mostrar quem atende, quais serviços são feitos e como entrar em contato. Linguagem cotidiana, sem slogans ou promessas genéricas.

## Estrutura

- Abertura clara com imagem de produto em fundo neutro, título curto, uma ação principal e provas objetivas do atendimento.
- Serviços em três colunas no desktop, duas até 1080px e uma até 580px. Arte quadrada e descrição abaixo. Evitar miniaturas laterais, pois as artes contêm texto.
- Apresentação de Robson Nunes com foto e explicação do atendimento.
- PC Gamer, empresas, dúvidas e contato.

## CSS

styles.css importa base.css, components.css, sections.css e responsive.css, nessa ordem. Editar a regra correspondente, evitando acumular sobrescritas.

Base branca, superfície #f7f6f3, texto #181d20, grafite #263133 e vermelho #c9331a. Verde #147d43 reservado ao WhatsApp. Fonte nativa do sistema.

A imagem principal usa composição limpa de produto, sem texto, selo, marca de terceiros ou fundo de oficina. O vermelho da marca aparece em ações e pequenos sinais de hierarquia; não deve dominar grandes superfícies claras.

Serviços separados por linhas discretas. Evitar caixas decorativas em todos os conteúdos. Artes de serviço preservadas, com opção de ampliar.

## Interação

O mascote ocupa o canto inferior direito e substitui o atalho flutuante de WhatsApp. Abre ajuda apenas por clique, com respostas pré-definidas e encaminhamento ao Robson. Usar `help.css` para esse componente. A entrada e o balanço sutil do mascote respeitam `prefers-reduced-motion`; não adicionar outras animações repetitivas, abertura automática ou simulação de atendimento humano. No celular, o painel respeita a altura disponível e permite rolagem interna.

Filtros com aria-pressed e contagem de resultados. Menu fecha com Escape. Ampliação mantém e restaura o foco. O formulário prepara a mensagem para revisão e envio pelo visitante no WhatsApp.

Preservar foco visível, link para pular conteúdo e preferência por movimento reduzido.

## Conferência desta revisão

Abertura inspecionada no Edge em 1440px. Emulação de celular em 390px confirmou largura do documento de 390px, sem rolagem horizontal. JavaScript passou na verificação de sintaxe. Não foi executado teste completo de todas as interações.
