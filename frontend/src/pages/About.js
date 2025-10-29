import React from 'react'
import { Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material'
import PageTemplate from '../components/PageTemplate'

const About = () => {
  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          animation: 'fadeIn 1s ease-out',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
          }}
        >
          About Care Connect
        </Typography>

        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
            mb: 6,
          }}
        >
          Transforming healthcare through technology, making quality care
          accessible to everyone.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#185a9d',
                    mb: 2,
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#4a5568', lineHeight: 1.7 }}
                >
                  To leverage cutting-edge technology and make healthcare
                  services more accessible, efficient, and user-friendly for
                  everyone. We believe in transforming the healthcare experience
                  through innovation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#185a9d',
                    mb: 2,
                  }}
                >
                  Our Vision
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#4a5568', lineHeight: 1.7 }}
                >
                  To be the leading platform in digital healthcare solutions,
                  creating a seamless connection between patients and healthcare
                  providers while setting new standards in healthcare delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#185a9d',
                    mb: 2,
                  }}
                >
                  Our Values
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#4a5568', lineHeight: 1.7 }}
                >
                  We are committed to innovation, accessibility, and excellence
                  in healthcare. Our platform emphasizes security, user privacy,
                  and delivering the highest quality of service to our users.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#185a9d', fontWeight: 700 }}
          >
            Why Choose Care Connect?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              {
                title: 'Advanced Technology',
                description:
                  'Utilizing cutting-edge AI and machine learning for accurate symptom assessment and healthcare recommendations.',
              },
              {
                title: 'Easy Accessibility',
                description:
                  'Access healthcare services 24/7 from anywhere, making it convenient for both patients and healthcare providers.',
              },
              {
                title: 'Secure Platform',
                description:
                  'Your health information is protected with state-of-the-art security measures and HIPAA compliance.',
              },
              {
                title: 'Expert Support',
                description:
                  'Connect with qualified healthcare professionals and receive expert medical guidance.',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#185a9d',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#4a5568',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </PageTemplate>
  )
}

export default About
