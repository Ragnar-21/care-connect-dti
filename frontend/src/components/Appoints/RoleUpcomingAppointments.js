import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import UpcomingAppointments from './UpcomingAppointments'
import DoctorUpcomingAppointments from '../Doct/DoctorUpcomingAppointments'
import { Typography, Container } from '@mui/material'

const RoleUpcomingAppointments = () => {
  const { userRole, userData, isAuthenticated } = useAuth()

  console.log('RoleUpcomingAppointments: User role:', userRole)
  console.log('RoleUpcomingAppointments: User data:', userData)
  console.log('RoleUpcomingAppointments: Is authenticated:', isAuthenticated)

  // Render appropriate component based on user role
  if (userRole === 'doctor') {
    console.log(
      'RoleUpcomingAppointments: Rendering DoctorUpcomingAppointments'
    )
    return <DoctorUpcomingAppointments />
  } else if (userRole === 'patient') {
    console.log(
      'RoleUpcomingAppointments: Rendering UpcomingAppointments (patient)'
    )
    return <UpcomingAppointments />
  } else {
    console.log('RoleUpcomingAppointments: Unknown role, showing access denied')
    return (
      <Container>
        <Typography variant="h6" color="error">
          Access denied. Only patients and doctors can view upcoming
          appointments.
        </Typography>
      </Container>
    )
  }
}

export default RoleUpcomingAppointments
