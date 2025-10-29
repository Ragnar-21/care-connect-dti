import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'

const items = [
  {
    icon: <LocalHospitalRoundedIcon />,
    title: 'Comprehensive Care',
    description:
      'Access a full range of health services from experienced doctors, ensuring all your medical needs are met.',
  },
  {
    icon: <VerifiedUserRoundedIcon />,
    title: 'Secure and Private',
    description:
      'Your health information is protected with top-level security, ensuring your privacy at all times.',
  },
  {
    icon: <InsightsRoundedIcon />,
    title: 'Actionable Insights',
    description:
      'Receive detailed analytics and insights on your health, helping you make informed decisions.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: '24/7 Support',
    description:
      'Our customer support team is available around the clock to assist you with any queries or issues.',
  },
  {
    icon: <EventAvailableRoundedIcon />,
    title: 'Easy Appointments',
    description:
      'Schedule and manage appointments effortlessly with our user-friendly booking system.',
  },
  {
    icon: <HealthAndSafetyRoundedIcon />,
    title: 'Quality Assurance',
    description:
      'We adhere to the highest standards of healthcare, ensuring you receive the best possible care.',
  },
]

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 10, sm: 14 },
      }}
    >
      {/* Dynamic Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 35%, rgba(67, 206, 162, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 65%, rgba(24, 90, 157, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)
          `,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23185a9d' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.5,
          },
        }}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" mb={10}>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 800,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              maxWidth: '900px',
              mb: 1,
              animation: 'fadeInDown 1s ease-out',
            }}
          >
            Features that Set Us Apart
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.15rem', sm: '1.35rem' },
              color: '#555',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.8,
              animation: 'fadeIn 1s ease-out 0.5s both',
              letterSpacing: '0.01em',
            }}
          >
            Experience healthcare reimagined with our cutting-edge platform
            designed for your comfort and convenience
          </Typography>
        </Stack>

        <Grid container spacing={4} alignItems="stretch">
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 4px 30px rgba(24, 90, 157, 0.07)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  p: 4,
                  animation: `fadeInUp 1s ease-out ${index * 0.15}s both`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(135deg, rgba(67, 206, 162, 0.05), rgba(24, 90, 157, 0.05))',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(24, 90, 157, 0.12)',
                    border: '1px solid rgba(67, 206, 162, 0.3)',
                    '&::before': {
                      opacity: 1,
                    },
                    '& .feature-icon-wrapper': {
                      transform: 'scale(1.1) rotate(5deg)',
                      background:
                        'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                      boxShadow: '0 10px 20px rgba(24, 90, 157, 0.15)',
                      '& svg': {
                        color: '#ffffff',
                        transform: 'scale(1.1)',
                      },
                    },
                    '& .feature-title': {
                      background:
                        'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transform: 'translateX(8px)',
                    },
                  },
                }}
              >
                {/* Icon Wrapper */}
                <Box
                  className="feature-icon-wrapper"
                  sx={{
                    width: 88,
                    height: 88,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '24px',
                    background: 'rgba(67, 206, 162, 0.1)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    mb: 3.5,
                    position: 'relative',
                    zIndex: 1,
                    '& svg': {
                      fontSize: 44,
                      color: '#43cea2',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                  }}
                >
                  {item.icon}
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  className="feature-title"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.6rem', sm: '1.75rem' },
                    mb: 2.5,
                    position: 'relative',
                    zIndex: 1,
                    color: '#185a9d',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#555',
                    lineHeight: 1.85,
                    fontSize: '1.15rem',
                    position: 'relative',
                    zIndex: 1,
                    flex: 1,
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
