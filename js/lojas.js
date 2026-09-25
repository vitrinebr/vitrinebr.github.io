/* =========================================================
   VITRINEBR: lista de lojas
   Para adicionar uma loja nova, copie um bloco { ... } e troque os dados.
   ========================================================= */

const VITRINEBR = {
  // Link para quem quiser uma vitrine (WhatsApp, Instagram, e-mail...).
  // Deixe vazio ('') para esconder o convite no fim da página.
  contato: 'https://ig.me/m/euthigo.a',
  contatoTexto: 'Quero minha vitrine',
};

/* ---------------------------------------------------------
   - endereco: o nome do repositório (vitrinebr.github.io/ENDERECO/)
     ou um link completo (https://...) se a loja tiver domínio próprio
   - capa: imagem em assets/lojas/ (de preferência 1200 × 900)
   - logo: opcional, PNG sem fundo em assets/lojas/
   - cor: cor da marca (aparece no detalhe do card)
   --------------------------------------------------------- */

const LOJAS = [
  {
    nome: 'Nóli',
    endereco: 'noli',
    categoria: 'Ateliê',
    segmento: 'Cerâmica fria',
    descricao: 'Porta-joias, incensários, porta-velas e peças decorativas modeladas e pintadas à mão.',
    capa: 'assets/lojas/noli.jpg',
    logo: 'assets/lojas/noli-logo.png',
    cor: '#6E0003',
    fundoLogo: '#ECE6DC',
    instagram: 'https://www.instagram.com/atelie_noli',
  },
];
