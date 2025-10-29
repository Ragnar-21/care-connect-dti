import React, { useState, useEffect } from 'react'
import { fetchProfile } from './profileUtils'
import { useAuth } from '../../contexts/AuthContext'
import { updateProfile } from '../../services/api'
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

const API_URL = 'http://localhost:5001/api'

const UpdateProfile = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const userId = userData?.id
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const [formData, setFormData] = useState({
    userId,
    username: '',
    email: '',
    phoneNumber: '',
    medicalId: '',
    specialty: '',
    location: '',
  })
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    medicalId: '',
    profilePicture: '',
    role: '',
    specialty: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    fetchProfile(userData, setLoading, setProfile, API_URL)
  }, [userData, authLoading])

  useEffect(() => {
    if (profile.username) {
      setFormData({
        userId,
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        medicalId: profile.medicalId,
        specialty: profile.specialty || '',
        location: profile.location || '',
      })
    }
  }, [profile, userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
      .then((response) => {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success',
        })
        setProfile({
          ...profile,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          medicalId: formData.medicalId,
          specialty: formData.specialty,
          location: formData.location,
        })
      })
      .catch((error) => {
        console.error(error)
        setSnackbar({
          open: true,
          message: 'Failed to update profile',
          severity: 'error',
        })
      })
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography
            variant="h5"
            sx={{ color: '#185a9d', fontWeight: 700, mb: 4 }}
          >
            Personal Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#185a9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43cea2',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#185a9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43cea2',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#185a9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43cea2',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Medical ID"
                name="medicalId"
                value={formData.medicalId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#185a9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43cea2',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {profile.role === 'doctor' && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography
                variant="h5"
                sx={{ color: '#185a9d', fontWeight: 700, mb: 4 }}
              >
                Professional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., Cardiology, Dermatology"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#185a9d',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#43cea2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., City Hospital, Downtown Clinic"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#185a9d',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#43cea2',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                borderRadius: '30px',
                padding: '12px 48px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 20px rgba(24,90,157,0.3)',
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default UpdateProfile
