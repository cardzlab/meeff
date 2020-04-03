import React, { useEffect, useState } from "react";
import token from "basic-auth-token";
import "./App.css";

import Lightbox from "./Lightbox";

// Find profiles of people
const exploreRequest = async authToken => {
  const options = {
    method: "POST",
    accept: "application/json",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "lat=37.543698&lng=126.948323"
  };
  const response = await fetch("/meeff/user/explore/v2", options);
  return response.json();
};

// Find profiles of people nearby
const exploreRequestLoc = async (authToken, lat, long) => {
  const options = {
    method: "POST",
    accept: "application/json",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `lat=${lat}&lng=${long}`
  };
  const response = await fetch("/meeff/user/explore/v2", options);
  return response.json();
};

// Swipe left or right
const swipe = async (userId, isOkay, authToken) => {
  const answer = isOkay ? 1 : 0;
  const options = {
    method: "POST",
    accept: "application/json",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `userId=${userId}&isOkay=${answer}`
  };
  const response = await fetch("/meeff/user/undoableAnswer/v1", options);
  return response.json();
};

function App() {
  const [explore, setExplore] = useState(null);

  const [authToken, setAuthToken] = useState(null);

  const [formState, setFormState] = useState({ username: "", password: "" });

  const handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const saveAuthToken = () => {
    setAuthToken(token(formState.username, formState.password));
  };

  const exploreUsers = () => {
    exploreRequest(authToken).then(exploreData => setExplore(exploreData));
  };

  const exploreUsersLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        exploreRequestLoc(authToken, position.coords.latitude, position.coords.longitude).then(exploreData => setExplore(exploreData));
      });
    } else {
      alert("Your browser doesn't support getting location.");
    }
  };

  const like = userId => {
    swipe(userId, true, authToken);

    const usersWithoutId = explore.users.filter(user => user._id !== userId);
    setExplore({ ...explore, users: usersWithoutId});
  };

  const dislike = userId => {
    swipe(userId, false, authToken);

    const usersWithoutId = explore.users.filter(user => user._id !== userId);
    setExplore({ ...explore, users: usersWithoutId});
  };

  return (
    <div className="App">
      {!authToken ? (
        <>
          <label>Username</label>
          <input
            name="username"
            onChange={handleInputChange}
            value={formState.username}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={handleInputChange}
            value={formState.password}
          />
          <button onClick={saveAuthToken}>Set Credentials</button>
        </>
      ) : (
        <>
          <button onClick={exploreUsers} className="btn btn-primary">Get Users (Hongdae)</button>
          <button onClick={exploreUsersLocation} className="btn btn-secondary">Get Users (Current Location)</button>
          {explore && explore.users.length > 0
            ? explore.users.map(user => (
                <Lightbox
                  key={user._id}
                  user={user}
                  like={like}
                  dislike={dislike}
                />
              ))
            : null}
        </>
      )}
    </div>
  );
}

export default App;
