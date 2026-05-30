const loader = document.querySelector("[data-loader]");
const favicon = document.querySelector("#favicon");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const tabLinks = [...document.querySelectorAll("[data-tab-link]")];
const birthdayCountdown = document.querySelector("[data-birthday-countdown]");
const gameModal = document.querySelector("[data-game-modal]");
const gameOpenButton = document.querySelector("[data-game-open]");
const gameCloseButton = document.querySelector("[data-game-close]");
const gameCanvas = document.querySelector("[data-game-canvas]");
const gameStartButton = document.querySelector("[data-game-start]");
const gameRestartButton = document.querySelector("[data-game-restart]");
const gameSoundButton = document.querySelector("[data-game-sound]");
const gameScore = document.querySelector("[data-game-score]");
const mazeModal = document.querySelector("[data-maze-modal]");
const mazeOpenButton = document.querySelector("[data-maze-open]");
const mazeCloseButton = document.querySelector("[data-maze-close]");
const mazeCanvas = document.querySelector("[data-maze-canvas]");
const mazeStartButton = document.querySelector("[data-maze-start]");
const mazeRestartButton = document.querySelector("[data-maze-restart]");
const mazeSoundButton = document.querySelector("[data-maze-sound]");
const mazeScore = document.querySelector("[data-maze-score]");
const mazeLives = document.querySelector("[data-maze-lives]");
const mazeDirectionButtons = [...document.querySelectorAll("[data-maze-dir]")];
const projectViewport = document.querySelector("[data-project-viewport]");
const projectCards = [...document.querySelectorAll("[data-project-card]")];
const projectPrevButton = document.querySelector("[data-project-prev]");
const projectNextButton = document.querySelector("[data-project-next]");
const projectCurrent = document.querySelector("[data-project-current]");
const projectTotal = document.querySelector("[data-project-total]");

const animateFavicon = () => {
  if (!favicon) {
    return;
  }

  const frames = Array.from(
    { length: 12 },
    (_, index) => `assets/turtlefavicon-frames/turtlefavicon-${String(index).padStart(2, "0")}.gif`,
  );
  let frameIndex = 0;

  window.setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    favicon.href = frames[frameIndex];
  }, 120);
};

let activeProjectIndex = 0;
let projectScrollFrame = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateProjectMeta = () => {
  if (projectCards.length === 0) {
    return;
  }

  projectCards.forEach((card, index) => {
    card.toggleAttribute("aria-current", index === activeProjectIndex);
  });

  if (projectCurrent) {
    projectCurrent.textContent = String(activeProjectIndex + 1).padStart(2, "0");
  }
};

const scrollProjectIntoView = (behavior = "smooth") => {
  if (!projectViewport || projectCards.length === 0) {
    return;
  }

  const viewportWidth = projectViewport.clientWidth;

  if (!viewportWidth) {
    return;
  }

  projectViewport.scrollTo({
    left: activeProjectIndex * viewportWidth,
    behavior: prefersReducedMotion.matches ? "auto" : behavior,
  });
};

const setProjectIndex = (index, shouldScroll = true) => {
  if (projectCards.length === 0) {
    return;
  }

  activeProjectIndex = (index + projectCards.length) % projectCards.length;
  updateProjectMeta();

  if (shouldScroll) {
    scrollProjectIntoView();
  }
};

const moveProjectWheel = (direction) => {
  setProjectIndex(activeProjectIndex + direction);
};

if (projectTotal) {
  projectTotal.textContent = String(projectCards.length).padStart(2, "0");
}

projectPrevButton?.addEventListener("click", () => moveProjectWheel(-1));
projectNextButton?.addEventListener("click", () => moveProjectWheel(1));

projectViewport?.addEventListener("scroll", () => {
  if (projectScrollFrame) {
    return;
  }

  projectScrollFrame = window.requestAnimationFrame(() => {
    projectScrollFrame = 0;
    const viewportWidth = projectViewport.clientWidth;

    if (!viewportWidth) {
      return;
    }

    const nextIndex = Math.round(projectViewport.scrollLeft / viewportWidth);
    setProjectIndex(nextIndex, false);
  });
}, { passive: true });

projectViewport?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveProjectWheel(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveProjectWheel(1);
  }
});

window.addEventListener("resize", () => scrollProjectIntoView("auto"));

updateProjectMeta();

const showTab = (tabName, shouldFocus = false) => {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;

    if (isActive && shouldFocus) {
      panel.focus({ preventScroll: true });
    }
  });

  if (window.location.hash !== `#${tabName}`) {
    history.replaceState(null, "", `#${tabName}`);
  }

};

const validTabs = new Set(tabs.map((tab) => tab.dataset.tab));
const initialTab = window.location.hash.replace("#", "");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab, true));
});

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const tabName = link.dataset.tabLink;

    if (!validTabs.has(tabName)) {
      return;
    }

    event.preventDefault();
    showTab(tabName, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const updateBirthdayCountdown = () => {
  if (!birthdayCountdown) {
    return;
  }

  const now = new Date();
  let nextBirthday = new Date(now.getFullYear(), 10, 3, 0, 0, 0);

  if (nextBirthday <= now) {
    nextBirthday = new Date(now.getFullYear() + 1, 10, 3, 0, 0, 0);
  }

  const remaining = nextBirthday - now;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  birthdayCountdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s until Josue's next birthday.`;
};

const flapGame = (() => {
  if (!gameCanvas) {
    return null;
  }

  const ctx = gameCanvas.getContext("2d");
  const width = gameCanvas.width;
  const height = gameCanvas.height;
  const groundHeight = 78;
  const bird = {
    x: 112,
    y: 260,
    radius: 17,
    velocity: 0,
    rotation: 0,
  };

  let audioContext;
  let animationId;
  let lastFrame = 0;
  let pipeTimer = 0;
  let score = 0;
  let muted = false;
  let mode = "idle";
  let pipes = [];

  const settings = {
    gravity: 1420,
    flap: -430,
    pipeWidth: 72,
    pipeGap: 152,
    pipeSpeed: 168,
    pipeDelay: 1.34,
  };

  const updateScore = () => {
    if (gameScore) {
      gameScore.textContent = String(score);
    }
  };

  const ensureAudio = () => {
    if (!audioContext) {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      audioContext = AudioEngine ? new AudioEngine() : null;
    }

    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
  };

  const playTone = (frequency, duration, type = "sine", gain = 0.06, endFrequency = frequency) => {
    if (muted) {
      return;
    }

    ensureAudio();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
    volume.gain.setValueAtTime(gain, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  };

  const playFlap = () => playTone(620, 0.08, "triangle", 0.045, 920);
  const playScore = () => {
    playTone(780, 0.08, "sine", 0.05, 1040);
    window.setTimeout(() => playTone(1120, 0.08, "sine", 0.04, 1320), 70);
  };
  const playCrash = () => playTone(180, 0.24, "sawtooth", 0.06, 56);

  const reset = () => {
    bird.y = 260;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes = [];
    score = 0;
    pipeTimer = settings.pipeDelay * 0.72;
    lastFrame = 0;
    mode = "idle";
    updateScore();
    draw();
  };

  const start = () => {
    if (mode === "playing") {
      return;
    }

    if (mode === "over") {
      reset();
    }

    ensureAudio();
    mode = "playing";
    lastFrame = performance.now();
    window.cancelAnimationFrame(animationId);
    animationId = window.requestAnimationFrame(loop);
  };

  const flap = () => {
    if (mode === "over") {
      start();
      return;
    }

    if (mode !== "playing") {
      start();
    }

    bird.velocity = settings.flap;
    playFlap();
  };

  const stop = () => {
    window.cancelAnimationFrame(animationId);
    animationId = null;
  };

  const spawnPipe = () => {
    const minTop = 82;
    const maxTop = height - groundHeight - settings.pipeGap - 88;
    const top = minTop + Math.random() * (maxTop - minTop);

    pipes.push({
      x: width + 12,
      top,
      passed: false,
    });
  };

  const endGame = () => {
    if (mode === "over") {
      return;
    }

    mode = "over";
    playCrash();
    stop();
    draw();
  };

  const collidesWithPipe = (pipe) => {
    const birdLeft = bird.x - bird.radius;
    const birdRight = bird.x + bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + settings.pipeWidth;
    const lowerY = pipe.top + settings.pipeGap;

    if (birdRight < pipeLeft || birdLeft > pipeRight) {
      return false;
    }

    return birdTop < pipe.top || birdBottom > lowerY;
  };

  const update = (delta) => {
    bird.velocity += settings.gravity * delta;
    bird.y += bird.velocity * delta;
    bird.rotation = Math.max(-0.45, Math.min(1.1, bird.velocity / 520));

    pipeTimer += delta;

    if (pipeTimer >= settings.pipeDelay) {
      spawnPipe();
      pipeTimer = 0;
    }

    pipes.forEach((pipe) => {
      pipe.x -= settings.pipeSpeed * delta;

      if (!pipe.passed && pipe.x + settings.pipeWidth < bird.x) {
        pipe.passed = true;
        score += 1;
        updateScore();
        playScore();
      }

      if (collidesWithPipe(pipe)) {
        endGame();
      }
    });

    pipes = pipes.filter((pipe) => pipe.x > -settings.pipeWidth - 8);

    if (bird.y + bird.radius >= height - groundHeight || bird.y - bird.radius <= 0) {
      endGame();
    }
  };

  const drawBackground = () => {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#d8f1ff");
    sky.addColorStop(0.58, "#fff7fb");
    sky.addColorStop(1, "#ffe9f2");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    [
      [60, 96, 44],
      [110, 82, 34],
      [312, 138, 42],
      [360, 124, 30],
    ].forEach(([x, y, radius]) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.arc(x + radius * 0.82, y + 6, radius * 0.72, 0, Math.PI * 2);
      ctx.arc(x - radius * 0.82, y + 10, radius * 0.64, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(185, 156, 255, 0.28)";
    ctx.beginPath();
    ctx.moveTo(0, height - groundHeight - 80);
    ctx.quadraticCurveTo(96, height - groundHeight - 128, 188, height - groundHeight - 80);
    ctx.quadraticCurveTo(296, height - groundHeight - 28, width, height - groundHeight - 92);
    ctx.lineTo(width, height - groundHeight);
    ctx.lineTo(0, height - groundHeight);
    ctx.closePath();
    ctx.fill();
  };

  const drawPipes = () => {
    pipes.forEach((pipe) => {
      const lowerY = pipe.top + settings.pipeGap;
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + settings.pipeWidth, 0);
      pipeGradient.addColorStop(0, "#93efd2");
      pipeGradient.addColorStop(0.52, "#57c9af");
      pipeGradient.addColorStop(1, "#2ea98f");
      ctx.fillStyle = pipeGradient;

      ctx.fillRect(pipe.x, 0, settings.pipeWidth, pipe.top);
      ctx.fillRect(pipe.x, lowerY, settings.pipeWidth, height - groundHeight - lowerY);

      ctx.fillStyle = "#78dfc4";
      ctx.fillRect(pipe.x - 6, pipe.top - 20, settings.pipeWidth + 12, 20);
      ctx.fillRect(pipe.x - 6, lowerY, settings.pipeWidth + 12, 20);

      ctx.strokeStyle = "rgba(33, 23, 47, 0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, settings.pipeWidth, pipe.top);
      ctx.strokeRect(pipe.x, lowerY, settings.pipeWidth, height - groundHeight - lowerY);
    });
  };

  const drawGround = () => {
    ctx.fillStyle = "#ffd7e6";
    ctx.fillRect(0, height - groundHeight, width, groundHeight);
    ctx.fillStyle = "#ffc1d6";
    ctx.fillRect(0, height - groundHeight, width, 14);

    for (let x = -20; x < width + 20; x += 34) {
      ctx.fillStyle = x % 68 === 0 ? "#b99cff" : "#8fd8ff";
      ctx.beginPath();
      ctx.ellipse(x, height - 24, 20, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawBird = () => {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    ctx.fillStyle = "#ffcf52";
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff78ad";
    ctx.beginPath();
    ctx.ellipse(-7, 4, 11, 7, -0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f89a2e";
    ctx.beginPath();
    ctx.moveTo(18, -2);
    ctx.lineTo(34, 3);
    ctx.lineTo(18, 9);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(8, -7, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#21172f";
    ctx.beginPath();
    ctx.arc(10, -7, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(33, 23, 47, 0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 16, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  const drawOverlay = () => {
    if (mode === "playing") {
      return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    ctx.fillRect(52, 212, width - 104, 120);
    ctx.strokeStyle = "rgba(91, 70, 122, 0.16)";
    ctx.strokeRect(52, 212, width - 104, 120);
    ctx.fillStyle = "#21172f";
    ctx.font = "800 34px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(mode === "over" ? "Game Over" : "Tiny Flap", width / 2, 258);
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillStyle = "#6d6178";
    ctx.fillText(mode === "over" ? `Score ${score}` : "Start", width / 2, 290);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawOverlay();
  };

  function loop(time) {
    const delta = Math.min(0.032, (time - lastFrame) / 1000);
    lastFrame = time;

    if (mode === "playing") {
      update(delta);
      draw();
      animationId = window.requestAnimationFrame(loop);
    }
  }

  const setMuted = (nextMuted) => {
    muted = nextMuted;

    if (gameSoundButton) {
      gameSoundButton.textContent = muted ? "Sound Off" : "Sound On";
      gameSoundButton.setAttribute("aria-pressed", String(!muted));
    }
  };

  reset();

  return {
    reset,
    start,
    flap,
    stop,
    setMuted,
    isMuted: () => muted,
  };
})();

const mazeGame = (() => {
  if (!mazeCanvas) {
    return null;
  }

  const ctx = mazeCanvas.getContext("2d");
  const width = mazeCanvas.width;
  const height = mazeCanvas.height;
  const baseMap = [
    "#####################",
    "#.........#.........#",
    "#.###.###.#.###.###.#",
    "#o###.###.#.###.###o#",
    "#...................#",
    "#.###.#.#####.#.###.#",
    "#.....#...#...#.....#",
    "#####.###.#.###.#####",
    "#.###.#.#####.#.###.#",
    "#.....#...#...#.....#",
    "#####.###...###.#####",
    "#.........#.........#",
    "#.###.###.#.###.###.#",
    "#o..#...........#..o#",
    "###.#.#.#####.#.#.###",
    "#.....#...#...#.....#",
    "#.#######.#.#######.#",
    "#...................#",
    "#.###.###.#.###.###.#",
    "#.........#.........#",
    "#####################",
  ];
  const rows = baseMap.length;
  const cols = baseMap[0].length;
  const tile = width / cols;
  const directions = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };
  const opposites = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  const angles = {
    right: 0,
    down: Math.PI / 2,
    left: Math.PI,
    up: Math.PI * 1.5,
  };
  const chaserStarts = [
    { row: 10, col: 9, dir: "left", color: "#ff78ad" },
    { row: 10, col: 10, dir: "up", color: "#8fd8ff" },
    { row: 10, col: 11, dir: "right", color: "#b99cff" },
  ];

  let audioContext;
  let animationId;
  let lastFrame = 0;
  let accumulator = 0;
  let score = 0;
  let lives = 3;
  let pellets = 0;
  let frightSteps = 0;
  let muted = false;
  let mode = "idle";
  let maze = [];
  let chasers = [];
  const player = {
    row: 17,
    col: 10,
    dir: "left",
    nextDir: "left",
  };
  const stepDelay = 0.118;

  const updateHud = () => {
    if (mazeScore) {
      mazeScore.textContent = String(score);
    }

    if (mazeLives) {
      mazeLives.textContent = String(lives);
    }
  };

  const ensureAudio = () => {
    if (!audioContext) {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      audioContext = AudioEngine ? new AudioEngine() : null;
    }

    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
  };

  const playTone = (frequency, duration, type = "square", gain = 0.035, endFrequency = frequency) => {
    if (muted) {
      return;
    }

    ensureAudio();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
    volume.gain.setValueAtTime(gain, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  };

  const playPellet = () => playTone(360, 0.045, "square", 0.022, 520);
  const playPower = () => playTone(220, 0.18, "triangle", 0.046, 720);
  const playHit = () => playTone(160, 0.22, "sawtooth", 0.05, 55);
  const playWin = () => {
    playTone(520, 0.08, "sine", 0.04, 700);
    window.setTimeout(() => playTone(760, 0.1, "sine", 0.04, 980), 90);
  };

  const countPellets = () => maze.flat().filter((cell) => cell === "." || cell === "o").length;

  const resetActors = () => {
    player.row = 17;
    player.col = 10;
    player.dir = "left";
    player.nextDir = "left";
    frightSteps = 0;
    chasers = chaserStarts.map((chaser) => ({ ...chaser, startRow: chaser.row, startCol: chaser.col }));
  };

  const reset = () => {
    maze = baseMap.map((row) => row.split(""));
    score = 0;
    lives = 3;
    pellets = countPellets();
    accumulator = 0;
    lastFrame = 0;
    mode = "idle";
    resetActors();
    updateHud();
    draw();
  };

  const isWall = (row, col) => row < 0 || row >= rows || col < 0 || col >= cols || maze[row][col] === "#";

  const canMove = (actor, dir) => {
    const move = directions[dir];

    return move && !isWall(actor.row + move.row, actor.col + move.col);
  };

  const setDirection = (dir) => {
    if (!directions[dir]) {
      return;
    }

    player.nextDir = dir;

    if (mode !== "playing") {
      start();
    }
  };

  const collectPellet = () => {
    const cell = maze[player.row][player.col];

    if (cell !== "." && cell !== "o") {
      return;
    }

    maze[player.row][player.col] = " ";
    pellets -= 1;
    score += cell === "o" ? 25 : 10;

    if (cell === "o") {
      frightSteps = 58;
      playPower();
    } else {
      playPellet();
    }

    updateHud();

    if (pellets <= 0) {
      mode = "won";
      playWin();
      stop();
      draw();
    }
  };

  const distanceToPlayer = (row, col) => {
    const rowDiff = player.row - row;
    const colDiff = player.col - col;

    return Math.hypot(rowDiff, colDiff);
  };

  const moveChaser = (chaser) => {
    let options = Object.keys(directions).filter((dir) => canMove(chaser, dir));

    if (options.length > 1) {
      options = options.filter((dir) => dir !== opposites[chaser.dir]);
    }

    if (options.length === 0) {
      return;
    }

    const randomChoice = options[Math.floor(Math.random() * options.length)];
    const chosen = Math.random() < 0.18
      ? randomChoice
      : options.reduce((best, dir) => {
          const move = directions[dir];
          const scoreForDir = distanceToPlayer(chaser.row + move.row, chaser.col + move.col);
          const bestMove = directions[best];
          const bestScore = distanceToPlayer(chaser.row + bestMove.row, chaser.col + bestMove.col);

          return frightSteps > 0
            ? (scoreForDir > bestScore ? dir : best)
            : (scoreForDir < bestScore ? dir : best);
        }, options[0]);
    const move = directions[chosen];

    chaser.dir = chosen;
    chaser.row += move.row;
    chaser.col += move.col;
  };

  const resetChaser = (chaser) => {
    chaser.row = chaser.startRow;
    chaser.col = chaser.startCol;
    chaser.dir = "up";
  };

  const handleCollision = () => {
    const hit = chasers.find((chaser) => chaser.row === player.row && chaser.col === player.col);

    if (!hit) {
      return;
    }

    if (frightSteps > 0) {
      score += 50;
      resetChaser(hit);
      updateHud();
      playWin();
      return;
    }

    lives -= 1;
    updateHud();
    playHit();

    if (lives <= 0) {
      mode = "over";
      stop();
      draw();
      return;
    }

    resetActors();
  };

  const step = () => {
    if (canMove(player, player.nextDir)) {
      player.dir = player.nextDir;
    }

    if (canMove(player, player.dir)) {
      const move = directions[player.dir];
      player.row += move.row;
      player.col += move.col;
    }

    collectPellet();
    handleCollision();

    if (mode !== "playing") {
      return;
    }

    chasers.forEach(moveChaser);

    if (frightSteps > 0) {
      frightSteps -= 1;
    }

    handleCollision();
  };

  const start = () => {
    if (mode === "playing") {
      return;
    }

    if (mode === "over" || mode === "won") {
      reset();
    }

    ensureAudio();
    mode = "playing";
    lastFrame = performance.now();
    window.cancelAnimationFrame(animationId);
    animationId = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    window.cancelAnimationFrame(animationId);
    animationId = null;
  };

  const drawWalls = () => {
    ctx.fillStyle = "#090711";
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (maze[row][col] !== "#") {
          continue;
        }

        const x = col * tile;
        const y = row * tile;
        ctx.fillStyle = "#3477a2";
        ctx.fillRect(x + 2, y + 2, tile - 4, tile - 4);
        ctx.fillStyle = "rgba(143, 216, 255, 0.38)";
        ctx.fillRect(x + 5, y + 5, tile - 10, 3);
      }
    }
  };

  const drawPellets = () => {
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cell = maze[row][col];

        if (cell !== "." && cell !== "o") {
          continue;
        }

        const x = col * tile + tile / 2;
        const y = row * tile + tile / 2;
        ctx.fillStyle = cell === "o" ? "#ffd7e6" : "#fff7fb";
        ctx.beginPath();
        ctx.arc(x, y, cell === "o" ? 5.5 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawPlayer = () => {
    const x = player.col * tile + tile / 2;
    const y = player.row * tile + tile / 2;
    const mouth = mode === "playing"
      ? 0.22 + Math.abs(Math.sin(performance.now() / 90)) * 0.24
      : 0.28;
    const angle = angles[player.dir] ?? 0;

    ctx.fillStyle = "#ffcf52";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, tile * 0.42, angle + mouth, angle + Math.PI * 2 - mouth);
    ctx.closePath();
    ctx.fill();
  };

  const drawChasers = () => {
    chasers.forEach((chaser) => {
      const x = chaser.col * tile + tile / 2;
      const y = chaser.row * tile + tile / 2;

      ctx.fillStyle = frightSteps > 0 ? "#8fd8ff" : chaser.color;
      ctx.beginPath();
      ctx.arc(x, y - 2, tile * 0.36, Math.PI, 0);
      ctx.lineTo(x + tile * 0.36, y + tile * 0.34);
      ctx.lineTo(x + tile * 0.14, y + tile * 0.22);
      ctx.lineTo(x, y + tile * 0.34);
      ctx.lineTo(x - tile * 0.14, y + tile * 0.22);
      ctx.lineTo(x - tile * 0.36, y + tile * 0.34);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fff7fb";
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawOverlay = () => {
    if (mode === "playing") {
      return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.84)";
    ctx.fillRect(48, 150, width - 96, 120);
    ctx.strokeStyle = "rgba(91, 70, 122, 0.18)";
    ctx.strokeRect(48, 150, width - 96, 120);
    ctx.textAlign = "center";
    ctx.fillStyle = "#21172f";
    ctx.font = "800 31px system-ui, sans-serif";
    ctx.fillText(mode === "won" ? "Maze Clear" : mode === "over" ? "Game Over" : "Pixel Maze", width / 2, 198);
    ctx.fillStyle = "#6d6178";
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.fillText(mode === "idle" ? "Start or choose a direction" : `Score ${score}`, width / 2, 230);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    drawWalls();
    drawPellets();
    drawPlayer();
    drawChasers();
    drawOverlay();
  };

  function loop(time) {
    const delta = Math.min(0.05, (time - lastFrame) / 1000);
    lastFrame = time;
    accumulator += delta;

    while (accumulator >= stepDelay && mode === "playing") {
      step();
      accumulator -= stepDelay;
    }

    draw();

    if (mode === "playing") {
      animationId = window.requestAnimationFrame(loop);
    }
  }

  const setMuted = (nextMuted) => {
    muted = nextMuted;

    if (mazeSoundButton) {
      mazeSoundButton.textContent = muted ? "Sound Off" : "Sound On";
      mazeSoundButton.setAttribute("aria-pressed", String(!muted));
    }
  };

  reset();

  return {
    reset,
    start,
    stop,
    setDirection,
    setMuted,
    isMuted: () => muted,
  };
})();

const openGame = () => {
  if (!gameModal || !flapGame) {
    return;
  }

  mazeGame?.stop();

  if (mazeModal) {
    mazeModal.hidden = true;
  }

  gameModal.hidden = false;
  flapGame.reset();
  gameStartButton?.focus();
};

const closeGame = () => {
  if (!gameModal || !flapGame) {
    return;
  }

  flapGame.stop();
  gameModal.hidden = true;
  gameOpenButton?.focus();
};

const openMaze = () => {
  if (!mazeModal || !mazeGame) {
    return;
  }

  flapGame?.stop();

  if (gameModal) {
    gameModal.hidden = true;
  }

  mazeModal.hidden = false;
  mazeGame.reset();
  mazeStartButton?.focus();
};

const closeMaze = () => {
  if (!mazeModal || !mazeGame) {
    return;
  }

  mazeGame.stop();
  mazeModal.hidden = true;
  mazeOpenButton?.focus();
};

gameOpenButton?.addEventListener("click", openGame);
gameCloseButton?.addEventListener("click", closeGame);
gameStartButton?.addEventListener("click", () => flapGame?.flap());
gameRestartButton?.addEventListener("click", () => {
  flapGame?.reset();
  flapGame?.flap();
});
gameSoundButton?.addEventListener("click", () => {
  if (flapGame) {
    flapGame.setMuted(!flapGame.isMuted());
  }
});
gameCanvas?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  flapGame?.flap();
});
gameModal?.addEventListener("click", (event) => {
  if (event.target === gameModal) {
    closeGame();
  }
});
mazeOpenButton?.addEventListener("click", openMaze);
mazeCloseButton?.addEventListener("click", closeMaze);
mazeStartButton?.addEventListener("click", () => mazeGame?.start());
mazeRestartButton?.addEventListener("click", () => {
  mazeGame?.reset();
  mazeGame?.start();
});
mazeSoundButton?.addEventListener("click", () => {
  if (mazeGame) {
    mazeGame.setMuted(!mazeGame.isMuted());
  }
});
mazeDirectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mazeGame?.setDirection(button.dataset.mazeDir);
  });
});

let mazePointerStart = null;

mazeCanvas?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  mazePointerStart = {
    x: event.clientX,
    y: event.clientY,
  };
  mazeGame?.start();
});

mazeCanvas?.addEventListener("pointerup", (event) => {
  if (!mazePointerStart) {
    return;
  }

  const deltaX = event.clientX - mazePointerStart.x;
  const deltaY = event.clientY - mazePointerStart.y;
  mazePointerStart = null;

  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 14) {
    return;
  }

  mazeGame?.setDirection(
    Math.abs(deltaX) > Math.abs(deltaY)
      ? (deltaX > 0 ? "right" : "left")
      : (deltaY > 0 ? "down" : "up"),
  );
});
mazeModal?.addEventListener("click", (event) => {
  if (event.target === mazeModal) {
    closeMaze();
  }
});

window.addEventListener("keydown", (event) => {
  if (gameModal?.hidden === false && event.key === "Escape") {
    closeGame();
  }

  if (gameModal?.hidden === false && (event.code === "Space" || event.key === "ArrowUp")) {
    event.preventDefault();
    flapGame?.flap();
  }

  if (mazeModal?.hidden === false && event.key === "Escape") {
    closeMaze();
  }

  if (mazeModal?.hidden === false) {
    const directionByKey = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const direction = directionByKey[event.key];

    if (direction) {
      event.preventDefault();
      mazeGame?.setDirection(direction);
    }
  }
});

window.addEventListener("hashchange", () => {
  const tabName = window.location.hash.replace("#", "");

  if (validTabs.has(tabName)) {
    showTab(tabName);
  }
});

window.addEventListener("load", () => {
  if (validTabs.has(initialTab)) {
    showTab(initialTab);
  }

  animateFavicon();
  updateBirthdayCountdown();
  window.setInterval(updateBirthdayCountdown, 1000);

  window.setTimeout(() => {
    document.body.classList.add("is-ready");
    loader?.classList.add("is-hidden");
  }, 850);
});
