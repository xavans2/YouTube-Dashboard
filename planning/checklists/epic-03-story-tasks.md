# EP-03 Exploration & Export Checklists

## ST-03001 Video detail page
- [ ] Create branch `feat/st-03001-video-detail-page` before coding.
- [ ] Open a Draft PR with `ST-03001` in the title and body.
- [ ] Define test strategy before implementation: API fixture for valid/missing video, route integration test, and UI navigation smoke test; identify the first failing test.
- [ ] Add `/video/:id` data endpoint and terminal-style detail view.
- [ ] Handle deleted, unavailable, and API-error states.
- [ ] Add or update story documentation at `docs/st03001-video-detail-page.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-03002 Period and video comparison
- [ ] Create branch `feat/st-03002-period-video-comparison` before coding.
- [ ] Open a Draft PR with `ST-03002` in the title and body.
- [ ] Define test strategy before implementation: comparison unit fixtures, zero-baseline cases, and UI selection smoke test; identify the first failing test.
- [ ] Add target selection for two videos or two periods.
- [ ] Implement absolute and percentage difference calculations.
- [ ] Add or update story documentation at `docs/st03002-period-video-comparison.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-03003 CSV and JSON export
- [ ] Create branch `feat/st-03003-data-export` before coding.
- [ ] Open a Draft PR with `ST-03003` in the title and body.
- [ ] Define test strategy before implementation: CSV escaping unit tests, JSON schema contract test, and browser download smoke test; identify the first failing test.
- [ ] Add selected-period CSV and JSON exports with stable metadata.
- [ ] Preserve carried-forward markers and escape values safely.
- [ ] Add or update story documentation at `docs/st03003-data-export.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

