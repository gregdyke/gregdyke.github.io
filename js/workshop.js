var tune_header = (title) => {
  return `X:0
T:${title}
M:3/4
L:1/8
Q:210
K:Ddor
`;
};

var tune =
  tune_header("Les Lourdaus de la Montanha") +
  `|: a2 | ab a2 g2 | f2 ef g2 |1 fe d^c de | f2 e2 :|2 fe d2 ^c2 | d4 |
w: | lam | la-bu lam lam | lam la-bu lam | la-bu la-bu la-bu | lam lam | la-bu lam lam | laaa |
|: A2 | d^c d2 e2 | f2 ef g2 |1 fe d^c de | f2 e2 :|2 fe d2 ^c2 | d4 |
w: | lam | la-bu lam lam | lam la-bu lam | la-bu la-bu la-bu | lam lam | la-bu lam lam | laaa |`;

var tune_prequi_venia =
  tune_header("Les Lourdaus de la Montanha") +
  `| a2 | ab a2 g2 | f3 e1 g2 | fe d2 e2 | f2 e2
w: | Pre qui ven-iá velh- | ar les lour-| daus de la mon- | ta-nha
| a2 | ab a2 g2 | f3 e1 g2 | fe d2 ^c2 | d4 |
w: | Pre qui ven-iá velh- | ar se n'en| vol-ià pas dan-| sar
| A2 | d^c d2 e2 | f3 e1 g2 | fe d2 e2 | f2 e2 |
w: | N'en | cha-lià pas ve- | nir les lour-| daus de la mon- | ta-nha
| A2 | d^c d2 e2 | f2 g3 g | fe d2 ^c2 | d4 |
w: | N'en | cha-lià pas ve- | nir se n'en-| vol-ià mès dur- | mir
| a2 | ab a2 g2 | f3 e1 g2 | fe d2 e2 | f3 e1`;

var tune_se_la_volia =
  tune_header("Se la Volià Chausir") +
  `| a2 | ab a2 g2 | f3 e1 g2 | fe d2 e2 | f3 e1
w: | Se la vo-lià chau- | sir la miá| mí-a la miá | mí-a
| a2 | ab a2 g2 | f3 e1 g2 | fe d2 ^c2 | d4-d1 |
w: | Se la vo-lià chau- | sir la pren | driá de vès Chas-| très
| A1 | d^c d2 e2 | f3 e1 g2 | fe d2 e2 | f2 e3 |
w: | De | paur de me trom- | par la mia| mi-a la mia | mi-a
| A1 | d^c d2 e2 | f4 fg | fe d3 ^c1 | d4 |
w: | De | paur de me trom- | par la pren| driá de Sent Do- |nat`;

var movement =
  tune_header("Underlying melodic movement") +
  `|: a2 | a4 g2 | f4 g2 |1 f4 d2 | f2 e2 :|2 f4 ^c2 | d4 |
w: | lam | laaa lam | laaa lam | laaa lam | lam lam | laaa lam | laaa |
|: A2 | d4 e2 | f4 g2 |1 f4 d2 | f2 e2 :|2 f4 ^c2 | d4 |
w: | lam | laaa lam | laaa lam | laaa lam | lam lam | laaa lam | laaa |`;

var laaalam =
  tune_header("Turnaround with laaa lam") +
  `|: f2 ef g2 | fe d2 ^c2 | d4 a2 | ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | laaa lam | la-bu lam lam |`;

var laaalabu =
  tune_header("Turnaround with laaa labu") +
  `|: f2 ef g2 | fe d2 ^c2 | d4 fg| ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | laaa la-bu| la-bu lam lam |`;

var laalulabu =
  tune_header("Turnaround with laa lu labu") +
  `|: f2 ef g2 | fe d2 ^c2 | d3 e1 fg | ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | laa lu la-bu | la-bu lam lam |`;

var lamlabulabu =
  tune_header("Turnaround with lam labu labu") +
  `|: f2 ef g2 | fe d2 ^c2 | d2 de fg | ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | lam la-bu la-bu | la-bu lam lam |`;

var labulabulabu =
  tune_header("Turnaround with labu labu labu") +
  `|: f2 ef g2 | fe d2 ^c2 | d^c de fg | ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | la-bu la-bu la-bu | la-bu lam lam |`;

var laaaalu =
  tune_header("Turnaround with laaaa lu") +
  `|: f2 ef g2 | fe d2 ^c2 | d4-d1 g1 | ab a2 g2 :|
w: | lam la-bu lam | la-bu lam lam | laaaa *lu | la-bu lam lam |`;

var melodyinstrument =
  tune_header(
    "Typical additions a melody instrument might play with the lyrics as the starting point"
  ) +
  `|: a2 | ab ag ag | f3 f1 g2 | fe d^c de | f2 e2 :|
w: | lam | la-bu la-bu la-bu | laa lu lam | la-bu la-bu la-bu | lam lam |`;

var alllabulabu =
  tune_header("(Too) many labulabu") +
  `|: a2 | ab ag ag | fg fe fg | fe d^c de | f2 e2 :|
w: | lam | la-bu la-bu la-bu | la-bu la-bu la-bu | la-bu la-bu la-bu | lam lam |`;

var twooverthree =
  tune_header("Two accents over three beats") +
  `|: a2 | a3 g3 | f3 g3 | fe d^c de | f2 e2 :|
w: | lam | laa laa | laa laa | la-bu la-bu la-bu | lam lam |`;

var threeovertwo =
  tune_header("Three accents over two bars") +
  `|: a2 | ab a2 ag | f2 ef g2 | fe d2 de | f2 e2 :|
w: | lam | la-bu lam la-bu | lam la-bu lam | la-bu lam la-bu | lam lam |`;

var weirdrepetition =
  tune_header("A slightly absurd motif") +
  `|: a2 | a3 b1 ag | fe f3 g1 | fe d^c d2- | df e2 :|
w: | lam | laa lu la-bu | la-bu laa lu | la-bu la-bu laa | *lu lam |`;

var depaurdemetrompar =
  tune_header(
    "Variation to part B inspired by the lyrics to 'Se la Volià Chausir'"
  ) +
  `|: A1 | d^c d2 e2 | f4 fg |1 fe d2 e2 | f2 e3 :|2 fe d2 ^c2 | d4 |
w: | lu | la-bu lam lam | laaa la-bu | la-bu lam lam | lam laa | la-bu lam lam | laaa |
`;

var selavoliachausir =
  tune_header(
    "Variation to part A inspired by the lyrics to 'Se la Volià Chausir'"
  ) +
  `|: a2 | ab a2 g2 | f3 e1 g2 |1 fe d2 e2 | f3 e1 :|2 fe d2 ^c2 | d4 |
w: | lam | la-bu lam lam | laa lu lam | la-bu lam lam | laa lu | la-bu lam lam | laaa |`;

function render(id, tune) {
  var visualObj = ABCJS.renderAbc(id, tune)[0];
  if (ABCJS.synth.supportsAudio()) {
    var synthControl = new ABCJS.synth.SynthController();
    synthControl.load(`#${id}-audio`, null, {
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: true,
    });
    synthControl.setTune(visualObj, false);
  } else {
    document.querySelector(`#${id}-audio`).innerHTML =
      "<div class='audio-error'>Audio is not supported in this browser.</div>";
  }
}

render("tune", tune);
render("tune-se-la-volia", tune_se_la_volia);
render("tune-prequi-venia", tune_prequi_venia);
render("movement", movement);
render("laaalam", laaalam);
render("laaalabu", laaalabu);
render("laalulabu", laalulabu);
render("lamlabulabu", lamlabulabu);
render("labulabulabu", labulabulabu);
render("laaaalu", laaaalu);
render("melodyinstrument", melodyinstrument);
render("depaurdemetrompar", depaurdemetrompar);
render("selavoliachausir", selavoliachausir);
render("alllabulabu", alllabulabu);
render("threeovertwo", threeovertwo);
render("twooverthree", twooverthree);
render("weirdrepetition", weirdrepetition);
