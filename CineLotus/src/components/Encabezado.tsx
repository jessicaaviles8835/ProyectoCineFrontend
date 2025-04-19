import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type Props = {
  onToggleDrawer: () => void;
};

const Encabezado: React.FC<Props> = ({ onToggleDrawer }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Cine Lotus
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Encabezado;