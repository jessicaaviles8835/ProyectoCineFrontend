import { Container, CircularProgress, Alert, Box, Typography} from '@mui/material';
import { PeliculaCard } from './PeliculaCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

type Pelicula = {
  id:number;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  nombreSala: string;
  fecha: string;
};

const Cartelera = () => {

    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      axios
        .get('http://localhost:3000/cartelera')
        .then((res) => setPeliculas(res.data))
        .catch(() => setError('Error al cargar la cartelera'))
        .finally(() => setCargando(false));
    }, []);
  
    return (
      <Container sx={{ mt: 2 }}>
        {cargando && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MovieFilterIcon sx={{ fontSize: 80, color: '#1976d2' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: '#1976d2' }}>
            En cartelera
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            marginTop: 2
          }}
        >
          {peliculas.map((pelicula) => (
            <PeliculaCard key={pelicula.id} id={pelicula.id} nombrePelicula={pelicula.nombrePelicula} 
                    poster={pelicula.poster} descripcionPelicula={pelicula.descripcionPelicula}/>
          ))}
        </Box>
      </Container>
    );
  };

export default Cartelera;