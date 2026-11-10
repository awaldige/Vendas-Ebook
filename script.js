
/* =========================================
   AW EBOOKS - SCRIPT PRINCIPAL
========================================= */

/* =========================================
   CONFIGURAÇÕES E PRODUTOS
========================================= */

const STORAGE_CART = "awEbooksCart";
const STORAGE_THEME = "awEbooksTheme";
const STORAGE_DOWNLOADS = "awEbooksDownloads";

const produtosDisponiveis = {
  "HTML5 Notes": 35.90,
  "CSS Notes": 40.00,
  "MySQL Notes": 27.90
};

/* =========================================
   ELEMENTOS DA INTERFACE
========================================= */

const listaCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total");
const btnFinalizar = document.getElementById("finalizar");
const formasPagamento = document.getElementById("formasPagamento");
const formPagamento = document.getElementById("formPagamento");
const botaoTema = document.querySelector(".theme-toggle");

let carrinho = carregarCarrinho();
let downloadsLiberados = carregarDownloads();

/* =========================================
   ARMAZENAMENTO LOCAL
========================================= */

function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch (erro) {
    console.error("Não foi possível salvar os dados:", erro);
  }
}

function carregarCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_CART)) || [];

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados
      .filter(item =>
        item &&
        Object.prototype.hasOwnProperty.call(
          produtosDisponiveis,
          item.nome
        )
      )
      .map(item => ({
        nome: item.nome,
        preco: produtosDisponiveis[item.nome]
      }));
  } catch (erro) {
    console.error("Erro ao carregar o carrinho:", erro);
    return [];
  }
}

function carregarDownloads() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(STORAGE_DOWNLOADS)
    ) || [];

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados.filter(nome =>
      Object.prototype.hasOwnProperty.call(
        produtosDisponiveis,
        nome
      )
    );
  } catch (erro) {
    console.error("Erro ao carregar downloads:", erro);
    return [];
  }
}

function salvarCarrinho() {
  salvarDados(STORAGE_CART, carrinho);
}

function salvarDownloads() {
  salvarDados(STORAGE_DOWNLOADS, downloadsLiberados);
}

/* =========================================
   TEMA CLARO E ESCURO
========================================= */

function aplicarTema(tema) {
  const novoTema = tema === "dark" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", novoTema);

  if (botaoTema) {
    botaoTema.textContent = novoTema === "light" ? "🌙" : "☀️";

    botaoTema.setAttribute(
      "aria-label",
      novoTema === "light"
        ? "Ativar tema escuro"
        : "Ativar tema claro"
    );
  }

  const metaTheme = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (metaTheme) {
    metaTheme.content = novoTema === "dark" ? "#081426" : "#07152e";
  }
}

function alternarTema() {
  const temaAtual = document.documentElement.getAttribute("data-theme");
  const novoTema = temaAtual === "light" ? "dark" : "light";

  aplicarTema(novoTema);

  try {
    localStorage.setItem(STORAGE_THEME, novoTema);
  } catch (erro) {
    console.error("Não foi possível salvar o tema:", erro);
  }
}

function inicializarTema() {
  let temaSalvo = "light";

  try {
    temaSalvo = localStorage.getItem(STORAGE_THEME) || "light";
  } catch (erro) {
    console.error("Não foi possível recuperar o tema:", erro);
  }

  aplicarTema(temaSalvo);
}

/* =========================================
   FORMATAÇÃO DE MOEDA
========================================= */

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* =========================================
   ADICIONAR AO CARRINHO
========================================= */

function adicionarAoCarrinho(nome, preco) {
  if (!Object.prototype.hasOwnProperty.call(
    produtosDisponiveis,
    nome
  )) {
    alert("Produto não encontrado.");
    return;
  }

  if (carrinho.some(item => item.nome === nome)) {
    alert(`${nome} já está no carrinho.`);
    return;
  }

  // Usa o preço oficial cadastrado no catálogo.
  const precoOficial = produtosDisponiveis[nome];

  carrinho.push({
    nome,
    preco: precoOficial
  });

  salvarCarrinho();
  atualizarCarrinho();

  const botao = [...document.querySelectorAll(".produto")]
    .find(produto => produto.dataset.nome === nome)
    ?.querySelector("button");

  if (botao) {
    const textoOriginal = botao.textContent;

    botao.textContent = "✓ Adicionado!";

    setTimeout(() => {
      botao.textContent = textoOriginal;
    }, 1200);
  }
}

/* =========================================
   REMOVER DO CARRINHO
========================================= */

function removerDoCarrinho(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);

  salvarCarrinho();
  atualizarCarrinho();
}

/* =========================================
   ATUALIZAR CARRINHO
========================================= */

function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    const li = document.createElement("li");

    const nomePreco = document.createElement("span");
    nomePreco.textContent =
      `${item.nome} — ${formatarMoeda(item.preco)}`;

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.textContent = "Remover";
    btnRemover.setAttribute(
      "aria-label",
      `Remover ${item.nome} do carrinho`
    );

    btnRemover.addEventListener("click", () => {
      removerDoCarrinho(item.nome);
    });

    li.appendChild(nomePreco);
    li.appendChild(btnRemover);

    listaCarrinho.appendChild(li);

    total += item.preco;
  });

  totalCarrinho.textContent = `Total: ${formatarMoeda(total)}`;

  btnFinalizar.disabled = carrinho.length === 0;

  salvarCarrinho();
}

/* =========================================
   ABRIR CHECKOUT DEMONSTRATIVO
========================================= */

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um eBook ao carrinho.");
    return;
  }

  formasPagamento.classList.remove("hidden");

  formasPagamento.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* =========================================
   LIBERAR DOWNLOADS
========================================= */

function liberarDownloads(itensComprados) {
  itensComprados.forEach(item => {
    if (!downloadsLiberados.includes(item.nome)) {
      downloadsLiberados.push(item.nome);
    }
  });

  salvarDownloads();

  atualizarDownloads();
}

function atualizarDownloads() {
  document.querySelectorAll(".produto").forEach(produto => {
    const nome = produto.dataset.nome;

    if (downloadsLiberados.includes(nome)) {
      const botaoDownload = produto.querySelector(".download-btn");

      if (botaoDownload) {
        botaoDownload.classList.remove("hidden");
      }
    }
  });
}

/* =========================================
   CONFIRMAR PAGAMENTO DEMONSTRATIVO
========================================= */

formPagamento.addEventListener("submit", function(event) {
  event.preventDefault();

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const pagamentoSelecionado = formPagamento.querySelector(
    'input[name="pagamento"]:checked'
  );

  if (!pagamentoSelecionado) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  const itensComprados = [...carrinho];

  const forma = pagamentoSelecionado.parentElement.textContent.trim();

  liberarDownloads(itensComprados);

  alert(
    `Simulação concluída!\n\n` +
    `Forma selecionada: ${forma}\n` +
    `Total: ${formatarMoeda(
      itensComprados.reduce((total, item) => total + item.preco, 0)
    )}\n\n` +
    `Os downloads demonstrativos foram liberados.`
  );

  carrinho = [];

  salvarCarrinho();
  atualizarCarrinho();

  formPagamento.reset();
  formasPagamento.classList.add("hidden");

  document.getElementById("catalogo").scrollIntoView({
    behavior: "smooth"
  });
});

/* =========================================
   DOWNLOAD DOS ARQUIVOS PDF
========================================= */

function forcarDownload(event, arquivo) {
  event.preventDefault();

  const link = document.createElement("a");

  link.href = arquivo;
  link.download = arquivo.split("/").pop();

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

function inicializarLoja() {
  inicializarTema();
  atualizarCarrinho();
  atualizarDownloads();
}

inicializarLoja();
