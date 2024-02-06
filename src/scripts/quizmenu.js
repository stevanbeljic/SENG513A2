class Quiz{

    score = 0;

    formatQuestion(obj) {
        return new Question(obj.question, obj.correct_answer, obj.incorrect_answers[0], obj.incorrect_answers[1], obj.incorrect_answers[2], obj.difficulty);
    }

    generateQuiz() {

        fetch('https://opentdb.com/api.php?amount=40&type=multiple')
            .then(response => response.json())
            .then(data => {
                const questions = [];
                data.results.forEach(obj => {
                    questions.push(this.formatQuestion(obj));
                });

                console.log(questions);
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
        return questionTest;
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
    
    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "none";
}

function printName(){
    let username = localStorage.getItem('username');
    document.getElementById('namep').innerHTML = username+' is here';
}

function start(){
    const game = new Quiz();

    const initDiv = document.getElementById('initDiv');
    initDiv.style.display = "none";

    const optionsDiv = document.getElementById('optionsDiv');
    optionsDiv.style.display = "grid";
    document.getElementById("question").style.gridColumn = "1/3";
    optionsDiv.style.gridTemplateColumns = "repeat(2, 1fr)";

    game.generateQuiz();
}