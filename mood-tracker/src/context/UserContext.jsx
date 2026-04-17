// src/context/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';

// This is the "empty container" — the Provider or "user" fills in later.
const UserContext = createContext();

// This is what wraps our app in App.jsx.
// It holds the currentUser in state and shares it with every child.
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({}); // empty = not logged in

  // The function we'll call when a user logs in or logs out
  const handleUpdateUser = (user) => {
    setCurrentUser(user);
  };

  return (
    // value prop is the "package" we send down to all children
    // We send both the data (currentUser) AND the updater function
    <UserContext.Provider value={{ currentUser, handleUpdateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Any component that needs user data just calls useUserContext().
export const useUserContext = () => {
  return useContext(UserContext);
};