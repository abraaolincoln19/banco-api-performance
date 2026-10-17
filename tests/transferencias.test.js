import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from '../helpers/autenticacao.js';

export const options = {
 iterations: 1,
};

export default function() {
  const token = onterToken()

  const url = 'http://localhost:3000/transferencias';

  const payload = JSON.stringify({
    valor: 11,
    token: "",
    contaOrigem: 1,
    contaDestino: 2
  });

   const params = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
    };

  let res = http.post(urlpayload, params);
  check(res, { "status is 201": (res) => res.status === 200 });
  sleep(1);
}
