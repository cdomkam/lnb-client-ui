import React, { createContext, useContext } from 'react';

// Create a context with a default value
export const UserContext = createContext<{ fb_user_id: string } | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

// Export the provider component
// export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const user = "John Doe"; // Example data

//     return (
//         <UserContext.Provider value={user} >
//             {children}
//         </UserContext.Provider>
//     );
//   };