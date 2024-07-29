import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, CardMedia, Container, List, ListItem, CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useParams } from 'react-router-dom';

const Recipe = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          setError('No such recipe found.');
        }
      } catch (err) {
        setError('An error occurred while fetching the recipe.');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {recipe ? (
        <Card sx={{ maxWidth: 600, margin: 'auto' }}>
          {recipe.imageUrl && (
            <CardMedia
              component="img"
              height="200" 
              image={recipe.imageUrl}
              alt={recipe.title}
              sx={{ objectFit: 'cover' }} 
            />
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
            <Typography variant="h6" color="text.secondary">Category: {recipe.category || 'N/A'}</Typography>
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <Typography variant="body1" color="text.secondary">{ingredient}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Instructions:</Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>
                      <Typography variant="body1" color="text.secondary">{instruction}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center' }}>Recipe not found</Typography>
      )}
    </Container>
  );
};

export default Recipe;
