# EP-01 Data Foundation & Reliability Checklists

## ST-01001 Test and validation foundation
- [ ] Create branch `chore/st-01001-test-validation-foundation` before coding.
- [ ] Open a Draft PR with `ST-01001` in the title and body.
- [ ] Define test strategy before implementation: unit tests for pure transforms, API tests for route contracts, and a smoke test for navigation; identify fixtures and the first failing test.
- [ ] Add a minimal test runner and `npm test` command.
- [ ] Add focused tests for history retention, carry-forward, growth, and zero-baseline behavior.
- [ ] Add or update story documentation at `docs/st01001-test-validation-foundation.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-01002 Scheduled daily snapshot collector
- [ ] Create branch `feat/st-01002-scheduled-daily-snapshot` before coding.
- [ ] Open a Draft PR with `ST-01002` in the title and body.
- [ ] Define test strategy before implementation: scheduler unit tests, collector integration tests, duplicate-day fixture, and API failure fixture; identify the first failing test.
- [ ] Implement a scheduler entry point independent of browser traffic.
- [ ] Make same-day writes idempotent and log failures safely.
- [ ] Add or update story documentation at `docs/st01002-scheduled-daily-snapshot.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-01003 History quality and retention hardening
- [ ] Create branch `fix/st-01003-history-quality-retention` before coding.
- [ ] Open a Draft PR with `ST-01003` in the title and body.
- [ ] Define test strategy before implementation: unit fixtures with missing days, zero values, boundary retention dates, and carry-forward metadata; identify the first failing test.
- [ ] Harden the 30-day query and carry-forward service.
- [ ] Preserve zero as valid data and retain the comparison baseline.
- [ ] Add or update story documentation at `docs/st01003-history-quality-retention.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

