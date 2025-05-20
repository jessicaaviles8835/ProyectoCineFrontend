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
import PeopleIcon from "@mui/icons-material/People";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  activo: string;
};

const columnas = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "nombre", headerName: "Nombre", flex: 3 },
  { field: "email", headerName: "Correo", flex: 3 },
  { field: "tipo", headerName: "Tipo", flex: 2 },
  { field: "activo", headerName: "Activo", flex: 2 },
  {
    field: "fecha_creacion",
    headerName: "Fecha Creación",

    flex: 2,
  },
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
          to={`/users/edit/${params.row.id}`}
        >
          <EditIcon />
        </IconButton>
      </Box>
    ),
  },
];

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiUrl + "/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsuarios(res.data))
      .catch(() => setError("Error al cargar los Usuarios"))
      .finally(() => setCargando(false));
  }, []);

  const [busqueda, setBusqueda] = useState("");
  const [filasFiltradas, setFilasFiltradas] = useState(usuarios);

  useEffect(() => {
    if (!busqueda) {
      setFilasFiltradas(usuarios); // Si no hay búsqueda, mostrar todos los datos
    } else {
      const filtradas = usuarios.filter(
        (fila) =>
          fila.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          fila.email.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilasFiltradas(filtradas); // Filtrar datos y actualizar el estado
    }
  }, [busqueda, usuarios]); // El efecto se ejecuta cada vez que cambia la búsqueda

  return (
    <Container sx={{ mt: 5 }}>
      {cargando && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <PeopleIcon sx={{ fontSize: 80, color: "#1976d2" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}
        >
          Gestión de usuarios
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Link to="/nuevousuario" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Agregar Nuevo Usuario
          </Button>
        </Link>
      </Box>
      <TextField
        label="Buscar por nombre o correo"
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

export default Usuarios;
