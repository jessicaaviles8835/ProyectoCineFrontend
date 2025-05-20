import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { SalaCard } from "./SalaCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CastIcon from "@mui/icons-material/Cast";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

type Sala = {
  idsala: number;
  nombre: string;
  capacidad: number;
  activa: string;
};

const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredItems = salas.filter((sala) =>
    sala.nombre.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiUrl + "/salas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSalas(res.data))
      .catch(() => setError("Error al cargar las salas"))
      .finally(() => setCargando(false));
  }, []);

  return (
    <Container sx={{ mt: 1 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CastIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Gestión de salas
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Link to="/nuevasala" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Agregar Nueva Sala
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
          gap: 1,
        }}
      >
        {filteredItems.map((sala) => (
          <SalaCard
            key={sala.idsala}
            idsala={sala.idsala}
            nombre={sala.nombre}
            capacidad={sala.capacidad}
            activa={sala.activa}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Salas;
