import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Props = {
  setUser: (user: { nombre: string }) => void;
  setTipo: (tipo: { nombre: string }) => void;
};

export const Login: React.FC<Props> = ({ setUser , setTipo }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setCargando(true)
        try {
          const response = await axios.post('http://localhost:3000/users/login', {
            username,
            password
          });
          const token = response.data.token;
          localStorage.setItem('token', token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ nombre: payload.username });
          setTipo({ nombre: payload.tipo });
          navigate('/'); // redirige a la cartelera
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Error en el login');
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ocurrió un error desconocido');
          }
        }
        finally{
            setCargando(false)
        };
      };

    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
  
          <form onSubmit={handleLogin}>
            <TextField
              label="Nombre de usuario"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {cargando && <CircularProgress />}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
  
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Ingresar
            </Button>
          </form>
        </Box>
      </Container>
    );
  };
  
  export default Login;