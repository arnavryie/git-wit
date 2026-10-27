# ⚔️ Contributing to GitWit

Thank you for your interest in contributing to **GitWit**! We are building the open-source social intelligence layer that connects GitHub developers with real community discovery.

## Development Setup

1. Fork and clone the repository.
2. Install frontend and mobile dependencies:
   ```bash
   cd apps/frontend && npm install
   cd ../mobile && npm install
   ```
3. Run the simultaneous dev environment:
   ```bash
   npm run dev
   ```

## Contribution Workflow

- Create a feature branch (`git checkout -b feature/your-feature-name`).
- Ensure all TypeScript types pass (`npm run typecheck`).
- Write meaningful, atomic commits adhering to conventional commit specifications.
- Submit a Pull Request detailing the problem solved and relevant screenshots.

Author: Yukta Tapdiya (@yukta06tapdiya)
