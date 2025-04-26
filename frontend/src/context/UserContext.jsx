import { createContext, useState, useContext } from "react";

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

export const useUserContext = () => useContext(UserDataContext);

export default UserContext;
