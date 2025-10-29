import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import PageTemplate from '../components/PageTemplate'
import {
  EventAvailable as EventAvailableIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Pending as PendingIcon,
} from '@mui/icons-material'

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(24,90,157,0.15)',
    '& .icon-wrapper': {
      transform: 'scale(1.1)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #185a9d, #43cea2)',
  },
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #185a9d, #43cea2)',
  transition: 'transform 0.3s ease',
  boxShadow: '0 8px 16px rgba(24,90,157,0.2)',
  color: 'white',
}))

const AppointmentsHub = () => {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Book Appointment',
      description:
        'Schedule a new appointment with our healthcare professionals',
      icon: <EventAvailableIcon sx={{ fontSize: 36 }} />,
      path: '/patient/book-appointment',
    },
    {
      title: 'Upcoming Appointments',
      description: 'View and manage your scheduled appointments',
      icon: <ScheduleIcon sx={{ fontSize: 36 }} />,
      path: '/patient/upcoming-appointments',
    },
    {
      title: 'Pending Requests',
      description: 'Track the status of your appointment requests',
      icon: <PendingIcon sx={{ fontSize: 36 }} />,
      path: '/patient/pending-requests',
    },
    {
      title: 'Appointment History',
      description: 'Access your past appointments and medical records',
      icon: <HistoryIcon sx={{ fontSize: 36 }} />,
      path: '/patient/appointment-history',
    },
  ]

  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          animation: 'fadeIn 1s ease-out',
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textAlign: 'center',
              textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Appointment Center
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 5,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Manage all your healthcare appointments in one place. Book new
            appointments, track requests, and view your medical history.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <StyledCard onClick={() => navigate(feature.path)}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <IconWrapper className="icon-wrapper">
                    {feature.icon}
                  </IconWrapper>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: '#185a9d',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageTemplate>
  )
}

export default AppointmentsHub
