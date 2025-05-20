import { Card, CardMedia, Typography, Box } from "@mui/material";
import BoletoQR from "../../components/BoletoQR";
const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  id: number;
  nombrePelicula: string;
  nombreSala: string;
  poster: string;
  fecha: Date;
  asiento: number;
};

export const BoletoCard: React.FC<Props> = ({
  id,
  nombrePelicula,
  nombreSala,
  poster,
  fecha,
  asiento,
}) => {
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const qrData =
    "Película: " +
    nombrePelicula +
    "\n" +
    "Sala: " +
    nombreSala +
    "\n" +
    "Fecha: " +
    fechaFormateada +
    "\n" +
    "Asiento: " +
    asiento;
  return (
    <Card sx={{ display: "flex", marginBottom: 2, width: "100%" }}>
      <CardMedia
        component="img"
        sx={{ width: 120, objectFit: "cover" }}
        image={`${apiUrl}/posters/${poster}`}
        alt={`Poster de ${id}`}
      />
      <Box
        sx={{
          ml: 4,
          mt: 4,
          display: "flex",
          flexDirection: "column",
          flexGrow: 4,
        }}
      >
        <Typography variant="h5">{nombrePelicula}</Typography>
        <Typography variant="h5">{nombreSala}</Typography>
        <Typography variant="h5">Fecha: {fechaFormateada}</Typography>
        <Typography variant="h5">Asiento: {asiento}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <BoletoQR valor={qrData} />
      </Box>
    </Card>
  );
};
