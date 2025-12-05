let currentWord = '';
let currentGuess = '';
let currentRow = 0;
let gameOver = false;
let gameWon = false;

const words = [
    'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
    'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
    'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
    'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID',
    'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN',
    'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK',
    'BLOOD', 'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK',
    'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE',
    'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE',
    'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS',
    'DEATH'
];

function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    console.log('Current word:', currentWord);
    createGameBoard();
    createKeyboard();
    loadStats();
}

function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        row.id = `row-${i}`;

        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            box.id = `box-${i}-${j}`;
            row.appendChild(box);
        }

        gameBoard.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ОРУУЛАХ', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'УСТГАХ']
    ];

    keyboard.innerHTML = '';

    rows.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';

        row.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.className = key.length > 1 ? 'key wide' : 'key letter';
            keyElement.textContent = key === 'УСТГАХ' ? '⌫' : key === 'ОРУУЛАХ' ? 'ENTER' : key;
            keyElement.id = `key-${key}`;
            keyElement.addEventListener('click', () => handleKeyPress(key === 'ОРУУЛАХ' ? 'ENTER' : key === 'УСТГАХ' ? 'BACKSPACE' : key));
            keyboardRow.appendChild(keyElement);
        });

        keyboard.appendChild(keyboardRow);
    });
}

function handleKeyPress(key) {
    if (gameOver) return;

    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key.length === 1 && currentGuess.length < 5) {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentGuess.length < 5) {
        currentGuess += letter;
        updateDisplay();
    }
}

function deleteLetter() {
    currentGuess = currentGuess.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    const row = document.getElementById(`row-${currentRow}`);
    const boxes = row.children;

    for (let i = 0; i < 5; i++) {
        const box = boxes[i];
        if (i < currentGuess.length) {
            box.textContent = currentGuess[i];
            box.classList.add('filled');
        } else {
            box.textContent = '';
            box.classList.remove('filled');
        }
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) {
        showMessage('Үсэг хүрэлцэхгүй байна');
        return;
    }

    if (!words.includes(currentGuess)) {
        showMessage('Үгийн жагсаалтад байхгүй');
        return;
    }

    checkGuess();
    currentGuess = '';
    currentRow++;

    if (gameWon) {
        showMessage('Баяр хүргэе!');
        endGame(true);
    } else if (currentRow >= 6) {
        showMessage(`Үг нь ${currentWord} байсан`);
        endGame(false);
    }
}

function checkGuess() {
    const row = document.getElementById(`row-${currentRow}`);
    const boxes = row.children;
    const wordArray = currentWord.split('');
    const guessArray = currentGuess.split('');
    const result = [];

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === wordArray[i]) {
            result[i] = 'correct';
            wordArray[i] = null;
            guessArray[i] = null;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] && wordArray.includes(guessArray[i])) {
            result[i] = 'present';
            wordArray[wordArray.indexOf(guessArray[i])] = null;
        } else if (guessArray[i]) {
            result[i] = 'absent';
        }
    }

    let allCorrect = true;
    for (let i = 0; i < 5; i++) {
        const box = boxes[i];
        const key = document.getElementById(`key-${currentGuess[i]}`);
        
        box.classList.add(result[i]);
        
        if (result[i] === 'correct') {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        } else if (result[i] === 'present' && !key.classList.contains('correct')) {
            key.classList.remove('absent');
            key.classList.add('present');
        } else if (result[i] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.classList.add('absent');
        }

        if (result[i] !== 'correct') {
            allCorrect = false;
        }
    }

    if (allCorrect) {
        gameWon = true;
    }
}

function showMessage(text) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

function endGame(won) {
    gameOver = true;
    updateStats(won);
    setTimeout(() => {
        showStats();
    }, 2000);
}

function restartGame() {
    currentWord = '';
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;

    currentWord = words[Math.floor(Math.random() * words.length)];
    console.log("New Word:", currentWord);

    createGameBoard();
    createKeyboard();
    closeStats();
    loadStats();
}

function showStats() {
    document.getElementById('statsModal').style.display = 'flex';
}

function closeStats() {
    document.getElementById('statsModal').style.display = 'none';
}

function showHelp() {
    alert(""+
        "Үгийн тоглоомын дүрэм:\n\n" +
        "1. 5 үсэгтэй үгийг 6 оролдлогоор таа.\n" +
        "2. Таамаглал бүрийн дараа хавтангийн өнгө өөрчлөгдөж таны таамаглал үгтэй хэр ойр байсныг харуулна:\n" +
        "   - Ногоон: Үсэг зөв байрлалд байна.\n" +
        "   - Шар: Үсэг үгэнд байгаа боловч буруу байрлалд байна.\n" +
        "   - Саарал: Үсэг үгэнд байхгүй.\n\n" +
        "Амжилт хүсье!"
    );
}

function loadStats() {
    const stats = JSON.parse(localStorage.getItem('wordleStats')) || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0
    };

    document.getElementById('gamesPlayed').textContent = stats.gamesPlayed;
    document.getElementById('winPercentage').textContent = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    document.getElementById('maxStreak').textContent = stats.maxStreak;
}

function updateStats(won) {
    const stats = JSON.parse(localStorage.getItem('wordleStats')) || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0
    };

    stats.gamesPlayed++;
    if (won) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }

    localStorage.setItem('wordleStats', JSON.stringify(stats));
    loadStats();
}

function goBack() {
    window.history.back();
}

function loadPage(url) {
    if (window.parent && window.parent.loadPage) {
        window.parent.loadPage(url);
    } else {
        window.location.href = url;
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
        handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
    } else if (key.match(/[A-Z]/) && key.length === 1) {
        handleKeyPress(key);
    }
});

initGame();