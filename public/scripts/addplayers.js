document.getElementById('addbutton').addEventListener('click', addplayers);

function addplayers() {

    const playername = document.getElementById('playername').value;
    const playerage = document.getElementById('playerage').value;
    const playerskill = document.getElementById('playerskill').value;
    const playerrole = document.getElementById('playerrole').value;

    const cardGrid = document.getElementById('appendhere');

    const card = document.createElement('div');
    card.classList.add('card', 'col-lg-3');

    const cardbody = document.createElement('div');
    cardbody.classList.add('card-body');
    card.append(cardbody);

    const cardtitle = document.createElement('h5');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = playername;
    cardbody.append(cardtitle);

    const cardsubtitle = document.createElement('h6');
    cardsubtitle.classList.add('card-subtitle');
    cardsubtitle.innerHTML = playerrole;
    cardbody.append(cardsubtitle);

    const cardtext = document.createElement('p');
    cardtext.classList.add('card-text');
    cardtext.innerHTML = "Age: "+ playerage + "<br>Skill: " + playerskill;
    cardbody.append(cardtext);

    // card.innerHTML = newteam;
    cardGrid.append(card);
}
