// lib/questions.ts

// Dies ist unsere zentrale Fragen-Bibliothek.
// Um Fragen zu ändern, musst du nur hier den Text anpassen.

export const questionPacks = {
    'schnelles-vorspiel': {
      name: "Das schnelle Vorspiel",
      questions: [
        { id: 'sv_01', optionA: "Hund", optionB: "Katze" },
        { id: 'sv_02', optionA: "Pizza", optionB: "Pasta" },
        { id: 'sv_03', optionA: "Stadt", optionB: "Land" },
        { id: 'sv_04', optionA: "Früaufsteher", optionB: "Nachteule" },
        { id: 'sv_05', optionA: "Kaffee", optionB: "Tee" },
        { id: 'sv_06', optionA: "Film zuhause", optionB: "Kino" },
        { id: 'sv_07', optionA: "Süß", optionB: "Salzig" },
        { id: 'sv_08', optionA: "Sommer", optionB: "Winter" },
        { id: 'sv_09', optionA: "Anrufen", optionB: "Texten" },
        { id: 'sv_10', optionA: "Spender", optionB: "Sparer" },
      ],
    },
    'schonungslos-ehrlich': {
      name: "Schonungslos ehrlich",
      questions: [
          { id: 'se_01', optionA: "Sicherheit", optionB: "Freiheit" },
          { id: 'se_02', optionA: "Vergeben", optionB: "Vergessen" },
          { id: 'se_03', optionA: "Notlüge für den Frieden", optionB: "Schmerzhafte Wahrheit" },
          { id: 'se_04', optionA: "Viele Bekannte", optionB: "Wenige enge Freunde" },
          { id: 'se_05', optionA: "Durchgeplante Zukunft", optionB: "Spontanes Leben" },
          { id: 'se_06', optionA: "Mehr Geld", optionB: "Mehr Zeit" },
          { id: 'se_07', optionA: "Leidenschaftlicher Streit", optionB: "Eisernes Schweigen" },
          { id: 'se_08', optionA: "Arbeiten um zu leben", optionB: "Leben um zu arbeiten" },
          { id: 'se_09', optionA: "Optimist", optionB: "Realist" },
          { id: 'se_10', optionA: "Leicht vertrauen", optionB: "Vertrauen muss verdient werden" },
          { id: 'se_11', optionA: "Über Gefühle reden", optionB: "Gefühle zeigen" },
          { id: 'se_12', optionA: "Große Hochzeit", optionB: "Heimlich durchbrennen" },
          { id: 'se_13', optionA: "Seelenverwandte existieren", optionB: "Liebe wird aufgebaut" },
          { id: 'se_14', optionA: "Zweite Chancen geben", optionB: "Ein Fehler reicht" },
          { id: 'se_15', optionA: "Ordnung", optionB: "Kreatives Chaos" },
      ],
    },
    'crash-test': {
      name: "Der Kompatibilitäts-Crash-Test",
      questions: [
          { id: 'ct_01', optionA: "Unsichtbarkeit", optionB: "Fliegen" },
          { id: 'ct_02', optionA: "Mit Tieren sprechen können", optionB: "Alle menschlichen Sprachen beherrschen" },
          { id: 'ct_03', optionA: "Den Welthunger beenden", optionB: "Eine Milliarde Euro erhalten" },
          { id: 'ct_04', optionA: "Nie wieder Internet", optionB: "Nie wieder reisen" },
          { id: 'ct_05', optionA: "Immer 10 Minuten zu spät", optionB: "Immer 20 Minuten zu früh sein" },
          { id: 'ct_06', optionA: "Die Vergangenheit neu erleben", optionB: "Die Zukunft sehen können" },
          { id: 'ct_07', optionA: "Einen Drachen als Haustier", optionB: "Selbst ein Drache sein" },
          { id: 'ct_08', optionA: "Hauptrolle in einem Horrorfilm", optionB: "Einer Komödie" },
          { id: 'ct_09', optionA: "Eine Welt ohne Kunst", optionB: "Eine Welt ohne Wissenschaft" },
          { id: 'ct_10', optionA: "Einfache Reise zum Mars (ohne Rückkehr)", optionB: "Auf der Erde bleiben" },
      ],
    },
  };
  
  export type Question = {
    id: string;
    optionA: string;
    optionB: string;
  };
  
  export type QuestionPack = {
    name: string;
    questions: Question[];
  };