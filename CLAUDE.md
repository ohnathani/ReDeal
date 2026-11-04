# CLAUDE.md

Claude Code specific instructions for the ReDeal project.

@AGENTS.md

## Project-Specific Instructions

### Before Making Changes

1. **Inspect the codebase first** — Read relevant files before modifying
2. **Understand existing patterns** — Follow the conventions in AGENTS.md
3. **Plan substantial features** — For changes spanning multiple files, outline the approach first
4. **Explain significant decisions** — Document why you chose a particular approach

### Design System Compliance

- **Reference `css/variables.css`** before creating or modifying any UI
- **Use the Electric Violet palette** — `#5E17EB` primary, lavender for selected states
- **Never introduce new colors** without adding to `variables.css`
- **Check existing components** before introducing new styles
- **Verify visual consistency** across all affected pages

### Implementation Guidelines

- **Preserve existing functionality** — Never break what works
- **Avoid unnecessary rewrites** — Refactor only when it improves clarity or fixes a bug
- **No frameworks without approval** — React, Vue, etc. require explicit user permission
- **No new dependencies** — Don't add npm packages, CDN libraries, or external scripts without asking

### Bug Reports

When fixing bugs:
1. Identify the root cause
2. Explain the cause in the commit message or PR description
3. Add a test case or verification step if applicable
4. Check for similar issues elsewhere

### Code Style Enforcement

- Run HTML through validator before committing
- Check console for JavaScript errors
- Verify responsive behavior at all breakpoints
- Test keyboard accessibility

### Communication

- Be concise but complete
- Reference file paths with line numbers when discussing code
- Show before/after for significant changes
- Ask for clarification if requirements are ambiguous

---

*This file is read by Claude Code on startup. AGENTS.md contains the full project conventions and design system.*