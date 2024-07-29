import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { doc, arrayUnion, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/AuthContext';

const Favorites = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) {
                setError('You need to be logged in to view your favorites.');
                setLoading(false);
                return;
            }

            try {
                // Fetch user document
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const favoriteIds = userData.favorites || [];


                    if (favoriteIds.length > 0) {
                        const recipesRef = collection(db, 'recipes');
                        const q = query(recipesRef, where('__name__', 'in', favoriteIds));
                        const recipesSnap = await getDocs(q);
                        const favoriteRecipes = recipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                        setRecipes(favoriteRecipes);
                    } else {
                        setRecipes([]);
                    }
                } else {
                    setError('User document does not exist.');
                }
            } catch (err) {
                setError('An error occurred while fetching favorites.');
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser]);

    const handleToggleFavorite = useCallback(async (recipeId) => {
        if (!currentUser) {
            alert('You need to be logged in to modify favorites.');
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
                    prevRecipes.filter(recipe => recipe.id !== recipeId)
                );

                console.log('Favorite status updated.');
            } else {
                console.error('User document does not exist.');
            }
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    }, [currentUser]);

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Box mt={5}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: "Brush Script MT", fontSize: "60px" }}>Your Favorites</Typography>
            <Grid container spacing={3}>
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
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
                                        <IconButton
                                            onClick={() => handleToggleFavorite(recipe.id)}
                                            color="error"
                                            aria-label="Toggle favorite"
                                        >
                                            <Favorite />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ fontFamily: "Arial", fontSize: "20px", fontStyle: "italic" }} >Empty</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Favorites;
