import { Container, CircularProgress, Alert, Box, Typography, TextField, IconButton} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GridRenderCellParams } from '@mui/x-data-grid';




type Usuario = {
    idusuario:number;
    nombre: string;
    email: string;
    tipo: string;
    activo: string;
};

const columnas = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'email', headerName: 'Correo', width: 200 },
  { field: 'tipo', headerName: 'Tipo', width: 200 },
  { field: 'activo', headerName: 'Activo', width: 100 },
  {
    field: 'fecha_creacion',
    headerName: 'Fecha Creación',
    width: 180,
    valueFormatter: (value: any) => {
      if (!value) return '';
      const fecha = new Date(value);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    width: 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params:GridRenderCellParams) => (
      <Box display="flex" gap={1}>
        <IconButton
          color="primary"
          size="small"
          onClick={() => console.log('Ver', params.row)}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="primary"
          size="small"
          onClick={() => console.log('Editar', params.row)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={() => console.log('Eliminar', params.row)}
        >
          <DeleteIcon />
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
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => setUsuarios(res.data))
        .catch(() => setError('Error al cargar las Usuarios'))
        .finally(() => setCargando(false));
    }, []);

    const [busqueda, setBusqueda] = useState('');
    const [filasFiltradas, setFilasFiltradas] = useState(usuarios);

    useEffect(() => {
      if (!busqueda) {
        setFilasFiltradas(usuarios); // Si no hay búsqueda, mostrar todos los datos
      } else {
        const filtradas = usuarios.filter((fila) =>
          fila.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          fila.email.toLowerCase().includes(busqueda.toLowerCase())
        );
        setFilasFiltradas(filtradas); // Filtrar datos y actualizar el estado
      }
    }, [busqueda, usuarios]); // El efecto se ejecuta cada vez que cambia la búsqueda
  
    return (
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        {cargando && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LocalMoviesOutlinedIcon sx={{ fontSize: 80, color: '#1976d2' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: '#1976d2' }}>
            Gestión de usuarios
          </Typography>
        </Box>
        <TextField
          label="Buscar por nombre o correo"
          variant="outlined"
          fullWidth
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={filasFiltradas}
            columns={columnas}
            sx={{
              '& .MuiDataGrid-columnHeader': {
                whiteSpace: 'nowrap',
              },
              '& .MuiDataGrid-cell': {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              },
            }}
          />
        </Box>
      </Container>
    );
  };

export default Usuarios;