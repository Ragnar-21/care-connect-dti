const Doctor = require('../models/doctorModel')
const User = require('../models/userModel')

exports.updateAvailability = async (req, res) => {
  const { doctorId, date, slots } = req.body

  try {
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    let availability = doctor.availability.find(
      (a) => a.date.toISOString().split('T')[0] === date,
    )
    if (availability) {
      // Update existing availability
      availability.slots = slots
    } else {
      // Add new availability
      doctor.availability.push({ date, slots })
    }

    await doctor.save()
    res
      .status(200)
      .json({ message: 'Availability updated successfully', doctor })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

exports.searchDoctors = async (req, res) => {
  const { name, specialty, location } = req.query

  try {
    let query = { role: 'doctor' }

    // Case-insensitive name search across username, firstName, and lastName
    if (name) {
      query.$or = [
        { username: { $regex: name, $options: 'i' } },
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ];
    }

    // Case-insensitive specialty search
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    // Case-insensitive location search
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const doctors = await User.find(query)
      .select('username firstName lastName email specialty location medicalId profilePicture') // Include all necessary fields
      .sort({ firstName: 1, lastName: 1 }); // Sort by name

    res.status(200).json(doctors)
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ message: 'Internal server error', error })
  }
}
