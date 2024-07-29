import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, InputAdornment } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{

                    marginTop: 5,
                    color: '#333',
                    fontFamily: "Brush Script MT",
                }}
            >
                Login to Start Posting your Recipes
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '100%',
                    borderRadius: 2,
                    backgroundColor: "smoke white"
                }}
            >

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'grey !important', 
                            },
                            '&:hover fieldset': {
                                borderColor: 'grey !important', 
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'grey !important', 
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'grey !important' 
                        }
                    }}
                    onChange={(e) => setEmail(e.target.value)}

                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'grey !important', 
                            },
                            '&:hover fieldset': {
                                borderColor: 'grey !important', 
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'grey !important', 
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'grey !important' 
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"

                    fullWidth
                    sx={{
                        mt: 2, backgroundColor: "#8DA399",
                        '&:hover': {
                            backgroundColor: "#8DA399", 
                            opacity: 0.9 
                        },
                        color: 'black',
                    }}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
