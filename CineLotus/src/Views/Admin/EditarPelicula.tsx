import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function EditarPelicula() {
  const { id } = useParams();
  const [idpelicula, setIdpelicula] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [poster, setPoster] = useState("");
  const [activa, setActiva] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/peliculas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const { idpelicula, nombre, descripcion, poster, activa } = res.data;
        setNombre(nombre);
        setDescripcion(descripcion);
        setPoster(poster);
        setActiva(activa);
        setIdpelicula(idpelicula);
      })
      .catch(() => setError("Error al cargar la película"))
      .finally(() => setCargando(false));
  }, [id]);

  const enviarPelicula = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("idpelicula", idpelicula);
    if (file) {
      formData.append("file", file);
    }
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("poster", poster);
    formData.append("activa", activa);

    try {
      const response = await axios.put(
        "http://localhost:3000/peliculas/edit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success("Registro modificado con éxito");
      setTimeout(() => {
        navigate("/peliculas"); // redirige a la lista de peliculas
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al guardar la película");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <ToastContainer />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Editar película
        </Typography>

        <form onSubmit={enviarPelicula}>
          <TextField
            label="Identificador"
            fullWidth
            margin="normal"
            value={idpelicula}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            required
          />
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          <TextField
            select
            label="Activa"
            value={activa}
            onChange={(e) => setActiva(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">Selecciona una opción</MenuItem>
            <MenuItem value="Si">Si</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          {poster && !file && (
            <Box>
              <Typography variant="body2">Póster:</Typography>
              <img
                src={`http://localhost:3000/posters/${poster}`}
                alt="Poster actual"
                style={{ maxWidth: 200 }}
              />
            </Box>
          )}

          {/* Input para el archivo */}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              if (selectedFile) {
                setFile(selectedFile);
                setPoster(""); // borrar poster actual
              }
              setFile(e.target.files?.[0] || null);
            }}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span">
              {file
                ? `Selected: ${file.name}`
                : "Cambiar el poster de la película"}
            </Button>
          </label>

          {cargando && <CircularProgress />}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
