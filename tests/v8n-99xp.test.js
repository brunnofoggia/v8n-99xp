import v8n from '../lib/v8n-99xp.esm.js';

// regex
test('valid dd/mm/yyyy > 11/11/2020', () => {
    expect(v8n().regex(/^(\d{2})\/(\d{2})\/(\d{4})$/).test('11/11/2020')).toBe(true);
});
test('invalid dd/mm/yyyy > 11/11', () => {
    expect(v8n().email(/^(\d{2})\/(\d{2})\/(\d{4})$/).test('11/11/2020')).toBe(false);
});

// email
test('valid email > team@99xp.org', () => {
    expect(v8n().email().test('team@99xp.org')).toBe(true);
});
test('invalid email > team@99xp', () => {
    expect(v8n().email().test('team@99xp')).toBe(false);
});

// string alpha
test('string > loremipsum', () => {
    expect(v8n().stringAlpha().test('loremipsum')).toBe(false);
});
test('string > loremipsum123', () => {
    expect(v8n().stringAlpha().test('loremipsum123')).toBe(true);
});

// fullname
test('valid fullname > bruno foggia', () => {
    expect(v8n().fullname().test('bruno foggia')).toBe(true);
});
test('invalid fullname > bruno', () => {
    expect(v8n().fullname().test('bruno')).toBe(false);
});

// password match
test('passwords match', () => {
    expect(v8n().passwordMatch().test(['string123', 'password_1', {
        password: 'string123',
        password_1: 'string123'
    }])).toBe(false);
});
test('passwords not match', () => {
    expect(v8n().passwordMatch().test(['string123', 'password_1', {
        password: 'string1234',
        password_1: 'string123'
    }])).toBe(false);
});

// CPF
test('valid CPF', () => {
    expect(v8n().cpf().test('244.592.250-00')).toBe(true);
});
test('invalid CPF', () => {
    expect(v8n().cpf().test('444.592.250-00')).toBe(false);
});

// CNPJ
test('valid CNPJ', () => {
    expect(v8n().cnpj().test('24.936.499/0001-01')).toBe(true);
});
test('invalid CNPJ', () => {
    expect(v8n().cnpj().test('24.936.499/0001-00')).toBe(false);
});

// Credit Card
test('valid Credit Card', () => {
    expect(v8n().creditcard().test('5201561050025011')).toBe(true);
});
test('invalid Credit Card', () => {
    expect(v8n().creditcard().test('5201561050025099')).toBe(false);
});

// Credit Card ValidTo
test('valid Credit Card validTo > 09/2030', () => {
    expect(v8n().creditcardValidTo().test('09/2030')).toBe(true);
});
test('invalid Credit Card validTo > 09/2099', () => {
    expect(v8n().creditcardValidTo().test('09/2099')).toBe(false);
});
test('invalid Credit Card validTo > 09/2019', () => {
    expect(v8n().creditcardValidTo().test('09/2019')).toBe(false);
});
test('invalid Credit Card validTo > 09/24', () => {
    expect(v8n().creditcardValidTo().test('09/24')).toBe(false);
});

// Renavam
test('valid renavam', () => {
    expect(v8n().renavam().test('123456789')).toBe(true);
});
test('invalid renavam', () => {
    expect(v8n().renavam().test('123123123')).toBe(false);
});

// BR Phone
test('Valid DDD+Phone > 11912345678', () => {
    expect(v8n().brphone().test('11912345678')).toBe(true);
});
test('invalid DDD+Phone > 912345678', () => {
    expect(v8n().brphone().test('912345678')).toBe(false);
});
