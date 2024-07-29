import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, IconButton, InputAdornment } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig'; // Adjust import if necessary
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { doc, setDoc } from 'firebase/firestore';


const createOrUpdateUserDocument = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      favorites: [],  
      posts: []      
    }, { merge: true }); 
    console.log('User document created or updated.');
  } catch (error) {
    console.error('Error creating or updating user document:', error);
  }
};

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await createOrUpdateUserDocument(user);

      console.log('User signed up and document created/updated');
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else if (error.code === 'auth/invalid-email') {
        setError('The email address is badly formatted.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password must be at least 6 characters long.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error signing up:', error.message);
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
          
          marginTop:5, 
          color: '#333',
          fontFamily:"Brush Script MT", 
        }}
      >
         Sign Up, Start, Save
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSignUp}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
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
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 ,backgroundColor: "#8DA399",
                '&:hover': {
                  backgroundColor: "#8DA399", 
                  opacity: 0.9 
                },
                color: 'black'}}
          >
            Sign Up
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      </Paper>
    </Box>
  );
};

export default SignUp;
