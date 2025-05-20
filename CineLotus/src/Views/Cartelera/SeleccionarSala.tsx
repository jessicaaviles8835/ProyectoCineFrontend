import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { SalaCard } from "./SalaCard";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { useParams } from "react-router-dom";
import BotonVolver from "../../components/BotonVolver";
const apiUrl = import.meta.env.VITE_API_URL;

type Pelicula = {
  idcartelera: number;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  fecha: string;
  sala: number;
  nombreSala: string;
};

const SeleccionarSala = () => {
  const { id } = useParams();
  const { fecha } = useParams();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [peli, setPeli] = useState<Pelicula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${apiUrl}/reservas/step2/${id}/${fecha}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPeliculas(res.data);
        setPeli(res.data[0]);
      })
      .catch(() => setError("Error al cargar la cartelera"))
      .finally(() => setCargando(false));
  }, [id]);

  return (
    <Container sx={{ mt: 2 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <BotonVolver />
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <MovieFilterIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Seleccionar Sala ({peli?.fecha.substring(0, 10)})
        </Typography>
      </Box>
      <Card sx={{ display: "flex", marginBottom: 2, width: "100%" }}>
        <CardMedia
          component="img"
          sx={{ width: 200, objectFit: "cover" }}
          image={`${apiUrl}/posters/${peli?.poster}`}
          alt={`Poster de ${id}`}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6">{peli?.nombrePelicula}</Typography>
            <Typography color="text.secondary">
              {peli?.descripcionPelicula}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr 1fr 1fr",
          },
          gap: 2,
          marginTop: 2,
        }}
      >
        {peliculas.map((pelicula) => (
          <SalaCard
            key={pelicula.idcartelera}
            idcartelera={pelicula.idcartelera}
            nombreSala={pelicula.nombreSala}
          />
        ))}
      </Box>
    </Container>
  );
};

export default SeleccionarSala;
