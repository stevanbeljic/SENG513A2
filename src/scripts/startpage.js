function readName(){
    let tempname = document.getElementById('name').value;

    if(tempname == ''){
        alert('Name can not be empty');
    } else {
        localStorage.setItem('username', tempname);
        window.location.href = 'quizmenu.html';
    }
}