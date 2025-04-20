import { Card, CardContent, CardActions, Typography, Box, Button} from '@mui/material';
import { Link } from 'react-router-dom';
import CastIcon from '@mui/icons-material/Cast';

type Props = {
  idsala:number;
  nombre: string;
  capacidad: number;
  activa: string;
};

export const SalaCard: React.FC<Props> = ({ idsala,nombre,capacidad,activa}) => {
  return (
    <Card
    component={Link}
    to={`/salas/ver/${idsala}`}
    sx={{ display: 'flex', marginBottom: 2, width: '100%',backgroundColor: '#cdeaf7', color: '#000', transition: '0.3s', textDecoration: 'none', '&:hover': {
      backgroundColor: '#1976d2',
      color: '#fff',
      textDecoration: 'none'
    }}}>
      <Box sx={{ padding: 2 }}>
        <CastIcon sx={{ fontSize: 80 }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6">{nombre}</Typography>
          <Typography color="text.secondary">Capacidad: {capacidad}</Typography>
          <Typography color="text.secondary">Activa: {activa}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
