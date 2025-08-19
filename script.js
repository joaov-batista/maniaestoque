// Aqui ficam as chaves do meu projeto no Firebase, não posso mostrar pra ninguém.
const firebaseConfig = {
  apiKey: "AIzaSyCpSYROtAFclPOqPwTeu0NvEG4FUIee5ec",
  authDomain: "estoquemania-63d6e.firebaseapp.com",
  projectId: "estoquemania-63d6e",
  storageBucket: "estoquemania-63d6e.appspot.com",
  messagingSenderId: "808343934247",
  appId: "1:808343934247:web:a3050290d08ff047628502",
  measurementId: "G-4C6Y8MCBWR"
};

// Iniciando a conexão com o Firebase, a mágica começa aqui.
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Pegando todos os botões e campos da tela pra poder usar depois.
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');
const modal = document.getElementById('product-modal');
const cancelBtn = document.getElementById('cancel-btn');
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('show-register');
const summaryCardsContainer = document.querySelector('.summary-cards');

// Variáveis que vou precisar em vários lugares do código.
let localProducts = [];
let unsubscribe;

// --- Toda a parte de login e de criar conta nova ---

// Função pra trocar entre a tela de login e a de cadastro.
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    const isLoginVisible = !loginForm.classList.contains('hidden');
    authTitle.textContent = isLoginVisible ? 'Login' : 'Cadastro';
    authSubtitle.textContent = isLoginVisible ? 'Acesse sua conta para gerenciar seus produtos' : 'Crie uma conta para começar';
    toggleText.textContent = isLoginVisible ? 'Não tem uma conta?' : 'Já tem uma conta?';
    toggleLink.textContent = isLoginVisible ? 'Cadastre-se' : 'Faça Login';
});

// Quando o cara clica em 'Criar Conta'.
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .catch(error => {
            console.error("Erro no cadastro:", error);
            let friendlyMessage = "Ocorreu um erro ao tentar criar a conta.";
            if (error.code === 'auth/email-already-in-use') { friendlyMessage = "Este endereço de e-mail já está em uso."; }
            else if (error.code === 'auth/weak-password') { friendlyMessage = "A senha é muito fraca. Use pelo menos 6 caracteres."; }
            alert(friendlyMessage);
        });
});

// Quando ele tenta entrar no sistema.
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password).catch(error => { console.error("Erro no login:", error); alert("E-mail ou senha inválidos."); });
});

// Botão de sair, pra deslogar.
logoutBtn.addEventListener('click', () => auth.signOut());

// Essa é a parte mais importante. O Firebase fica de olho se tem alguém logado ou não e mostra a tela certa.
auth.onAuthStateChanged(user => {
    if (user) {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        initAppForUser();
    } else {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        if (unsubscribe) unsubscribe();
    }
});

// A função principal que roda quando o usuário consegue entrar no sistema.
function initAppForUser() {
    const productsRef = db.collection('products');
    
    // Aqui ele fica ouvindo o banco de dados em tempo real. Se alguém adicionar um produto, aparece na hora pra todo mundo.
    unsubscribe = productsRef.onSnapshot(snapshot => {
        localProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProducts();
    }, error => console.error("Erro ao buscar produtos: ", error));

    // Lógica pra salvar um produto novo ou editar um que já existe.
    const productFormHandler = (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value.trim(),
            date: document.getElementById('product-date').value,
            quantity: document.getElementById('product-quantity').value,
            location: document.getElementById('product-location').value.trim()
        };
        const promise = id ? productsRef.doc(id).update(productData) : productsRef.add(productData);
        promise.then(closeModal).catch(error => alert(error.message));
    };

    productForm.addEventListener('submit', productFormHandler);

    // Pra quando clicar nos botões de editar ou deletar um produto.
    productList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const card = target.closest('.product-card');
        const productId = card.dataset.id;
        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja remover este produto?')) productsRef.doc(productId).delete();
        } else if (target.classList.contains('edit-btn')) {
            const product = localProducts.find(p => p.id === productId);
            document.getElementById('modal-title').textContent = 'Editar Produto';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-date').value = product.date;
            document.getElementById('product-quantity').value = product.quantity;
            document.getElementById('product-location').value = product.location;
            openModal();
        }
    });

    unsubscribe = () => { productForm.removeEventListener('submit', productFormHandler); };
}

// --- Funções que ajudam o resto do código a funcionar ---

// Pra abrir e fechar aquela janelinha de adicionar produto.
const openModal = () => modal.classList.add('active');
const closeModal = () => {
    modal.classList.remove('active');
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Adicionar Produto';
};

// Calcula se o produto tá vencido, perto de vencer ou de boa.
const getProductStatus = (expiryDateStr) => {
    const today = new Date();
    const expiry = new Date(new Date(expiryDateStr).getTime() + 24 * 60 * 60 * 1000);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { className: 'expired', text: `Venceu há ${Math.abs(diffDays)} dia(s)` };
    if (diffDays === 0) return { className: 'warning', text: 'Vence hoje' };
    if (diffDays <= 7) return { className: 'warning', text: `Vence em ${diffDays} dia(s)` };
    return { className: 'fresh', text: 'Fresco' };
};

// A função que desenha todos os produtos na tela. É aqui que o filtro e a busca acontecem.
const renderProducts = () => {
    productList.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const filterTerm = filterSelect.value;
    
    let filteredProducts = localProducts.filter(p => {
        const statusClass = getProductStatus(p.date).className;
        return p.name.toLowerCase().includes(searchTerm) && (filterTerm === 'todos' || filterTerm === statusClass);
    });

    // MUDANÇA: Adicionei essa linha pra ordenar os produtos por data, do mais próximo ao mais distante.
    filteredProducts.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filteredProducts.length === 0) {
        productList.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center; padding: 2rem;">Nenhum produto encontrado.</p>`;
    } else {
        filteredProducts.forEach(p => {
            const status = getProductStatus(p.date);
            const formattedDate = new Date(p.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const card = document.createElement('div');
            card.className = `product-card ${status.className}`;
            card.dataset.id = p.id;
            card.innerHTML = `
                <div class="product-actions"><button class="edit-btn"><i class="fas fa-edit"></i></button><button class="delete-btn"><i class="fas fa-trash"></i></button></div>
                <h3>${p.name}</h3><p class="category">${p.category}</p>
                <div class="product-info"><i class="fas fa-calendar-alt"></i><span>${formattedDate}</span></div>
                <div class="product-info"><i class="fas fa-box-open"></i><span>Qtd: ${p.quantity}</span></div>
                <div class="product-info"><i class="fas fa-map-marker-alt"></i><span>${p.location}</span></div>
                <div class="status-badge">${status.text}</div>`;
            productList.appendChild(card);
        });
    }
    updateSummary();
};

// Atualiza os números lá de cima: total de produtos, vencidos, etc.
const updateSummary = () => {
    document.getElementById('total-produtos').textContent = localProducts.length;
    document.getElementById('produtos-frescos').textContent = localProducts.filter(p => getProductStatus(p.date).className === 'fresh').length;
    document.getElementById('proximos-vencimento').textContent = localProducts.filter(p => getProductStatus(p.date).className === 'warning').length;
    document.getElementById('produtos-vencidos').textContent = localProducts.filter(p => getProductStatus(p.date).className === 'expired').length;
};

// --- Deixando os outros botões e campos prontos pra quando o usuário interagir ---
addProductBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.target === modal && closeModal());
searchInput.addEventListener('input', renderProducts);
filterSelect.addEventListener('change', renderProducts);

// A última funcionalidade que pedi, pra filtrar clicando nos cards.
summaryCardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card && card.dataset.filter) {
        const filterValue = card.dataset.filter;
        filterSelect.value = filterValue;
        renderProducts();
    }
});
