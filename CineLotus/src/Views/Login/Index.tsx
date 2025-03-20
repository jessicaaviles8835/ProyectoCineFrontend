import { Avatar, Box, Button, Paper, TextField } from "@mui/material"
import IconoRojo from "../../../public/IconoUserRojo.png"
import { AccountCircle } from "@mui/icons-material"
import HttpsIcon from '@mui/icons-material/Https';
import React, { useState } from 'react';
import axios from 'axios';




export const Login: React.FC<{}> = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/users/login', {
            username,
            password
          });
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
      };
      
      const handleProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No estás autenticado');
          return;
        }
    
        try {
          const response = await axios.get('http://localhost:3000/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.data.message);
        } catch (error) {
          console.error('Error al obtener perfil:', error);
        }
      };

    return (
        <Box sx={{ bgcolor: "#d8d8d8", width: '100%', height: '100vh', display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={24} sx={{ width: 400, height: 300, borderRadius: "10%" }}>
                <Box sx={{ width: "100%", height:80, position: "relative" }}>
                    <Avatar alt="Avatar Icon" src={IconoRojo} sx={{ position: "absolute", left: "50%", top: -50, height: 100, width: 100, transform: "translateX(-50%)" }} />
                </Box>
                <Box sx={{display:"grid", placeItems:"center", rowGap:2}}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end',  width:"80%" }}>
                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="input-user-name" label="Nombre de usuario" variant="standard" sx={{width:"100%"}} onChange={(e) => setUsername(e.target.value)}/>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', width:"80%" }}>
                        <HttpsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="input-password" label="Contraseña" variant="standard" sx={{width:"100%"}} onChange={(e) => setPassword(e.target.value)}/>
                    </Box>
                    <Box sx={{marginTop:3}}>
                        <Button sx={{bgcolor:"#ff6b6b"}} variant="contained" onClick={handleLogin}>Iniciar sesión</Button>
                    </Box>
                </Box>
                <button onClick={handleProfile}>Ver perfil</button>

                {token && <div>Token JWT: {token}</div>}
            </Paper>
        </Box>
    )
}