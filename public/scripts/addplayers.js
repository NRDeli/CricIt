document.getElementById('addbutton').addEventListener('click', addplayers);
document.getElementById('addplayer').setAttribute('action', `/addplayers/team?arr=` + JSON.stringify(playerArrFinal));



function addplayers(playerArrFinal) {
    var tempDataofPlayer = {
        'name': document.getElementById('playername').value,
        'skill': document.getElementById('playerskill').value,
        'arm': document.getElementById('arm').value,
        'salary': document.getElementById('salary').value,
        'age': document.getElementById('playerage').value,
        'role': document.getElementById('playerrole').value
    };


    const cardGrid = document.getElementById('appendhere');

    const card = document.createElement('div');
    card.classList.add('card', 'col-lg-3');

    const cardbody = document.createElement('div');
    cardbody.classList.add('card-body');
    card.append(cardbody);

    const cardtitle = document.createElement('h5');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = tempDataofPlayer.name;
    cardbody.append(cardtitle);

    const cardsubtitle = document.createElement('h6');
    cardsubtitle.classList.add('card-subtitle');
    cardsubtitle.innerHTML = tempDataofPlayer.role;
    cardbody.append(cardsubtitle);


    const cardtext = document.createElement('p');
    cardtext.classList.add('card-text');
    cardtext.innerHTML = "Age: " + tempDataofPlayer.age + "<br>Skill: " + tempDataofPlayer.skill
        + "<br>Salary: " + tempDataofPlayer.salary + "<br>Arm: " + tempDataofPlayer.arm
        ;
    cardbody.append(cardtext);

    // card.innerHTML = newteam;
    cardGrid.append(card);
}

