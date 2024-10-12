// results_pl.js
module.exports = {
  resultMessage: (A, B, C, D) => `*Twój wynik:*
  Typ tarczycy = ${A}/13,
  Typ adrenalinowy = ${B}/13,
  Typ wątrobowy = ${C}/13,
  Typ jajnikowy = ${D}/13`,

  links: {
    A: `<a href="https://professional.skin/pltest_a">Typ tarczycy</a>`,
    B: `<a href="https://professional.skin/pltest_b">Typ adrenalinowy</a>`,
    C: `<a href="https://professional.skin/pltest_c">Typ wątrobowy</a>`,
    D: `<a href="https://professional.skin/pltest_d">Typ jajnikowy</a>`,
  }
};
