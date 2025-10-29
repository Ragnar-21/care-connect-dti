import React from 'react'
import care1 from '../../assets/care1.png'
import care2 from '../../assets/care2.png'
import care3 from '../../assets/care3.png'
import { Box, Container, Stack, Typography, Button } from '@mui/material'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './HeroSection.module.css'

const photos = [
  {
    src: care1,
    alt: 'Comprehensive health monitoring and advice',
  },
  {
    src: care2,
    alt: '24/7 access to healthcare professionals',
  },
  {
    src: care3,
    alt: 'User-friendly interface for easy navigation',
  },
]

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(24,90,157,0.95) 0%, rgba(67,206,162,0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        boxSizing: 'border-box',
        left: 0,
        right: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: { xs: 8, sm: 10 },
          position: 'relative',
          zIndex: 1,
          maxWidth: '1440px',
          width: '100%',
          mx: 'auto',
        }}
      >
        <Stack
          spacing={3}
          useFlexGap
          sx={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            px: { xs: 2, sm: 4 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
              fontWeight: 800,
              textAlign: 'center',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              animation: 'fadeInDown 1s ease-out',
            }}
          >
            Welcome to Care Connect
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              color: '#ffffff',
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              fontFamily: 'Roboto, Arial, sans-serif',
              mb: 3,
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto',
              animation: 'fadeIn 1s ease-out 0.5s both',
            }}
          >
            Your personal health assistant, providing comprehensive care and
            support anytime, anywhere. Experience healthcare reimagined for the
            modern age.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mt: 4,
              animation: 'fadeInUp 1s ease-out 1s both',
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                boxShadow: '0 4px 24px 0 rgba(67,206,162,0.25)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 28px 0 rgba(67,206,162,0.3)',
                  background:
                    'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
                },
              }}
              href="#features"
            >
              Explore Features
            </Button>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              mt: { xs: 6, sm: 8 },
              animation: 'fadeIn 1s ease-out 1.5s both',
            }}
          >
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              transitionTime={500}
              stopOnHover={true}
              swipeable={true}
              emulateTouch={true}
              dynamicHeight={false}
              sx={{
                '& .carousel .slide img': {
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                },
              }}
            >
              {photos.map((photo, index) => (
                <div key={index}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
