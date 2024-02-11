class Quiz {

    score = 0;
    attempts = 0;
    quizQuestions;
    gotCorrect = false;
    diffIndex = 0;
    num_answered = 0;
    difficulties = ['easy', 'medium', 'hard'];

    formatQuestion(obj) {
        return new Question(obj.question, obj.correct_answer, obj.incorrect_answers[0], obj.incorrect_answers[1], obj.incorrect_answers[2], obj.difficulty);
    }

    incrementAttempts(){
        this.attempts++;
        if(this.attempts > this.quizQuestions.length){
            this.attempts = 1;
        }
    }

    *questionGenerator(){

        while(true){
            let tempQuestion = this.quizQuestions[this.attempts];
            if(this.gotCorrect === true){
                //console.log("diff index: "+this.difficulties[this.diffIndex]);
                if(tempQuestion.difficulty !== this.difficulties[this.diffIndex]){
                    this.incrementAttempts();
                    continue;
                }
                this.incrementAttempts();
                yield tempQuestion;
            } else {
                //console.log("diff index: "+this.difficulties[this.diffIndex]);
                if(tempQuestion.difficulty !== this.difficulties[this.diffIndex]){
                    this.incrementAttempts();
                    continue;
                }
                
                this.incrementAttempts();
                yield tempQuestion;
            }
            this.attempts++;
            yield tempQuestion;
        } 
    }

    async fetchQuiz() {

        await fetch('https://opentdb.com/api.php?amount=40&type=multiple')
            .then(response => response.json())
            .then(data => {
                const questions = [];
                data.results.forEach(obj => {
                    questions.push(this.formatQuestion(obj));
                });
                
                this.quizQuestions = questions;
            })
            .catch(error => console.error('Error:', error));
    }
    
}

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

class User {

    username = "";

    constructor(usernameIn) {
        this.username = usernameIn;
    }

    get getUsername() {
        return this.username;
    }
}

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

function printName(){
    let username = localStorage.getItem('username');
    document.getElementById('namep').innerHTML = username+' is here';
}

function displayQuestion(question){
    document.getElementById('question').innerHTML = question.questionText;
    const occupiedSpaces = [];
    
    let placement = Math.floor((Math.random() * 4) + 1);
    document.getElementById('option'+placement).innerHTML = question.correctOption;
    occupiedSpaces.push(placement);

    for(let x = 1; x <= 3; x++){
        while (occupiedSpaces.includes(placement)){
            placement = Math.floor((Math.random() * 4) + 1);
        }
        document.getElementById('option'+placement).innerHTML = question['incorrect'+x];
        occupiedSpaces.push(placement);
    }
}

function updateScore(score){
    document.getElementById('scorecard').innerHTML = 'Score: '+score;
}

function gameOver(score){
    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "none";

    const scorecard = document.getElementById('scorecard');
    scorecard.innerHTML = 'Your final score was '+score+'<br>Thanks for playing!';
    scorecard.style.fontSize = '30px';
    scorecard.style.textAlign = 'center';
}

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

async function start(){
    const game = new Quiz();

    const initDiv = document.getElementById('initDiv');
    initDiv.style.display = "none";

    const scoreCard = document.getElementById('scorecard');
    scoreCard.style.display = "block";

    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "grid";
    document.getElementById("question").style.gridColumn = "1/3";
    optionsDiv.style.gridTemplateColumns = "repeat(2, 1fr)";

    await game.fetchQuiz();

    const wrap = document.getElementById('buttonwrap');

    //https://stackoverflow.com/questions/49680484/how-to-add-one-event-listener-for-all-buttons
    wrap.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton){
            return ;
        }

        game.num_answered++;
        const selected = event.target.innerHTML;
        const correctSelection = game.quizQuestions[game.attempts-1].correctOption;

        if (selected === correctSelection){
            game.score+=10;
            updateScore(game.score);
            highlightCorrect(correctSelection, selected);
            game.diffIndex = Math.min(2, game.diffIndex+1);
            game.gotCorrect = true;

            if(game.num_answered > 9) {
                gameOver(game.score);
            }

            setTimeout(() => {
                let questionGenerated = game.questionGenerator().next();
                const question = questionGenerated.value;
                displayQuestion(question);
            }, 1000);
        } else {
            highlightCorrect(correctSelection, selected);
            game.diffIndex = Math.max(0, game.diffIndex-1);
            game.gotCorrect = false;

            if(game.num_answered > 9) {
                gameOver(game.score);
            }

            setTimeout(() => {
                let questionGenerated = game.questionGenerator().next();
                const question = questionGenerated.value;
                displayQuestion(question);
            }, 1000);
        }
    })
    
    const questionGenerator = game.questionGenerator();
    let questionGenerated = questionGenerator.next();
    const question = questionGenerated.value;
    displayQuestion(question);

}