import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

type Props = {
  idpelicula: number;
  nombre: string;
  descripcion: string;
  activa: string;
};

export const PeliculaCard: React.FC<Props> = ({
  idpelicula,
  nombre,
  descripcion,
  activa,
}) => {
  return (
    <Card
      component={Link}
      to={`/peliculas/${idpelicula}`}
      sx={{
        display: "flex",
        marginBottom: 2,
        width: "100%",
        backgroundColor: "#cdeaf7",
        color: "#000",
        transition: "0.3s",
        textDecoration: "none",
        "&:hover": {
          backgroundColor: "#1976d2",
          color: "#fff",
          textDecoration: "none",
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <LocalMoviesIcon sx={{ fontSize: 80 }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6">{nombre}</Typography>
          <Typography color="text.secondary">
            Descripción: {descripcion}
          </Typography>
          <Typography color="text.secondary">Activa: {activa}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
