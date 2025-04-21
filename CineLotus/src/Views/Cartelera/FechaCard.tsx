import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  id: number;
  fecha:string;
};

const formatearFechaCorta = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const FechaCard: React.FC<Props> = ({ id, fecha }) => {
  return (
    <Card component={Link}
      to={`/reserva/step2/${id}/${fecha.substring(0,10)}`} sx={{ display: 'flex', marginBottom: 2, width: '100%',backgroundColor: '#cdeaf7', color: '#000', transition: '0.3s', textDecoration: 'none', '&:hover': {
        backgroundColor: '#1976d2',
        color: '#fff',
        textDecoration: 'none'
      }}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent>
          <Typography>{formatearFechaCorta(fecha)}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
