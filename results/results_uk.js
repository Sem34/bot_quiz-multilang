module.exports = {
  resultMessage: (A, B, C, D, Ecount) => `*Ваш результат:*
    "Щитоподібний"=${A}/13,
    "Наднирковий"=${B}/13,
    "Печінковий"=${C}/13,
    "Яєчниковий"=${D}/13,
    "Баланс"=${Ecount}/13`,
  
  links: {
      A: `<a href="https://professional.skin/test_a">Щитоподібний</a>`,
      B: `<a href="https://professional.skin/test_b">Наднирковий</a>`,
      C: `<a href="https://professional.skin/test_c">Печінковий</a>`,
      D: `<a href="https://professional.skin/test_d">Яєчниковий</a>`,
      E: `<a href="https://professional.skin/test_e">Збалансований</a>`
  }
};
 