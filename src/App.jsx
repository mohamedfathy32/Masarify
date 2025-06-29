import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/index";
import useAuth from "./hooks/useAuth";
import Splash from "./components/Splash";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Splash />;
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
