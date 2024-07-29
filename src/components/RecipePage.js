import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardMedia, MenuItem, Select, Button, FormControl, InputLabel, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { collection, getDocs, updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'recipes'));
                const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecipes(recipesData);
                setFilteredRecipes(recipesData);

                const uniqueCategories = [...new Set(recipesData.map(recipe => recipe.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } catch (err) {
                setError('An error occurred while fetching recipes.');
                console.error('Error fetching recipes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        const updateFavoriteStatus = async () => {
            if (!currentUser) return;
            setLoading(true);
            const userRef = doc(db, 'users', currentUser.uid);
            try {
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const favoriteIds = userData.favorites || [];

            
                    setRecipes(prevRecipes =>
                        prevRecipes.map(recipe => ({
                            ...recipe,
                            isFavorite: favoriteIds.includes(recipe.id)
                        }))
                    );
                    setFilteredRecipes(prevRecipes =>
                        prevRecipes.map(recipe => ({
                            ...recipe,
                            isFavorite: favoriteIds.includes(recipe.id)
                        }))
                    );
                   
                } else {
                    console.error('User document does not exist.');
                }
            } catch (err) {
                console.error('Error fetching favorite status:', err);
            }
            finally{
                setLoading(false);
            }
        };

        updateFavoriteStatus();
    }, [currentUser]);

    const toggleFavorite = useCallback(async (recipeId) => {
        if (!currentUser) {
            alert('You need to be logged in to add favorites');
            return;
        }

        const userRef = doc(db, 'users', currentUser.uid);

        try {
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const favorites = userData.favorites || [];
                const isFavorite = favorites.includes(recipeId);

            
                await updateDoc(userRef, {
                    favorites: isFavorite ? arrayRemove(recipeId) : arrayUnion(recipeId)
                });

                
                setRecipes(prevRecipes =>
                    prevRecipes.map(recipe =>
                        recipe.id === recipeId ? { ...recipe, isFavorite: !isFavorite } : recipe
                    )
                );
                setFilteredRecipes(prevRecipes =>
                    prevRecipes.map(recipe =>
                        recipe.id === recipeId ? { ...recipe, isFavorite: !isFavorite } : recipe
                    )
                );
            
                console.log('Favorite status updated.');
            } else {
                console.error('User document does not exist.');
            }
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    }, [currentUser]);

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);

        if (category === '') {
            setFilteredRecipes(recipes);
        } else {
            setFilteredRecipes(recipes.filter(recipe => recipe.category === category));
        }
    };

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Box mt={5}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: "Brush Script MT" }}>Recipe List</Typography>
            <Box mb={2} display="flex" justifyContent="flex-end">
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="Category"
                        endAdornment={<Button onClick={() => handleCategoryChange({ target: { value: '' } })}>Clear</Button>}
                    >
                        <MenuItem value="">All</MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <Grid container spacing={3}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map(recipe => (
                            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                                <Card>
                                    {recipe.imageUrl && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={recipe.imageUrl}
                                            alt={recipe.title}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6">{recipe.title}</Typography>
                                        {recipe.category && (
                                            <Typography variant="body2" color="text.secondary">Category: {recipe.category}</Typography>
                                        )}
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                                <Button variant="outlined" sx={{ mt: 2 }}>View Details</Button>
                                            </Link>
                                            {currentUser && (
                                                <IconButton
                                                    onClick={() => toggleFavorite(recipe.id)}
                                                    color={recipe.isFavorite ? 'error' : 'default'}
                                                    aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                                >
                                                    {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
                                
                                                </IconButton>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6">No recipes available.</Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default RecipeList;




