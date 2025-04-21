import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";

const tarjetas = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  titulo: `${i + 1}`,
}));

type Butaca = {
  id: number;
  butaca: number;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  fecha: string;
  nombreSala: string;
};

export default function CuadriculaSinEspacios() {
  const { id } = useParams();
  const [peli, setPeli] = useState<Butaca | null>(null);
  const [butacas, setButacas] = useState<Butaca[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/reservas/step3/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setButacas(res.data);
        setPeli(res.data[0]);
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setCargando(false));
  }, [id]);

  return (
    <Container sx={{ mt: 2 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <MovieFilterIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Seleccionar Asientos {peli?.nombreSala} (
          {peli?.fecha.substring(0, 10)})
        </Typography>
      </Box>
      <Card sx={{ display: "flex", marginBottom: 2, width: "100%" }}>
        <CardMedia
          component="img"
          sx={{ width: 100, objectFit: "cover" }}
          image={`http://localhost:3000/posters/${peli?.poster}`}
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
          gridTemplateColumns: "repeat(10, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          width: "50%",
          height: "500px",
          margin: "0 auto",
          gap: 0, // sin espacio entre columnas ni filas
          border: "1px solid #ccc", // opcional: para ver el borde general
        }}
      >
        {tarjetas.map((tarjeta) => (
          <Box
            key={tarjeta.id}
            sx={{
              position: "relative",
              overflow: "hidden",
              height: 75, // puedes ajustar según lo que necesites
            }}
          >
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                padding: 2,
                backgroundColor: "#cdeaf7",
              }}
            >
              <ChairOutlinedIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "50%",
                  transform: "translate(50%, -50%)",
                  fontSize: "4rem", // ajusta según el tamaño de la tarjeta
                  color: "grey.500",
                  opacity: 0.9,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              <Typography variant="caption">{tarjeta.id}</Typography>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
