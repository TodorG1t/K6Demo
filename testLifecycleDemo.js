import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

let ErrorCount = new Counter("errors");

function getRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const options = {
    vus: 1,
    duration: '1s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<10000'], // 95% of requests should be below 200ms
        errors: ["count<1"]
    },
};

export function setup() {
  let randomBearerValue = getRandomString(10);

  return { data: randomBearerValue };
}

export default function(data) {
  let result = http.get(
    'https://httpbin.org/bearer',
    {
      headers: { 'Authorization': `Bearer ${data.data}` }
    });

  check(result, {
    'Has successful authentication': (r) => r.body.includes('"authenticated": true'),
  });  
}

export function teardown(data) {
  // some logic for teardown
}