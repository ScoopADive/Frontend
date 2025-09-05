// src/context/UsersContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/mypage/all/');
        const map = {};
        (res.data || []).forEach((u) => (map[u.id] = u.username));
        setUsersMap(map);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return <UsersContext.Provider value={{ usersMap }}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error('useUsers must be used within UsersProvider');
  return context;
}
