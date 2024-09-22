// results_pl.js
module.exports = {
  resultMessage: (A, B, C, D) => `*Twój wynik:*
  Typ tarczycy = ${A}/13,
  Typ nadnerczy = ${B}/13,
  Typ wątrobowy = ${C}/13,
  Typ jajnikowy = ${D}/13`,

  links: {
    A: `<a href="https://professional.skin/test_a">Typ tarczycy</a>`,
    B: `<a href="https://professional.skin/test_b">Typ nadnerczy</a>`,
    C: `<a href="https://professional.skin/test_c">Typ wątrobowy</a>`,
    D: `<a href="https://professional.skin/test_d">Typ jajnikowy</a>`,
  }
};
