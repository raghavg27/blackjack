import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { navItems } from "./nav-items";
import GameRules from './pages/GameRules';
import HelpSupport from './pages/HelpSupport';
import ResponsibleGaming from './pages/ResponsibleGaming';

const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
            <Route path="/game-rules" element={<GameRules />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </React.StrictMode>
);

export default App;
