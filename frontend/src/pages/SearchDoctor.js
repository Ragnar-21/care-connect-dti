import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Rating,
  Chip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import PageTemplate from '../components/PageTemplate'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FilterListIcon from '@mui/icons-material/FilterList'
import StarIcon from '@mui/icons-material/Star'

const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    reviews: 127,
    location: 'New York, NY',
    availableToday: true,
    image: 'https://example.com/doctor1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    experience: '12 years',
    rating: 4.9,
    reviews: 98,
    location: 'Los Angeles, CA',
    availableToday: false,
    image: 'https://example.com/doctor2.jpg',
  },
  // Add more mock doctors as needed
]

const SearchDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [sortBy, setSortBy] = useState('rating')

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
          Find a Doctor
        </Typography>

        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
            mb: 8,
          }}
        >
          Connect with top healthcare professionals and book appointments
          instantly
        </Typography>

        {/* Search and Filter Section */}
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name or specialization"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#185a9d' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    label="Specialization"
                  >
                    <MenuItem value="">All Specializations</MenuItem>
                    <MenuItem value="cardiology">Cardiology</MenuItem>
                    <MenuItem value="neurology">Neurology</MenuItem>
                    <MenuItem value="pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="dermatology">Dermatology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="experience">Experience</MenuItem>
                    <MenuItem value="availability">Availability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    height: '100%',
                    background:
                      'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                    },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Doctor Cards */}
        <Grid container spacing={4}>
          {mockDoctors.map((doctor) => (
            <Grid item xs={12} md={6} key={doctor.id}>
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
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Avatar
                        src={doctor.image}
                        sx={{
                          width: 120,
                          height: 120,
                          margin: '0 auto',
                          border: '4px solid #43cea2',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="h5"
                        sx={{ color: '#185a9d', fontWeight: 700, mb: 1 }}
                      >
                        {doctor.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                        {doctor.specialization} • {doctor.experience} Experience
                      </Typography>
                      <Box
                        sx={{
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Rating
                          value={doctor.rating}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          ({doctor.reviews} reviews)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <LocationOnIcon sx={{ color: '#185a9d' }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {doctor.location}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          background:
                            'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                          },
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageTemplate>
  )
}

export default SearchDoctor
