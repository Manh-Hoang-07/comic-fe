import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metrics
const error500 = new Counter('error_500');
const error400 = new Counter('error_400');
const errorTimeout = new Counter('error_timeout');

export const options = {
  stages: [
    { duration: '30s', target: 200 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 1000 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // muốn fail <5%
    http_req_duration: ['p(95)<2000'], // 95% < 2s
  },
};

export default function () {
  let res = http.get('http://localhost:3000'); // đổi URL nếu cần

  // Log status nếu muốn xem trực tiếp
  // if (res.status !== 200) {
  //   console.log(`Error status: ${res.status}`);
  // }

  // Check thành công
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Đếm lỗi
  if (res.status >= 500) {
    error500.add(1);
  } else if (res.status >= 400) {
    error400.add(1);
  } else if (res.status === 0) {
    errorTimeout.add(1);
  }
}