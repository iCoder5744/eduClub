// Calculator Functions
function appendToCalc(value) {
    const display = document.getElementById('calcDisplay');
    if (display.value === '0' || display.value === 'Error') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearCalc() {
    document.getElementById('calcDisplay').value = '0';
    document.getElementById('calcSteps').innerHTML = '';
}

function deleteLast() {
    const display = document.getElementById('calcDisplay');
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculateResult() {
    const display = document.getElementById('calcDisplay');
    const stepsDiv = document.getElementById('calcSteps');
    const expression = display.value.replace(/×/g, '*');

    try {
        const result = Function('"use strict"; return (' + expression + ')')();

        // 

        display.value = result;
        saveCalculation(expression, result);

    } catch (error) {
        display.value = 'Error';
        stepsDiv.innerHTML = '<div style="color: red; margin-top: 10px;">Invalid expression</div>';
    }
}

function saveCalculation(expression, result) {
    let calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    calculations.push({
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    });

    if (calculations.length > 10) {
        calculations = calculations.slice(-10);
    }

    localStorage.setItem('calculations', JSON.stringify(calculations));
}

// Flashcard Functions
function addFlashcard() {
    const frontInput = document.getElementById('flashcardFront');
    const backInput = document.getElementById('flashcardBack');

    const front = frontInput.value.trim();
    const back = backInput.value.trim();

    if (front && back) {
        const flashcard = {
            id: Date.now(),
            front: front,
            back: back,
            created: new Date().toISOString()
        };

        flashcards.push(flashcard);
        localStorage.setItem('flashcards', JSON.stringify(flashcards));

        frontInput.value = '';
        backInput.value = '';

        renderFlashcards();
        showNotification('Flashcard added successfully!', 'success');
    } else {
        showNotification('Please fill in both sides of the flashcard', 'error');
    }
}

function renderFlashcards() {
    const container = document.getElementById('flashcardContainer');

    if (flashcards.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); margin: 20px 0;">No flashcards yet. Create your first one above!</p>';
        return;
    }

    container.innerHTML = flashcards.map(card => `
        <div class="flashcard grid" onclick="flipCard(this)">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <p>${card.front}</p>
                </div>
                <div class="flashcard-back">
                    <p>${card.back}</p>
                </div>
            </div>
            <button class="btn" onclick="event.stopPropagation(); deleteFlashcard(${card.id})"
                style="top: 0; right: 0; background: #ef4444; color: white; padding: 5px 10px; font-size: 0.8rem; position: absolute;">
                Delete
            </button>
        </div>
    `).join('');
}

function flipCard(cardElement) {
    cardElement.classList.toggle('flipped');
}

function deleteFlashcard(id) {
    flashcards = flashcards.filter(card => card.id !== id);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    renderFlashcards();
    showNotification('Flashcard deleted', 'info');
}

function clearFlashcards() {
    if (confirm('Are you sure you want to delete all flashcards?')) {
        flashcards = [];
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        renderFlashcards();
        showNotification('All flashcards cleared', 'info');
    }
}

function loadFlashcards() {
    renderFlashcards();
}

// Quiz Functions
let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz() {
    currentQuiz = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    currentQuestionIndex = 0;
    quizScore = 0;

    renderQuizQuestion();
}

function renderQuizQuestion() {
    const container = document.getElementById('quizContainer');
    const question = currentQuiz[currentQuestionIndex];

    if (!question) {
        showQuizResults();
        return;
    }

    container.innerHTML = `
        <div class="question">
            <h4>Question ${currentQuestionIndex + 1} of ${currentQuiz.length}</h4>
            <p style="font-size: 1.1rem; margin-bottom: 15px;">${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectOption(this, ${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary mt-2" onclick="submitAnswer()" style="display: none;" id="submitBtn">
                Next Question
            </button>
        </div>
    `;
}

function selectOption(optionElement, index) {
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });

    optionElement.classList.add('selected');
    optionElement.dataset.selectedIndex = index;

    document.getElementById('submitBtn').style.display = 'inline-block';
}

function submitAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) return;

    const selectedIndex = parseInt(selectedOption.dataset.selectedIndex);
    const correctIndex = currentQuiz[currentQuestionIndex].correct;

    document.querySelectorAll('.option').forEach((opt, index) => {
        if (index === correctIndex) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });

    if (selectedIndex === correctIndex) {
        quizScore++;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        renderQuizQuestion();
    }, 1500);
}

function showQuizResults() {
    const container = document.getElementById('quizContainer');
    const percentage = Math.round((quizScore / currentQuiz.length) * 100);

    userProgress.quizScores.push({
        score: quizScore,
        total: currentQuiz.length,
        percentage: percentage,
        date: new Date().toISOString()
    });

    if (percentage > 70) {
        userProgress.overallProgress = Math.min(100, userProgress.overallProgress + 2);
    }

    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressDisplay();

    container.innerHTML = `
        <div class="text-center">
            <div class="quiz-score">${quizScore} / ${currentQuiz.length}</div>
            <h3>Quiz Complete!</h3>
            <p>You scored ${percentage}%</p>
            <div style="margin: 20px 0;">
                ${percentage >= 80 ? '🎉 Excellent work!' :
                percentage >= 60 ? '👍 Good job!' :
                '💪 Keep practicing!'}
            </div>
            <button class="btn btn-primary green-btn" onclick="startQuiz()">Try Again</button>
            <button class="btn btn-secondary blue-btn mt-2" onclick="resetQuiz()">Back to Tools</button>
        </div>
    `;
}

function resetQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '<button class="btn btn-primary" onclick="startQuiz()">Start New Quiz</button>';
}
