import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
      {'Copyright © '}
      <Link color="inherit" href="/" sx={{ textDecoration: 'none' }}>
        Care Connect
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Community', href: '/community' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'HIPAA Compliance', href: '/hipaa' },
  ],
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        position: 'relative',
        background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
        color: '#fff',
        py: { xs: 6, sm: 10 },
        overflow: 'hidden',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        boxSizing: 'border-box',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: 3, sm: 4 },
        }}
      >
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  mb: 2,
                  background:
                    'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Care Connect
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3,
                  maxWidth: '300px',
                  lineHeight: 1.6,
                }}
              >
                Transforming healthcare through technology. Making quality
                healthcare accessible to everyone, everywhere.
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  '& .MuiIconButton-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
              >
                <IconButton
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <PhoneOutlinedIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <MailOutlineIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <LocationOnOutlinedIcon />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <Grid item xs={12} sm={6} md={2} key={category}>
              <Typography
                variant="subtitle1"
                component="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#fff',
                  textTransform: 'capitalize',
                }}
              >
                {category}
              </Typography>
              <Stack spacing={2}>
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#fff',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Copyright />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              '& .MuiIconButton-root': {
                bgcolor: 'rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                },
              },
            }}
          >
            <IconButton
              href="https://github.com/your-github"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://linkedin.com/your-linkedin"
              target="_blank"
              rel="noopener"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com/your-twitter"
              target="_blank"
              rel="noopener"
            >
              <TwitterIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
