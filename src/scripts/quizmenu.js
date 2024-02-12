//Stevan's Trivia Game - hosted on https://seng513a2.pages.dev
//Stevan Beljic - SENG 513 Assignment 2

/* 
*   Quiz class
*   Used for executing the game
*/

const MAX_QUESTIONS = 10;

class Quiz {

    //class fields
    score = 0;
    attempts = 0;
    quizQuestions;
    gotCorrect = false;
    diffIndex = 0;
    num_answered = 0;
    difficulties = ['easy', 'medium', 'hard'];

    //method used to format questions properly into Question objects
    formatQuestion(obj) {
        return new Question(obj.question, obj.correct_answer, obj.incorrect_answers[0], obj.incorrect_answers[1], obj.incorrect_answers[2], obj.difficulty);
    }

    //increments attempts properly, ensuring the index does not go over the length of the array
    incrementAttempts(){
        this.attempts++;
        if(this.attempts >= this.quizQuestions.length){
            this.attempts = 0;
        }
    }

    /*
    *   Question generator method
    *   Pulls a question and checks if its of the desired difficulty, if not, it will pull a new question. It will do this
    *   until a valid question is found, and it will then yield it.
    */
    *questionGenerator(){
        while(true){
            let tempQuestion = this.quizQuestions[this.attempts];
            if(this.gotCorrect === true){
                if(tempQuestion.difficulty !== this.difficulties[this.diffIndex]){
                    this.incrementAttempts();
                    continue;
                }
                yield tempQuestion;
                this.incrementAttempts();
            } else {
                if(tempQuestion.difficulty !== this.difficulties[this.diffIndex]){
                    this.incrementAttempts();
                    continue;
                }
                yield tempQuestion;
                this.incrementAttempts();
            }
        } 
    }

    /*
    *   Method to fetch the quiz questions from the Open Trivia DB
    */
    async fetchQuiz() {

        //currently fetching geography questions
        await fetch('https://opentdb.com/api.php?amount=50&category=22&type=multiple')
            .then(response => response.json())
            .then(data => {
                const questions = [];
                data.results.forEach(obj => {
                    questions.push(this.formatQuestion(obj));
                });
                
                this.quizQuestions = questions;
            })
            .catch(error => {
                throw "Error connecting to database";
            }); //notify user of failure to obtain quiz
    }
    
}

/*
*   Question class
*   Contains question info, such as text, correct answer, incorrect answers, and difficulty
*/
class Question{

    questionText = "";
    correctOption = "";
    incorrect1 = "";
    incorrect2 = "";
    incorrect3 = "";
    difficulty = "";

    constructor(qt, c, i1, i2, i3, diff) {
        this.questionText = qt;
        this.correctOption = c;
        this.incorrect1 = i1;
        this.incorrect2 = i2;
        this.incorrect3 = i3;
        this.difficulty = diff;
    }

    get questionOptions() {
        const options = [this.correctOption, this.incorrect1, this.incorrect2, this.incorrect3];
    }

    get questionText() {
        return questionText;
    }

    get getCorrectAnswer(){
        return this.correctOption;
    }

}

/*
*   User class
*   Can be expanded to contain further user info. Currently only keeps track of the user's name.
*/
class User {

    username = "";

    constructor(usernameIn) {
        this.username = usernameIn;
    }

    get getUsername() {
        return this.username;
    }
}

/*
*   Function: init
*   Called onload of body element. Sets scorecard and options to invisible as to only display initial welcome message. Reads the users
*   name from local storage and displays it in a welcome message.
*/
function init(){
    const tmp = localStorage.getItem('User');
    const user = JSON.parse(tmp);
    const tmpName = user.username;
    document.getElementById('welcomemessage').innerHTML = 'Welcome, '+tmpName;

    const scoreCard = document.getElementById('scorecard');
    scoreCard.style.display = "none";
    
    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "none";
}

/*
*   function: displayQuestion
*   Must be called using the .call() function
*   Displays the question text and its answers randomly across the four buttons 
*/
function displayQuestion(){
    document.getElementById('question').innerHTML = this.questionText;
    const occupiedSpaces = [];
    //Uncomment this to see the difficulty of each question displayed
    //console.log("Question difficulty: "+this.difficulty);
    
    let placement = Math.floor((Math.random() * 4) + 1);
    document.getElementById('option'+placement).innerHTML = this.correctOption;
    occupiedSpaces.push(placement);

    for(let x = 1; x <= 3; x++){
        while (occupiedSpaces.includes(placement)){ //generates a new number between 1 and 4 until a non-selected placement has been generated
            placement = Math.floor((Math.random() * 4) + 1);
        }
        document.getElementById('option'+placement).innerHTML = this['incorrect'+x];
        occupiedSpaces.push(placement);
    }
}

/*
*   function: updateScore
*   Updates the scorecard element.
*/
function updateScore(score){
    document.getElementById('scorecard').innerHTML = 'Score: '+score;
}

/*
*   function: gameOver
*   Ends the game by hiding all clickable buttons and informing the user what their final score was.
*/
function gameOver(score){
    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "none";

    const scorecard = document.getElementById('scorecard');
    scorecard.innerHTML = 'Your final score was '+score+'<br>Thanks for playing, '+JSON.parse(localStorage.getItem('User')).username+'!';
    scorecard.style.fontSize = '30px';
    scorecard.style.textAlign = 'center';
}

/*
*   function: highlightCorrect
*   Parameters: correctButton, selection
*   Takes the button containing the correct answer and the button the user selected.
*   Appropriately highlights the user's selection, displaying green if they were correct, yellow on the user's selecton if it was incorrect,
*   and grey for all other buttons.
*/
function highlightCorrect(correctButton, selection) {
    const buttons = document.getElementsByClassName('option');

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button.innerHTML === correctButton) {
            button.style.backgroundColor = "green";
        } else if(button.innerHTML === selection){
            button.style.backgroundColor = "DarkKhaki";
        } else {
            button.style.backgroundColor = "grey";
        }
    }

    setTimeout(() => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = "";
        }
    }, 1000);
}

/*
*   function: start
*   Called upon clicking of start button.
*   Initializes the game by creating a new quiz object. Initializes event listeners for four button options 
*   and hides initial welcome message.
*/
async function start(){
    const game = new Quiz();

    const initDiv = document.getElementById('initDiv');
    initDiv.style.display = "none";

    const scoreCard = document.getElementById('scorecard');
    scoreCard.style.display = "block";

    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "initial";

    //try catch around fetch quiz. If unable to fetch quiz, display the error to the user and terminate.
    try{
        await game.fetchQuiz();
    } catch (error){
        document.getElementById('scorecard').innerHTML = error;
        const optionsDiv = document.getElementById('optionsDiv');
        optionsDiv.style.display = "none";
        console.log("Error connecting to database.");
        return;
    }

    //https://stackoverflow.com/questions/49680484/how-to-add-one-event-listener-for-all-buttons
    //used source to create an event listener for all buttons within the wrap container
    const wrap = document.getElementById('buttonwrap');
    const questionGenerator = game.questionGenerator();
    wrap.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton){
            return ;
        }

        game.num_answered++;
        const selected = event.target.innerHTML;
        const correctSelection = game.quizQuestions[game.attempts].correctOption;

        if (selected === correctSelection){ //right answer selected
            updateScore((game.score+=10));
            highlightCorrect(correctSelection, selected);
            game.diffIndex = Math.min(2, game.diffIndex+1); //increase difficulty
            game.gotCorrect = true;
            
            let questionGenerated = questionGenerator.next();
            const question = questionGenerated.value;
            //set a timeout, allowing the highlight to be displayed before showing the next question
            setTimeout(() => {
                if(game.num_answered >= MAX_QUESTIONS) {//end the game if 10 questions have been answered
                    gameOver(game.score);
                }
                //set target of "this" to be question when calling displayQuestion
                displayQuestion.call(question);
            }, 1000);

        } else { //wrong answer selected
            highlightCorrect(correctSelection, selected);
            game.diffIndex = Math.max(0, game.diffIndex-1); //decrease difficulty
            game.gotCorrect = false;
            
            let questionGenerated = questionGenerator.next();
            const question = questionGenerated.value;
            setTimeout(() => {
                if(game.num_answered >= MAX_QUESTIONS) { //end the game if 10 questions have been answered
                    gameOver(game.score);
                }
                //set target of "this" to be question when calling displayQuestion
                displayQuestion.call(question);
            }, 1000);
        }
    })

    //display initial question
    let questionGenerated = questionGenerator.next();
    const question = questionGenerated.value;
    displayQuestion.call(question); //set target of "this" to be question when calling displayQuestion

}