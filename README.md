# 🚀 Tauri + React Simple App Template

Template moderno e **opinado** para criação de aplicações desktop leves com Tauri, React e Vite. Focado em alta performance, produtividade e padronização.

## 🛠 Tech Stack

- **Framework Desktop:** [Tauri v2](https://tauri.app/)
- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vite.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) & [Rust](https://www.rust-lang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Validação:** [Zod](https://zod.dev/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/)

## 🏎 Começando

1.  **Instalar dependências:**

    ```bash
    npm install
    ```

2.  **Iniciar ambiente de desenvolvimento:**

    ```bash
    npm run tauri dev
    ```

3.  **Gerar build de produção:**
    ```bash
    npm run tauri build
    ```

## 🎨 Interface e Shadcn/UI

Para manter a aplicação leve e única em termos de design, este projeto foi projetado para utilizar o **shadcn/ui via CLI**.

> [!IMPORTANT]
> **NÃO** reutilize componentes e estilos de projetos anteriores manualmente. Para cada novo projeto, utilize o **shadcn/ui create** para fazer o setup inicial dos componentes base.
>
> 🔗 **[https://ui.shadcn.com/create](https://ui.shadcn.com/create)**

### 🎨 Ícones

Utilizamos o **`react-icons`**, priorizando a biblioteca **Lucide** (`react-icons/lu`).

## 📜 Convenções e Arquitetura

Este projeto segue regras estritas de arquitetura e estilização.

- **Identação:** 4 espaços.
- **Ponto e vírgula:** Desativado (`semi: false`).
- **Aspas:** Duplas (`"`) por padrão.
- **Ordenação de Imports:** Automática por tamanho de linha (descendente).

### Estrutura de Pastas

- **`src/services`**: Camada de lógica e comunicação.
- **`src/schemas`**: Validações Zod para formulários e dados.
- **`src/hooks`**: Hooks customizados e reutilizáveis.
    - **`src/hooks/forms`**: Hooks específicos para gerenciamento de estados de formulários.
- **`src/types`**: Definições de tipos TypeScript globais.
- **`src/components/providers`**: Centralização de contextos.
- **`src/components/ui`**: Componentes base (Shadcn/UI).

## 🧪 Testes e Cobertura (Backend)

O backend (Rust) deve manter **100% de cobertura de testes**.

- **Rodar testes:** `cargo test` (dentro da pasta `src-tauri`).
- **Cobertura:** Utilizamos o `cargo-tarpaulin` para medição.
    - Instalação: `cargo install cargo-tarpaulin`.
    - Comando: `cargo tarpaulin --ignore-config-files --stdout`.

## 🤖 Scripts Úteis

- `npm run format`: Formata o código com Prettier.
- `npm run lint`: Verifica erros com ESLint.
- `npm run lint:fix`: Corrige automaticamente problemas de linting.

---

Feito com ❤️ por Marcuth.
