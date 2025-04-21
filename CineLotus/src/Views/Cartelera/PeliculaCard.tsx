import { Card, CardMedia, CardContent, CardActions, Typography, Box, Button} from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  id: number;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  user: { nombre: string } | null;
};

export const PeliculaCard: React.FC<Props> = ({ id, nombrePelicula,poster,descripcionPelicula,user }) => {
  return (
    <Card sx={{ display: 'flex', marginBottom: 2, width: '100%' }}>
      <CardMedia
        component="img"
        sx={{ width: 120, objectFit: 'cover' }}
        image={`http://localhost:3000/posters/${poster}`}
        alt={`Poster de ${id}`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6">{nombrePelicula}</Typography>
          <Typography color="text.secondary">{descripcionPelicula}</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button component={Link} to={`/reserva/step1/${id}`}>Comprar entradas</Button>
            </Box>
          ) : (
            <>
              <Button component={Link} to={`/login`}>Comprar entradas</Button>
            </>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};
