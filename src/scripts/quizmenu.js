class Quiz{
    constructor() {

    }

    score = 0;
}

class Question{
    constructor() {

    }
    questionTest = "";

}

class User {

    constructor() {
        this.username = localStorage.getItem('username');
    }

    username = "";
}

function init(){
    const tmp = localStorage.getItem('username');
    document.getElementById('welcomemessage').innerHTML = 'Welcome, '+tmp;
    
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
}