
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
  
  type Props = {
    open: boolean;
    onClose: () => void;
  };
  
  const Sidebar: React.FC<Props> = ({ open, onClose }) => {
  
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
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Cartelera" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/usuarios"
            onClick={onClose}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>

          <ListItemButton onClick={() => console.log('Cerrar sesión')}>
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
  