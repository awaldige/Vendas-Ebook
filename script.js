// Alterna o tema claro/escuro
function alternarTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute("data-theme");
  const novoTema = temaAtual === "light" ? "dark" : "light";
  html.setAttribute("data-theme", novoTema);
  document.querySelector(".theme-toggle").textContent = novoTema === "light" ? "🌙" : "☀️";
}

// Variáveis de controle
let carrinho = [];
const listaCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total");
const btnFinalizar = document.getElementById("finalizar");
const formasPagamento = document.getElementById("formasPagamento");

// Adiciona item ao carrinho, prevenindo duplicatas
function adicionarAoCarrinho(nome, preco) {
  if (carrinho.some(item => item.nome === nome)) {
    alert(`${nome} já está no carrinho.`);
    return;
  }

  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

// Remove item do carrinho pelo nome
function removerDoCarrinho(nome) {
  const index = carrinho.findIndex(item => item.nome === nome);
  if (index !== -1) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  }
}

// Atualiza o carrinho na interface, incluindo botões de remover
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

    // Botão remover
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.onclick = () => removerDoCarrinho(item.nome);

    li.appendChild(btnRemover);
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

  alert("Pagamento confirmado! Você pode baixar seus eBooks.");

  formasPagamento.classList.add("hidden");

  liberarDownloads();

  carrinho = [];
  atualizarCarrinho();
});

// Libera os botões de download dos eBooks comprados
function liberarDownloads() {
  carrinho.forEach(item => {
    const produtoDiv = [...document.querySelectorAll(".produto")].find(div => div.dataset.nome === item.nome);
    if (produtoDiv) {
      const botaoDownload = produtoDiv.querySelector(".download-btn");
      if (botaoDownload) {
        botaoDownload.classList.remove("hidden");
      }
    }
  });
}

// Força o download do PDF ao clicar no link de download
function forcarDownload(event, url) {
  event.preventDefault();
  const link = document.createElement("a");
  link.href = url;
  link.download = url.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
