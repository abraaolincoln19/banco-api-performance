const postLogin = JSON.parse(open('../Fixtures/postLogin.json'));
import http from 'k6/http';

export function obterToken() {
    const url = 'http://localhost:3000/login';
    
        const payload = JSON.stringify(postLogin);
    
        const params = {
            headers: {
            'Content-Type': 'application/json',
            },
        };
    
        const res = http.post(url, payload, params);

        return res.json('token')
}