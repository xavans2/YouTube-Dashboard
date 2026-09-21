# EP-04 Alerts & Monitoring Checklists

## ST-04001 Configurable performance alerts
- [ ] Create branch `feat/st-04001-configurable-performance-alerts` before coding.
- [ ] Open a Draft PR with `ST-04001` in the title and body.
- [ ] Define test strategy before implementation: threshold unit tests, duplicate suppression fixtures, persistence tests, and UI alert smoke test; identify the first failing test.
- [ ] Add validated configurable thresholds for views, growth, and engagement.
- [ ] Display metric, actual value, threshold, period, and timestamp.
- [ ] Add or update story documentation at `docs/st04001-configurable-performance-alerts.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-04002 Operational alerts
- [ ] Create branch `feat/st-04002-operational-alerts` before coding.
- [ ] Open a Draft PR with `ST-04002` in the title and body.
- [ ] Define test strategy before implementation: stale snapshot, API failure, recovery, and missing-upload fixtures; identify the first failing test.
- [ ] Add stale collection, API failure, and missing-upload conditions.
- [ ] Add documented optional notification configuration and recovery behavior.
- [ ] Add or update story documentation at `docs/st04002-operational-alerts.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

