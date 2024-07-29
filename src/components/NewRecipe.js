import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { db, storage } from '../firebase/firebaseConfig';

const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
];

const AddRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [instructions, setInstructions] = useState([]);
    const [currentInstruction, setCurrentInstruction] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleAddIngredient = () => {
        if (currentIngredient.trim()) {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient('');
        }
    };

    const handleAddInstruction = () => {
        if (currentInstruction.trim()) {
            setInstructions([...instructions, currentInstruction.trim()]);
            setCurrentInstruction('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleRemoveInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const storageRef = ref(storage, `images/${file.name}`);
                console.log('Uploading file to:', storageRef.fullPath);

                // Upload the file
                await uploadBytes(storageRef, file);
                console.log('Upload successful');

                // Get the download URL
                const url = await getDownloadURL(storageRef);
                console.log('Image URL:', url);

                // Update state with the URL
                setImageUrl(url);
                setImage(file); // Keep the file object for preview
            } catch (error) {
                console.error("Error uploading image: ", error);
                setError('Failed to upload image.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setError('User not logged in.');
            return;
        }

        try {
            if (!imageUrl) {
                throw new Error('Image URL is missing');
            }

            // Add new recipe to Firestore
            const recipeRef = await addDoc(collection(db, 'recipes'), {
                title,
                ingredients,
                instructions,
                category,
                imageUrl,
            });

            console.log('Recipe added successfully!');

            // Update user’s posts field with new recipe ID
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                posts: arrayUnion(recipeRef.id)
            });

            // Clear form
            setTitle('');
            setIngredients([]);
            setInstructions([]);
            setCategory('');
            setImageUrl('');
            setImage(null);

            // Redirect to recipes page
            navigate('/recipes');
        } catch (err) {
            setError('An error occurred while adding the recipe.');
            console.error('Error adding recipe:', err);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{fontFamily:"Brush Script MT ", height:"20px"}}>
                Add New Recipe
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper',
                    maxHeight: '80vh', 
                    overflowY: 'auto', 
                }}
            >
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    label="Ingredient"
                    fullWidth
                    margin="normal"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddIngredient();
                        }
                    }}
                    placeholder="Add ingredient and press Enter"
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
                <List>
                    {ingredients.map((ingredient, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={ingredient} />
                            <IconButton edge="end" onClick={() => handleRemoveIngredient(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <TextField
                    label="Instruction"
                    fullWidth
                    margin="normal"
                    value={currentInstruction}
                    onChange={(e) => setCurrentInstruction(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInstruction();
                        }
                    }}
                    placeholder="Add instruction and press Enter"
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
                <List>
                    {instructions.map((instruction, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={instruction} />
                            <IconButton edge="end" onClick={() => handleRemoveInstruction(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <FormControl fullWidth margin="normal" sx={{
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
                }}>
                    <InputLabel >Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required

                    >
                        {categories.map((cat, index) => (
                            <MenuItem key={index} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box mt={2} display="flex" alignItems="center">
                    <Button
                        variant="contained"
                        component="label"
                        size="small"
                        sx={{
                            mr: 2, backgroundColor: "#8DA399", '&:hover': {
                                backgroundColor: "#8DA399", 
                                opacity: 0.9 
                            },
                            color: 'black'
                        }}
                    >
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </Button>
                    {image && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Selected Preview"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    border: '2px solid black',
                                    borderRadius: '8px',
                                    marginLeft: '10px',
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{ ml: 2 }}
                            >
                                {image.name}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 2, backgroundColor: "#8DA399",
                        '&:hover': {
                            backgroundColor: "#8DA399", 
                        },
                        color: 'black'
                    }}
                >
                    Add Recipe
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
        </Container>
    );
};

export default AddRecipe;
