# EP-02 Trend & Content Analytics Checklists

## ST-02001 Multi-period trend charts
- [ ] Create branch `feat/st-02001-multi-period-trends` before coding.
- [ ] Open a Draft PR with `ST-02001` in the title and body.
- [ ] Define test strategy before implementation: aggregation unit tests, API period contract tests, and UI smoke coverage for each range; identify the first failing test.
- [ ] Add 7-, 30-, and 90-day selectors and trend series.
- [ ] Explain sparse and empty history states.
- [ ] Add or update story documentation at `docs/st02001-multi-period-trends.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-02002 Engagement analytics
- [ ] Create branch `feat/st-02002-engagement-analytics` before coding.
- [ ] Open a Draft PR with `ST-02002` in the title and body.
- [ ] Define test strategy before implementation: formula unit tests for normal, missing, and zero denominators; API and UI fixtures; identify the first failing test.
- [ ] Document and implement like-rate, comment-rate, and aggregate engagement formulas.
- [ ] Add per-video and period-level presentation.
- [ ] Add or update story documentation at `docs/st02002-engagement-analytics.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

## ST-02003 Content performance insights
- [ ] Create branch `feat/st-02003-content-performance-insights` before coding.
- [ ] Open a Draft PR with `ST-02003` in the title and body.
- [ ] Define test strategy before implementation: aggregation fixtures by upload timing, content age, sample size, and unavailable fields; identify the first failing test.
- [ ] Add period filters and documented performance dimensions.
- [ ] Label small samples and unavailable YouTube fields.
- [ ] Add or update story documentation at `docs/st02003-content-performance-insights.md`.
- [ ] Write or update the failing automated test before production changes when practical; record why if not practical.
- [ ] Add/update production code until focused tests pass, keeping test evidence in checklist notes and PR body.
- [ ] Assess residual test impact; add/update additional automated tests when needed, or document why no further tests are required.
- [ ] Assess CI impact; update CI or other validation automation when needed, or document why no CI change is required.
- [ ] Run full test suite before finalizing the PR and record results.
- [ ] Run lint (`pnpm lint`) before finalizing the PR and record results, or document the project-specific alternative if unavailable.
- [ ] Commit logical changes and push the branch.
- [ ] Mark the PR Ready only after all story tasks are complete.
- [ ] Wait for merge; do not merge directly from local branch.

