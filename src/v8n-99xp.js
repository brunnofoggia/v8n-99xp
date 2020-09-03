// [v8n-99xp](https://github.com/brunnofoggia/v8n-99xp) is a set of validation
// methods based on projects I've been working on using
// [v8n](https://imbrn.github.io/v8n/). Validations included: email, alpha string,
// fullname, passwords match, cpf, cnpj, credit card number and validto, renavam, brphone

// Baseline setup
// --------------
import v8n from 'v8n';
import _ from 'underscore-99xp';

// Custom Regex Validation
v8n.extend({
    regex(testRule, replaceRule) {
        return _.partial(
            function (tr, rr, v) {
                var validate = () => {
                    if (!v) {
                        return false;
                    }
                    v = v.toString();

                    if (tr.test(v)) {
                        return true;
                    }

                    return false;
                };

                if (_.isArray(rr)) {
                    var regex = rr[0],
                        str = rr[1];

                    v = v.replace(regex, str);
                }

                return validate();
            },
            testRule,
            replaceRule
        );
    },
});

// Email validation regex based
v8n.extend({
    email(expected) {
        return (value) => {
            var validate = function (email) {
                if (!email || typeof email !== 'string') {
                    return false;
                }

                if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)
                ) {
                    return true;
                }

                return false;
            };

            return validate(value);
        };
    },
});

// Alpha Numeric validation
v8n.extend({
    stringAlpha(expected) {
        return (value) => {
            var validate = function (s) {
                if (!s || typeof s !== 'string') {
                    return false;
                }

                if (
                    /[a-zA-Z]+/.test(s) &&
                    /[0-9]+/.test(s) &&
                    !/[^a-zA-Z0-9]+/.test(s)
                ) {
                    return true;
                }

                return false;
            };

            return validate(value);
        };
    },
});

// Fullname validation (reject single names)
v8n.extend({
    fullname(expected) {
        return (value) => {
            var validate = function (v) {
                if (!v || typeof v !== 'string') {
                    return false;
                }

                var vf = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (
                    /^[a-zA-Z]{2,}(\s+(([a-zA-Z]{3,})|([a-zA-Z]{2,}\s+[a-zA-Z]{3,})))+$/.test(
                        vf
                    )
                ) {
                    return true;
                }

                return false;
            };

            return validate(value);
        };
    },
});

// Password match compares two password values
// It is required to work that you have both with quite the same name, like
// password and password_1 or password_lorem and passowrd_lorem_1
// and apply the validation to password_1 because the last _ and everything after
// it will be removed to get the first field, password in this case
v8n.extend({
    passwordMatch(expected) {
        return (value, attrs) => {
            var validate = function (data) {
                if (
                    typeof data !== 'object' ||
                    typeof data[0] === 'undefined'
                ) {
                    return true;
                }

                var [v, a, f] = data;

                var f1 = f.split('_');
                f1.pop();
                f1 = f1.join('_');

                if (!v || !a || !(f1 in a)) {
                    return false;
                }

                if (v + '' !== a[f1] + '') {
                    return false;
                }

                return true;
            };

            return validate(value, attrs);
        };
    },
});

// CPF Validation (works with or without mask)
var validateCPF = function (value) {
    const mod11 = (num) => num % 11;
    const not = (x) => !x;
    const isEqual = (a) => (b) => b === a;
    const mergeDigits = (num1, num2) => `${num1}${num2}`;
    const getTwoLastDigits = (cpf) => `${cpf[9]}${cpf[10]}`;
    const getCpfToCheckInArray = (cpf) => cpf.substr(0, 9).split('');
    const generateArray = (length) => Array.from({ length }, (v, k) => k);

    const isIn = (list) => (val) => list.findIndex((v) => val === v) >= 0;

    const isSameDigitsCPF = (cpfFull) =>
        isIn(generateArray(10).map(generateStringSequence(11)))(cpfFull);

    const generateStringSequence = (times) => (char) => `${char}`.repeat(times);

    const toSumOfMultiplication = (total) => (result, num, i) =>
        result + num * total--;

    const getSumOfMultiplication = (list, total) =>
        list.reduce(toSumOfMultiplication(total), 0);

    const getValidationDigit = (total) => (cpf) =>
        getDigit(mod11(getSumOfMultiplication(cpf, total)));

    const getDigit = (num) => (num > 1 ? 11 - num : 0);

    const isValidCPF = (cpfFull) => {
        const cpf = getCpfToCheckInArray(cpfFull);
        const firstDigit = getValidationDigit(10)(cpf);
        const secondDigit = getValidationDigit(11)(cpf.concat(firstDigit));

        return isEqual(getTwoLastDigits(cpfFull))(
            mergeDigits(firstDigit, secondDigit)
        );
    };

    const validate = (CPF) =>
        CPF.length === 11 && not(isSameDigitsCPF(CPF)) && isValidCPF(CPF);

    return validate(value.replace(/(\.|\-)/g, ''));
};

v8n.extend({
    cpf(expected) {
        return (value) => {
            return validateCPF(value.replace(/(\.|\-)/g, ''));
        };
    },
});

var validateCNPJ = function (value) {
    const mod14 = (num) => num % 14;
    const not = (x) => !x;
    const generateArray = (length) => Array.from({ length }, (v, k) => k);

    const isIn = (list) => (val) => list.findIndex((v) => val === v) >= 0;

    const isSameDigitsCNPJ = (cnpjFull) =>
        isIn(generateArray(10).map(generateStringSequence(14)))(cnpjFull);

    const generateStringSequence = (times) => (char) => `${char}`.repeat(times);

    const isValidCNPJ = (cnpj) => {
        if (!cnpj || mod14(cnpj.length) > 0) {
            return false;
        }

        var tamanho, numeros, digitos, soma, pos, i, resultado;

        tamanho = cnpj.length - 2;
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado + '' !== digitos.charAt(0) + '') {
            return false;
        }
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado + '' !== digitos.charAt(1) + '') {
            return false;
        }

        return true;
    };

    const validate = (CNPJ) =>
        CNPJ.length === 14 && not(isSameDigitsCNPJ(CNPJ)) && isValidCNPJ(CNPJ);

    return validate(value.replace(/(\.|\-|\/)/g, ''));
};

// CNPJ Validation (works with or without mask)
v8n.extend({
    cnpj(expected) {
        return (value) => {
            return validateCNPJ(value.replace(/(\.|\-|\/)/g, ''));
        };
    },
});

// CPF / CNPJ Validation (works with or without mask)
v8n.extend({
    cpfcnpj(expected) {
        return (value) => {
            var v = value.replace(/(\.|\-|\/)/g, '');
            return v.length === 11 ? validateCPF(v) : validateCNPJ(v);
        };
    },
});

// Credit card number validation - [Reference](https://medium.com/swlh/credit-card-validation-in-javascript-ruby-and-c-4b0a9b245766)
v8n.extend({
    creditcard(expected) {
        return (value) => {
            const sumArrDigits = (array) => {
                return array
                    .join('')
                    .split('')
                    .map((e) => parseInt(e));
            };

            const validlen = (arr) => {
                return (
                    arr.length === 13 || arr.length === 15 || arr.length === 16
                );
            };

            const arrSplit = (cardArray) => {
                const selectOddValues = cardArray.filter((a, i) => i % 2 === 1);
                const selectEvenValues = cardArray.filter(
                    (a, i) => i % 2 === 0
                );
                let arr1;
                let arr2;
                if (cardArray.length % 2 === 1) {
                    arr1 = selectOddValues.map((e) => e * 2);
                    arr2 = selectEvenValues;
                } else {
                    arr1 = selectEvenValues.map((e) => e * 2);
                    arr2 = selectOddValues;
                }
                return { arr1, arr2 };
            };

            const isValidCC = (cardNumber) => {
                const cardArray = cardNumber
                    .toString()
                    .split('')
                    .map((e) => parseInt(e));
                validlen(cardArray);
                const splitArr = arrSplit(cardArray);
                const checksum =
                    sumArrDigits(splitArr.arr1).reduce((a, c) => a + c) +
                    splitArr.arr2.reduce((a, c) => a + c);

                if (checksum % 10 === 0) {
                    return true;
                }

                return false;
            };

            const validate = (cardNumber) => isValidCC(cardNumber);

            return validate(value.replace(/[^0-9]/g, ''));
        };
    },
});

// Credit card validto validation (requires mm/yyyy mask)
v8n.extend({
    validTo(dateStartLimit, dateEndLimit) {
        return _.partial(function(dSL, dEL, v) {
            var validate = () => {
                var dateType = /\//.test(v) ? 'pt' : 'en',
                    regexp = dateType === 'pt' ? /^((?<d>\d{2})\/)?(?<m>\d{2})\/(?<y>\d{4})$/ : /^(?<y>\d{4})-(?<m>\d{2})(-(?<d>\d{2}))?$/,
                    matches = v.match(regexp);

                if (!matches) {
                    return false;
                }

                var d = matches.groups['d'] || '31',
                    m = matches.groups['m'],
                    y = matches.groups['y'],
                    cD = new Date(),
                    iD = new Date(y, parseInt(m, 10) - 1, d, 12);

                cD.setHours(0);
                cD.setMinutes(0);
                cD.setSeconds(0);
                cD.setMilliseconds(0);

                if (parseInt(d, 10) < 1 || parseInt(d, 10) > 31) {
                    return false;
                }

                if (parseInt(m, 10) < 1 || parseInt(m, 10) > 12) {
                    return false;
                }

                if (dSL || dEL) {
                    if (dSL) {
                    dSL = dSL===true ? cD :
                        new Date(dSL[0], (dSL[1] || 0) - 1, dSL[2] || 1, dSL[3] || 0, dSL[4] || 0, dSL[5] || 0);

                        if (iD < dSL) {
                            return false;
                        }
                    }

                    if (dEL) {
                        dEL = new Date(dEL[0], (dEL[1] || 12) - 1, dEL[2] || 31, dSL[3] || 23, dSL[4] || 59, dSL[5] || 59);

                        if (iD > dEL) {
                            return false;
                        }
                    }
                }

                return true;
            };

            return validate();
        }, dateStartLimit, dateEndLimit);
    },
});

// Renavam validation - [Reference](https://github.com/eliseuborges/Renavam/blob/master/Renavam.js)
v8n.extend({
    renavam(expected) {
        return (value) => {
            var validate = function (renavam) {
                if (!renavam || typeof renavam !== 'string') {
                    return false;
                }

                renavam = renavam.padStart(11, '0');

                if (!renavam.match('^[0-9]{11}$')) {
                    return false;
                }

                var renavamSemDigito = renavam.substring(0, 10);
                var renavamReversoSemDigito = renavamSemDigito
                    .split('')
                    .reverse()
                    .join('');

                var soma = 0;
                var multiplicador = 2;
                for (var i = 0; i < 10; i++) {
                    var algarismo = renavamReversoSemDigito.substring(i, i + 1);
                    soma += algarismo * multiplicador;

                    if (multiplicador >= 9) {
                        multiplicador = 2;
                    } else {
                        multiplicador++;
                    }
                }

                var mod11 = soma % 11;
                var ultimoDigitoCalculado = 11 - mod11;
                ultimoDigitoCalculado =
                    ultimoDigitoCalculado >= 10 ? 0 : ultimoDigitoCalculado;
                var digitoRealInformado = parseInt(
                    renavam.substring(renavam.length - 1, renavam.length)
                );
                if (ultimoDigitoCalculado === digitoRealInformado) {
                    return true;
                }

                return false;
            };

            return validate(value.replace(/[^0-9]/g, ''));
        };
    },
});

// Phone validation (DDD+Phone, does not work with DDI)
v8n.extend({
    brphone(expected) {
        return (value) => {
            var validate = function (phone) {
                if (!phone || typeof phone !== 'string') {
                    return false;
                }

                if (/^[0-9]{10,11}$/.test(phone)) {
                    return true;
                }

                return false;
            };

            return validate(value.replace(/[^0-9]/g, ''));
        };
    },
});

export default v8n;
