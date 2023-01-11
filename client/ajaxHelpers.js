import axios from 'axios';

export const fetchAllPlayers = async () => {
  try {
    const { data } = await axios.get('/api/players');
    return data;
  } catch (err) {
    console.log('error', err);
  }
};

export const fetchSinglePlayer = async (playerId) => {
  try {
    const { data } = await axios.get(`/api/players/${playerId}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const addNewPlayer = async (playerObj) => {
  try {
    const { data } = await axios.post('/api/players', playerObj);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const updatePlayer = async (playerObj) => {
  try {
    const { data } = await axios.put(`/api/players/${playerObj.id}`, playerObj);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const removePlayer = async (playerId) => {
  try {
    const { data } = await axios.delete(`/api/players/${playerId}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};
