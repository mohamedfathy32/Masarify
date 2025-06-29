import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/index";
import useAuth from "./hooks/useAuth";
import Splash from "./components/Splash";
import { ThemeProvider } from "./hooks/useTheme";

function App() {
  const { loading } = useAuth();

  return (
    <ThemeProvider>
      {loading ? (
        <Splash />
      ) : (
        <Router>
          <AppRoutes />
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
