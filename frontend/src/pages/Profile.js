import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Divider,
} from '@mui/material'
import PageTemplate from '../components/PageTemplate'
import EditIcon from '@mui/icons-material/Edit'
import SecurityIcon from '@mui/icons-material/Security'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsIcon from '@mui/icons-material/Notifications'

const Profile = () => {
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
          My Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Overview Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto 20px',
                    border: '4px solid #43cea2',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ color: '#185a9d', fontWeight: 700, mb: 1 }}
                >
                  John Doe
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Patient ID: #123456
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    background:
                      'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                    color: '#fff',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
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
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value="John Doe"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value="john.doe@example.com"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value="+1 234 567 8900"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      value="01/01/1990"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Sections */}
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {[
                {
                  icon: (
                    <SecurityIcon sx={{ fontSize: 40, color: '#185a9d' }} />
                  ),
                  title: 'Security Settings',
                  description:
                    'Manage your account security and privacy preferences',
                },
                {
                  icon: <HistoryIcon sx={{ fontSize: 40, color: '#185a9d' }} />,
                  title: 'Medical History',
                  description: 'View your complete medical history and records',
                },
                {
                  icon: (
                    <NotificationsIcon
                      sx={{ fontSize: 40, color: '#185a9d' }}
                    />
                  ),
                  title: 'Notifications',
                  description: 'Configure your notification preferences',
                },
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      {item.icon}
                      <Typography
                        variant="h6"
                        sx={{ color: '#185a9d', fontWeight: 600, my: 2 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageTemplate>
  )
}

export default Profile
