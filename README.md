# 📦 ManiaEstoque - Controle de Validade

Um sistema web completo para controle de validade de produtos, projetado para pequenos comércios. A aplicação oferece um dashboard visual, gerenciamento de produtos em tempo real e um sistema de alertas por cores para evitar perdas e otimizar a gestão do estoque.

![Dashboard do ManiaEstoque]
<img width="1919" height="1079" alt="Captura de tela 2025-09-11 192442" src="https://github.com/user-attachments/assets/db33a08a-2f61-4c0e-9545-0e8dfb5f8918" />

---

## ✨ Funcionalidades Principais

* **🔐 Autenticação Segura:** Sistema de login e cadastro de usuários para proteger o acesso aos dados do estoque.

* **📊 Dashboard Intuitivo:** Uma visão geral e imediata do status do estoque com cards interativos que mostram:
    * O **total de produtos** cadastrados.
    * Produtos **frescos** (longe do vencimento).
    * Itens **próximos ao vencimento**.
    * Produtos já **vencidos**.

* **➕ Gerenciamento de Produtos (CRUD):** Adicione, edite e remova produtos facilmente através de um modal simples e direto, registrando informações como nome, categoria, quantidade e localização.

* **🚦 Status de Validade Automático:** Os produtos são automaticamente classificados e codificados por cores, proporcionando alertas visuais claros:
    * **Verde:** Fresco
    * **Amarelo:** Próximo ao Vencimento
    * **Vermelho:** Vencido

* **🔍 Busca e Filtragem Dinâmica:** Encontre produtos instantaneamente com uma busca por nome ou filtre a visualização por status de validade. Os resultados são atualizados em tempo real.

* **📱 Design Responsivo:** A interface se adapta perfeitamente a diferentes tamanhos de tela, permitindo o gerenciamento do estoque tanto no computador quanto no celular ou tablet.

---

## 💻 Tecnologias Utilizadas

* **Frontend:** `HTML5`, `CSS3` (com Flexbox & Grid para responsividade) e `JavaScript (Vanilla)`.
* **Backend & Database:** `Firebase` (Firestore Realtime Database & Authentication).
* **Bibliotecas:** `Font Awesome` para os ícones.

---

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/joaov-batista/maniaestoque.git](https://github.com/joaov-batista/maniaestoque.git)
    ```

2.  **Configure o Firebase:**
    * Crie um projeto no [console do Firebase](https://console.firebase.google.com/).
    * Ative os serviços **Firestore Database** e **Authentication** (com e-mail/senha).
    * No arquivo `script.js`, substitua o objeto `firebaseConfig` pelas credenciais do **seu** projeto Firebase.

3.  **Abra o `index.html`:**
    * Por ser um projeto frontend, basta abrir o arquivo `index.html` no seu navegador de preferência.

---

Feito com ❤️ por **João Batista**.
