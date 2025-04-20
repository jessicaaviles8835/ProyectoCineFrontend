import { Card, CardMedia, CardContent, Typography, Box} from '@mui/material';

type Props = {
  id: number;
  nombrePelicula: string;
  poster: string;
  nombreSala: string;
  descripcionPelicula: string;
};

export const PeliculaCard: React.FC<Props> = ({ id, nombrePelicula,poster,nombreSala,descripcionPelicula }) => {
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
          <Typography color="text.secondary">{nombreSala}</Typography>
          <Typography color="text.secondary">{descripcionPelicula}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
