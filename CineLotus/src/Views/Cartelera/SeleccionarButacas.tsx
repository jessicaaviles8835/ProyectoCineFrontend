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
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import { ToastContainer, toast } from "react-toastify";

type Asiento = {
  id: number;
  numAsiento: number;
  estado: string;
  pelicula: string;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  cartelera: string;
  fecha: string;
  sala: string;
  nombreSala: string;
  capacidad: number;
  filas: number;
  columnas: number;
};

export default function SeleccionarButacas() {
  const { id } = useParams();
  const [peli, setPeli] = useState<Asiento | null>(null);
  const [estadoAsientos, setEstadoAsientos] = useState<Asiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const cap = peli?.capacidad || 0;
  const filas = peli?.filas || 0;
  const columnas = peli?.columnas || 0;

  const [idcartelera, setIdcartelera] = useState(id);
  const [estado, setEstado] = useState("Pendiente");

  const [idcliente, setIdcliente] = useState<string | null>(null); // Estado para el ID del cliente
  const [token, setToken] = useState<string | null>(null); // Estado para el token

  useEffect(() => {
    const token = localStorage.getItem("token"); // O de donde lo almacenes
    if (token) {
      setToken(token);
    }
  }, []);

  // 2. Decodificar el token y obtener el ID del cliente
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el JWT
        setIdcliente(payload.id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [token]); // Se ejecuta cuando el token cambia

  const nuevaReserva = async (butaca: SetStateAction<number>) => {
    setError(null);
    setCargando(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/reservas/new",
        {
          idcartelera,
          idcliente,
          butaca,
          estado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al guardar la reserva");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setCargando(false);
    }
  };

  const tarjetas = Array.from({ length: cap }, (_, i) => ({
    id: i + 1,
    titulo: `${i + 1}`,
  }));

  const manejarClickAsiento = (numero: number) => {
    const asientoEncontrado = estadoAsientos.find(
      (asiento) => asiento.numAsiento === numero
    );

    if (asientoEncontrado) {
      setEstadoAsientos((prev) =>
        prev.map((asiento) => {
          if (asiento.numAsiento === numero) {
            if (asiento.estado === "Reservada") return asiento; // ocupado, no cambia
            return {
              ...asiento,
              estado: asiento.estado === "Libre" ? "Pendiente" : "Libre",
            };
          }
          return asiento;
        })
      );
    } else {
      nuevaReserva(numero);
    }
  };

  const obtenerColorHex = (estadoNombre: string) => {
    switch (estadoNombre) {
      case "Libre":
        return "#ffffff";
      case "Reservada":
        return "#f44336";
      case "Pendiente":
        return "#ffeb3b";
      default:
        return "#ffffff";
    }
  };

  useEffect(() => {
    const obtenerReservas = async () => {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:3000/reservas/step3/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setEstadoAsientos(res.data);
          setPeli(res.data[0]);
        })
        .catch(() => setError("Error al cargar los datos"))
        .finally(() => setCargando(false));
    };
    obtenerReservas();
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
      <ToastContainer />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnas}, 1fr)`,
          gridTemplateRows: `repeat(${filas}, 1fr)`,
          width: "75%",
          height: "100%",
          margin: "0 auto",
          gap: 0, // sin espacio entre columnas ni filas
          border: "1px solid #ccc", // opcional: para ver el borde general
        }}
      >
        {tarjetas.map((tarjeta) => {
          const estado = estadoAsientos.find(
            (asiento) => asiento.numAsiento === tarjeta.id
          );
          const colorNombre = estado?.estado || "Libre";
          const colorHex = obtenerColorHex(colorNombre);

          return (
            <Box
              key={tarjeta.id}
              sx={{
                position: "relative",
                overflow: "hidden",
                height: 75,
              }}
            >
              <Card
                onClick={() => manejarClickAsiento(tarjeta.id)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  padding: 2,
                  backgroundColor: colorHex,
                  cursor: colorHex === "#f44336" ? "not-allowed" : "pointer",
                  opacity: colorHex === "#f44336" ? 0.8 : 1,
                }}
              >
                <ChairOutlinedIcon
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "50%",
                    transform: "translate(50%, -50%)",
                    fontSize: "4rem",
                    color: "grey.800",
                    opacity: 0.9,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
                <Typography variant="caption">{tarjeta.id}</Typography>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
