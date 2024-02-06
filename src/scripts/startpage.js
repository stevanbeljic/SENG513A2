function readName(){
    let tempname = document.getElementById('name').value;

    if(tempname == ''){
        alert('Name can not be empty');
    } else {
        const user = new User(tempname);
        localStorage.setItem('User', JSON.stringify(user));
        window.location.href = 'quizmenu.html';
    }
}