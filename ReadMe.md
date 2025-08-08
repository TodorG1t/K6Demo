## Run Tests

Make sure you have [k6 installed](https://grafana.com/docs/k6/latest/set-up/install-k6/).

To run a test script (e.g., `script.js`), use the following command:

```bash
k6 run testBatchRequestsDemo.js ## To run example with batch requests
k6 run testLifecycleDemo.js ## To run example with test lifecycle flow
k6 run testVirtualUsersDemo.js ## To run example with virtual users
k6 run testStagesDemo.js ## To run example with stages