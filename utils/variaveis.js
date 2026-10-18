const configlocal = JSON.parse(open('../config/config.local.json'));

export function pegarBaseUrl() {
    return __ENV.BASE_URL || configlocal.baseUrl;
}