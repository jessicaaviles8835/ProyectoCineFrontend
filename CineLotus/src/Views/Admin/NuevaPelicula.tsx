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
const apiUrl = import.meta.env.VITE_API_URL;

export default function NuevaPelicula() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const enviarPelicula = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");

    if (!file) {
      setError("File is required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);

    try {
      const response = await axios.post(apiUrl + "/peliculas/new", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      toast.success("Registro insertado con éxito");
      setTimeout(() => {
        navigate("/peliculas"); // redirige a la lista de peliculas
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al guardar la película");
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
        <ToastContainer />
        <Typography variant="h4" align="center" gutterBottom>
          Agregar nueva película
        </Typography>

        <form onSubmit={enviarPelicula}>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          {/* Input para el archivo */}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span">
              {file
                ? `Selected: ${file.name}`
                : "Seleccionar el poster de la película"}
            </Button>
          </label>

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
