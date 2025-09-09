// results_pl.js
module.exports = {
  resultMessage: (A, B, C, D, Ecount) => `*Twój wynik:*
  Typ tarczycy = ${A}/13,
  Typ adrenalinowy = ${B}/13,
  Typ wątrobowy = ${C}/13,
  Typ jajnikowy = ${D}/13
  E → równowaga — to oznaka stosunkowo zrównoważonego układu hormonalnego i nerwowego =${Ecount}/13`,

  links: {
    A: `<a href="https://professional.skin/pltest_a">Typ tarczycy</a>`,
    B: `<a href="https://professional.skin/pltest_b">Typ adrenalinowy</a>`,
    C: `<a href="https://professional.skin/pltest_c">Typ wątrobowy</a>`,
    D: `<a href="https://professional.skin/pltest_d">Typ jajnikowy</a>`,
    E: `*Twój wynik: Zrównoważony układ hormonalny.*\n
Nie stwierdzono u ciebie wyraźnie dominującego typu sylwetki. Oznacza to, że tarczyca, nadnercza, wątroba i jajniki funkcjonują w miarę równomiernie.\n
Często zdarza się to u osób prowadzących aktywny tryb życia, dbających o odżywianie i sen lub posiadających elastyczny system kompensacji.\n\n
*Ważne:* zrównoważony wynik nie oznacza braku ryzyka czy predyspozycji. Raczej wskazuje na brak silnych zaburzeń równowagi. Twój organizm utrzymuje balans, ale pod wpływem stresu lub zmian w diecie jeden z typów może ujawnić się wyraźniej.`
  }
};
