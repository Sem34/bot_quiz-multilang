// results_en.js
module.exports = {
  resultMessage: (A, B, C, D, Ecount) => `*Your result is:*
  "Thyroid"=${A}/13,
  "Adrenaline"=${B}/13,
  "Liver-related"=${C}/13,
  "Ovarian"=${D}/13
  "E → balance — this is a sign of a relatively well-balanced hormonal and nervous system."=${Ecount}/13`,

  links: {
    A: `<a href="https://professional.skin/entest_a">Thyroid</a>`,
    B: `<a href="https://professional.skin/entest_b">Adrenaline</a>`,
    C: `<a href="https://professional.skin/entest_c">Liver-related</a>`,
    D: `<a href="https://professional.skin/entest_d">Ovarian</a>`,
    E: `<a href="https://professional.skin/entest_e">Balanced</a>`
  }
};