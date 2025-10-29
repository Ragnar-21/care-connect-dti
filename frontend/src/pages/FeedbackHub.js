import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
} from '@mui/material'
import {
  Feedback,
  History,
  Star,
  RateReview,
  TrendingUp,
} from '@mui/icons-material'

const FeedbackHub = () => {
  const navigate = useNavigate()

  const feedbackOptions = [
    {
      title: 'Give Feedback',
      description:
        'Share your experience with doctors and help other patients make informed decisions.',
      icon: <Feedback sx={{ fontSize: 48, color: 'primary.main' }} />,
      buttonText: 'Write Review',
      buttonColor: 'primary',
      route: '/patient/feedback',
      features: [
        'Rate your doctor experience',
        'Write detailed feedback',
        'Help other patients',
        'Anonymous option available',
      ],
    },
    {
      title: 'Feedback History',
      description:
        'View and manage all the feedback you have submitted to doctors.',
      icon: <History sx={{ fontSize: 48, color: 'secondary.main' }} />,
      buttonText: 'View History',
      buttonColor: 'secondary',
      route: '/patient/feedback-history',
      features: [
        'View all your reviews',
        'Track your feedback',
        'Manage submissions',
        'Personal statistics',
      ],
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <RateReview sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        </Box>
        <Typography variant="h3" gutterBottom>
          Feedback Center
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
          Your voice matters in improving healthcare quality
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Share your experiences with doctors to help other patients make
          informed decisions, and view your feedback history to track your
          contributions to the community.
        </Typography>
      </Paper>

      {/* Options Grid */}
      <Grid container spacing={4}>
        {feedbackOptions.map((option, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition:
                  'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>{option.icon}</Box>

                <Typography variant="h4" gutterBottom>
                  {option.title}
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mb: 3 }}
                >
                  {option.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ textAlign: 'center', mb: 2 }}
                  >
                    Features:
                  </Typography>
                  {option.features.map((feature, featureIndex) => (
                    <Box
                      key={featureIndex}
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      <Star
                        sx={{ color: 'primary.main', mr: 1, fontSize: 16 }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  color={option.buttonColor}
                  size="large"
                  fullWidth
                  onClick={() => navigate(option.route)}
                  sx={{ py: 1.5 }}
                >
                  {option.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Statistics Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Why Your Feedback Matters
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                🏥
              </Typography>
              <Typography variant="h6" gutterBottom>
                Improve Healthcare
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your feedback helps doctors improve their services and patient
                care quality.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                👥
              </Typography>
              <Typography variant="h6" gutterBottom>
                Help Others
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Share your experience to help other patients choose the right
                doctor for their needs.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                ⭐
              </Typography>
              <Typography variant="h6" gutterBottom>
                Build Trust
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Honest reviews build trust in the healthcare community and
                promote transparency.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default FeedbackHub
