import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import PendingRequests from './PendingRequests'
import DoctorPendingRequests from '../Doct/DoctorPendingRequests'
import { Typography, Container } from '@mui/material'

const RolePendingRequests = () => {
  const { userRole, userData, isAuthenticated } = useAuth()

  // Render appropriate component based on user role
  if (!isAuthenticated) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Please log in to view pending requests.
        </Typography>
      </Container>
    )
  }

  if (userRole === 'doctor') {
    return <DoctorPendingRequests />
  } else if (userRole === 'patient') {
    return <PendingRequests />
  } else {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Access denied. Only patients and doctors can view pending requests.
          Current role: {userRole || 'undefined'}
        </Typography>
      </Container>
    )
  }
}

export default RolePendingRequests
