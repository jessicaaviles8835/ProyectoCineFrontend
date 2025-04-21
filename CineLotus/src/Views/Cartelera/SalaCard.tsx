import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  id: number;
  nombreSala:string;
};


export const SalaCard: React.FC<Props> = ({ id, nombreSala }) => {
  return (
    <Card component={Link}
      to={`/reserva/step3/${id}`} sx={{ display: 'flex', marginBottom: 2, width: '100%',backgroundColor: '#cdeaf7', color: '#000', transition: '0.3s', textDecoration: 'none', '&:hover': {
        backgroundColor: '#1976d2',
        color: '#fff',
        textDecoration: 'none'
      }}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent>
          <Typography>{nombreSala}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
