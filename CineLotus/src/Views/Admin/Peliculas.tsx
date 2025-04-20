import { Container, CircularProgress, Alert, Box, Typography} from '@mui/material';
import { PeliculaCard } from './PeliculaCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';

type Pelicula = {
    idpelicula:number;
    nombre: string;
    descripcion: string;
    activa: string;
};

const Peliculas = () => {

    const [Peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:3000/peliculas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => setPeliculas(res.data))
        .catch(() => setError('Error al cargar las peliculas'))
        .finally(() => setCargando(false));
    }, []);
  
    return (
      <Container sx={{ mt: 2 }}>
        {cargando && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LocalMoviesOutlinedIcon sx={{ fontSize: 80, color: '#1976d2' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: '#1976d2' }}>
            Gestión de películas
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr'},
            gap: 2,
          }}
        >
          {Peliculas.map((Pelicula) => (
            <PeliculaCard key={Pelicula.idpelicula} nombre={Pelicula.nombre} descripcion={Pelicula.descripcion} 
                activa={Pelicula.activa}/>
          ))}
        </Box>
      </Container>
    );
  };

export default Peliculas;