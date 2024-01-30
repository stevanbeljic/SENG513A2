document.addEventListener('DOMContentLoaded', function (){
    var form = document.querySelector('form');

    form.addEventListener('submit', function (event){
        event.preventDefault();

        var nameInput = document.getElementById('name');
        let playerName = nameInput.value;

        if(playerName === ''){
            alert('Provide a name');
        } else {
            window.location.href = 'quizmenu.html';
        }
    });
});