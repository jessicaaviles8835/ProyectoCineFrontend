import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

type Cartelera = {
  idcartelera: number;
  pelicula: string;
  sala: string;
  fechaFuncion: string;
  activa: string;
};

const columnas = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "pelicula", headerName: "Película", flex: 3 },
  { field: "sala", headerName: "Sala", flex: 3 },
  {
    field: "fechaFuncion",
    headerName: "Fecha Función",
    width: 180,
    valueFormatter: (value: any) => {
      if (!value) return "";
      const fecha = new Date(value);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    flex: 2,
  },
  { field: "activa", headerName: "Activa", flex: 2 },
  {
    field: "acciones",
    headerName: "Acciones",
    width: 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams) => (
      <Box display="flex" gap={1}>
        <IconButton
          component={Link}
          color="primary"
          size="small"
          to={`/cartelera/edit/${params.row.id}`}
        >
          <EditIcon />
        </IconButton>
      </Box>
    ),
  },
];

const Carteleras = () => {
  const [carteleras, setCarteleras] = useState<Cartelera[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiUrl + "/cartelera/cartelera", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCarteleras(res.data))
      .catch(() => setError("Error al cargar las películas"))
      .finally(() => setCargando(false));
  }, []);

  const [busqueda, setBusqueda] = useState("");
  const [filasFiltradas, setFilasFiltradas] = useState(carteleras);

  useEffect(() => {
    if (!busqueda) {
      setFilasFiltradas(carteleras); // Si no hay búsqueda, mostrar todos los datos
    } else {
      const filtradas = carteleras.filter(
        (fila) =>
          fila.pelicula.toLowerCase().includes(busqueda.toLowerCase()) ||
          fila.sala.toLowerCase().includes(busqueda.toLowerCase()) ||
          fila.fechaFuncion.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilasFiltradas(filtradas); // Filtrar datos y actualizar el estado
    }
  }, [busqueda, carteleras]); // El efecto se ejecuta cada vez que cambia la búsqueda

  return (
    <Container sx={{ mt: 5 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CalendarMonthIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Gestión de la cartelera
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Link to="/nuevacartelera" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Agregar Nueva Entrada
          </Button>
        </Link>
      </Box>
      <TextField
        label="Buscar por película, sala o fecha"
        variant="outlined"
        fullWidth
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={filasFiltradas}
          columns={columnas}
          autoPageSize
          sx={{
            "& .MuiDataGrid-columnHeader": {
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default Carteleras;
