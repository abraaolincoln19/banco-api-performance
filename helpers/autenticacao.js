const postLogin = JSON.parse(open('../Fixtures/postLogin.json'));
import http from 'k6/http';
import { pegarBaseUrl } from '../utils/variaveis.js';

export function obterToken() {
    const url = pegarBaseUrl() + '/login';
    
        const payload = JSON.stringify(postLogin);
    
        const params = {
            headers: {
            'Content-Type': 'application/json',
            },
        };
    
        const res = http.post(url, payload, params);

        return res.json('token')
}