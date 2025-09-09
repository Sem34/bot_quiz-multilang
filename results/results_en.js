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
    E: `*Your result: Balanced hormonal system.*\n
No distinct body type was identified. This means that your thyroid, adrenal glands, liver, and ovaries are functioning more or less evenly.\n
This is often the case for people who lead an active lifestyle, pay attention to nutrition and sleep, or have a flexible system of compensations.\n\n
*Important:* a balanced result does not mean you are free of risks or predispositions. It rather indicates the absence of a strong imbalance. Your body maintains balance, but under stress or with dietary changes, one of the types may become more pronounced.`
  }
};