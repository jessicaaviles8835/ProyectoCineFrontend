import { Avatar, Box, Button, Paper, TextField } from "@mui/material"
import IconoRojo from "../../../public/IconoUserRojo.png"
import { AccountCircle } from "@mui/icons-material"
import HttpsIcon from '@mui/icons-material/Https';



export const Login: React.FC<{}> = () => {
    return (
        <Box sx={{ bgcolor: "#d8d8d8", width: '100%', height: '100vh', display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={24} sx={{ width: 400, height: 300, borderRadius: "10%" }}>
                <Box sx={{ width: "100%", height:80, position: "relative" }}>
                    <Avatar alt="Avatar Icon" src={IconoRojo} sx={{ position: "absolute", left: "50%", top: -50, height: 100, width: 100, transform: "translateX(-50%)" }} />
                </Box>
                <Box sx={{display:"grid", placeItems:"center", rowGap:2}}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end',  width:"80%" }}>
                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="input-user-name" label="Nombre de usuario" variant="standard" sx={{width:"100%"}}/>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', width:"80%" }}>
                        <HttpsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="input-password" label="Contraseña" variant="standard" sx={{width:"100%"}}/>
                    </Box>
                    <Box sx={{marginTop:3}}>
                        <Button sx={{bgcolor:"#ff6b6b"}} variant="contained">Iniciar sesión</Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}