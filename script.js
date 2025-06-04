// Alterna o tema claro/escuro
function alternarTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute("data-theme");
  html.setAttribute("data-theme", temaAtual === "light" ? "dark" : "light");
  document.querySelector(".theme-toggle").textContent = temaAtual === "light" ? "☀️" : "🌙";
}

// Variáveis de controle
let carrinho = [];
const listaCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total");
const btnFinalizar = document.getElementById("finalizar");
const formasPagamento = document.getElementById("formasPagamento");

// Adiciona item ao carrinho
function adicionarAoCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

// Atualiza o carrinho na interface
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    listaCarrinho.appendChild(li);
    total += item.preco;
  });

  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
  btnFinalizar.disabled = carrinho.length === 0;
}

// Finaliza a compra e mostra opções de pagamento
function finalizarCompra() {
  formasPagamento.classList.remove("hidden");
}

// Confirma o pagamento e libera os downloads
document.getElementById("formPagamento").addEventListener("submit", function (e) {
  e.preventDefault();

  alert("Pagamento confirmado! Os links de download foram liberados.");

  carrinho.forEach(item => {
    const produto = document.querySelector(`.produto[data-nome="${item.nome}"]`);
    const botaoDownload = produto.querySelector(".download-btn");
    if (botaoDownload) {
      botaoDownload.classList.remove("hidden");
    }
  });

  carrinho = [];
  atualizarCarrinho();
  formasPagamento.classList.add("hidden");
});

// Força o download do PDF (sem abrir em nova aba)
function forcarDownload(event, arquivo) {
  event.preventDefault();
  const link = document.createElement("a");
  link.href = arquivo;
  link.download = arquivo.split("/").pop(); // Extrai apenas o nome do arquivo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

