import {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  updatePlayer,
  removePlayer,
} from './ajaxHelpers';

const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

export const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  playerList.map((pup) => {
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="remove-from-roster" data-id=${pup.id}>Remove from roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  });

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  detailButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const singlePlayer = await fetchSinglePlayer(event.target.dataset.id);
      renderSinglePlayer(singlePlayer);
    });
  });

  let deleteButtons = [
    ...document.getElementsByClassName('remove-from-roster'),
  ];
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      await removePlayer(event.target.dataset.id);
      const allPlayers = await fetchAllPlayers();
      renderAllPlayers(allPlayers);
    });
  });
};

export const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <select id='assign-team'> 
      <option> --Choose Team-- </option>
      <option value='1'> Ruff </option>
      <option value='2'> Fluff </option>
      </select>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;

  let goBackButton = document.getElementById('see-all');
  goBackButton.addEventListener('click', async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });

  let selectTeamButton = document.getElementById('assign-team');

  selectTeamButton.addEventListener('change', async (event) => {
    // console.log('event', event.target.value);
    // console.log('team', playerObj.team);
    if (event.target.value !== playerObj.team) {
      await updatePlayer({
        teamId: event.target.value,
        id: playerObj.id,
      });
      const singlePlayer = await fetchSinglePlayer(playerObj.id);
      renderSinglePlayer(singlePlayer);
    }
  });
};

export const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // console.log('event', event.target.querySelector('input').value);
    const inputs = form.elements;
    const inputsByName = inputs['name'];
    const inputsByBreed = inputs['breed'];
    addNewPlayer({
      name: inputsByName.value,
      breed: inputsByBreed.value,
    });
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    inputsByName.value = '';
    inputsByBreed.value = '';
  });
};
