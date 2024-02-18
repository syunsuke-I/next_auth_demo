"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext: React.FC<AuthContextProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};