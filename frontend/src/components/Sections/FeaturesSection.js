import care7 from '../../assets/care7.png'
import care8 from '../../assets/care8.png'
import care9 from '../../assets/care9.png'
import care88 from '../../assets/care88.png'
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import PropTypes from 'prop-types'

const items = [
  {
    icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: '2rem' }} />,
    title: 'Comprehensive Care',
    description:
      'Access a full range of health services from experienced doctors, ensuring all your medical needs are met.',
    imageLight: `url(${care8})`,
    imageDark: `url(${care8})`,
  },
  {
    icon: <VerifiedUserRoundedIcon sx={{ fontSize: '2rem' }} />,
    title: 'Secure and Private',
    description:
      'Your health information is protected with top-level security, ensuring your privacy at all times.',
    imageLight: `url(${care9})`,
    imageDark: `url(${care9})`,
  },
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: '2rem' }} />,
    title: 'Actionable Insights',
    description:
      'Receive detailed analytics and insights on your health, helping you make informed decisions.',
    imageLight: `url(${care7})`,
    imageDark: `url(${care7})`,
  },
  {
    icon: <SupportAgentRoundedIcon sx={{ fontSize: '2rem' }} />,
    title: '24/7 Support',
    description:
      'Our customer support team is available around the clock to assist you with any queries or issues.',
    imageLight: `url(${care88})`,
    imageDark: `url(${care88})`,
  },
  {
    icon: <EventAvailableRoundedIcon sx={{ fontSize: '2rem' }} />,
    title: 'Easy Appointments',
    description:
      'Schedule and manage appointments effortlessly with our user-friendly booking system.',
    imageLight: `url(${care7})`,
    imageDark: `url(${care7})`,
  },
]

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)

  const handleItemClick = (index) => {
    setSelectedItemIndex(index)
  }

  const selectedFeature = items[selectedItemIndex]

  return (
    <Box
      id="features"
      sx={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 35%, rgba(67, 206, 162, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 65%, rgba(24, 90, 157, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 10, sm: 16 },
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Stack spacing={4} alignItems="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 800,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              animation: 'fadeInDown 1s ease-out',
            }}
          >
            Product Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
              color: '#555',
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.8,
              animation: 'fadeIn 1s ease-out 0.3s both',
            }}
          >
            Discover the key features of our CareConnect application, designed
            to provide comprehensive care, security, actionable insights, and
            more.
          </Typography>
        </Stack>

        {/* Desktop View */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Grid
            container
            spacing={{ xs: 4, md: 6 }}
            sx={{
              maxWidth: '1800px',
              mx: 'auto',
            }}
          >
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                {items.slice(0, 2).map((item, index) => (
                  <FeatureCard
                    key={index}
                    item={item}
                    index={index}
                    isSelected={selectedItemIndex === index}
                    onClick={() => handleItemClick(index)}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  height: '500px',
                  position: 'relative',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: '1px solid rgba(230, 230, 230, 0.8)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  animation: 'fadeIn 1s ease-out 0.8s both',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '90%',
                    backgroundImage: selectedFeature.imageLight,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'pulseScale 4s infinite',
                  }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                {items.slice(2, 4).map((item, index) => (
                  <FeatureCard
                    key={index + 2}
                    item={item}
                    index={index + 2}
                    isSelected={selectedItemIndex === index + 2}
                    onClick={() => handleItemClick(index + 2)}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Mobile View */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              mb: 4,
              justifyContent: 'center',
              '& > *': { margin: '4px !important' },
            }}
          >
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderRadius: '12px',
                  padding: '12px',
                  height: 'auto',
                  background:
                    selectedItemIndex === index
                      ? 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)'
                      : 'rgba(255, 255, 255, 0.9)',
                  color: selectedItemIndex === index ? '#fff' : '#555',
                  border: '1px solid',
                  borderColor:
                    selectedItemIndex === index
                      ? 'transparent'
                      : 'rgba(230, 230, 230, 0.8)',
                  boxShadow:
                    selectedItemIndex === index
                      ? '0 4px 16px rgba(24, 90, 157, 0.15)'
                      : 'none',
                  '&:hover': {
                    background:
                      selectedItemIndex === index
                        ? 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)'
                        : 'rgba(67, 206, 162, 0.1)',
                  },
                  '& .MuiChip-label': {
                    fontSize: '1rem',
                    px: 2,
                  },
                }}
              />
            ))}
          </Stack>

          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid rgba(230, 230, 230, 0.8)',
              overflow: 'hidden',
              animation: 'fadeIn 0.5s ease-out',
              mx: 'auto',
              maxWidth: '600px',
            }}
          >
            <Box
              sx={{
                backgroundImage: selectedFeature.imageLight,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 320,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#185a9d',
                  mb: 2,
                }}
              >
                {selectedFeature.title}
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                }}
              >
                {selectedFeature.description}
              </Typography>
              <Link
                color="primary"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#43cea2',
                  textDecoration: 'none',
                  '& > svg': {
                    transition: 'transform 0.2s',
                    ml: 0.5,
                  },
                  '&:hover > svg': {
                    transform: 'translateX(4px)',
                  },
                }}
              >
                Learn more
                <ChevronRightRoundedIcon fontSize="small" />
              </Link>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

// Feature Card Component
const FeatureCard = ({ item, index, isSelected, onClick }) => (
  <Card
    variant="outlined"
    component={Button}
    onClick={onClick}
    sx={{
      p: 3,
      height: 'fit-content',
      width: '100%',
      background: isSelected
        ? 'linear-gradient(135deg, rgba(67, 206, 162, 0.08) 0%, rgba(24, 90, 157, 0.08) 100%)'
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid',
      borderColor: isSelected
        ? 'rgba(67, 206, 162, 0.3)'
        : 'rgba(230, 230, 230, 0.8)',
      boxShadow: isSelected ? '0 8px 32px rgba(24, 90, 157, 0.12)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `fadeInUp 1s ease-out ${index * 0.15}s both`,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(24, 90, 157, 0.12)',
        borderColor: 'rgba(67, 206, 162, 0.5)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        textAlign: 'left',
        alignItems: 'flex-start',
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: isSelected
            ? 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)'
            : 'rgba(67, 206, 162, 0.1)',
          color: isSelected ? '#fff' : '#43cea2',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {item.icon}
      </Box>
      <Box sx={{ textTransform: 'none', flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: isSelected ? '#185a9d' : '#333',
            mb: 1,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            lineHeight: 1.7,
            mb: 1.5,
            fontSize: '0.95rem',
          }}
        >
          {item.description}
        </Typography>
        <Link
          color="primary"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: '#43cea2',
            textDecoration: 'none',
            '& > svg': {
              transition: 'transform 0.2s',
              ml: 0.5,
            },
            '&:hover > svg': {
              transform: 'translateX(4px)',
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Learn more
          <ChevronRightRoundedIcon fontSize="small" />
        </Link>
      </Box>
    </Box>
  </Card>
)

FeatureCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
