import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { uploadProfilePicture } from '../../services/api'
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PhotoIcon from '@mui/icons-material/Photo'
import DeleteIcon from '@mui/icons-material/Delete'

const UploadProfilePicture = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const { userData } = useAuth()

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (file) {
      formData.append('profilePicture', file)
      uploadProfilePicture(userData?.id, formData)
        .then((response) => {
          setSnackbar({
            open: true,
            message: 'Profile picture uploaded successfully',
            severity: 'success',
          })
          setFile(null)
          setPreview(null)
        })
        .catch((error) => {
          console.error(error)
          setSnackbar({
            open: true,
            message: 'Failed to upload profile picture',
            severity: 'error',
          })
        })
    }
  }

  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: '#185a9d', fontWeight: 700, mb: 4, textAlign: 'center' }}
        >
          Update Profile Picture
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 250,
              height: 250,
              borderRadius: '20px',
              border: '2px dashed #43cea2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: preview ? 'none' : 'rgba(67,206,162,0.1)',
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      background: 'rgba(255,255,255,1)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <PhotoIcon sx={{ fontSize: 64, color: '#43cea2' }} />
            )}
          </Box>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="profile-picture-input"
          />

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <label htmlFor="profile-picture-input">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderColor: '#43cea2',
                  color: '#185a9d',
                  borderRadius: '30px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#185a9d',
                    background: 'rgba(24,90,157,0.1)',
                  },
                }}
              >
                Choose Image
              </Button>
            </label>

            {file && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  background:
                    'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                  borderRadius: '30px',
                  padding: '12px 48px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 20px rgba(24,90,157,0.3)',
                  },
                }}
              >
                Upload Picture
              </Button>
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{ color: '#666', textAlign: 'center' }}
          >
            Supported formats: JPG, PNG, GIF
            <br />
            Maximum file size: 5MB
          </Typography>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default UploadProfilePicture
