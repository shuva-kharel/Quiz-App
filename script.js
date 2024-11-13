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

const noOfQuestions = 10;

// catogery buttons
const scienceCatogeryBtn = document.querySelector('.science-cat');
const mathsCatogeryBtn = document.querySelector('.maths-cat');
const englishCatogeryBtn = document.querySelector('.english-cat');
const generalCatogeryBtn = document.querySelector('.general-cat');
const physicsCatogeryBtn = document.querySelector('.physics-cat');
const computerCatogeryBtn = document.querySelector('.computer-cat');
const rapidCatogeryBtn = document.querySelector('.rapid-cat');

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    startQuiz();
    questionCounter(1);
    headerScore();
}

tryAgainBtn.onclick = () => {
    window.requestAnimationFrame(() => {
        clearCatogeryActiveBtn();
        quizBox.classList.add('active');
        nextBtn.classList.remove('active');
        resultBox.classList.remove('active');
        
        // Reset variables
        questionCount = 0;
        questionNumb = 1;
        userScore = 0;

        // Reset options and clear previous question content
        optionList.innerHTML = '';

        // Generate the new set of questions for the selected category
        quizQuestions = getRandomQuestions(selectedCategory);
        
        // Display first question
        showQuestions(questionCount, quizQuestions);  
        questionCounter(questionNumb);
        headerScore();
    });
};

goHomeBtn.onclick = () => {
    selectedCategory = '';  // Clear selected category, allowing the user to select a new one
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    // Reset quiz (you might want to trigger category selection again)
    // showCategorySelection();  // Optionally, show category selection screen
}

let selectedCategory = '';

// Catogery Buttons
scienceCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    scienceCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'science';
}

mathsCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    mathsCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'maths';
}

englishCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    englishCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'english';
}

generalCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    generalCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'general';
}

physicsCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    physicsCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'physics';
}

computerCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    computerCatogeryBtn.classList.add('active');
    continueBtn.classList.add('active');
    selectedCategory = 'computer';
}

rapidCatogeryBtn.onclick = () =>{
    clearCatogeryActiveBtn();
    rapidCatogeryBtn.classList.add('rapid-active');
    continueBtn.classList.add('rapid-active');
    selectedCategory = 'rapid';
}

function clearCatogeryActiveBtn(){
    scienceCatogeryBtn.classList.remove('active');
    mathsCatogeryBtn.classList.remove('active');
    englishCatogeryBtn.classList.remove('active');
    generalCatogeryBtn.classList.remove('active');
    physicsCatogeryBtn.classList.remove('active');
    computerCatogeryBtn.classList.remove('active');
    rapidCatogeryBtn.classList.remove('rapid-active');
    continueBtn.classList.remove('rapid-active');
}


let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

const nextBtn = document.querySelector('.next-btn');

nextBtn.onclick = () => {
    if (questionCount < quizQuestions.length - 1) {
        questionCount++;
        showQuestions(questionCount, quizQuestions);  // Display the next question
        questionNumb++;  // Increment the question number
        questionCounter(questionNumb);  // Update the question counter
        nextBtn.classList.remove('active');  // Hide the "Next" button until a question is answered
    } else {
        nextBtn.classList.remove('active');
        showResultBox();  // Show the results when all questions are answered
    }
}


const optionList = document.querySelector('.option-list');

function showQuestions(index, quizQuestions) {
    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('Quiz questions are undefined or empty.');
        return;
    }

    console.log(`Showing question ${index + 1} out of ${quizQuestions.length}`);

    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${index + 1}. ${quizQuestions[index].question}`;

    let optionTag = '';
    quizQuestions[index].options.forEach(option => {
        optionTag += `<div class="option"><span>${option}</span></div>`;
    });

    optionList.innerHTML = optionTag;  // Update only the options, minimizing DOM operations

    const option = document.querySelectorAll('.option');
    option.forEach(opt => {
        opt.addEventListener('click', function () {
            optionSelected(this, quizQuestions, index);
        });
    });
}

function optionSelected(answer, quizQuestions, index) {
    let userAnswer = answer.textContent;
    let correctAnswer = quizQuestions[index].answer;  // Use the passed quizQuestions and index
    let allOptions = optionList.children.length;

    if(userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');
        for(let i = 0; i < allOptions; i++) {
            if(optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }

    for(let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disable');
    }

    nextBtn.classList.add('active');
}

function getRandomQuestions(category) {
    const allQuestions = questions[category];
    const selectedQuestions = [];

    if (!allQuestions || allQuestions.length === 0) {
        console.error(`No questions found for category: ${category}`);
        return [];  // Return an empty array if no questions are found
    }

    const numberOfQuestions = Math.min(noOfQuestions, allQuestions.length);  // Limit to 5 questions
    while (selectedQuestions.length < numberOfQuestions) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const question = allQuestions[randomIndex];
        if (!selectedQuestions.includes(question)) {
            selectedQuestions.push(question);
        }
    }

    return selectedQuestions;
}

let quizQuestions = [];  // Define quizQuestions globally

function startQuiz() {
    quizQuestions = getRandomQuestions(selectedCategory);  // Assign random questions when starting the quiz
    showQuestions(0, quizQuestions);  // Show the first question
    questionCounter(1);  // Start with question 1
    headerScore();  // Update the score header
}

function questionCounter(index){
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${quizQuestions.length} Questions`;  // Correct
}

function headerScore(){
    const headerScoreText = document.querySelector('.header-score');
    // Use quizQuestions.length to get the total number of questions
    headerScoreText.textContent = `Score: ${userScore} / ${quizQuestions.length}`;
}

function showResultBox(){
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Score ${userScore} out of ${quizQuestions.length}`;  // Use quizQuestions.length instead of questions.length

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = (userScore / quizQuestions.length) * 100;  // Use quizQuestions.length instead of questions.length
    let speed = 10;

    let progress = setInterval(() => {
        progressStartValue++;
        
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#2ba0ee ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`;
        
        if(progressStartValue == progressEndValue){
            clearInterval(progress);
        }
    }, speed);
}