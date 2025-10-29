import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ToggleColorMode from './ToggleColorMode'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Navbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const location = useLocation()

  const commonItems = [{ label: 'Profile', link: '/profile' }]

  const adminItems = [
    { label: 'Users', link: '/admin/users' },
    { label: 'Doctors', link: '/admin/doctors' },
    { label: 'Appointments', link: '/admin/appointments' },
    { label: 'Analytics', link: '/admin/analytics' },
    { label: 'Activity Logs', link: '/admin/activity-logs' },
  ]

  const doctorItems = [
    { label: 'Pending Requests', link: '/doctor/pending-requests' },
    { label: 'Upcoming Appointments', link: '/doctor/upcoming-appointments' },
    { label: 'Appointment History', link: '/doctor/appointment-history' },
    { label: 'My Feedback', link: '/doctor/feedback' },
  ]

  const patientItems = [
    { label: 'Symptom Checker', link: '/patient/symptom-checker' },
    { label: 'Search Doctors', link: '/patient/search-doctors' },
    { label: 'Appointments', link: '/patient/appointments-hub' },
    { label: 'Feedback', link: '/patient/feedback-hub' },
  ]

  const isActiveRoute = (path) => location.pathname === path

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(24, 90, 157, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              fontWeight: 700,
              mr: 4,
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            Care Connect
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                color: isActiveRoute('/') ? '#185a9d' : '#666',
                fontWeight: isActiveRoute('/') ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  background: 'rgba(67, 206, 162, 0.08)',
                  color: '#43cea2',
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              startIcon={<InfoIcon />}
              sx={{
                color: isActiveRoute('/about') ? '#185a9d' : '#666',
                fontWeight: isActiveRoute('/about') ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  background: 'rgba(67, 206, 162, 0.08)',
                  color: '#43cea2',
                },
              }}
            >
              About
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {isAuthenticated ? (
            <>
              {/* Role-specific navigation items */}
              {userRole === 'admin' &&
                adminItems.concat(commonItems).map((item) => (
                  <Button
                    component={Link}
                    to={item.link}
                    key={item.link}
                    sx={{
                      color: isActiveRoute(item.link) ? '#185a9d' : '#666',
                      fontWeight: isActiveRoute(item.link) ? 600 : 400,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'rgba(67, 206, 162, 0.08)',
                        color: '#43cea2',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              {userRole === 'doctor' &&
                doctorItems.concat(commonItems).map((item) => (
                  <Button
                    component={Link}
                    to={item.link}
                    key={item.link}
                    sx={{
                      color: isActiveRoute(item.link) ? '#185a9d' : '#666',
                      fontWeight: isActiveRoute(item.link) ? 600 : 400,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'rgba(67, 206, 162, 0.08)',
                        color: '#43cea2',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              {userRole === 'patient' &&
                patientItems.concat(commonItems).map((item) => (
                  <Button
                    component={Link}
                    to={item.link}
                    key={item.link}
                    sx={{
                      color: isActiveRoute(item.link) ? '#185a9d' : '#666',
                      fontWeight: isActiveRoute(item.link) ? 600 : 400,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'rgba(67, 206, 162, 0.08)',
                        color: '#43cea2',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              <Button
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{
                  ml: 2,
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/signup"
                startIcon={<PersonAddIcon />}
                sx={{
                  color: isActiveRoute('/signup') ? '#185a9d' : '#666',
                  fontWeight: isActiveRoute('/signup') ? 600 : 400,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'rgba(67, 206, 162, 0.08)',
                    color: '#43cea2',
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  px: 3,
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #1a4f8c 0%, #3db892 100%)',
                  },
                }}
              >
                Login
              </Button>
            </>
          )}
          <Box sx={{ ml: 2 }}>
            <ToggleColorMode mode={mode} toggleColorMode={toggleTheme} />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
