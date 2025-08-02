// DOM Elements
const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const timerDisplay = document.querySelector('.timer-display');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');

// Category buttons
const scienceCatogeryBtn = document.querySelector('.science-cat');
const mathsCatogeryBtn = document.querySelector('.maths-cat');
const englishCatogeryBtn = document.querySelector('.english-cat');
const generalCatogeryBtn = document.querySelector('.general-cat');
const physicsCatogeryBtn = document.querySelector('.physics-cat');
const computerCatogeryBtn = document.querySelector('.computer-cat');
const rapidCatogeryBtn = document.querySelector('.rapid-cat');

// Quiz configuration
const noOfQuestions = 5;
let questions = {};
let quizQuestions = [];
let selectedCategory = '';
let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let timer;
let timeLeft = 60;

// Initialize the quiz
async function initQuiz() {
    await loadQuestions();
    setupEventListeners();
}

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('../scripts/questions.json');
        if (!response.ok) throw new Error('Failed to load questions');
        questions = await response.json();
        console.log('Questions loaded successfully');
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to default questions
        questions = {
            science: [
                {
                    "question": "What is the chemical symbol for water?",
                    "answer": "H2O",
                    "options": ["O2", "H2O", "CO2", "HO2"]
                },
                {
                    "question": "What planet is closest to the sun?",
                    "answer": "Mercury",
                    "options": ["Venus", "Mercury", "Earth", "Mars"]
                }
            ],
            random: [] // Add other categories as needed
        };
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Button click handlers
    startBtn.onclick = () => {
        popupInfo.classList.add('active');
        main.classList.add('active');
    };

    exitBtn.onclick = () => {
        popupInfo.classList.remove('active');
        main.classList.remove('active');
    };

    continueBtn.onclick = () => {
        if (!selectedCategory) return;
        quizSection.classList.add('active');
        popupInfo.classList.remove('active');
        main.classList.remove('active');
        quizBox.classList.add('active');
        startQuiz();
    };

    tryAgainBtn.onclick = resetQuiz;
    goHomeBtn.onclick = goToHome;

    // Category selection handlers
    scienceCatogeryBtn.onclick = () => selectCategory('science', scienceCatogeryBtn);
    mathsCatogeryBtn.onclick = () => selectCategory('maths', mathsCatogeryBtn);
    englishCatogeryBtn.onclick = () => selectCategory('english', englishCatogeryBtn);
    generalCatogeryBtn.onclick = () => selectCategory('general', generalCatogeryBtn);
    physicsCatogeryBtn.onclick = () => selectCategory('physics', physicsCatogeryBtn);
    computerCatogeryBtn.onclick = () => selectCategory('computer', computerCatogeryBtn);
    rapidCatogeryBtn.onclick = () => {
        clearCatogeryActiveBtn();
        rapidCatogeryBtn.classList.add('rapid-active');
        continueBtn.classList.add('rapid-active', 'active');
        selectedCategory = 'random';
        updateCategoryDisplay();
    };

    nextBtn.onclick = nextQuestion;
}

// Category selection function
function selectCategory(category, button) {
    clearCatogeryActiveBtn();
    button.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = category;
    updateCategoryDisplay();
}

// Clear active category buttons
function clearCatogeryActiveBtn() {
    const activeButtons = [
        scienceCatogeryBtn,
        mathsCatogeryBtn,
        englishCatogeryBtn,
        generalCatogeryBtn,
        physicsCatogeryBtn,
        computerCatogeryBtn,
        rapidCatogeryBtn
    ];

    activeButtons.forEach(btn => {
        btn.classList.remove('active', 'rapid-active');
    });
    continueBtn.classList.remove('active', 'rapid-active');
}

// Update category display
function updateCategoryDisplay() {
    const categoryDisplay = document.querySelector('.quiz-category');
    if (selectedCategory) {
        const displayText = selectedCategory === 'random' ? 'Random Quiz' :
            selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        categoryDisplay.textContent = displayText;
    }
}

// Start the quiz
function startQuiz() {
    quizQuestions = getRandomQuestions(selectedCategory);
    if (quizQuestions.length === 0) {
        console.error('No questions available for selected category');
        return;
    }

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    showQuestions(questionCount);
    questionCounter(questionNumb);
    headerScore();
}

// Get random questions for the selected category
function getRandomQuestions(category) {
    if (category === 'random') {
        // Combine all categories for random quiz
        const allCategories = Object.values(questions).flat();
        return shuffleArray(allCategories).slice(0, noOfQuestions);
    }

    const categoryQuestions = questions[category] || [];
    return shuffleArray(categoryQuestions).slice(0, noOfQuestions);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Display questions
function showQuestions(index) {
    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('No questions available');
        return;
    }

    startTimer();

    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${index + 1}. ${quizQuestions[index].question}`;

    optionList.innerHTML = quizQuestions[index].options
        .map(option => `<div class="option"><span>${option}</span></div>`)
        .join('');

    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', function () {
            clearInterval(timer);
            optionSelected(this, index);
        });
    });
}

// Handle option selection
function optionSelected(answer, index) {
    const userAnswer = answer.textContent;
    const correctAnswer = quizQuestions[index].answer;
    const allOptions = optionList.children;

    if (userAnswer === correctAnswer) {
        answer.classList.add('correct');
        userScore++;
        headerScore();
    } else {
        answer.classList.add('incorrect');
        // Highlight correct answer
        Array.from(allOptions).find(opt =>
            opt.textContent === correctAnswer
        ).classList.add('correct');
    }

    // Disable all options after selection
    Array.from(allOptions).forEach(opt => opt.classList.add('disable'));
    nextBtn.classList.add('active');
}

// Timer functions
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (!timerDisplay) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Visual feedback when time is running low
    timerDisplay.style.color = timeLeft <= 10 ? 'red' : 'white';
    timerDisplay.style.animation = timeLeft <= 10 ? 'pulse 0.5s infinite alternate' : 'none';
}

function timeUp() {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.add('disable'));

    // Highlight correct answer
    const correctAnswer = quizQuestions[questionCount].answer;
    Array.from(options).find(opt =>
        opt.textContent === correctAnswer
    ).classList.add('correct');

    nextBtn.classList.add('active');
}

// Navigation functions
function nextQuestion() {
    clearInterval(timer);

    if (questionCount < quizQuestions.length - 1) {
        questionCount++;
        questionNumb++;
        showQuestions(questionCount);
        questionCounter(questionNumb);
        nextBtn.classList.remove('active');
    } else {
        showResultBox();
    }
}

function resetQuiz() {
    clearInterval(timer);
    quizBox.classList.add('active');
    resultBox.classList.remove('active');
    nextBtn.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    quizQuestions = getRandomQuestions(selectedCategory);
    showQuestions(questionCount);
    questionCounter(questionNumb);
    headerScore();
}

function goToHome() {
    clearInterval(timer);
    quizSection.classList.remove('active');
    resultBox.classList.remove('active');
    nextBtn.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    selectedCategory = '';
}

// Update UI functions
function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${quizQuestions.length} Questions`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${quizQuestions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Score ${userScore} out of ${quizQuestions.length}`;

    animateProgressCircle();
}

function animateProgressCircle() {
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    const progressEndValue = (userScore / quizQuestions.length) * 100;
    const speed = 10;

    const progress = setInterval(() => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background =
            `conic-gradient(#2ba0ee ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`;

        if (progressStartValue >= progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);