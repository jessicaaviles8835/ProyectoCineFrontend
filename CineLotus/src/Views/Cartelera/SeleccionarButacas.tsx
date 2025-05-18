import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Grid2,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import { ToastContainer, toast } from "react-toastify";
import BotonVolver from "../../components/BotonVolver";
import { useNavigate } from "react-router-dom";

//Estilo del modal
const estiloModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

//Tipo de dato que viene de la consulta al backend
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
  cliente: string;
};

//Pintar los coleres en la leyenda
const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        borderColor: "#000000",
        backgroundColor: color,
        border: "1px solid black",
        mr: 1.5,
      }}
    />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

//Validar MM/YY
const regexVencimiento = /^(0[1-9]|1[0-2])\/\d{2}$/;

//Componente
export default function SeleccionarButacas() {
  const { idcartelera } = useParams();
  const navigate = useNavigate();
  const [peli, setPeli] = useState<Asiento | null>(null);
  const [estadoAsientos, setEstadoAsientos] = useState<Asiento[]>([]);
  const [enProceso, setEnProceso] = useState<Asiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const cap = peli?.capacidad || 0;
  const filas = peli?.filas || 0;
  const columnas = peli?.columnas || 0;
  const [estado] = useState("Pendiente");
  //Estado del modal
  const [abierto, setAbierto] = useState(false);
  const abrirModal = () => setAbierto(true);
  const cerrarModal = () => setAbierto(false);
  //La T/C
  const [numerotc, setNumerotc] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");

  //Para saber quien está usando el sistema
  const [idcliente, setIdcliente] = useState<string | null>(null); // Estado para el ID del cliente
  const [token, setToken] = useState<string | null>(null); // Estado para el token
  // 1. Obtiene el token
  useEffect(() => {
    const token = localStorage.getItem("token"); //Obtiene el token
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

  //Llama al backend para pedirle el estado de los asientos
  const obtenerReservas = async () => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/reservas/step3/${idcartelera}`, {
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

  //Ingresar un nuevo registro cuando se hace click en un asiento y lo pone pendiente
  const nuevaReserva = async (butaca: SetStateAction<number>) => {
    setError(null);
    setCargando(true);
    try {
      await axios.post(
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
      toast.success("Asiento seleccionado pendiente de confirmación");
      obtenerReservas();
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

  //Editar una reserva que ya está en la BD
  const actualizarReserva = async (asiento: SetStateAction<Asiento>) => {
    setError(null);
    setCargando(true);
    try {
      await axios.put(
        "http://localhost:3000/reservas/edit",
        {
          asiento,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Estado del asiento actualizado");
      obtenerReservas();
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

  //Actualizar el estado de los asientos desde el backend
  useEffect(() => {
    obtenerReservas();
  }, []);

  //Actualizar los seleccionados cuando cambia el arreglo
  useEffect(() => {
    setEnProceso(
      estadoAsientos
        .filter((a) => a.estado === "Pendiente" && a.cliente === idcliente) // solo los seleccionados por el cliente actual
        .map((a) => a)
    );
  }, [estadoAsientos]);

  //Inicializar un arreglo con la capacidad total de la sala
  const tarjetas = Array.from({ length: cap }, (_, i) => ({
    id: i + 1,
    titulo: `${i + 1}`,
  }));

  //Manejar cuando el usuario hace clic en el asiento
  const manejarClickAsiento = (numero: number) => {
    const asientoEncontrado = estadoAsientos.find(
      (asiento) => asiento.numAsiento === numero
    );

    if (asientoEncontrado) {
      setEstadoAsientos((prev) =>
        prev.map((asiento) => {
          if (asiento.numAsiento === numero) {
            if (asiento.estado === "Reservada") return asiento; // ocupado, no cambia
            if (asiento.cliente !== idcliente && asiento.estado === "Pendiente")
              return asiento; // pendiente de otro, no cambia
            if (asiento.cliente === idcliente) {
              if (asiento.estado === "Libre") {
                asiento.estado = "Pendiente";
              } else {
                asiento.estado = "Libre";
              }
              console.log(asiento);
              actualizarReserva(asiento);
              return asiento;
            }
          }
          return asiento;
        })
      );
    } else {
      nuevaReserva(numero);
    }
  };

  //Obtener color de acuerdo al estado
  const obtenerColorEstado = (descEstado: string, codCliente: string) => {
    switch (descEstado) {
      case "Libre":
        return "#ffffff";
      case "Reservada":
        return "#f44336";
      case "Pendiente":
        if (codCliente == idcliente) {
          return "#ffeb3b";
        } else {
          return "#f44336";
        }

      default:
        return "#ffffff";
    }
  };

  //Validar que la T/C solo sean números
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const soloNumeros = valor.replace(/\D/g, ""); // elimina todo lo que no sea dígito

    if (soloNumeros.length <= 16) {
      const formateado = formatearNumero(soloNumeros);
      setNumerotc(formateado);
    }
  };

  //Formatear de 4 en 4 el número de tarjeta
  const formatearNumero = (valor: string) => {
    return valor
      .replace(/\D/g, "") // quitar todo lo que no sea número
      .slice(0, 16) // máximo 16 dígitos
      .replace(/(.{4})/g, "$1 ") // agrupar de 4 en 4
      .trim(); // quitar espacio final
  };

  //Procesa la compra de los boletos seleccionados y los deja reservados
  const procesarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      cvc.length !== 3 ||
      vencimiento.length !== 5 ||
      numerotc.length !== 19
    ) {
      console.log("Formulario inválido");
      return;
    }

    const asientosSeleccionados = estadoAsientos
      .filter((a) => a.estado === "Pendiente" && a.cliente === idcliente) // solo los seleccionados por el cliente actual
      .map((a) => a.id); // extraer solo los ID

    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:3000/reservas/procesar",
        {
          asientosSeleccionados,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Registros insertados con éxito");
      setTimeout(() => {
        navigate("/resumencompra", {
          state: { asientos: asientosSeleccionados },
        });
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al procesar los datos");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setCargando(false);
    }
  };

  const cancelarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    const asientosSeleccionados = estadoAsientos
      .filter((a) => a.estado === "Pendiente" && a.cliente === idcliente) // solo los seleccionados por el cliente actual
      .map((a) => a.id); // extraer solo los ID

    setError(null);
    setCargando(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:3000/reservas/cancelar",
        {
          asientosSeleccionados,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.reservas);
      toast.success("Operación cancelada");
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al procesar los datos");
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
          Seleccionar Asientos {peli?.nombreSala} (
          {peli?.fecha.substring(0, 10)})
        </Typography>
      </Box>
      <Card sx={{ display: "flex", marginBottom: 2, width: "100%" }}>
        <CardMedia
          component="img"
          sx={{ width: 100, objectFit: "cover" }}
          image={`http://localhost:3000/posters/${peli?.poster}`}
          alt={`Poster de ${idcartelera}`}
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
      <Grid2 container spacing={2}>
        <Grid2 sx={{ width: "80%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnas}, 1fr)`,
              gridTemplateRows: `repeat(${filas}, 1fr)`,
              width: "100%",
              height: "100%",
              margin: "0 auto",
              gap: 0, // sin espacio entre columnas ni filas
              border: "1px solid #ccc", // opcional: para ver el borde general
            }}
          >
            {tarjetas.map((tarjeta) => {
              const butaca = estadoAsientos.find(
                (asiento) => asiento.numAsiento === tarjeta.id
              );
              const descEstado = butaca?.estado || "Libre";
              const codCliente = butaca?.cliente || "";
              const colorHex = obtenerColorEstado(descEstado, codCliente);

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
                      cursor:
                        colorHex === "#f44336" ? "not-allowed" : "pointer",
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
        </Grid2>
        <Grid2>
          <Box>
            <LegendItem color="#ffeb3b" label="Tus asientos" />
            <LegendItem color="#f44336" label="Reservados" />
            <LegendItem color="#ffffff" label="Disponibles" />
          </Box>
          <Box>
            <Button
              sx={{ mt: 2 }}
              disabled={enProceso.length === 0}
              variant="contained"
              onClick={abrirModal}
            >
              Realizar compra
            </Button>
          </Box>
          <Box>
            <Button
              sx={{ mt: 2 }}
              disabled={enProceso.length === 0}
              variant="contained"
              onClick={cancelarCompra}
            >
              Cancelar compra
            </Button>
          </Box>
        </Grid2>
      </Grid2>
      <Modal
        open={abierto}
        onClose={() => {}}
        disableEscapeKeyDown
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
      >
        <Box sx={estiloModal}>
          <Typography variant="h6" gutterBottom>
            Ingresar datos para el pago de sus asientos
          </Typography>
          <form onSubmit={procesarCompra}>
            <TextField
              fullWidth
              label="Número de tarjeta"
              name="tarjeta"
              variant="outlined"
              placeholder="1234 5678 9012 3456"
              value={numerotc}
              onChange={handleChange}
              inputProps={{ maxLength: 19 }}
              margin="normal"
              error={numerotc.length > 0 && numerotc.length < 19}
              helperText={
                numerotc.length > 0 && numerotc.length < 19
                  ? "Debe tener 16 dígitos"
                  : ""
              }
              required
            />
            <TextField
              fullWidth
              label="Fecha de vencimiento"
              name="vencimiento"
              placeholder="MM/YY"
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
              margin="normal"
              error={
                (vencimiento.length > 0 && vencimiento.length < 5) ||
                (vencimiento.length > 0 && !regexVencimiento.test(vencimiento))
              }
              helperText={
                (vencimiento.length > 0 && vencimiento.length < 5) ||
                (vencimiento.length > 0 && !regexVencimiento.test(vencimiento))
                  ? "Formato inválido. Usa MM/YY"
                  : ""
              }
              inputProps={{ maxLength: 5 }}
              required
            />
            <TextField
              fullWidth
              label="CVC"
              name="cvc"
              type="number"
              placeholder="###"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              margin="normal"
              error={cvc.length > 0 && (cvc.length < 3 || cvc.length > 3)}
              helperText={
                cvc.length > 0 && (cvc.length < 3 || cvc.length > 3)
                  ? "Formato inválido. Usa 3 dígitos"
                  : ""
              }
              inputProps={{ maxLength: 5 }}
              required
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={cerrarModal} sx={{ mr: 1 }} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Enviar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
