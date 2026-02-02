# E2E Warning: `--localstorage-file`

## Summary

When running e2e tests the warning appears:

```
Warning: `--localstorage-file` was provided without a valid path
```

This warning does not come from the repo; the flag seems injected by the runtime/harness.

## Detected origin

When running with `--trace-warnings` the stack points to Jest environment teardown:

- `node:internal/webstorage`
- `jest-util`
- `jest-environment-node`

Jest attempts to clean `global.localStorage` after each test. Node detects the
`--localstorage-file` flag without a path and emits the warning.

## Impact

It is only a console warning. E2E tests still pass.

## Mitigation options

- Run e2e with `NODE_OPTIONS=--no-warnings` to hide global warnings.
- Keep as-is if it does not affect test results.
