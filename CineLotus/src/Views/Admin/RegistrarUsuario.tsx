import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegistrarUsuario() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const enviarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/users/register', {
              username,
              email,
              password
            }, {
                headers: {
                Authorization: `Bearer ${token}`
            }});
            console.log(response);
            navigate('/login'); // redirige al login
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Error al registrar el usuario');
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ocurrió un error desconocido');
          }
        }
      };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Registrar Usuario
            </Typography>

            <form onSubmit={enviarUsuario}>
                <TextField
                label="Nombre de usuario"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Guardar
                </Button>
            </form>
        </Box>
      
    </Container>
  );
}