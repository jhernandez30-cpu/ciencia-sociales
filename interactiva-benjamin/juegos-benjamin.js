const STORAGE_KEYS = {
  score: "benjaminZeledonGameScore",
  best: "benjaminZeledonBestScore"
};

const state = {
  score: Number(localStorage.getItem(STORAGE_KEYS.score)) || 0,
  best: Number(localStorage.getItem(STORAGE_KEYS.best)) || 0,
  activeGame: null
};

const gameMenu = document.getElementById("gameMenu");
const gameStage = document.getElementById("gameStage");
const gameContent = document.getElementById("gameContent");
const activeGameTitle = document.getElementById("activeGameTitle");
const scoreTotal = document.getElementById("scoreTotal");
const bestScore = document.getElementById("bestScore");
const backToGames = document.getElementById("backToGames");
const resetProgress = document.getElementById("resetProgress");

const quizQuestions = [
  {
    question: "¿Dónde nació Benjamín Zeledón?",
    options: ["León", "La Concordia", "Managua", "Granada"],
    answer: "La Concordia",
    explain: "Correcto. Benjamín Zeledón nació en La Concordia el 4 de octubre de 1879."
  },
  {
    question: "¿Cuál fue la profesión de Benjamín Zeledón?",
    options: ["Médico", "Ingeniero", "Abogado", "Comerciante"],
    answer: "Abogado",
    explain: "Correcto. Su formación como abogado fortaleció su participación pública y política."
  },
  {
    question: "¿Qué ideales defendía Benjamín Zeledón?",
    options: ["La soberanía nacional", "La intervención extranjera", "La división del país", "El abandono de la patria"],
    answer: "La soberanía nacional",
    explain: "Correcto. Zeledón defendió el derecho de Nicaragua a decidir su propio destino."
  },
  {
    question: "¿En qué año ocurrió la intervención estadounidense mencionada en su historia?",
    options: ["1821", "1895", "1912", "1934"],
    answer: "1912",
    explain: "Correcto. En 1912 se produjo la intervención estadounidense durante el conflicto político nicaragüense."
  },
  {
    question: "¿Qué lugares defendió Benjamín Zeledón?",
    options: ["El Coyotepe y La Barranca", "León y Granada", "Managua y Rivas", "Catarina y Masaya"],
    answer: "El Coyotepe y La Barranca",
    explain: "Correcto. Estos lugares fueron posiciones estratégicas en su resistencia patriótica."
  },
  {
    question: "¿Qué líder nicaragüense fue inspirado por el ejemplo de Zeledón?",
    options: ["Rubén Darío", "Augusto C. Sandino", "José Dolores Estrada", "José Santos Zelaya"],
    answer: "Augusto C. Sandino",
    explain: "Correcto. Su ejemplo marcó la conciencia patriótica de Augusto C. Sandino."
  },
  {
    question: "¿Qué representa Benjamín Zeledón para Nicaragua?",
    options: ["Valentía y patriotismo", "Rendición", "Desinterés", "Olvido histórico"],
    answer: "Valentía y patriotismo",
    explain: "Correcto. Es recordado como símbolo de dignidad, patriotismo y soberanía nacional."
  },
  {
    question: "¿Cuándo murió Benjamín Zeledón?",
    options: ["4 de octubre de 1912", "15 de septiembre de 1821", "1 de enero de 1900", "18 de mayo de 1895"],
    answer: "4 de octubre de 1912",
    explain: "Correcto. Murió el 4 de octubre de 1912, cerca de Catarina, Masaya."
  }
];

const trueFalseQuestions = [
  ["Benjamín Zeledón nació en La Concordia.", true, "Nació en La Concordia, Jinotega, el 4 de octubre de 1879."],
  ["Benjamín Zeledón fue abogado.", true, "Sí. Estudió Derecho y ejerció como abogado."],
  ["Benjamín Zeledón defendió la intervención extranjera.", false, "Falso. Zeledón defendió la soberanía nacional frente a la intervención extranjera."],
  ["Benjamín Zeledón participó en la defensa de El Coyotepe.", true, "Verdadero. El Coyotepe fue una posición clave de resistencia."],
  ["La Barranca fue uno de los lugares relacionados con su resistencia.", true, "Verdadero. La Barranca forma parte de los lugares asociados a su lucha."],
  ["Augusto C. Sandino fue inspirado por el ejemplo de Benjamín Zeledón.", true, "Verdadero. Su sacrificio influyó en la conciencia patriótica de Sandino."],
  ["Benjamín Zeledón no tuvo importancia en la historia de Nicaragua.", false, "Falso. Es un símbolo nacional de patriotismo y soberanía."],
  ["Su legado está relacionado con patriotismo y soberanía nacional.", true, "Verdadero. Su legado fortalece la identidad y memoria nacional."]
];

const memoryPairs = [
  ["La Concordia", "Lugar de nacimiento"],
  ["Derecho", "Formación académica"],
  ["Abogado", "Profesión"],
  ["El Coyotepe", "Lugar de resistencia"],
  ["La Barranca", "Defensa patriótica"],
  ["Augusto C. Sandino", "Inspirado por Zeledón"],
  ["Soberanía", "Derecho de un pueblo a decidir"],
  ["1912", "Año de su lucha y muerte"]
];

const timelineEvents = [
  "Nace en La Concordia.",
  "Realiza sus estudios.",
  "Estudia Derecho.",
  "Se convierte en abogado.",
  "Participa en la vida política.",
  "Organiza la resistencia patriótica.",
  "Defiende El Coyotepe y La Barranca.",
  "Muere el 4 de octubre de 1912.",
  "Su legado inspira a Augusto C. Sandino."
];

const phraseQuestions = [
  ["Benjamín Zeledón nació en ________.", ["La Concordia", "Managua", "León"], "La Concordia", "La Concordia fue su lugar de nacimiento."],
  ["Zeledón estudió ________ y llegó a ser abogado.", ["Derecho", "Medicina", "Arquitectura"], "Derecho", "Su formación en Derecho lo preparó para la vida pública."],
  ["En 1912 defendió la soberanía frente a la intervención ________.", ["extranjera", "comercial", "educativa"], "extranjera", "La intervención extranjera fue el contexto de su resistencia."],
  ["Lideró la resistencia en El Coyotepe y ________.", ["La Barranca", "Granada", "Bluefields"], "La Barranca", "El Coyotepe y La Barranca fueron lugares claves de resistencia."],
  ["Su ejemplo inspiró a ________.", ["Augusto C. Sandino", "Rubén Darío", "Cristóbal Colón"], "Augusto C. Sandino", "Sandino fue inspirado por el ejemplo patriótico de Zeledón."]
];

const missionQuestions = [
  {
    title: "Misión Biografía",
    question: "¿Cuál fue el nombre completo del héroe estudiado?",
    options: ["Benjamín Zeledón Rodríguez", "Augusto Zeledón Sandino", "José Benjamín Darío"],
    answer: "Benjamín Zeledón Rodríguez",
    badge: "Explorador histórico"
  },
  {
    title: "Misión Formación",
    question: "¿Qué estudió para convertirse en abogado?",
    options: ["Derecho", "Ingeniería", "Medicina"],
    answer: "Derecho",
    badge: "Estudiante patriota"
  },
  {
    title: "Misión Política",
    question: "¿En qué movimiento participó políticamente?",
    options: ["Movimiento liberal", "Movimiento monárquico", "Movimiento colonial"],
    answer: "Movimiento liberal",
    badge: "Defensor de la soberanía"
  },
  {
    title: "Misión Soberanía",
    question: "¿Qué defendió frente a la intervención extranjera?",
    options: ["La soberanía nacional", "La división nacional", "El dominio extranjero"],
    answer: "La soberanía nacional",
    badge: "Guardián de la memoria"
  },
  {
    title: "Misión Legado",
    question: "¿A qué líder inspiró su ejemplo?",
    options: ["Augusto C. Sandino", "Rubén Darío", "Cristóbal Colón"],
    answer: "Augusto C. Sandino",
    badge: "Experto en Benjamín Zeledón"
  }
];

const games = {
  quiz: { title: "Reto de la Soberanía", render: renderQuiz },
  trueFalse: { title: "¿Verdadero o Falso?", render: renderTrueFalse },
  memory: { title: "Memoria Histórica", render: renderMemory },
  timeline: { title: "Ordena la Historia", render: renderTimeline },
  complete: { title: "Completa la Frase", render: renderCompletePhrase },
  mission: { title: "Misión: Defensor de la Patria", render: renderMission }
};

function updateScoreBoard() {
  scoreTotal.textContent = state.score;
  bestScore.textContent = state.best;
  localStorage.setItem(STORAGE_KEYS.score, String(state.score));
  localStorage.setItem(STORAGE_KEYS.best, String(state.best));
}

function addScore(points) {
  state.score += points;
  if (state.score > state.best) {
    state.best = state.score;
  }
  updateScoreBoard();
}

function setGame(gameId) {
  const game = games[gameId];
  if (!game) return;

  state.activeGame = gameId;
  activeGameTitle.textContent = game.title;
  gameMenu.classList.add("hidden");
  gameStage.classList.remove("hidden");
  game.render();
  gameStage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function returnToGames() {
  state.activeGame = null;
  gameContent.innerHTML = "";
  gameStage.classList.add("hidden");
  gameMenu.classList.remove("hidden");
  gameMenu.scrollIntoView({ behavior: "smooth", block: "start" });
}

function optionButton(label, className = "option-btn") {
  return `<button class="${className}" type="button">${label}</button>`;
}

function feedbackText(isCorrect, text) {
  return `<div class="feedback show ${isCorrect ? "good" : "bad"}">${text}</div>`;
}

function setInlineFeedback(elementId, isCorrect, text) {
  const feedback = document.getElementById(elementId);
  if (!feedback) return;
  feedback.className = `feedback show ${isCorrect ? "good" : "bad"}`;
  feedback.textContent = text;
}

function resultMessage(points, max) {
  if (points <= 3) return "Sigue aprendiendo, vas por buen camino.";
  if (points <= 6) return "Muy bien, conoces bastante sobre Benjamín Zeledón.";
  return "Excelente, eres un defensor del conocimiento histórico.";
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function renderQuiz() {
  let current = 0;
  let localPoints = 0;
  let answered = false;

  function draw() {
    const item = quizQuestions[current];
    gameContent.innerHTML = `
      <article class="game-box">
        <h3>Reto de la Soberanía</h3>
        <p class="game-description">Responde las preguntas y demuestra cuánto sabes sobre Benjamín Zeledón.</p>
        <div class="status-row">
          <span class="status-chip">Pregunta ${current + 1} de ${quizQuestions.length}</span>
          <span class="status-chip">Puntos del reto: ${localPoints}</span>
        </div>
        <section class="question-card">
          <p class="question-text">${item.question}</p>
          <div class="options-grid">${item.options.map((option) => optionButton(option)).join("")}</div>
        </section>
        <div id="quizFeedback" class="feedback" aria-live="polite"></div>
        <div class="game-actions">
          <button class="primary-btn" id="nextQuestion" type="button" disabled>Siguiente pregunta</button>
        </div>
      </article>
    `;

    const buttons = gameContent.querySelectorAll(".option-btn");
    const feedback = document.getElementById("quizFeedback");
    const next = document.getElementById("nextQuestion");
    answered = false;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = button.textContent;
        const isCorrect = chosen === item.answer;

        buttons.forEach((candidate) => {
          if (candidate.textContent === item.answer) candidate.classList.add("correct");
          candidate.disabled = true;
        });

        if (isCorrect) {
          localPoints += 1;
          addScore(10);
          feedback.outerHTML = feedbackText(true, item.explain);
        } else {
          button.classList.add("wrong");
          feedback.outerHTML = feedbackText(false, `Casi. La respuesta correcta es: ${item.answer}. ${item.explain}`);
        }
        next.disabled = false;
      });
    });

    next.addEventListener("click", () => {
      current += 1;
      if (current < quizQuestions.length) {
        draw();
      } else {
        gameContent.innerHTML = `
          <article class="result-card">
            <span class="medal">${localPoints >= 7 ? "A+" : localPoints >= 4 ? "B" : "C"}</span>
            <h3>Resultado final</h3>
            <p>Obtuviste ${localPoints} de ${quizQuestions.length} respuestas correctas.</p>
            <p>${resultMessage(localPoints, quizQuestions.length)}</p>
            <button class="primary-btn" type="button" id="playAgain">Volver a jugar</button>
          </article>
        `;
        document.getElementById("playAgain").addEventListener("click", renderQuiz);
      }
    });
  }

  draw();
}

function renderTrueFalse() {
  let current = 0;
  let localPoints = 0;

  function draw() {
    if (current >= trueFalseQuestions.length) {
      gameContent.innerHTML = `
        <article class="result-card">
          <span class="medal">${localPoints}/${trueFalseQuestions.length}</span>
          <h3>Resultado</h3>
          <p>Acertaste ${localPoints} afirmaciones.</p>
          <button class="primary-btn" id="tfAgain" type="button">Volver a jugar</button>
        </article>
      `;
      document.getElementById("tfAgain").addEventListener("click", renderTrueFalse);
      return;
    }

    const [statement, answer, explanation] = trueFalseQuestions[current];
    gameContent.innerHTML = `
      <article class="game-box">
        <h3>¿Verdadero o Falso?</h3>
        <div class="status-row">
          <span class="status-chip">Afirmación ${current + 1} de ${trueFalseQuestions.length}</span>
          <span class="status-chip">Aciertos: ${localPoints}</span>
        </div>
        <section class="question-card">
          <p class="question-text">${statement}</p>
          <div class="tf-actions">
            <button class="tf-btn" type="button" data-value="true">Verdadero</button>
            <button class="tf-btn" type="button" data-value="false">Falso</button>
          </div>
        </section>
        <div id="tfFeedback" class="feedback" aria-live="polite"></div>
        <button class="primary-btn" id="tfNext" type="button" disabled>Siguiente</button>
      </article>
    `;

    const feedback = document.getElementById("tfFeedback");
    const next = document.getElementById("tfNext");
    const buttons = gameContent.querySelectorAll(".tf-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const chosen = button.dataset.value === "true";
        const correct = chosen === answer;
        buttons.forEach((item) => {
          item.disabled = true;
          if ((item.dataset.value === "true") === answer) item.classList.add("correct");
        });

        if (correct) {
          localPoints += 1;
          addScore(10);
          feedback.outerHTML = feedbackText(true, `Correcto. ${explanation}`);
        } else {
          button.classList.add("wrong");
          feedback.outerHTML = feedbackText(false, `Incorrecto. ${explanation}`);
        }
        next.disabled = false;
      });
    });

    next.addEventListener("click", () => {
      current += 1;
      draw();
    });
  }

  draw();
}

function renderMemory() {
  const cards = shuffle(memoryPairs.flatMap((pair, pairIndex) => [
    { id: pairIndex, text: pair[0] },
    { id: pairIndex, text: pair[1] }
  ]));
  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let attempts = 0;
  let found = 0;

  function draw() {
    gameContent.innerHTML = `
      <article class="game-box">
        <h3>Memoria Histórica</h3>
        <p class="game-description">Encuentra parejas correctas entre conceptos y significados.</p>
        <div class="status-row">
          <span class="status-chip" id="attempts">Intentos: ${attempts}</span>
          <span class="status-chip" id="found">Parejas: ${found}/${memoryPairs.length}</span>
        </div>
        <section class="memory-panel">
          <div class="memory-grid">
            ${cards.map((card, index) => `<button class="memory-card" data-index="${index}" type="button" aria-label="Tarjeta de memoria oculta">${card.text}</button>`).join("")}
          </div>
        </section>
        <div id="memoryFeedback" class="feedback" aria-live="polite"></div>
      </article>
    `;

    gameContent.querySelectorAll(".memory-card").forEach((button) => {
      button.addEventListener("click", () => flipCard(button));
    });
  }

  function updateMemoryStatus() {
    document.getElementById("attempts").textContent = `Intentos: ${attempts}`;
    document.getElementById("found").textContent = `Parejas: ${found}/${memoryPairs.length}`;
  }

  function flipCard(button) {
    if (lock || button.classList.contains("flipped") || button.classList.contains("matched")) return;
    button.classList.add("flipped");
    button.setAttribute("aria-label", button.textContent);

    if (!firstCard) {
      firstCard = button;
      return;
    }

    secondCard = button;
    attempts += 1;
    lock = true;
    const first = cards[Number(firstCard.dataset.index)];
    const second = cards[Number(secondCard.dataset.index)];

    if (first.id === second.id) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard.disabled = true;
      secondCard.disabled = true;
      found += 1;
      addScore(10);
      setInlineFeedback("memoryFeedback", true, "Pareja correcta. Estás conectando conceptos históricos.");
      firstCard = null;
      secondCard = null;
      lock = false;
      updateMemoryStatus();
      if (found === memoryPairs.length) {
        gameContent.insertAdjacentHTML("beforeend", `
          <article class="result-card">
            <h3>¡Excelente!</h3>
            <p>Has completado la memoria histórica de Benjamín Zeledón.</p>
            <button class="primary-btn" id="memoryAgain" type="button">Volver a jugar</button>
          </article>
        `);
        document.getElementById("memoryAgain").addEventListener("click", renderMemory);
      }
      return;
    }

    setInlineFeedback("memoryFeedback", false, "No coinciden. Observa los conceptos e inténtalo de nuevo.");
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.setAttribute("aria-label", "Tarjeta de memoria oculta");
      secondCard.setAttribute("aria-label", "Tarjeta de memoria oculta");
      firstCard = null;
      secondCard = null;
      lock = false;
      updateMemoryStatus();
    }, 850);
  }

  draw();
}

function renderTimeline() {
  let order = shuffle(timelineEvents);
  let awarded = false;

  function draw(message = "") {
    gameContent.innerHTML = `
      <article class="game-box">
        <h3>Ordena la Historia</h3>
        <p class="game-description">Usa los botones para subir o bajar cada evento y reconstruir la secuencia histórica.</p>
        <ol class="order-list">
          ${order.map((event, index) => `
            <li class="order-item">
              <span class="order-number">${index + 1}</span>
              <span>${event}</span>
              <span class="move-controls">
                <button type="button" data-move="up" data-index="${index}" aria-label="Subir evento">↑</button>
                <button type="button" data-move="down" data-index="${index}" aria-label="Bajar evento">↓</button>
              </span>
            </li>
          `).join("")}
        </ol>
        ${message}
        <div class="game-actions">
          <button class="primary-btn" id="checkOrder" type="button">Verificar orden</button>
          <button class="small-btn" id="showHint" type="button">Pista</button>
          <button class="small-btn" id="shuffleOrder" type="button">Mezclar</button>
        </div>
      </article>
    `;

    gameContent.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const direction = button.dataset.move;
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= order.length) return;
        [order[index], order[target]] = [order[target], order[index]];
        draw();
      });
    });

    document.getElementById("checkOrder").addEventListener("click", () => {
      const isCorrect = order.every((event, index) => event === timelineEvents[index]);
      if (isCorrect) {
        if (!awarded) {
          addScore(90);
          awarded = true;
        }
        draw(feedbackText(true, "¡Correcto! Ordenaste la historia de Benjamín Zeledón."));
      } else {
        draw(feedbackText(false, "Revisa el orden e inténtalo otra vez. Recuerda empezar por su nacimiento en La Concordia."));
      }
    });

    document.getElementById("showHint").addEventListener("click", () => {
      draw(feedbackText(true, `Pista: el primer evento correcto es “${timelineEvents[0]}”`));
    });

    document.getElementById("shuffleOrder").addEventListener("click", () => {
      order = shuffle(timelineEvents);
      awarded = false;
      draw();
    });
  }

  draw();
}

function renderCompletePhrase() {
  let current = 0;
  let localPoints = 0;

  function draw() {
    if (current >= phraseQuestions.length) {
      gameContent.innerHTML = `
        <article class="result-card">
          <span class="medal">${localPoints}/${phraseQuestions.length}</span>
          <h3>Frases completadas</h3>
          <p>Lograste ${localPoints} respuestas correctas.</p>
          <button class="primary-btn" id="phraseAgain" type="button">Volver a jugar</button>
        </article>
      `;
      document.getElementById("phraseAgain").addEventListener("click", renderCompletePhrase);
      return;
    }

    const [phrase, options, answer, explanation] = phraseQuestions[current];
    gameContent.innerHTML = `
      <article class="game-box">
        <h3>Completa la frase</h3>
        <div class="status-row">
          <span class="status-chip">Frase ${current + 1} de ${phraseQuestions.length}</span>
          <span class="status-chip">Aciertos: ${localPoints}</span>
        </div>
        <section class="question-card">
          <p class="phrase">${phrase.replace("________", '<span class="blank">________</span>')}</p>
          <div class="options-grid">${options.map((option) => optionButton(option)).join("")}</div>
        </section>
        <div id="phraseFeedback" class="feedback" aria-live="polite"></div>
        <button class="primary-btn" id="phraseNext" type="button" disabled>Siguiente</button>
      </article>
    `;

    const feedback = document.getElementById("phraseFeedback");
    const next = document.getElementById("phraseNext");
    gameContent.querySelectorAll(".option-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const correct = button.textContent === answer;
        gameContent.querySelectorAll(".option-btn").forEach((item) => {
          item.disabled = true;
          if (item.textContent === answer) item.classList.add("correct");
        });

        if (correct) {
          localPoints += 1;
          addScore(10);
          feedback.outerHTML = feedbackText(true, `Correcto. ${explanation}`);
        } else {
          button.classList.add("wrong");
          feedback.outerHTML = feedbackText(false, `Incorrecto. La opción correcta es ${answer}. ${explanation}`);
        }
        next.disabled = false;
      });
    });

    next.addEventListener("click", () => {
      current += 1;
      draw();
    });
  }

  draw();
}

function renderMission() {
  let current = 0;
  const unlocked = [];

  function draw(message = "") {
    const mission = missionQuestions[current];
    const progress = Math.round((unlocked.length / missionQuestions.length) * 100);

    if (!mission) {
      gameContent.innerHTML = `
        <article class="result-card">
          <span class="medal">★</span>
          <h3>¡Felicidades!</h3>
          <p>Has completado la misión y aprendiste sobre la vida, lucha y legado de Benjamín Zeledón.</p>
          <div class="badges">${unlocked.map((badge) => `<span class="badge unlocked">${badge}</span>`).join("")}</div>
          <button class="primary-btn" id="missionAgain" type="button">Repetir misión</button>
        </article>
      `;
      document.getElementById("missionAgain").addEventListener("click", renderMission);
      return;
    }

    gameContent.innerHTML = `
      <article class="game-box">
        <h3>Misión: Defensor de la Patria</h3>
        <p class="game-description">Completa misiones, gana puntos y desbloquea insignias.</p>
        <div class="progress-wrap" aria-label="Progreso de misiones">
          <div class="progress-bar" style="width:${progress}%"></div>
        </div>
        <div class="badges">
          ${missionQuestions.map((item) => `<span class="badge ${unlocked.includes(item.badge) ? "unlocked" : ""}">${item.badge}</span>`).join("")}
        </div>
        <section class="mission-card">
          <span class="status-chip">${mission.title}</span>
          <p class="question-text">${mission.question}</p>
          <div class="options-grid">${mission.options.map((option) => optionButton(option)).join("")}</div>
        </section>
        ${message}
      </article>
    `;

    gameContent.querySelectorAll(".option-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const correct = button.textContent === mission.answer;
        gameContent.querySelectorAll(".option-btn").forEach((item) => {
          item.disabled = true;
          if (item.textContent === mission.answer) item.classList.add("correct");
        });

        if (correct) {
          addScore(10);
          unlocked.push(mission.badge);
          current += 1;
          gameContent.insertAdjacentHTML("beforeend", `
            <div class="feedback show good">Misión completada. Desbloqueaste la insignia “${mission.badge}”.</div>
            <button class="primary-btn" id="nextMission" type="button">Siguiente misión</button>
          `);
          document.getElementById("nextMission").addEventListener("click", () => draw());
        } else {
          button.classList.add("wrong");
          gameContent.insertAdjacentHTML("beforeend", `
            <div class="feedback show bad">Respuesta incorrecta. Revisa la pista histórica e inténtalo otra vez: la respuesta correcta se relaciona con “${mission.answer}”.</div>
            <button class="primary-btn" id="retryMission" type="button">Intentar de nuevo</button>
          `);
          document.getElementById("retryMission").addEventListener("click", () => draw());
        }
      });
    });
  }

  draw();
}

document.querySelectorAll(".game-card").forEach((card) => {
  card.querySelector("button").addEventListener("click", () => setGame(card.dataset.game));
});

backToGames.addEventListener("click", returnToGames);

resetProgress.addEventListener("click", () => {
  state.score = 0;
  state.best = 0;
  updateScoreBoard();
});

updateScoreBoard();
