import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export default function NuevoUsuario() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState("");
  const [activo, setActivo] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        apiUrl + "/users/new",
        {
          username,
          email,
          password,
          tipo,
          activo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/usuarios"); // redirige a la lista de usuarios
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Error al registrar el usuario"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setCargando(false);
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

          <TextField
            label="Repetir contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            helperText={error}
            required
          />

          <TextField
            select
            label="Tipo de usuario"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">Selecciona el tipo de usuario</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Cliente">Cliente</MenuItem>
          </TextField>

          <TextField
            select
            label="Activo"
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">Selecciona una opción</MenuItem>
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          {cargando && <CircularProgress />}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
