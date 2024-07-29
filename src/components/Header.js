import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Avatar, Box, Popover, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { AccountCircle } from '@mui/icons-material';

const Navbar = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleMenuClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'profile-popover' : undefined;

    return (
        <AppBar position="static" sx={{ color: 'black', backgroundColor: '#8DA399' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontSize: '1.5rem', fontStyle: 'italic' }}
                >
                    Recipe Sharing App
                </Typography>
                <Container
                    maxWidth="lg"
                    sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}
                >
                    <Button
                        component={Link}
                        to="/"
                        sx={{
                            color: 'black',
                            textTransform: 'none',
                            fontSize: '1.3rem',
                            '&:hover': {
                                textDecoration: 'underline',
                                backgroundColor: 'transparent',
                            },
                            fontStyle: 'italic'
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="/post-recipe"
                        sx={{
                            color: 'black',
                            textTransform: 'none',
                            fontSize: '1.3rem',
                            '&:hover': {
                                textDecoration: 'underline',
                                backgroundColor: 'transparent',
                            },
                            fontStyle: 'italic'
                        }}
                    >
                        Post Recipe
                    </Button>
                    <Button
                        component={Link}
                        to="/recipes"
                        sx={{
                            color: 'black',
                            textTransform: 'none',
                            fontSize: '1.3rem',
                            '&:hover': {
                                textDecoration: 'underline',
                                backgroundColor: 'transparent',
                            },
                            fontStyle: 'italic'
                        }}
                    >
                        View Recipes
                    </Button>
                    {userEmail && (
                        <>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{ color: 'black' }}
                            >
                                <Avatar sx={{ bgcolor: '#5F9EA0' }}>
                                    <AccountCircle />
                                </Avatar>
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{ p: 1 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MenuItem onClick={() => handleNavigate('/favorites')}>Favorites</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Box>
                            </Popover>
                        </>
                    )}
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
