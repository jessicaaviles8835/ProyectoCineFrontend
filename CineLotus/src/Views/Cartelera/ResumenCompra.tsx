import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { BoletoCard } from "./BoletoCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

type Asiento = {
  id: number;
  numAsiento: number;
  estado: string;
  pelicula: string;
  nombrePelicula: string;
  poster: string;
  descripcionPelicula: string;
  cartelera: string;
  fecha: Date;
  sala: string;
  nombreSala: string;
  capacidad: number;
  filas: number;
  columnas: number;
  cliente: string;
};

export default function ResumenCompra() {
  const location = useLocation();
  const ids = location.state?.asientos || [];
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [asientosComprados, setAsientosComprados] = useState<Asiento[]>([]);

  useEffect(() => {
    if (ids.length > 0) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:3000/reservas/resumen?ids=${ids.join(",")}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAsientosComprados(res.data);
        })
        .catch(() => setError("Error al cargar los datos"))
        .finally(() => setCargando(false));
    }
  }, [ids]);

  return (
    <Container sx={{ mt: 2, width: "60%" }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <ConfirmationNumberOutlinedIcon
          sx={{ fontSize: 80, color: "#1976d2" }}
        />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Resumen de compra
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr" },
          gap: 2,
          marginTop: 2,
        }}
      >
        {asientosComprados.map((asiento) => (
          <BoletoCard
            key={asiento.id}
            id={asiento.id}
            asiento={asiento.numAsiento}
            nombrePelicula={asiento.nombrePelicula}
            poster={asiento.poster}
            nombreSala={asiento.nombreSala}
            fecha={asiento.fecha}
          />
        ))}
      </Box>
    </Container>
  );
}
