import { useContext } from "react";

import { AuthContext } from "../components/provider/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthWrapper");
  return context.user;
}
