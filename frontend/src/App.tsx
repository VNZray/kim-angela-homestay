import { BrowserRouter } from "react-router-dom";

import React from "react";
import AppRoutes from "@/routes/AppRoutes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
