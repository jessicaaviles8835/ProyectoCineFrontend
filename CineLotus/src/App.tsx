import { Box, Toolbar } from '@mui/material';
import Encabezado from './components/Encabezado';
import MenuLateral from './components/MenuLateral';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cartelera from './Views/Cartelera/Cartelera'
import { Login } from './Views/Login/Index';
import Salas from './Views/Admin/Salas'
import NuevaSala from './Views/Admin/NuevaSala'
import EditarSala from './Views/Admin/EditarSala'
import Peliculas from './Views/Admin/Peliculas'
import Usuarios from './Views/Admin/Usuarios'
import RegistrarUsuario from './Views/Admin/RegistrarUsuario'
import Snackbar from '@mui/material/Snackbar';

function App() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ nombre: string } | null>(null);
  const [tipo, setTipo] = useState<{ nombre: string } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
        setUser({ nombre: payload.username });
        setTipo({ nombre: payload.tipo });
      } catch (err) {
        console.error('Token inválido');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTipo(null);
    setOpenSnackbar(true);
    navigate('/'); // redirige a la cartelera
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <Encabezado
        onToggleDrawer={() => setOpen(!open)}
        user={user}
        onLogout={handleLogout}
      />
      <MenuLateral open={open} onClose={() => setOpen(false)} onLogout={handleLogout} tipo={tipo}/>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Cartelera />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/nuevasala" element={<NuevaSala />} />
          <Route path="/salas/ver/:id" element={<EditarSala />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/registrarse" element={<RegistrarUsuario />} />
          <Route path="/login" element={<Login setUser={setUser} setTipo={setTipo} />} />
        </Routes>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Sesión cerrada correctamente"
      />
    </Box>
  );
}

export default App;
