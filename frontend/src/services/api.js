import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post('/refresh-token')
        const { token, user } = response.data

        // Update localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('userData', JSON.stringify(user))

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`

        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        localStorage.removeItem('userRole')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Admin
export const getUsers = () => api.get('/users')
export const getDoctors = () => api.get('/doctors')
export const getAppointments = () => api.get('/appointments')
export const updateUser = (user) => api.put('/user', user)
export const deleteUser = (userId) => api.delete(`/user/${userId}`)
export const updateAppointment = (appointment) =>
  api.put('/appointment', appointment)
export const deleteAppointment = (appointmentId) =>
  api.delete(`/appointment/${appointmentId}`)

export const getAnalyticsData = () => api.get('/analytics/data')
export const getActivityLogs = () => api.get('/activityLogs')

//Appointments
export const bookAppointment = (data) => api.post('/book', data)
export const getAppointmentHistory = (userMedicalId) =>
  api.get('/history', { params: { userMedicalId } })
export const getAllDoctors = () => api.get('/doctors')
export const getAllPatients = () => api.get('/patients')

//profile
export const getProfile = (userId) => api.get(`/profile/${userId}`)
export const updateProfile = (data) => api.post('/profile/update', data)
export const uploadProfilePicture = (userId, formData) =>
  api.post(`/profile/uploadProfilePicture/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Auth
export const signup = (data) => api.post('/signup', data)
export const login = (data) => api.post('/login', data)
export const refreshToken = () => api.post('/refresh-token')

// Chat
export const sendMessage = (data) => api.post('/chat/send', data)
export const getMessages = (userId1, userId2) =>
  api.get(`/chat/messages/${userId1}/${userId2}`)

// Feedback APIs
export const createFeedback = async (data) => {
  try {
    const response = await api.post('/feedback', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getDoctorFeedback = async (doctorMedicalId) => {
  try {
    const response = await api.get(`/feedback/doctor/${doctorMedicalId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getPatientFeedback = async (patientMedicalId) => {
  try {
    const response = await api.get(`/feedback/patient/${patientMedicalId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteFeedback = async (feedbackId, patientMedicalId) => {
  try {
    const response = await api.delete(`/feedback/${feedbackId}`, {
      data: { patientMedicalId },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Notifications
export const sendReminder = (data) =>
  api.post('/notifications/send-reminder', data)

// Doctor
export const searchDoctors = (params) => api.get('/doctors/search', { params })

// Symptoms
export const checkSymptoms = (data) => api.post('/symptoms/check', data)

// Appointment Requests
export const createAppointmentRequest = (data) =>
  api.post('/appointment-requests', data)
export const getDoctorAppointmentRequests = (doctorMedicalId) =>
  api.get(`/appointment-requests/doctor/${doctorMedicalId}`)
export const getPatientAppointmentRequests = (patientMedicalId) => {
  console.log('Fetching appointment requests for patient:', patientMedicalId)
  return api.get(`/appointment-requests/patient/${patientMedicalId}`)
}
export const updateAppointmentRequestStatus = (requestId, data) =>
  api.put(`/appointment-requests/${requestId}/status`, data)
export const addMessageToRequest = (requestId, data) =>
  api.post(`/appointment-requests/${requestId}/messages`, data)
export const getAppointmentRequestById = (requestId) =>
  api.get(`/appointment-requests/${requestId}`)

// Appointment Management
export const getPendingRequests = (medicalId) =>
  api.get(`/appointments/pending/${medicalId}`)
export const getUpcomingAppointments = (medicalId) =>
  getPatientAppointmentRequests(medicalId)
export const acceptAppointment = (requestId) =>
  api.put(`/appointment-requests/${requestId}/status`, { status: 'approved' })
export const rejectAppointment = (requestId) =>
  api.put(`/appointment-requests/${requestId}/status`, { status: 'rejected' })
export const cancelAppointment = (requestId) =>
  api.put(`/appointment-requests/${requestId}/status`, { status: 'cancelled' })

// Appointment endpoints with urgency score
export const bookAppointmentWithUrgency = (data) =>
  api.post('/appointments/book', data)
export const getDoctorsAvailable = () => api.get('/doctors/available')

// Function to convert severity score to urgency level
export const getUrgencyFromSeverity = (severityScore) => {
  if (severityScore >= 9) return 'Emergency'
  if (severityScore >= 7) return 'Urgent'
  if (severityScore >= 4) return 'Same Day'
  return 'Routine'
}
