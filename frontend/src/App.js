import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CssBaseline, CircularProgress, Grid } from '@mui/material'
import './styles/branding.css'
import './styles/animations.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AdminLayout from './layouts/AdminLayout'
import DoctorLayout from './layouts/DoctorLayout'
import PatientLayout from './layouts/PatientLayout'
import MainLayout from './layouts/MainLayout'
import Navbar from './components/Navbar'
import ProfileLayout from './layouts/ProfileLayout'

const Signup = lazy(() => import('./components/Auth/Signup'))
const Login = lazy(() => import('./components/Auth/Login'))
const Users = lazy(() => import('./components/Admin/Users'))
const Doctors = lazy(() => import('./components/Admin/Doctors'))
const Appointments = lazy(() => import('./components/Admin/Appointments'))
const Analytics = lazy(() => import('./components/Admin/Analytics'))
const ActivityLogs = lazy(() => import('./components/Admin/ActivityLogs'))
const BookAppointment = lazy(
  () => import('./components/Appoints/BookAppointment')
)
const RolePendingRequests = lazy(
  () => import('./components/Appoints/RolePendingRequests')
)
const RoleUpcomingAppointments = lazy(
  () => import('./components/Appoints/RoleUpcomingAppointments')
)
const AppointmentHistory = lazy(
  () => import('./components/Appoints/AppointmentHistory')
)
const UserProfile = lazy(() => import('./components/Profile/UserProfile'))
const UpdateProfile = lazy(() => import('./components/Profile/UpdateProfile'))
const UploadProfilePicture = lazy(
  () => import('./components/Profile/UploadProfilePicture')
)
const FeedbackForm = lazy(() => import('./components/Feed/FeedbackForm'))
const DoctorFeedback = lazy(() => import('./components/Feed/DoctorFeedback'))
const PatientFeedbackHistory = lazy(
  () => import('./components/Feed/PatientFeedbackHistory')
)
const SearchDoctors = lazy(() => import('./components/Doct/SearchDoctors'))
const SymptomChecker = lazy(() => import('./components/Symptom/SymptomChecker'))

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const FeedbackHub = lazy(() => import('./pages/FeedbackHub'))

const AppointmentsHub = lazy(() => import('./pages/AppointmentsHub'))

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CssBaseline />
          <Navbar />
          <Suspense
            fallback={
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
              >
                <CircularProgress />
              </Grid>
            }
          >
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>

              {/* Patient routes */}
              <Route path="/patient" element={<PatientLayout />}>
                <Route path="appointments-hub" element={<AppointmentsHub />} />
                <Route path="book-appointment" element={<BookAppointment />} />
                <Route
                  path="pending-requests"
                  element={<RolePendingRequests />}
                />
                <Route
                  path="upcoming-appointments"
                  element={<RoleUpcomingAppointments />}
                />
                <Route
                  path="appointment-history"
                  element={<AppointmentHistory />}
                />
                <Route path="symptom-checker" element={<SymptomChecker />} />
                <Route path="search-doctors" element={<SearchDoctors />} />
                <Route path="feedback-hub" element={<FeedbackHub />} />
                <Route path="feedback" element={<FeedbackForm />} />
                <Route
                  path="feedback-history"
                  element={<PatientFeedbackHistory />}
                /> 
              </Route>

              {/* Doctor routes */}
              <Route path="/doctor" element={<DoctorLayout />}>
                <Route path="appointments-hub" element={<AppointmentsHub />} />
                <Route
                  path="pending-requests"
                  element={<RolePendingRequests />}
                />
                <Route
                  path="upcoming-appointments"
                  element={<RoleUpcomingAppointments />}
                />
                <Route
                  path="appointment-history"
                  element={<AppointmentHistory />}
                />
                <Route path="feedback" element={<DoctorFeedback />} /> 
              </Route>

              {/* Profile routes */}
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="update" element={<UpdateProfile />} />
                 <Route path="picture" element={<UploadProfilePicture />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="users" element={<Users />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="activity-logs" element={<ActivityLogs />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
