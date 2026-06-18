const botoesAssinatura = document.querySelectorAll('[data-plano]');
const linksRodape = document.querySelectorAll('.lista__link a');

const modal = document.createElement('div');
modal.className = 'modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-labelledby', 'modal-titulo');
modal.innerHTML = `
  <div class="modal__conteudo">
    <button class="modal__fechar" type="button" aria-label="Fechar formulário">×</button>
    <h2 class="modal__titulo" id="modal-titulo">Finalize sua assinatura</h2>
    <p class="modal__texto" id="modal-descricao"></p>
    <form class="formulario" novalidate>
      <div class="formulario__campo">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text" autocomplete="name" required>
        <small class="formulario__erro" data-erro="nome"></small>
      </div>
      <div class="formulario__campo">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" autocomplete="email" required>
        <small class="formulario__erro" data-erro="email"></small>
      </div>
      <button class="container__botao" type="submit">Enviar interesse</button>
    </form>
  </div>
`;

document.body.appendChild(modal);

const toast = document.createElement('p');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);

const descricaoModal = modal.querySelector('#modal-descricao');
const botaoFechar = modal.querySelector('.modal__fechar');
const formulario = modal.querySelector('.formulario');
const campoNome = modal.querySelector('#nome');
const campoEmail = modal.querySelector('#email');
const erroNome = modal.querySelector('[data-erro="nome"]');
const erroEmail = modal.querySelector('[data-erro="email"]');

let planoSelecionado = '';
let temporizadorToast;

function abrirModal(plano, preco) {
  planoSelecionado = plano;
  descricaoModal.textContent = `Você escolheu o plano ${plano} por ${preco}. Preencha seus dados para receber a proposta.`;
  modal.classList.add('modal--aberto');
  campoNome.focus();
}

function fecharModal() {
  modal.classList.remove('modal--aberto');
  formulario.reset();
  limparErros();
}

function limparErros() {
  erroNome.textContent = '';
  erroEmail.textContent = '';
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add('toast--visivel');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    toast.classList.remove('toast--visivel');
  }, 4000);
}

botoesAssinatura.forEach((botao) => {
  botao.addEventListener('click', (evento) => {
    evento.preventDefault();
    abrirModal(botao.dataset.plano, botao.dataset.preco);
  });
});

linksRodape.forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();
    mostrarToast(`Você clicou em "${link.textContent}". Link demonstrativo da aula.`);
  });
});

botaoFechar.addEventListener('click', fecharModal);

modal.addEventListener('click', (evento) => {
  if (evento.target === modal) {
    fecharModal();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && modal.classList.contains('modal--aberto')) {
    fecharModal();
  }
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limparErros();

  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  let formularioValido = true;

  if (nome.length < 3) {
    erroNome.textContent = 'Digite pelo menos 3 caracteres.';
    formularioValido = false;
  }

  if (!emailValido(email)) {
    erroEmail.textContent = 'Digite um e-mail válido.';
    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  fecharModal();
  mostrarToast(`${nome}, recebemos seu interesse no plano ${planoSelecionado}!`);
});
