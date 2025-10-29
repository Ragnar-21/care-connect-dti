import React, { useState, useEffect } from 'react'
import {
  getAllDoctors,
  getAllPatients,
  bookAppointment,
} from '../../services/api'

const SimpleBooking = () => {
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    doctorMedicalId: '',
    patientMedicalId: '',
    date: '',
    time: '',
    symptoms: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [doctorsResponse, patientsResponse] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
      ])
      setDoctors(doctorsResponse.data.doctors)
      setPatients(patientsResponse.data.patients)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await bookAppointment(booking)
      alert('Appointment booked successfully!')
      console.log('Appointment:', response.data.appointment)

      // Reset form
      setBooking({
        doctorMedicalId: '',
        patientMedicalId: '',
        date: '',
        time: '',
        symptoms: '',
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert(`Error: ${error.response?.data?.message || error.message}`)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Book Appointment (Medical ID System)</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Doctors List */}
        <div>
          <h3>Available Doctors</h3>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: '10px',
            }}
          >
            {doctors.map((doctor) => (
              <div
                key={doctor.medicalId}
                style={{
                  padding: '8px',
                  border: '1px solid #eee',
                  marginBottom: '5px',
                  backgroundColor:
                    booking.doctorMedicalId === doctor.medicalId
                      ? '#e8f5e8'
                      : 'white',
                }}
              >
                <strong>{doctor.username}</strong>
                <br />
                <small>Medical ID: {doctor.medicalId}</small>
                <br />
                {doctor.specialty && (
                  <small>Specialty: {doctor.specialty}</small>
                )}
                <button
                  onClick={() =>
                    setBooking({
                      ...booking,
                      doctorMedicalId: doctor.medicalId,
                    })
                  }
                  style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Patients List */}
        <div>
          <h3>Patients</h3>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: '10px',
            }}
          >
            {patients.map((patient) => (
              <div
                key={patient.medicalId}
                style={{
                  padding: '8px',
                  border: '1px solid #eee',
                  marginBottom: '5px',
                  backgroundColor:
                    booking.patientMedicalId === patient.medicalId
                      ? '#e8f5e8'
                      : 'white',
                }}
              >
                <strong>{patient.username}</strong>
                <br />
                <small>Medical ID: {patient.medicalId}</small>
                <br />
                <small>Email: {patient.email}</small>
                <button
                  onClick={() =>
                    setBooking({
                      ...booking,
                      patientMedicalId: patient.medicalId,
                    })
                  }
                  style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: '2px solid #007bff',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h3>Appointment Details</h3>

        <div style={{ marginBottom: '15px' }}>
          <label>Doctor Medical ID:</label>
          <input
            type="text"
            name="doctorMedicalId"
            value={booking.doctorMedicalId}
            onChange={handleInputChange}
            required
            placeholder="Select a doctor above"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Patient Medical ID:</label>
          <input
            type="text"
            name="patientMedicalId"
            value={booking.patientMedicalId}
            onChange={handleInputChange}
            required
            placeholder="Select a patient above"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={booking.date}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={booking.time}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Symptoms:</label>
          <textarea
            name="symptoms"
            value={booking.symptoms}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="Describe the symptoms..."
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Book Appointment
        </button>
      </form>

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
        }}
      >
        <h4>How it works:</h4>
        <ul>
          <li>Select a doctor from the list (uses Medical ID like &quot;DOC001&quot;)</li>
          <li>
            Select a patient from the list (uses Medical ID like &quot;PAT001&quot;)
          </li>
          <li>Fill in appointment details</li>
          <li>No more complex ObjectIds needed!</li>
        </ul>
      </div>
    </div>
  )
}

export default SimpleBooking
