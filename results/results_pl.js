// results_pl.js
module.exports = {
    resultMessage: (A, B, C, D) => `*Twój wynik:*
    "Tarczycowy"=${A}/13,
    "Nadnerczowy"=${B}/13,
    "Wątrobowy"=${C}/13,
    "Jajnikowy"=${D}/13`,

    links: {
      A: `<a href="https://professional.skin/test_a">Tarczycowy</a>`,
      B: `<a href="https://professional.skin/test_b">Nadnerczowy</a>`,
      C: `<a href="https://professional.skin/test_c">Wątrobowy</a>`,
      D: `<a href="https://professional.skin/test_d">Jajnikowy</a>`,
    }
};
