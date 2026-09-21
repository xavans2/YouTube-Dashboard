# EP-05 Production Operations Checklists

## ST-05001 System health and diagnostics
- [ ] Create branch `feat/st-05001-system-health-diagnostics` before coding.
- [ ] Open a Draft PR with `ST-05001` in the title and body.
- [ ] Define test strategy before implementation: health endpoint contract tests for healthy, stale, API-missing, and failure states; identify the first failing test.
- [ ] Harden `/system` and the health endpoint with safe dependency status and freshness checks.
- [ ] Ensure secrets and raw provider responses never appear in diagnostics.
- [ ] Add or update story documentation at `docs/st05001-system-health-diagnostics.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-05002 Settings and configuration page
- [ ] Create branch `feat/st-05002-settings-configuration` before coding.
- [ ] Open a Draft PR with `ST-05002` in the title and body.
- [ ] Define test strategy before implementation: validation unit tests, persistence integration test, and settings UI smoke test; identify the first failing test.
- [ ] Add safe settings for refresh, alert thresholds, and display preferences.
- [ ] Keep secrets environment-managed and validate all user input.
- [ ] Add or update story documentation at `docs/st05002-settings-configuration.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-05003 Persistent 24/7 deployment and backups
- [ ] Create branch `chore/st-05003-production-deployment-backups` before coding.
- [ ] Open a Draft PR with `ST-05003` in the title and body.
- [ ] Define test strategy before implementation: deployment smoke test, restart persistence test, backup/restore fixture, and health-check verification; identify the first failing test.
- [ ] Document the chosen host, process manager, persistent storage, HTTPS, environment variables, and restart policy.
- [ ] Implement backups and a tested restore procedure.
- [ ] Add or update story documentation at `docs/st05003-production-deployment-backups.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code and deployment configuration until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

