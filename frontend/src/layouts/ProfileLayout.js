import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container, Tabs, Tab, Box, Paper } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import PageTemplate from '../components/PageTemplate'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

const ProfileLayout = () => {
  const location = useLocation()
  const currentTab = location.pathname.split('/').pop() || 'profile'

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
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
            mb: 4,
          }}
        >
          <Tabs
            value={currentTab}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#43cea2',
              },
              '& .MuiTab-root': {
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 64,
                color: '#666',
                '&.Mui-selected': {
                  color: '#185a9d',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: '#43cea2',
                },
              },
            }}
          >
            <Tab
              label="View Profile"
              icon={<AccountCircleIcon />}
              value="profile"
              component={Link}
              to="/profile"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            />
            <Tab
              label="Update Profile"
              icon={<EditIcon />}
              value="update"
              component={Link}
              to="/profile/update"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            />
            <Tab
              label="Upload Picture"
              icon={<PhotoCameraIcon />}
              value="upload"
              component={Link}
              to="/profile/upload"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            />
          </Tabs>
        </Paper>
        <Box>
          <Outlet />
        </Box>
      </Box>
    </PageTemplate>
  )
}

export default ProfileLayout
