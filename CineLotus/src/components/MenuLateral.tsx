
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import TheatersIcon from '@mui/icons-material/Theaters';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CastIcon from '@mui/icons-material/Cast';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
  
  type Props = {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
  };
  
  const Sidebar: React.FC<Props> = ({ open, onClose, onLogout }) => {
  
    return (
      <Drawer
        open={open}
        onClose={onClose}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': { width: 240 },
          display: { xs: 'block', sm: 'block' }
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton
            component={Link}
            to="/"
            onClick={onClose}
          >
            <ListItemIcon>
              <MovieFilterIcon />
            </ListItemIcon>
            <ListItemText primary="Cartelera" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/cartelera"
            onClick={onClose}
          >
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Gestionar cartelera" />
          </ListItemButton>
          
          <ListItemButton
            component={Link}
            to="/salas"
            onClick={onClose}
          >
            <ListItemIcon>
              <CastIcon />
            </ListItemIcon>
            <ListItemText primary="Gestionar salas" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/peliculas"
            onClick={onClose}
          >
            <ListItemIcon>
              <TheatersIcon />
            </ListItemIcon>
            <ListItemText primary="Gestionar películas" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/usuarios"
            onClick={onClose}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Gestionar usuarios" />
          </ListItemButton>

          <ListItemButton onClick={() => onLogout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </List>
      </Drawer>
    );
  };
  
  export default Sidebar;
  