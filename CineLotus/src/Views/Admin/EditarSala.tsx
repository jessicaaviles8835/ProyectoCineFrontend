import { Box, Button, TextField, Typography, Container, Alert, CircularProgress,MenuItem } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditarSala() {
    const { id } = useParams();
    
    const [nombre, setNombre] = useState('');
    const [filas, setFilas] = useState('');
    const [columnas, setColumnas] = useState('');
    const [activa, setActiva] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      axios
        .get(`http://localhost:3000/salas/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        .then((res) => {
          const {nombre, filas, columnas, activa} = res.data;
          setNombre(nombre);
          setFilas(filas);
          setColumnas(columnas);
          setActiva(activa);
        })
        .catch(() => setError('Error al cargar la sala'))
        .finally(() => setCargando(false));
    }, [id]);

    const enviarSala = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const token = localStorage.getItem('token');

        try {
            await axios.put('http://localhost:3000/salas/edit', {
                id,
                nombre,
                filas,
                columnas,
                activa
            }, {
                headers: {
                Authorization: `Bearer ${token}`
            }});
            navigate('/salas'); // redirige a la lista de salas
        } catch (err) {
          console.log(err)
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Error al guardar la sala');
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ocurrió un error desconocido');
          }
        }
      };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
        {cargando && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Modificar sala
            </Typography>

            <form onSubmit={enviarSala}>
                <TextField
                label="Identificador"
                fullWidth
                margin="normal"
                value={id}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                required
                />
                <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                />
                <TextField
                label="Filas"
                fullWidth
                margin="normal"
                value={filas}
                onChange={(e) => setFilas(e.target.value)}
                required
                />
                <TextField
                label="Columnas"
                fullWidth
                margin="normal"
                value={columnas}
                onChange={(e) => setColumnas(e.target.value)}
                required
                />
                <TextField
                select
                label="Activa"
                value={activa}
                onChange={(e) => setActiva(e.target.value)}
                fullWidth
                margin="normal"
                required
                >
                  <MenuItem value="">Selecciona una opción</MenuItem>
                  <MenuItem value="Si">Si</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                >
                Guardar
                </Button>
            </form>
        </Box>
      
    </Container>
  );
}