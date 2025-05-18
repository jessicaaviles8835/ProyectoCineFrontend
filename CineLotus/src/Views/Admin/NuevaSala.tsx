import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NuevaSala() {
  const [nombre, setNombre] = useState("");
  const [filas, setFilas] = useState("");
  const [columnas, setColumnas] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:3000/salas/new",
        {
          nombre,
          filas,
          columnas,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success("Registro insertado con éxito");
      setTimeout(() => {
        navigate("/salas"); // redirige a la lista de salas
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al guardar la sala");
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
      <ToastContainer />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Agregar nueva sala
        </Typography>

        <form onSubmit={enviarSala}>
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
            type="number"
            fullWidth
            margin="normal"
            value={filas}
            onChange={(e) => setFilas(e.target.value)}
            required
          />
          <TextField
            label="Columnas"
            type="number"
            fullWidth
            margin="normal"
            value={columnas}
            onChange={(e) => setColumnas(e.target.value)}
            required
          />
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
