import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { PeliculaCard } from "./PeliculaCard";
import { useEffect, useState } from "react";
import axios from "axios";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

type Pelicula = {
  idpelicula: number;
  nombre: string;
  descripcion: string;
  activa: string;
};

const Peliculas = () => {
  const [Peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredItems = Peliculas.filter((Pelicula) =>
    Pelicula.nombre.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiUrl + "/peliculas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPeliculas(res.data))
      .catch(() => setError("Error al cargar las peliculas"))
      .finally(() => setCargando(false));
  }, []);

  return (
    <Container sx={{ mt: 2 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <LocalMoviesOutlinedIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Gestión de películas
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Link to="/nuevapelicula" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Agregar Nueva Película
          </Button>
        </Link>
      </Box>
      <TextField
        label="Buscar por nombre"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {filteredItems.map((Pelicula) => (
          <PeliculaCard
            key={Pelicula.idpelicula}
            idpelicula={Pelicula.idpelicula}
            nombre={Pelicula.nombre}
            descripcion={Pelicula.descripcion}
            activa={Pelicula.activa}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Peliculas;
