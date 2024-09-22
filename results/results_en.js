// results_en.js
module.exports = {
  resultMessage: (A, B, C, D) => `*Your result is:*
  "Thyroid"=${A}/13,
  "Adrenaline"=${B}/13,
  "Liver-related"=${C}/13,
  "Ovarian"=${D}/13`,

  links: {
    A: `<a href="https://professional.skin/test_a">Thyroid</a>`,
    B: `<a href="https://professional.skin/test_b">Adrenaline</a>`,
    C: `<a href="https://professional.skin/test_c">Liver-related</a>`,
    D: `<a href="https://professional.skin/test_d">Ovarian</a>`,
  }
};
