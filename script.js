document.addEventListener("DOMContentLoaded", () => {
  // Ativa modo claro/escuro e salva escolha no localStorage
  function alternarTema() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('.theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  // Inicializa tema ao carregar a página
  function initTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelector('.theme-toggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  // Mostra mensagem temporária
  function mostrarMensagem(texto) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = texto;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('visivel');
    }, 100);
    setTimeout(() => {
      toast.classList.remove('visivel');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // Controle do carrinho
  const carrinho = [];
  const itensCarrinhoEl = document.getElementById('itens-carrinho');
  const totalEl = document.getElementById('total');
  const btnFinalizar = document.getElementById('finalizar');
  const formasPagamentoSection = document.getElementById('formasPagamento');
  const formPagamento = document.getElementById('formPagamento');

  function atualizarCarrinho() {
    itensCarrinhoEl.innerHTML = '';
    let total = 0;
    carrinho.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
      itensCarrinhoEl.appendChild(li);
      total += item.preco;
    });
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    btnFinalizar.disabled = carrinho.length === 0;
  }

  function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
    mostrarMensagem(`"${nome}" adicionado ao carrinho.`);
  }

  function finalizarCompra() {
    formasPagamentoSection.classList.remove('hidden');
    btnFinalizar.disabled = true;
  }

  formPagamento.addEventListener('submit', (e) => {
    e.preventDefault();

    const pagamentoSelecionado = formPagamento.querySelector('input[name="pagamento"]:checked')?.value;
    if (!pagamentoSelecionado) {
      mostrarMensagem('Por favor, escolha uma forma de pagamento.');
      return;
    }

    mostrarMensagem('Pagamento confirmado! Você pode baixar seus eBooks.');

    // Mostrar botões de download relacionados aos itens do carrinho
    carrinho.forEach((item) => {
      const produtos = document.querySelectorAll('.produto');
      produtos.forEach((produto) => {
        const nomeProduto = produto.getAttribute('data-nome');
        if (nomeProduto === item.nome) {
          const btnDownload = produto.querySelector('.download-btn');
          if (btnDownload) btnDownload.classList.remove('hidden');
        }
      });
    });

    formasPagamentoSection.classList.add('hidden');
    carrinho.length = 0;
    atualizarCarrinho();
  });

  // Função para baixar arquivo sem sair da página
  function baixarArquivo(caminho, nomeArquivo) {
    const link = document.createElement('a');
    link.href = caminho;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Inicializar tema ao carregar a página
  initTema();

  // Disponibiliza funções globalmente
  window.alternarTema = alternarTema;
  window.adicionarAoCarrinho = adicionarAoCarrinho;
  window.finalizarCompra = finalizarCompra;
  window.baixarArquivo = baixarArquivo;
});

