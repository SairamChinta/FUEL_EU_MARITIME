# AI Agent Workflow Log

## Agents Used
- GitHub Copilot (inline suggestions & completion)
- Raptor mini (Preview) / Assistant (for multi-step reasoning & edits)

## Prompts & Outputs (examples)
- Example 1: "Add /banking/apply endpoint to backend and implement repository method" → generated code to add applyBanked to BankingRepository and to create negative/positive bank entries.
- Example 2: "Implement Pooling UI to allow creating pools" → created `PoolingTab.tsx` with ship/year selection and hooks integration.

### Example prompt flow (detailed)
- Prompt: "Create POST /banking/apply endpoint that validates fromShipId, toShipId, year, amount and enforces target deficit. Add a use-case and repository method to apply banked surplus as negative/positive bank entries."
- Agent output snippet (generated):
	- Controller: banking.applyBanked -> reads body, validates, calls ApplyBanked use-case
	- Use-case: ApplyBanked -> checks target adjusted compliance is negative, calls bankingRepo.applyBanked
	- Repository method: applyBanked -> creates negative and positive BankEntry rows and returns updated balances

I verified the generated code by hand, added unit tests (ApplyBanked tests), and fixed minor type/parameter issues.

## Validation / Corrections
- I reviewed all AI-suggested code and wrote unit tests for use-cases. I corrected type mismatches and adjusted axios error handling.

## Observations
- Agent completions were useful for repetitive boilerplate (controllers, hooks, UI markup). They sometimes missed project-specific naming/types and required manual corrections.

## Additional Examples — UI polish

- Prompt: "Replace all UI emojis with professional icons, load a modern font and update the color palette to an elegant maritime brand."
- Agent output: created `react-icons` imports in layout/pages, linked Google Fonts (Inter), and updated Tailwind config + index.css for improved palette and typography.

I reviewed visuals manually in the browser, updated a small palette, and tuned layout spacing to look consistent across pages.

## Best Practices Followed
- Kept domain logic in core/usecases and repositories in adapters.
- Wrote unit tests for key use-cases to validate behavior suggested by agents.
