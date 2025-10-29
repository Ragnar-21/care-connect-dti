import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchProfile } from './profileUtils'
import { useAuth } from '../../contexts/AuthContext'
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BadgeIcon from '@mui/icons-material/Badge'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const API_URL = 'http://localhost:5001/api'

const ProfileField = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
    {icon}
    <Box>
      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: '#185a9d', fontWeight: 500 }}>
        {value || 'Not specified'}
      </Typography>
    </Box>
  </Box>
)

ProfileField.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
}

const UserProfile = () => {
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

  const { userRole, userData, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    fetchProfile(userData, setLoading, setProfile, API_URL)
  }, [userData, userRole, authLoading])

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

  if (!profile.username) {
    return (
      <Card
        sx={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#666' }}>
          User not found
        </Typography>
      </Card>
    )
  }

  return (
    <Grid container spacing={4}>
      {/* Profile Overview */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              src={profile.profilePicture}
              alt={profile.username}
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 24px',
                border: '4px solid #43cea2',
                boxShadow: '0 8px 32px rgba(67,206,162,0.2)',
              }}
            />
            <Typography
              variant="h4"
              sx={{ color: '#185a9d', fontWeight: 700, mb: 2 }}
            >
              {profile.username}
            </Typography>
            <Chip
              label={
                profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
              }
              sx={{
                background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 500,
                mb: 3,
              }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Profile Details */}
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
              sx={{ color: '#185a9d', fontWeight: 700, mb: 4 }}
            >
              Personal Information
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={
                    <AccountCircleIcon
                      sx={{ color: '#43cea2', fontSize: 28 }}
                    />
                  }
                  label="Username"
                  value={profile.username}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={<EmailIcon sx={{ color: '#43cea2', fontSize: 28 }} />}
                  label="Email"
                  value={profile.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={<PhoneIcon sx={{ color: '#43cea2', fontSize: 28 }} />}
                  label="Phone Number"
                  value={profile.phoneNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={<BadgeIcon sx={{ color: '#43cea2', fontSize: 28 }} />}
                  label="Medical ID"
                  value={profile.medicalId}
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
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <ProfileField
                      icon={
                        <LocalHospitalIcon
                          sx={{ color: '#43cea2', fontSize: 28 }}
                        />
                      }
                      label="Specialty"
                      value={profile.specialty}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileField
                      icon={
                        <LocationOnIcon
                          sx={{ color: '#43cea2', fontSize: 28 }}
                        />
                      }
                      label="Location"
                      value={profile.location}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserProfile
