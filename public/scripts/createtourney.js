document.getElementById('addbutton').addEventListener('click', addteams);

function addteams() {
    const addteam = document.getElementById('addteam');

    const newteam = addteam.value;
    console.log(newteam);
    const cardGrid = document.getElementById('appendhere');

    const card = document.createElement('div');
    card.classList.add('card', 'col-lg-3');

    const cardbody = document.createElement('div');
    cardbody.classList.add('card-body');
    card.append(cardbody);

    const cardtitle = document.createElement('h5');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = newteam;
    cardbody.append(cardtitle);

    const addplayerlink = document.createElement('a');
    addplayerlink.setAttribute('href', "/addplayers/" + newteam);
    addplayerlink.classList.add('card-link');
    addplayerlink.innerHTML = 'Add Player';
    cardbody.append(addplayerlink);

    const editlink = document.createElement('a');
    editlink.setAttribute('href', "#");
    editlink.classList.add('card-link');
    editlink.innerHTML = 'edit';
    cardbody.append(editlink);

    const deletelink = document.createElement('a');
    deletelink.setAttribute('href', "#");
    deletelink.classList.add('card-link');
    deletelink.innerHTML = 'delete';
    cardbody.append(deletelink);

    // card.innerHTML = newteam;
    cardGrid.append(card);
}

