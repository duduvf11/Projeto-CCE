import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ajeitando para extrair o ID do token decodificado
        setUser({ nome: decoded.nome, id: decoded.id }); 
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [cookies.token]);

  const login = useCallback((token) => {
    setCookie('token', token, { path: '/' }); 
    const decoded = jwtDecode(token);
    // Ajeitando para extrair o ID do token decodificado
    setUser({ nome: decoded.nome, id: decoded.id }); 
  }, [setCookie]);

  const logout = useCallback(() => {
    removeCookie('token', { path: '/' }); 
    setUser(null);
  }, [removeCookie]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}