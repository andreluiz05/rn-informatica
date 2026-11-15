# RN Informática — Site Oficial

Site institucional e de serviços da **RN Informática** (Igarassu - PE), desenvolvido com HTML5 semântico, CSS3 moderno e JavaScript puro (sem dependências externas de compilação).

## Estrutura do Projeto

```text
rn-informatica/
├── index.html
├── README.md
├── docs/
│   └── design-system.md  # Guia visual e de interação
└── assets/
    ├── css/
    │   ├── styles.css       # Entrada e ordem de importação
    │   ├── base.css         # Tokens, reset e tipografia
    │   ├── components.css   # Cabeçalho, navegação e botões
    │   ├── sections.css     # Seções, formulário e lightbox
    │   ├── responsive.css   # Breakpoints e movimento reduzido
    │   └── help.css         # Mascote e painel de dúvidas
    ├── js/
    │   └── main.js
    └── imagens/
        ├── marca/
        │   ├── logo-rn-informatica.webp
        │   ├── perfil-instagram-robson-nunes.webp
        │   └── mascote-rn.png
        ├── hero/
        │   └── hero-pc-rn-v2.jpg
        ├── galeria/
        │   ├── bancada-computador-gamer-branco-aquario.webp
        │   ├── bancada-computador-gamer-preto-rgb.webp
        │   └── computador-gamer-destaque.webp
        └── servicos/
            ├── servico-cftv-alarmes-intelbras.webp
            ├── servico-comercios-escolas.webp
            ├── servico-computador-gamer-manutencao.webp
            ├── servico-eletricista-predial.webp
            ├── servico-geral-apresentacao.webp
            ├── servico-notebook-fonte-carregador.webp
            ├── servico-notebook-manutencao.webp
            ├── servico-notebook-reparo-base.webp
            └── servico-redes-computadores.webp
```

## Canais Oficiais Integrados

- **WhatsApp (Direto):** `https://wa.me/5581987289955` — `(81) 98728-9955`
- **Instagram:** `https://www.instagram.com/rn.informatica.pe/`
- **Facebook:** `https://www.facebook.com/rninfor.tec`
- **Localização (Google Maps):** `https://goo.gl/maps/wkNYAStm881WDxYA9`
- **Parceiros:** `https://linktr.ee/Rninfor`
- **Linktree Oficial:** `https://linktr.ee/rninformatica`
- **E-mail:** `rninfor.tec@gmail.com`

## Como Visualizar

O guia visual está em [docs/design-system.md](docs/design-system.md). A pasta `.agents` contém as instruções de trabalho das ferramentas e não faz parte do site publicado. A imagem `servico-geral-apresentacao.webp` é uma arte de reserva, preservada para uso futuro.

O mascote no canto inferior direito abre um painel de dúvidas com respostas pré-definidas e contato contextual pelo WhatsApp. Não depende de API ou chatbot externo. As respostas ficam em `iniciarAjuda`, em `assets/js/main.js`, e os estilos em `assets/css/help.css`. A imagem utilizada está em `assets/imagens/marca/mascote-rn.png`.

Para ajustar cores e tipografia, edite `assets/css/base.css`. Para mudar o layout de uma seção, use `sections.css`; ajustes por tamanho de tela ficam em `responsive.css`. Preserve a ordem de importação em `styles.css`.

Os filtros usam botões com estado pressionado e contagem anunciada. O menu fecha com Escape; a ampliação mantém o foco no diálogo e devolve ao botão original ao fechar. O formulário prepara uma mensagem para revisão e envio pelo próprio visitante no WhatsApp.

Abra o arquivo `index.html` diretamente em qualquer navegador moderno ou publique a pasta em qualquer serviço de hospedagem estática (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
