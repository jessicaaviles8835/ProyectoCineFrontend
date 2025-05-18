import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

type Pelicula = {
  idpelicula: number;
  nombre: string;
};

type Sala = {
  idsala: number;
  nombre: string;
};

export default function NuevaCartelera() {
  const [pelicula, setPelicula] = useState("");
  const [sala, setSala] = useState("");
  const [fechaI, setFechaI] = useState("");
  const [fechaF, setFechaF] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [peliculasActivas, setPeliculasActivas] = useState<Pelicula[]>([]);
  const [salasActivas, setSalasActivas] = useState<Sala[]>([]);

  // Cargar ambas listas
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      try {
        const [resPeliculas, resSalas] = await Promise.all([
          axios.get("http://localhost:3000/peliculas/api/activas", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:3000/salas/api/activas", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setPeliculasActivas(resPeliculas.data);
        setSalasActivas(resSalas.data);
      } catch (error) {
        console.error("Error cargando listas:", error);
      }
    };

    cargarDatos();
  }, []);

  const enviarCartelera = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3000/cartelera/new",
        {
          pelicula,
          sala,
          fechaI,
          fechaF,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Registros insertados con éxito");

      setTimeout(() => {
        navigate("/cartelera"); // redirige a la lista de peliculas
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Error al registrar la película"
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
      <ToastContainer />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registrar Películas en Cartelera
        </Typography>

        <form onSubmit={enviarCartelera}>
          <InputLabel id="pelicula-label">Seleccione una película</InputLabel>
          <Select
            labelId="pelicula-label"
            fullWidth
            value={pelicula}
            onChange={(e) => setPelicula(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Selecciona una película</em>
            </MenuItem>
            {peliculasActivas.map((peli) => (
              <MenuItem key={peli.idpelicula} value={peli.idpelicula}>
                {peli.nombre}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="sala-label">Seleccione una sala</InputLabel>
          <Select
            labelId="sala-label"
            fullWidth
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Seleccione una sala</em>
            </MenuItem>
            {salasActivas.map((sala) => (
              <MenuItem key={sala.idsala} value={sala.idsala}>
                {sala.nombre}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="fechaI-label">
            Seleccione una fecha de inicio
          </InputLabel>
          <TextField
            type="date"
            fullWidth
            value={fechaI}
            onChange={(e) => setFechaI(e.target.value)}
            required
          />

          <InputLabel id="fechaF-label">Seleccione una fecha de fin</InputLabel>
          <TextField
            type="date"
            fullWidth
            value={fechaF}
            onChange={(e) => setFechaF(e.target.value)}
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
