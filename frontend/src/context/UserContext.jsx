import { useState, createContext, useContext } from 'react';

// Create the context and export it
export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    fullname: {
      firstname: '',
      lastname: '',
    },
  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook to use UserDataContext
export const useUserContext = () => useContext(UserDataContext);

export default UserContext;
