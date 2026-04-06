## Summary

<!-- Brief description of what this PR changes and why. -->

## Visual QA gate (Chromium + WebKit)

If this PR touches landing-page layout, structure, or responsive behavior:

- [ ] Ran `npm run qa:gate` against production build (tests Chromium + WebKit)
- [ ] No critical findings (exit code 0)
- [ ] Reviewed any warnings in the report — especially WebKit-only findings for Safari/iOS

**Gate not required** for changes that do not affect rendered layout (docs, tooling, CI, backend-only, dependency bumps).

## Test plan

<!-- How was this tested beyond the gate? -->
