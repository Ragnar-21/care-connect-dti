import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material'
import PageTemplate from '../components/PageTemplate'
import SearchIcon from '@mui/icons-material/Search'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Sore Throat',
  'Body Ache',
  'Nausea',
  'Dizziness',
]

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAddSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  const handleAddCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom])
      setCustomSymptom('')
    }
  }

  const handleAnalyzeSymptoms = () => {
    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
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
            mb: 4,
          }}
        >
          Symptom Checker
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
          Get a preliminary assessment of your symptoms and receive
          recommendations for appropriate medical care.
        </Typography>

        <Grid container spacing={4}>
          {/* Symptom Selection */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{ color: '#185a9d', fontWeight: 700, mb: 3 }}
                >
                  Select Your Symptoms
                </Typography>

                {/* Custom Symptom Input */}
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your symptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          onClick={handleAddCustomSymptom}
                          disabled={!customSymptom}
                          sx={{
                            background:
                              'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                            '&:hover': {
                              background:
                                'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                            },
                          }}
                        >
                          Add
                        </Button>
                      ),
                    }}
                  />
                </Box>

                {/* Common Symptoms */}
                <Typography variant="h6" sx={{ color: '#185a9d', mb: 2 }}>
                  Common Symptoms
                </Typography>
                <Box sx={{ mb: 4 }}>
                  {commonSymptoms.map((symptom) => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      onClick={() => handleAddSymptom(symptom)}
                      sx={{
                        m: 0.5,
                        background:
                          'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                        color: '#fff',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Selected Symptoms */}
                <Typography variant="h6" sx={{ color: '#185a9d', mb: 2 }}>
                  Selected Symptoms
                </Typography>
                <Box>
                  {selectedSymptoms.map((symptom) => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      onDelete={() => handleRemoveSymptom(symptom)}
                      sx={{
                        m: 0.5,
                        background: '#f0f7ff',
                        color: '#185a9d',
                        '& .MuiChip-deleteIcon': {
                          color: '#185a9d',
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Cards */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <LocalHospitalIcon
                    sx={{ fontSize: 40, color: '#185a9d', mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: '#185a9d', fontWeight: 600, mb: 2 }}
                  >
                    Analyze Symptoms
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                    Get an instant preliminary assessment based on your symptoms
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAnalyzeSymptoms}
                    disabled={selectedSymptoms.length === 0 || isAnalyzing}
                    sx={{
                      background:
                        'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                      color: '#fff',
                      py: 1.5,
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                      },
                    }}
                  >
                    {isAnalyzing ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Analyze Now'
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <AssignmentTurnedInIcon
                    sx={{ fontSize: 40, color: '#185a9d', mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: '#185a9d', fontWeight: 600, mb: 2 }}
                  >
                    Book Appointment
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                    Consult with a healthcare professional for a thorough
                    evaluation
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: '#185a9d',
                      color: '#185a9d',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#43cea2',
                        color: '#43cea2',
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </PageTemplate>
  )
}

export default SymptomChecker
