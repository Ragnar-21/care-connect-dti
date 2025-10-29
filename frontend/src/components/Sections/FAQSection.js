import React, { useState } from 'react'
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './FAQSection.module.css'

const faqs = [
  {
    question: 'What is Care Connect?',
    answer:
      'Care Connect is a comprehensive healthcare platform designed to help you manage your health by booking appointments, checking symptoms, and connecting with healthcare professionals seamlessly.',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment by navigating to the "Appointments" section, selecting your preferred doctor, and choosing a suitable time slot from their available schedule.',
  },
  {
    question: 'Can I check my symptoms using Care Connect?',
    answer:
      'Yes, Care Connect offers an advanced symptom checker feature where you can enter your symptoms and receive preliminary advice. However, this should not replace professional medical consultation.',
  },
  {
    question: 'How do I update my profile?',
    answer:
      'You can update your profile by clicking on your profile icon and selecting "Edit Profile". Here you can update your personal information, medical history, and preferences.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'We prioritize your privacy and data security. All your information is encrypted using state-of-the-art technology, and we comply with HIPAA and other relevant healthcare data protection standards.',
  },
]

const FAQSection = () => {
  const [expanded, setExpanded] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 8, sm: 12 },
          px: { xs: 3, sm: 4 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              animation: 'fadeInDown 1s ease-out',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              color: '#666',
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              mb: 6,
              maxWidth: '800px',
              margin: '0 auto',
              animation: 'fadeIn 1s ease-out 0.5s both',
              px: { xs: 2, sm: 0 },
            }}
          >
            Find answers to common questions about our services and platform
          </Typography>
          <Box
            sx={{
              maxWidth: '900px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {faqs.map((faq, index) => (
              <Accordion
                expanded={String(expanded) === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                key={index}
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px !important',
                  mb: 2,
                  boxShadow:
                    expanded === `panel${index}`
                      ? '0 8px 32px rgba(24,90,157,0.15)'
                      : '0 4px 16px rgba(24,90,157,0.08)',
                  border: '1px solid rgba(67,206,162,0.2)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 1s ease-out ${index * 0.2}s both`,
                  width: '100%',
                  '&:before': {
                    display: 'none',
                  },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(24,90,157,0.12)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color:
                          expanded === `panel${index}` ? '#185a9d' : '#43cea2',
                        transition: 'all 0.3s ease',
                        transform:
                          expanded === `panel${index}`
                            ? 'rotate(180deg)'
                            : 'none',
                      }}
                    />
                  }
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      margin: '16px 0',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: expanded === `panel${index}` ? '#185a9d' : '#666',
                      fontSize: { xs: '1.1rem', sm: '1.2rem' },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    borderTop: '1px solid rgba(67,206,162,0.2)',
                    padding: '16px 24px 24px',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#666',
                      lineHeight: 1.7,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default FAQSection
