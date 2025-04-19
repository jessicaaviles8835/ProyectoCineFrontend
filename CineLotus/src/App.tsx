import { Box, Toolbar } from '@mui/material';
import Encabezado from './components/Encabezado';
import MenuLateral from './components/MenuLateral';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Cartelera from './Views/Cartelera/Cartelera'

function App() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Encabezado onToggleDrawer={toggleDrawer} />
      <MenuLateral open={open} onClose={toggleDrawer} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Cartelera />} />
          <Route path="/perfil" element={<Cartelera />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
