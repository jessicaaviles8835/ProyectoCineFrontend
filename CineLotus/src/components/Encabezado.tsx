import { AppBar, IconButton, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


type Props = {
  onToggleDrawer: () => void;
  user: { nombre: string } | null;
  onLogout: () => void;
};

const Encabezado: React.FC<Props> = ({ onToggleDrawer, user, onLogout }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component={Link} to="/" color="#FFF" variant="h4" noWrap sx={{ textDecoration: 'none','&:visited': {color: '#FFF'}}}>
            Cine Lotus
          </Typography>
        </Box>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountCircleIcon />
            <Typography variant="body1">Hola, {user.nombre}</Typography>
            <Button color="inherit" onClick={onLogout}>
              Cerrar sesión
            </Button>
          </Box>
        ) : (
          <>
          <Button color="inherit" component={Link} to="/login">
            Ingresar
          </Button>
          <Button color="inherit" component={Link} to="/registrarse">
            Registrarse
          </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Encabezado;