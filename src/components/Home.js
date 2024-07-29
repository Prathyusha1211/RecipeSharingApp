import { Box, Button, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import image2 from '../Images/biryani3.webp';
import image4 from '../Images/Drinks.jpeg';
import image3 from '../Images/momos.webp';
import image1 from '../Images/vannilaDessert.jpeg';
import { useAuth } from '../auth/AuthContext';

const images = [
    image1,
    image2,
    image3,
    image4
];


const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

const Home = () => {
    const { currentUser } = useAuth();

   return(
     <Box textAlign="center" mt={5}>
        <Typography
            variant="h2"
            gutterBottom
            sx={{
                fontFamily: 'Brush Script MT',
                color: "black",
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
        >
            Top Recipes of the Day
        </Typography>

        <Box
            mt={4}
            sx={{
                display: 'flex',
                justifyContent: 'center', 
                overflow: 'hidden',
                maxWidth: '100%', 
                mx: 'auto', 

            }}
        >
            <Box
                sx={{
                    width: '700px',  
                    height: '600px', 
                    position: 'relative',
                    overflow: 'hidden',

                }}
            >
                <Slider {...sliderSettings}>
                    {images.map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '500px',
                                    objectFit: 'cover',
                                    border: '1px solid black', 
                                    boxSizing: 'border-box', 
                                    display: 'block', 
                                    margin: '0 auto', 
                                    backgroundColor: 'white', 
                                }}
                            />
                        </div>
                    ))}
                </Slider>
            </Box>
        </Box>

    
      {!currentUser&& <>
        <Button component={RouterLink} to="/login" variant="contained" sx={{
                        mt: 2, backgroundColor: "#8DA399",
                        '&:hover': {
                            backgroundColor: "#8DA399", 
                            opacity: 0.9 
                        },
                        color: 'black'
                    }}>
            Login
        </Button>

        <Typography variant="body1" sx={{ mt: 2 }}>
            New user? <Link sx={{ color: "blue" }} component={RouterLink} to="/signup" variant="body1" >Sign up here</Link>
        </Typography>
      </>}
    </Box>
    )
};

export default Home;




