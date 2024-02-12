import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectesUserSet] = useState(new Set());

  const inputRef = useRef(null);

  const fetchUsers = async () => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://dummyjson.com/users/search?q=${searchTerm}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectesUserSet(new Set([...selectedUserSet, user.id]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updateUsers = selectedUsers.filter(
      (selectedUsers) => selectedUsers.id !== user.id
    );
    setSelectedUsers(updateUsers);

    const updateid = new Set(selectedUserSet);
    updateid.delete(user.id);
    setSelectesUserSet(updateid);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };
  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => (
          <Pill
            key={user.email}
            image={user.image}
            text={`${user.firstName} ${user.lastName}`}
            onClick={() => {
              handleRemoveUser(user);
            }}
          />
        ))}
        {/* input feild with search suggestion */}
        <div className="input-div">
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for a user"
            value={searchTerm}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          {/* Search Suggestion */}
          <ul className="suggestions-list noscrollbar">
            {suggestions?.users?.map((user) => {
              return !selectedUserSet.has(user.id) ? (
                <li key={user.id} onClick={() => handleSelectUser(user)}>
                  <img src={user.image} alt={user.id} />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <div key={user.id}></div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
