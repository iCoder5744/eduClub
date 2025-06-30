


// Global Variables
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
    overallProgress: 75,
    coursesCompleted: 12,
    badgesEarned: 3,
    quizScores: []
};

// Sample courses data
const coursesData = [
    {
        id: 1,
        title: "Advanced Calculus",
        category: "math",
        description: "Master derivatives, integrals, and advanced mathematical concepts",
        price: "$79",
        icon: "∫",
        level: "Advanced"
    },
    {
        id: 2,
        title: "Quantum Physics",
        category: "science",
        description: "Explore the fascinating world of quantum mechanics and particle physics",
        price: "$89",
        icon: "⚛️",
        level: "Expert"
    },
    {
        id: 3,
        title: "Python Programming",
        category: "programming",
        description: "Learn Python from basics to advanced web development",
        price: "$69",
        icon: "🐍",
        level: "Beginner"
    },
    {
        id: 4,
        title: "Spanish Mastery",
        category: "languages",
        description: "Become fluent in Spanish with interactive lessons and practice",
        price: "$59",
        icon: "🇪🇸",
        level: "Intermediate"
    },
    {
        id: 5,
        title: "Data Structures",
        category: "programming",
        description: "Master algorithms and data structures for coding interviews",
        price: "$79",
        icon: "🌳",
        level: "Intermediate"
    },
    {
        id: 6,
        title: "Organic Chemistry",
        category: "science",
        description: "Understand molecular structures and chemical reactions",
        price: "$75",
        icon: "🧪",
        level: "Advanced"
    },
    {
        id: 7,
        title: "Linear Algebra",
        category: "math",
        description: "Vectors, matrices, and their applications in modern mathematics",
        price: "$65",
        icon: "📐",
        level: "Intermediate"
    },
    {
        id: 8,
        title: "French Literature",
        category: "languages",
        description: "Explore classic and modern French literary works",
        price: "$55",
        icon: "📚",
        level: "Advanced"
    }
];

// Sample quiz questions
const quizQuestions = [
    {
        question: "What is the derivative of x²?",
        options: ["2x", "x²", "2", "x"],
        correct: 0
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
        correct: 3
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Silver", "Iron"],
        correct: 1
    },
    {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct: 1
    }
];

let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// DOM Content Loaded
    initializeApp();
    loadFlashcards();
    renderCourses();
    updateProgressDisplay();
    setupEventListeners();

// Initialize Application
function initializeApp() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .tool-card, .course-card, .progress-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchCourses();
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
    });
}

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
        // Basic expression evaluation with step-by-step breakdown
        const result = Function('"use strict"; return (' + expression + ')')();

        // Show steps
        stepsDiv.innerHTML = `
        <div style="background: var(--gray-50); padding: 15px; border-radius: 8px; margin-top: 10px;">
            <strong>Solution Steps:</strong><br>
                Expression: ${expression}<br>
                    Result: ${result}
                </div>
                `;

        display.value = result;

        // Save calculation to progress
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

    // Keep only last 10 calculations
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

        // Show success message
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
                <div class="flashcard" onclick="flipCard(this)">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <p>${card.front}</p>
                        </div>
                        <div class="flashcard-back">
                            <p>${card.back}</p>
                        </div>
                    </div>
                    <button class="btn" onclick="event.stopPropagation(); deleteFlashcard(${card.id})"
                        style="margin-top: 10px; background: #ef4444; color: white; padding: 5px 10px; font-size: 0.8rem;">
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
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Select current option
    optionElement.classList.add('selected');
    optionElement.dataset.selectedIndex = index;

    // Show submit button
    document.getElementById('submitBtn').style.display = 'inline-block';
}

function submitAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) return;

    const selectedIndex = parseInt(selectedOption.dataset.selectedIndex);
    const correctIndex = currentQuiz[currentQuestionIndex].correct;

    // Show correct/incorrect answers
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

    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        renderQuizQuestion();
    }, 1500);
}

function showQuizResults() {
    const container = document.getElementById('quizContainer');
    const percentage = Math.round((quizScore / currentQuiz.length) * 100);

    // Save quiz score
    userProgress.quizScores.push({
        score: quizScore,
        total: currentQuiz.length,
        percentage: percentage,
        date: new Date().toISOString()
    });

    // Update overall progress
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

// Course Functions
// Render on initial load
renderCourses();

// Filter button logic
function renderCourses(filter = 'all') {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    const filteredCourses = filter === 'all' ?
        coursesData :
        coursesData.filter(course => course.category === filter);

    container.innerHTML = filteredCourses.map(course => `
        <div class="course-card" data-category="${course.category}">
            <div class="course-image">
                ${course.icon}
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-footer">
                    <span class="course-price">${course.price}</span>
                    <button class="btn btn-primary">Enroll</button>
                </div>
            </div>
        </div>
    `).join('');
    }

function filterCourses(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Render filtered courses
    renderCourses(category);
}

function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
        showNotification(`Enrolled in ${course.title}!`, 'success');

        // Update user progress
        userProgress.coursesCompleted++;
        userProgress.overallProgress = Math.min(100, userProgress.overallProgress + 5);
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        updateProgressDisplay();
    }
}

function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!searchTerm) {
        renderCourses();
        return;
    }

    const filteredCourses = coursesData.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('coursesGrid');

    if (filteredCourses.length === 0) {
        container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <h3>No courses found</h3>
                        <p>Try searching with different keywords</p>
                    </div>
                `;
    } else {
        container.innerHTML = filteredCourses.map(course => `
                    <div class="course-card" data-category="${course.category}">
                        <div class="course-image">
                            ${course.icon}
                        </div>
                        <div class="course-content">
                            <span class="course-category">${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</span>
                            <h3 class="course-title">${course.title}</h3>
                            <p class="course-description">${course.description}</p>
                            <div class="course-footer">
                                <span class="course-price">${course.price}</span>
                                <button class="btn btn-primary" onclick="enrollCourse(${course.id})">Enroll</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }
}

// Progress Functions
function updateProgressDisplay() {
    // Update overall progress circle
    const overallCircle = document.getElementById('overallProgress');
    const overallText = overallCircle.querySelector('.progress-text');
    const overallPercentage = userProgress.overallProgress;

    overallText.textContent = `${overallPercentage}%`;
    overallCircle.style.background = `conic-gradient(var(--accent-green) ${overallPercentage * 3.6}deg, var(--gray-200) 0deg)`;

    // Update courses completed
    const coursesCircle = document.getElementById('coursesProgress');
    const coursesText = coursesCircle.querySelector('.progress-text');
    coursesText.textContent = userProgress.coursesCompleted;

    // Update badges
    const badgesContainer = document.getElementById('badgesContainer');
    const totalBadges = 5;
    const earnedBadges = Math.min(userProgress.badgesEarned, totalBadges);

    badgesContainer.innerHTML = '';
    const badgeIcons = ['🏆', '⭐', '🎯', '🚀', '💎'];

    for (let i = 0; i < totalBadges; i++) {
        const badge = document.createElement('div');
        badge.className = i < earnedBadges ? 'badge' : 'badge locked';
        badge.textContent = i < earnedBadges ? badgeIcons[i] : '🔒';
        badgesContainer.appendChild(badge);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'var(--accent-green)' :
            type === 'error' ? '#ef4444' : 'var(--primary-blue)'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation keyframes if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
                @keyframes slideInRight {
                    from {transform: translateX(100%); opacity: 0; }
                to {transform: translateX(0); opacity: 1; }
                    }
                @keyframes slideOutRight {
                    from {transform: translateX(0); opacity: 1; }
                to {transform: translateX(100%); opacity: 0; }
                    }
                `;
        document.head.appendChild(style);
    }

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize everything when page loads
window.addEventListener('load', function () {
    // Add loading animation completion
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to EduPlatform! Start your learning journey today.', 'success');
    }, 1000);
});

