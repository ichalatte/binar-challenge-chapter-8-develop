import { useContext, useEffect, useRef, useState } from "react";
import axios from "../lib/axios";

export default function Table() {
  const [players, setPlayers] = useState([]);

  // Add auto reload / refresh
  const [refresh, setRefresh] = useState(0); 

  // Store the original list of players
  const [originalPlayers, setOriginalPlayers] = useState([]); 

  // State to hold the selected search field
  const [searchField, setSearchField] = useState("username"); 

  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState("");


  const loadPlayersFromApi = () => {
    axios
      .get("/api/v1/players")
      .then((data) => {
        setPlayers([]);
        setPlayers(data.data.data);
        // Store the original list
        setOriginalPlayers(data.data.data);
      })
      .catch(() => {
        alert("something wrong");
      });
  };

  useEffect(() => {
    loadPlayersFromApi();
  }, [refresh]);

  const filteredPlayers = () => {
    return players.filter(
      (player) =>
      player[searchField].toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

   // Fungsi edit player
  const editPlayer = (playerId, updatedData) => {
    axios
      .put(`/api/v1/players/${playerId}`, updatedData)
      .then((response) => {

        // jika update berhasil, tampilkan form edit
        const updatedPlayers = players.map((player) =>
          player.id === playerId ? response.data.data : player
        );
        setPlayers(updatedPlayers);
         // Increment the refresh state to trigger useEffect and reload the data
         setRefresh((prevRefresh) => prevRefresh + 1);
         window.location.reload();
        }) 

      .catch(() => {
        alert("Something wrong, please reload.");
      });
  };

  // Fungsi delete player
const deletePlayer = (playerId) => {
  axios
    .delete(`/api/v1/players/${playerId}`)
    .then(() => {
      // Remove the deleted player from the state
      const updatedPlayers = players.filter((player) => player.id !== playerId);
      setPlayers(updatedPlayers);
      // Increment the refresh state to trigger useEffect and reload the data
      setRefresh((prevRefresh) => prevRefresh + 1);
      window.location.reload();
    })
    .catch(() => {
      alert("Something went wrong, please try again later.");
    });
};

  return (
    <>
<div className="form-group">

  {/* Search dropdown */}
  <select
    className="form-select bg-warning text-dark"
    value={searchField}
    onChange={(e) => setSearchField(e.target.value)}
  >
    <option value="username">Username</option>
    <option value="email">Email</option>
    <option value="experience">Experience</option>
    <option value="lvl">Level</option>
  </select>
        
  {/* Search input */}
  <input
    type="text"
    className="form-control mt-2 bg-warning text-dark"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
      <br />
      <table className="table table-striped table-warning text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Exp</th>
            <th>Level</th>
            <th>CreatedAt</th>
            <th>UpdatedAt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {filteredPlayers().map((player, key) => (
              <tr key={key}>
                <td>{player.id}</td>
                <td>{player.username}</td>
                <td>{player.email}</td>
                <td>{player.password}</td>
                <td>{player.experience}</td>
                <td>{player.lvl}</td>
                <td>{player.createdAt}</td>
                <td>{player.updatedAt}</td>
                <td>
                  {/* Edit Button */}
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => {
                      // Prompt for updated username and email
                      const updatedUsername = prompt("Enter new username:", player.username);
                      const updatedEmail = prompt("Enter new email:", player.email);
                      
                      if (updatedUsername !== null && updatedEmail !== null) {
                        const updatedPlayer = { ...player, username: updatedUsername, email: updatedEmail };
                        editPlayer(player.id, updatedPlayer);
                      }}}>
                    Edit
                  </button>         
                  {/* Delete Button */}
                  <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    // Show a confirmation prompt before deleting the player
                    const shouldDelete = window.confirm("Are you sure you want to delete this player?");
                    if (shouldDelete) {
                      // Call the deletePlayer function to delete the player
                      deletePlayer(player.id);}}}>
                        Delete </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className="btn btn-outline-warning btn-sm my-2 w-50 " onClick={() => loadPlayersFromApi()}> 
        Load </button>
        <button className="btn btn-outline-danger btn-sm my-2 w-50" onClick={() => setPlayers([])}>
        Clear
        </button>
    </>
  );
}
