// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddRecipe from './components/NewRecipe';
import RecipeList from './components/RecipePage';
import Navbar from './components/Header';
import './App.css'
import Recipe from './components/Recipe';
import Favorites from './components/Favorite';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <Navbar/>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<Recipe />} /> 
          <Route
          path="/post-recipe"
          element={<PrivateRoute element={<AddRecipe />} />}
        />
        <Route
          path="/favorites"
          element={<PrivateRoute element={<Favorites />} />}
        />
      
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
