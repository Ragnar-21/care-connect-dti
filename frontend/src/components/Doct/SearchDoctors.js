import React, { useState } from 'react'
import { searchDoctors } from '../../services/api'
import {
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Rating,
  Chip,
  InputAdornment,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import SearchIcon from '@mui/icons-material/Search'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import StarIcon from '@mui/icons-material/Star'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PersonIcon from '@mui/icons-material/Person'
import ClearIcon from '@mui/icons-material/Clear'

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
  'General Medicine',
  'Psychiatry',
]

const SearchDoctors = () => {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const clearSearch = () => {
    setName('')
    setSpecialty('')
    setLocation('')
  }

  const handleSearch = () => {
    setLoading(true)
    setDoctors([]) // Clear previous results

    // Don't search if all fields are empty
    if (!name && !specialty && !location) {
      setSnackbar({
        open: true,
        message: 'Please enter at least one search criteria',
        severity: 'info',
      })
      setLoading(false)
      return
    }

    const params = { name, specialty, location }

    searchDoctors(params)
      .then((response) => {
        console.log('Search response:', response) // Debug log
        const doctorsList = response.data || []
        setDoctors(doctorsList)
        setLoading(false)

        if (doctorsList.length === 0) {
          setSnackbar({
            open: true,
            message: `No doctors found matching "${name}"${specialty ? ` in ${specialty}` : ''}${location ? ` at ${location}` : ''}`,
            severity: 'info',
          })
        }
      })
      .catch((error) => {
        console.error('Error searching doctors:', error)
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            'Failed to search doctors. Please try again.',
          severity: 'error',
        })
        setLoading(false)
      })
  }

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
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 40 }} />
          Find Your Doctor
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
          Search for qualified healthcare professionals by name, specialty, or
          location
        </Typography>

        <Card
          sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  label="Doctor Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Search by name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#43cea2' }} />
                      </InputAdornment>
                    ),
                  }}
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
              <Grid item xs={12} md={3}>
                <TextField
                  label="Specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="e.g., Cardiology"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicalServicesIcon sx={{ color: '#43cea2' }} />
                      </InputAdornment>
                    ),
                  }}
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
              <Grid item xs={12} md={3}>
                <TextField
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="City or Hospital"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: '#43cea2' }} />
                      </InputAdornment>
                    ),
                  }}
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
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={handleSearch}
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={<SearchIcon />}
                    sx={{
                      background:
                        'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                      borderRadius: '30px',
                      padding: '12px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      height: '56px',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 20px rgba(24,90,157,0.3)',
                      },
                    }}
                  >
                    Search
                  </Button>
                  <IconButton
                    onClick={clearSearch}
                    sx={{
                      bgcolor: 'rgba(24,90,157,0.1)',
                      height: '56px',
                      width: '56px',
                      '&:hover': {
                        bgcolor: 'rgba(24,90,157,0.2)',
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', mb: 2 }}>
                Popular Specialties:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specialties.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onClick={() => setSpecialty(s)}
                    sx={{
                      background:
                        specialty === s
                          ? 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)'
                          : 'rgba(24,90,157,0.1)',
                      color: specialty === s ? '#fff' : '#185a9d',
                      fontWeight: 500,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {doctors.length > 0 && (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                <Card
                  sx={{
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
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        alt={doctor.username}
                        src={doctor.profilePicture}
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: '#185a9d',
                          fontSize: '1.5rem',
                        }}
                      >
                        {doctor.username[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ color: '#185a9d', fontWeight: 600 }}
                        >
                          Dr. {doctor.username}
                        </Typography>
                        <Rating
                          value={4}
                          readOnly
                          size="small"
                          icon={<StarIcon fontSize="inherit" />}
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#43cea2',
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MedicalServicesIcon
                        sx={{ color: '#43cea2', mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {doctor.specialty}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon
                        sx={{ color: '#43cea2', mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {doctor.location}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EventAvailableIcon />}
                      sx={{
                        background:
                          'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                        borderRadius: '30px',
                        padding: '10px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 8px 20px rgba(24,90,157,0.3)',
                        },
                      }}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

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
    </PageTemplate>
  )
}

export default SearchDoctors
