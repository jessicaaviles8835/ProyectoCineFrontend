import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BotonVolver = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)} // -1 vuelve una página atrás en el historial
      sx={{ borderRadius: "8px", mt: 2 }}
    >
      Regresar
    </Button>
  );
};

export default BotonVolver;
