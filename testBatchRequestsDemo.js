import http from "k6/http";
import { Counter } from "k6/metrics";

let ErrorCount = new Counter("errors");

export const options = {
    vus: 10,
    duration: '3s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
        errors: ["count<1"]
    },
};

export default function() {
  let randomVariable = Math.random() < 0.9 ? "200" : "500";

  const getRequest = {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  };
  
  const postRequest = {
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: JSON.stringify({
      title: 'foo',
      body: `${randomVariable}`,
      userId: 1
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  };

  const deleteRequest = {
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  };

  const responses = http.batch([getRequest, postRequest, deleteRequest]);
}