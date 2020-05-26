import v8n from 'v8n';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

v8n.extend({
  email: function email(expected) {
    return function (value) {
      var validate = function validate(email) {
        if (!email || typeof email !== 'string') {
          return false;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          return true;
        }

        return false;
      };

      return validate(value);
    };
  }
}); // Alpha Numeric validation

v8n.extend({
  stringAlpha: function stringAlpha(expected) {
    return function (value) {
      var validate = function validate(s) {
        if (!s || typeof s !== 'string') {
          return false;
        }

        if (/[a-zA-Z]+/.test(s) && /[0-9]+/.test(s) && !/[^a-zA-Z0-9]+/.test(s)) {
          return true;
        }

        return false;
      };

      return validate(value);
    };
  }
}); // Fullname validation (reject single names)

v8n.extend({
  fullname: function fullname(expected) {
    return function (value) {
      var validate = function validate(v) {
        if (!v || typeof v !== 'string') {
          return false;
        }

        var vf = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (/^[a-zA-Z]{2,}(\s+(([a-zA-Z]{3,})|([a-zA-Z]{2,}\s+[a-zA-Z]{3,})))+$/.test(vf) && !/[bcdfghjklmnpqrstvwxyz]{3,}/.test(vf)) {
          return true;
        }

        return false;
      };

      return validate(value);
    };
  }
}); // Password match compares two password values
// It is required to work that you have both with quite the same name, like
// password and password_1 or password_lorem and passowrd_lorem_1
// and apply the validation to password_1 because the last _ and everything after
// it will be removed to get the first field, password in this case

v8n.extend({
  passwordMatch: function passwordMatch(expected) {
    return function (value, attrs) {
      var validate = function validate(data) {
        if (_typeof(data) !== 'object' || typeof data[0] === 'undefined') {
          return true;
        }

        var _data = _slicedToArray(data, 3),
            v = _data[0],
            a = _data[1],
            f = _data[2];

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
  }
}); // CPF Validation (works with or without mask)

v8n.extend({
  cpf: function cpf(expected) {
    return function (value) {
      var mod11 = function mod11(num) {
        return num % 11;
      };

      var not = function not(x) {
        return !x;
      };

      var isEqual = function isEqual(a) {
        return function (b) {
          return b === a;
        };
      };

      var mergeDigits = function mergeDigits(num1, num2) {
        return "".concat(num1).concat(num2);
      };

      var getTwoLastDigits = function getTwoLastDigits(cpf) {
        return "".concat(cpf[9]).concat(cpf[10]);
      };

      var getCpfToCheckInArray = function getCpfToCheckInArray(cpf) {
        return cpf.substr(0, 9).split('');
      };

      var generateArray = function generateArray(length) {
        return Array.from({
          length: length
        }, function (v, k) {
          return k;
        });
      };

      var isIn = function isIn(list) {
        return function (val) {
          return list.findIndex(function (v) {
            return val === v;
          }) >= 0;
        };
      };

      var isSameDigitsCPF = function isSameDigitsCPF(cpfFull) {
        return isIn(generateArray(10).map(generateStringSequence(11)))(cpfFull);
      };

      var generateStringSequence = function generateStringSequence(times) {
        return function (_char) {
          return "".concat(_char).repeat(times);
        };
      };

      var toSumOfMultiplication = function toSumOfMultiplication(total) {
        return function (result, num, i) {
          return result + num * total--;
        };
      };

      var getSumOfMultiplication = function getSumOfMultiplication(list, total) {
        return list.reduce(toSumOfMultiplication(total), 0);
      };

      var getValidationDigit = function getValidationDigit(total) {
        return function (cpf) {
          return getDigit(mod11(getSumOfMultiplication(cpf, total)));
        };
      };

      var getDigit = function getDigit(num) {
        return num > 1 ? 11 - num : 0;
      };

      var isValidCPF = function isValidCPF(cpfFull) {
        var cpf = getCpfToCheckInArray(cpfFull);
        var firstDigit = getValidationDigit(10)(cpf);
        var secondDigit = getValidationDigit(11)(cpf.concat(firstDigit));
        return isEqual(getTwoLastDigits(cpfFull))(mergeDigits(firstDigit, secondDigit));
      };

      var validate = function validate(CPF) {
        return not(isSameDigitsCPF(CPF)) && isValidCPF(CPF);
      };

      return validate(value.replace(/(\.|\-)/g, ''));
    };
  }
}); // CNPJ Validation (works with or without mask)

v8n.extend({
  cnpj: function cnpj(expected) {
    return function (value) {
      var mod14 = function mod14(num) {
        return num % 14;
      };

      var not = function not(x) {
        return !x;
      };

      var generateArray = function generateArray(length) {
        return Array.from({
          length: length
        }, function (v, k) {
          return k;
        });
      };

      var isIn = function isIn(list) {
        return function (val) {
          return list.findIndex(function (v) {
            return val === v;
          }) >= 0;
        };
      };

      var isSameDigitsCNPJ = function isSameDigitsCNPJ(cnpjFull) {
        return isIn(generateArray(10).map(generateStringSequence(14)))(cnpjFull);
      };

      var generateStringSequence = function generateStringSequence(times) {
        return function (_char2) {
          return "".concat(_char2).repeat(times);
        };
      };

      var isValidCNPJ = function isValidCNPJ(cnpj) {
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

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

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

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado + '' !== digitos.charAt(1) + '') {
          return false;
        }

        return true;
      };

      var validate = function validate(CNPJ) {
        return not(isSameDigitsCNPJ(CNPJ)) && isValidCNPJ(CNPJ);
      };

      return validate(value.replace(/(\.|\-|\/)/g, ''));
    };
  }
}); // Credit card number validation - [Reference](https://medium.com/swlh/credit-card-validation-in-javascript-ruby-and-c-4b0a9b245766)

v8n.extend({
  creditcard: function creditcard(expected) {
    return function (value) {
      var sumArrDigits = function sumArrDigits(array) {
        return array.join('').split('').map(function (e) {
          return parseInt(e);
        });
      };

      var validlen = function validlen(arr) {
        return arr.length === 13 || arr.length === 15 || arr.length === 16;
      };

      var arrSplit = function arrSplit(cardArray) {
        var selectOddValues = cardArray.filter(function (a, i) {
          return i % 2 === 1;
        });
        var selectEvenValues = cardArray.filter(function (a, i) {
          return i % 2 === 0;
        });
        var arr1;
        var arr2;

        if (cardArray.length % 2 === 1) {
          arr1 = selectOddValues.map(function (e) {
            return e * 2;
          });
          arr2 = selectEvenValues;
        } else {
          arr1 = selectEvenValues.map(function (e) {
            return e * 2;
          });
          arr2 = selectOddValues;
        }

        return {
          arr1: arr1,
          arr2: arr2
        };
      };

      var isValidCC = function isValidCC(cardNumber) {
        var cardArray = cardNumber.toString().split('').map(function (e) {
          return parseInt(e);
        });
        validlen(cardArray);
        var splitArr = arrSplit(cardArray);
        var checksum = sumArrDigits(splitArr.arr1).reduce(function (a, c) {
          return a + c;
        }) + splitArr.arr2.reduce(function (a, c) {
          return a + c;
        });

        if (checksum % 10 === 0) {
          return true;
        }

        return false;
      };

      var validate = function validate(cardNumber) {
        return isValidCC(cardNumber);
      };

      return validate(value.replace(/[^0-9]/g, ''));
    };
  }
}); // Credit card validto validation (requires mm/yyyy mask)

v8n.extend({
  creditcardValidTo: function creditcardValidTo(expected) {
    return function (value) {
      var isValidDate = function isValidDate(dateStr) {
        if (!/^\d{2}\/\d{4}$/.test(dateStr)) {
          return false;
        }

        var _dateStr$split = dateStr.split('/'),
            _dateStr$split2 = _slicedToArray(_dateStr$split, 2),
            m = _dateStr$split2[0],
            y = _dateStr$split2[1],
            cY = new Date().getFullYear(),
            cM = new Date().getMonth() + 1;

        if (parseInt(m, 10) < 1 || parseInt(m, 10) > 12) {
          return false;
        }

        if (parseInt(y, 10) < cY || parseInt(y, 10) > cY + 10) {
          return false;
        } else if (parseInt(y, 10) === cY && parseInt(m, 10) < cM) {
          return false;
        }

        return true;
      };

      var validate = function validate(dateStr) {
        return isValidDate(dateStr);
      };

      return validate(value);
    };
  }
}); // Renavam validation - [Reference](https://github.com/eliseuborges/Renavam/blob/master/Renavam.js)

v8n.extend({
  renavam: function renavam(expected) {
    return function (value) {
      var validate = function validate(renavam) {
        if (!renavam || typeof renavam !== 'string') {
          return false;
        }

        renavam = renavam.padStart(11, '0');

        if (!renavam.match('^[0-9]{11}$')) {
          return false;
        }

        var renavamSemDigito = renavam.substring(0, 10);
        var renavamReversoSemDigito = renavamSemDigito.split('').reverse().join('');
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
        ultimoDigitoCalculado = ultimoDigitoCalculado >= 10 ? 0 : ultimoDigitoCalculado;
        var digitoRealInformado = parseInt(renavam.substring(renavam.length - 1, renavam.length));

        if (ultimoDigitoCalculado === digitoRealInformado) {
          return true;
        }

        return false;
      };

      return validate(value.replace(/[^0-9]/g, ''));
    };
  }
}); // Phone validation (DDD+Phone, does not work with DDI)

v8n.extend({
  brphone: function brphone(expected) {
    return function (value) {
      var validate = function validate(phone) {
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
  }
});

export default v8n;
