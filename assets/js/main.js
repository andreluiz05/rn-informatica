(() => {
  "use strict";

  // Configuração compartilhada por todos os links e formulários do WhatsApp.
  // O número deve permanecer no formato internacional, somente com algarismos.
  const WHATSAPP_NUMERO = "5581987289955";

  // Guarda o temporizador ativo para evitar que duas notificações se sobreponham.
  let temporizadorToast = null;

  /**
   * Cria uma URL segura do WhatsApp com a mensagem codificada.
   * @param {string} mensagem Texto que será preenchido na conversa.
   * @returns {string} URL completa do WhatsApp.
   */
  function montarLinkWhatsApp(mensagem) {
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  }

  /** Exibe uma notificação curta e a remove automaticamente após três segundos. */
  function exibirNotificacao(mensagem) {
    const elementoToast = document.getElementById("toast");
    if (!elementoToast) return;

    elementoToast.textContent = mensagem;
    elementoToast.removeAttribute("hidden");

    if (temporizadorToast) {
      clearTimeout(temporizadorToast);
    }

    temporizadorToast = setTimeout(() => {
      elementoToast.setAttribute("hidden", "");
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // Cabeçalho e navegação
  // ---------------------------------------------------------------------------

  /**
   * Aplica a sombra do cabeçalho durante a rolagem e destaca o item da seção
   * atualmente visível. O aria-current informa o mesmo estado a leitores de tela.
   */
  function iniciarCabecalhoEScrollSpy() {
    const cabecalho = document.getElementById("header");
    const linksNavegacao = Array.from(document.querySelectorAll(".nav__link"));
    const secoes = linksNavegacao
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const atualizarEstadoScroll = () => {
      if (cabecalho) {
        cabecalho.classList.toggle("is-scrolled", window.scrollY > 16);
      }

      // A margem compensa a altura do cabeçalho fixo ao calcular a seção ativa.
      const posicaoAtual = window.scrollY + 130;
      let secaoAtivaId = "";

      secoes.forEach((secao) => {
        if (posicaoAtual >= secao.offsetTop) {
          secaoAtivaId = secao.id;
        }
      });

      linksNavegacao.forEach((link) => {
        const destino = link.getAttribute("href")?.slice(1);
        const estaAtivo = destino === secaoAtivaId;
        link.classList.toggle("is-active", estaAtivo);
        if (estaAtivo) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    window.addEventListener("scroll", atualizarEstadoScroll, { passive: true });
    atualizarEstadoScroll();
  }

  /** Controla abertura, fechamento e acessibilidade do menu para celular. */
  function iniciarMenuMobile() {
    const botaoMenu = document.getElementById("menuToggle");
    const menuMobile = document.getElementById("mobileMenu");
    if (!botaoMenu || !menuMobile) return;

    // Centraliza todas as mudanças de estado para manter hidden e aria-expanded
    // sempre sincronizados.
    const definirMenuAberto = (aberto) => {
      if (aberto) {
        menuMobile.removeAttribute("hidden");
      } else {
        menuMobile.setAttribute("hidden", "");
      }
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu",
      );
    };

    botaoMenu.addEventListener("click", () => {
      const estaOculto = menuMobile.hasAttribute("hidden");
      definirMenuAberto(estaOculto);
    });

    menuMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => definirMenuAberto(false));
    });
    // Escape fecha o menu e devolve o foco ao botão que o abriu.
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && !menuMobile.hidden) {
        definirMenuAberto(false);
        botaoMenu.focus();
      }
    });
    // Clique fora do cabeçalho fecha o menu automaticamente.
    document.addEventListener("click", (evento) => {
      if (
        !menuMobile.hidden &&
        evento.target instanceof Element &&
        !evento.target.closest("#header")
      ) {
        definirMenuAberto(false);
      }
    });
    window
      .matchMedia("(min-width: 1121px)")
      .addEventListener("change", (evento) => {
        if (evento.matches) definirMenuAberto(false);
      });
  }

  // ---------------------------------------------------------------------------
  // Catálogo de serviços
  // ---------------------------------------------------------------------------

  /** Filtra os cartões por categoria e atualiza a quantidade exibida. */
  function iniciarFiltroServicos() {
    const abas = Array.from(document.querySelectorAll(".tab[data-filter]"));
    const cartoes = Array.from(
      document.querySelectorAll(".catalog-card[data-category]"),
    );
    if (!abas.length || !cartoes.length) return;

    const aplicarCategoria = (categoria) => {
      abas.forEach((aba) => {
        const ativa = aba.dataset.filter === categoria;
        aba.classList.toggle("is-active", ativa);
        aba.setAttribute("aria-pressed", String(ativa));
      });

      cartoes.forEach((cartao) => {
        const corresponde =
          categoria === "all" || cartao.dataset.category === categoria;
        cartao.classList.toggle("is-hidden", !corresponde);
        cartao.hidden = !corresponde;
      });
      const total = cartoes.filter((cartao) => !cartao.hidden).length;
      const contador = document.getElementById("serviceCount");
      if (contador)
        contador.textContent = `${total} ${total === 1 ? "serviço disponível" : "serviços disponíveis"}`;
    };

    abas.forEach((aba) => {
      aba.addEventListener("click", () => {
        aplicarCategoria(aba.dataset.filter || "all");
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Galeria e lightbox
  // ---------------------------------------------------------------------------

  /**
   * Abre imagens da galeria em uma caixa de diálogo acessível, bloqueia a
   * interação com o restante da página e restaura o foco ao fechar.
   */
  function iniciarModalImagem() {
    const modal = document.getElementById("lightbox");
    const imagemModal = document.getElementById("lightboxImg");
    const legendaModal = document.getElementById("lightboxCaption");
    const botaoFechar = document.getElementById("lightboxClose");
    if (!modal || !imagemModal || !legendaModal) return;

    let ultimoElementoFocado = null;
    let overflowAnterior = "";
    // Registra o estado original de cada elemento antes de aplicar `inert`.
    const elementosInertes = new Map();

    const fecharModal = () => {
      modal.setAttribute("hidden", "");
      imagemModal.removeAttribute("src");
      document.body.style.overflow = overflowAnterior;
      // Restaura exatamente o estado que existia antes da abertura do modal.
      elementosInertes.forEach((estado, elemento) => {
        elemento.inert = estado;
      });
      elementosInertes.clear();
      if (ultimoElementoFocado instanceof HTMLElement) {
        ultimoElementoFocado.focus();
      }
    };

    document.querySelectorAll("[data-lightbox]").forEach((gatilho) => {
      gatilho.addEventListener("click", () => {
        ultimoElementoFocado = document.activeElement;
        imagemModal.src = gatilho.dataset.lightbox || "";
        imagemModal.alt = gatilho.dataset.caption || "Imagem ampliada";
        legendaModal.textContent = gatilho.dataset.caption || "";
        modal.removeAttribute("hidden");
        overflowAnterior = document.body.style.overflow;
        // Impede que teclado e leitores de tela alcancem conteúdo atrás do modal.
        Array.from(document.body.children).forEach((elemento) => {
          if (
            elemento !== modal &&
            elemento instanceof HTMLElement &&
            elemento.tagName !== "SCRIPT"
          ) {
            elementosInertes.set(elemento, elemento.inert);
            elemento.inert = true;
          }
        });
        document.body.style.overflow = "hidden";
        botaoFechar?.focus();
      });
    });

    document.querySelectorAll("[data-close-lightbox]").forEach((elemento) => {
      elemento.addEventListener("click", fecharModal);
    });

    document.addEventListener("keydown", (evento) => {
      // O único controle interativo do lightbox é o botão de fechar.
      if (evento.key === "Tab" && !modal.hidden) {
        evento.preventDefault();
        botaoFechar?.focus();
      }
      if (evento.key === "Escape" && !modal.hasAttribute("hidden")) {
        fecharModal();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Contatos e orçamento
  // ---------------------------------------------------------------------------

  /** Copia telefone ou e-mail e oferece retorno visual e auditivo ao visitante. */
  function iniciarBotoesCopia() {
    document.querySelectorAll("[data-copy]").forEach((botao) => {
      let temporizadorEstado = null;
      const ariaOriginal = botao.getAttribute("aria-label") || "Copiar";

      botao.addEventListener("click", async () => {
        const texto = botao.getAttribute("data-copy");
        if (!texto) return;

        const rotulo = botao.querySelector(".copy-btn__label");

        try {
          await navigator.clipboard.writeText(texto);
          botao.classList.add("is-copied");
          botao.setAttribute("aria-label", `Copiado: ${texto}`);
          if (rotulo) rotulo.textContent = "Copiado!";
          if (temporizadorEstado) clearTimeout(temporizadorEstado);
          temporizadorEstado = setTimeout(() => {
            botao.classList.remove("is-copied");
            botao.setAttribute("aria-label", ariaOriginal);
            if (rotulo) rotulo.textContent = "Copiar";
          }, 1800);
          exibirNotificacao(`Copiado: ${texto}`);
        } catch {
          exibirNotificacao(`Contato: ${texto}`);
        }
      });
    });
  }

  /**
   * Converte os dados do formulário em uma mensagem organizada e abre o
   * atendimento no WhatsApp sem enviar informações para um servidor próprio.
   */
  function iniciarFormularioOrcamento() {
    const formulario = document.getElementById("quoteForm");
    const textoRetorno = document.getElementById("formFeedback");
    if (!formulario) return;

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const nomeCliente =
        document.getElementById("clientName")?.value.trim() || "";
      const tipoServico = document.getElementById("serviceType")?.value || "";
      const descricaoSolicitacao =
        document.getElementById("clientMessage")?.value.trim() || "";

      // O array facilita a manutenção das quebras de linha da mensagem.
      const mensagemProfissional = [
        "Olá, equipe RN Informática! Visitei o site oficial e gostaria de solicitar um orçamento.",
        "",
        `*Nome:* ${nomeCliente}`,
        `*Serviço de interesse:* ${tipoServico}`,
        `*Descrição da solicitação:* ${descricaoSolicitacao}`,
        "",
        "Aguardo o retorno. Obrigado(a)!",
      ].join("\n");

      const urlWhatsApp = montarLinkWhatsApp(mensagemProfissional);
      window.open(urlWhatsApp, "_blank", "noopener,noreferrer");

      if (textoRetorno) {
        textoRetorno.innerHTML = `Mensagem preparada! Caso o WhatsApp não abra automaticamente, <a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer">clique aqui para enviar</a>.`;
      }
      exibirNotificacao("Abrindo atendimento no WhatsApp...");
    });
  }

  // ---------------------------------------------------------------------------
  // Assistente de dúvidas
  // ---------------------------------------------------------------------------

  /**
   * Controla o mascote de ajuda, apresenta respostas locais e prepara uma
   * mensagem de WhatsApp relacionada à dúvida escolhida.
   */
  function iniciarAjuda() {
    const botao = document.getElementById("helpLauncher");
    const painel = document.getElementById("helpPanel");
    const fechar = document.getElementById("helpClose");
    const resposta = document.getElementById("helpAnswer");
    const contato = document.getElementById("helpWhatsapp");
    if (!botao || !painel || !fechar || !resposta || !contato) return;

    // Respostas curtas ficam no próprio site para abrir instantaneamente.
    const respostas = {
      orcamento:
        "Conte o que está acontecendo com o equipamento. Após a avaliação, você recebe o orçamento e decide se quer seguir com o serviço.",
      visita:
        "Sim. A RN Informática realiza visitas em Igarassu e região para redes, câmeras, elétrica e suporte a comércios e escolas. Combine o local e a disponibilidade pelo WhatsApp.",
      prazo:
        "O valor e o prazo dependem do problema e das peças necessárias. Podemos orientar você após avaliar o equipamento. Não há um preço único para todos os reparos.",
      gamer:
        "Pode levar suas peças para a montagem do PC. Se ainda vai comprar, converse com o Robson para conferir a compatibilidade antes da compra.",
    };
    // O parâmetro devolverFoco evita saltos quando o painel fecha por link externo.
    const definirAberto = (aberto, devolverFoco = true) => {
      painel.hidden = !aberto;
      botao.setAttribute("aria-expanded", String(aberto));
      if (aberto) fechar.focus();
      else if (devolverFoco) botao.focus();
    };
    botao.hidden = false;
    botao.addEventListener("click", () => definirAberto(painel.hidden));
    fechar.addEventListener("click", () => definirAberto(false));
    painel.querySelectorAll("[data-help]").forEach((pergunta) => {
      pergunta.addEventListener("click", () => {
        resposta.hidden = false;
        resposta.textContent = respostas[pergunta.dataset.help];
        painel
          .querySelectorAll("[data-help]")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === pergunta)),
          );
        contato.href = montarLinkWhatsApp(
          `Olá, Robson! Minha dúvida é: ${pergunta.textContent}`,
        );
      });
    });
    painel
      .querySelector(".help-more")
      .addEventListener("click", () => definirAberto(false, false));
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && !painel.hidden) definirAberto(false);
    });
    document.addEventListener("click", (evento) => {
      if (!painel.hidden && !evento.target.closest(".help-widget"))
        definirAberto(false, false);
    });
  }

  // ---------------------------------------------------------------------------
  // Rodapé e inicialização
  // ---------------------------------------------------------------------------

  /** Mantém o ano de direitos autorais sincronizado com a data do dispositivo. */
  function iniciarAnoRodape() {
    const elementoAno = document.getElementById("currentYear");
    if (elementoAno) {
      const anoAtual = String(new Date().getFullYear());
      elementoAno.textContent = anoAtual;
      elementoAno.setAttribute("datetime", anoAtual);
    }
  }

  // Inicia os recursos somente depois que toda a estrutura HTML estiver pronta.
  document.addEventListener("DOMContentLoaded", () => {
    iniciarCabecalhoEScrollSpy();
    iniciarMenuMobile();
    iniciarFiltroServicos();
    iniciarModalImagem();
    iniciarBotoesCopia();
    iniciarFormularioOrcamento();
    iniciarAnoRodape();
    iniciarAjuda();
  });
})();
