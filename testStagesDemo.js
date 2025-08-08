import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

let ErrorCount = new Counter("errors");

export const options = {
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<100'], // 95% of requests should be below 200ms
        errors: ["count<2"]
    },
    stages: [
        { duration: '3s', target: 5 },
        { duration: '5', target: 3 },
        { duration: '1s', target: 2 },
    ],
};

export default function() {
  const path = Math.random() < 0.9 ? "200" : "500";

  let res = http.get(`https://jsonplaceholder.typicode.com/posts/1`);
  let success = check(res, {
    "status is 200": r => r.status === 200
  });
  if (!success) {
    ErrorCount.add(1);
  }
}