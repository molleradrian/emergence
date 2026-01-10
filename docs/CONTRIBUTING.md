# Contributing to Aetherium Nexus

Welcome, future collaborator! We're excited you're interested in contributing to the Aetherium Nexus. This document outlines how you can get started, the project's philosophy, and guidelines for making your contributions as smooth as possible.

## Project Vision & Philosophy

The Aetherium Nexus is envisioned as a dynamic Operating System for Emergence (OS/E). Our core mission is to facilitate insight generation, knowledge management, and collaborative research through an advanced AI-powered platform. We believe in:

*   **Emergence:** Fostering systems where complex patterns and intelligence arise from simpler interactions.
*   **Transparency:** Making the evolution of ideas and the operation of AI agents understandable.
*   **Modularity:** Designing components that are independent and reusable.
*   **Quality Control:** Implementing mechanisms for self-correction and iterative refinement of knowledge.

## How to Contribute

There are many ways to contribute, regardless of your skill set:

1.  **Code Contributions:**
    *   **Bug Reports:** Identify and report issues.
    *   **Feature Implementation:** Develop new functionalities as outlined in the `DEVELOPMENT_ROADMAP.md`.
    *   **Refactoring:** Improve existing code for better performance, readability, or maintainability.

2.  **Documentation:**
    *   Improve existing documentation (e.g., `USER_GUIDE.md`).
    *   Create new guides, tutorials, or API references.
    *   Add screenshots and GIFs to enhance clarity.

3.  **Design Contributions:**
    *   Suggest UI/UX improvements.
    *   Contribute to visual design elements.

4.  **Research & Theory:**
    *   Propose new philosophical or technical approaches aligning with the OS/E vision.
    *   Contribute to the foundational knowledge artifacts in The Vault.

## Getting Started with Code Contributions

### 1. Setup Your Development Environment

*   **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd Emergence
    ```
*   **Install dependencies:**
    ```bash
    npm install
    ```
*   **Environment Variables:** Create a `.env.local` file in the root directory and configure necessary environment variables (e.g., Supabase API keys, Firebase configuration). Refer to `.env.example` if available.
*   **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or your configured port) in your browser.

### 2. Branching & Committing

We use a feature-branch workflow:

1.  **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name-or-bugfix
    ```
2.  **Make your changes.**
3.  **Commit your changes:** Write clear, concise commit messages. Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification if possible.
    ```bash
    git commit -m "feat: Add new feature"
    ```
4.  **Push your branch:**
    ```bash
    git push origin feature/your-feature-name-or-bugfix
    ```

### 3. Pull Requests (PRs)

1.  Open a Pull Request to the `main` branch.
2.  **Provide a clear description** of your changes, why they were made, and any relevant context.
3.  **Link to any related issues or roadmap tasks.**
4.  Ensure your code passes all existing tests and linting checks.
5.  Request a review from a core maintainer.

## Code Style & Guidelines

*   **TypeScript First:** All new code should be written in TypeScript.
*   **React & Next.js:** Adhere to React best practices and Next.js conventions.
*   **Tailwind CSS:** For styling, we use Tailwind CSS.
*   **Clear & Concise:** Write readable and maintainable code.
*   **Comments:** Add comments for complex logic or non-obvious design choices, explaining *why* something is done, not just *what*.

## Testing

*   Before submitting a PR, ensure your changes do not break existing functionality.
*   Write unit and integration tests for new features where appropriate.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on our GitHub repository. Provide:
*   A clear and descriptive title.
*   Steps to reproduce the bug (if applicable).
*   Expected behavior.
*   Actual behavior.
*   Screenshots or GIFs (if helpful).

## Thank You!

Your contributions are invaluable to the growth and evolution of the Aetherium Nexus. We look forward to building this emergent system together!
