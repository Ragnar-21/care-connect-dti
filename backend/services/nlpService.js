const process = require('process')
const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

// Initialize Gemini with updated model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
// Use the new model names - gemini-2.5-flash is the latest and fastest
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

const queryNLPService = async (query) => {
  try {
    const prompt = `You are an AI medical assistant providing structured health information. Analyze the symptoms and provide a well-formatted response.

**User Symptoms**: ${query}

Please provide your response in the following EXACT JSON format (make sure it's valid JSON):

{
  "primary_assessment": "[Brief description of symptom severity and general impact on well-being. DO NOT mention specific diseases or diagnoses. Focus on describing the symptoms objectively.]",
  "first_aid_tips": [
    "tip1",
    "tip2",
    "tip3"
  ],
  "warning_signs": [
    "sign1",
    "sign2",
    "sign3"
  ],
  "severity_score": [number from 1-10, where 1=very mild, 10=life-threatening emergency],
  "when_to_seek_help": "[Specific guidance on when to see a doctor]",
  "urgency": "[Routine/Same Day/Urgent/Emergency]",
  "recommended_action": "[Based on severity_score: 1-3=Schedule a routine check-up, 4-6=Book an appointment soon, 7-8=Book urgent care appointment, 9-10=Seek immediate emergency care]",
  "disclaimer": "This is AI-generated health information for educational purposes only. Always consult healthcare professionals for medical advice, diagnosis, or treatment."
}

Ensure the JSON is properly formatted and valid. Base severity score on symptom intensity and potential impact on daily activities.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini response received successfully')
    
    // Try to parse JSON response and format it nicely
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON from Gemini:', jsonData);
        
        const structuredResult = {
          formattedMessage: formatSymptomAnalysis(jsonData),
          severityScore: jsonData.severity_score || 0,
          urgency: jsonData.urgency || 'Routine',
          recommendedAction: jsonData.recommended_action || ''
        };
        
        console.log('Returning structured result:', structuredResult);
        return structuredResult;
      } else {
        // Fallback if JSON parsing fails
        return {
          formattedMessage: formatFallbackResponse(query, text),
          severityScore: 5,
          urgency: 'Same Day',
          recommendedAction: 'Book an appointment soon'
        };
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback formatting');
      return {
        formattedMessage: formatFallbackResponse(query, text),
        severityScore: 5,
        urgency: 'Same Day',
        recommendedAction: 'Book an appointment soon'
      };
    }
    
  } catch (error) {
    console.error('Error querying Gemini:', error)
    
    // Enhanced error handling for different error types
    let errorMessage = 'AI service temporarily unavailable'
    
    if (error.message && error.message.includes('quota')) {
      errorMessage = 'AI service quota exceeded. Please try again later'
      console.error('Gemini quota exceeded - check billing and usage limits')
    } else if (error.message && error.message.includes('404')) {
      errorMessage = 'AI model temporarily unavailable'
      console.error('Gemini model not found - may need to update model name')
    } else if (error.message && error.message.includes('401')) {
      errorMessage = 'AI service authentication failed'
      console.error('Gemini API key issue - check configuration')
    }
    
    // Provide a fallback response if Gemini fails
    return {
      formattedMessage: formatErrorResponse(query, errorMessage),
      severityScore: 5,
      urgency: 'Same Day',
      recommendedAction: 'Book an appointment soon to discuss your symptoms'
    }
  }
}

// Format the structured JSON response into a nice presentation
const formatSymptomAnalysis = (data) => {
  const severityEmoji = getSeverityEmoji(data.severity_score);
  const urgencyColor = getUrgencyIndicator(data.urgency);
  
  const report = [
    "🏥 SYMPTOM ANALYSIS REPORT",
    "═══════════════════════════════════════",
    "",
    "📊 SEVERITY ASSESSMENT",
    `   ${severityEmoji} Score: ${data.severity_score}/10`,
    `   ${urgencyColor} Urgency: ${data.urgency}`,
    "",
    "🔍 PRIMARY ASSESSMENT",
    `   ${data.primary_assessment}`,
    "",
    "🚑 FIRST AID TIPS",
    ...data.first_aid_tips.map(tip => `   ✓ ${tip}`),
    "",
    "⚠️ WARNING SIGNS TO WATCH",
    ...data.warning_signs.map(sign => `   🚨 ${sign}`),
    "",
    "👨‍⚕️ WHEN TO SEEK MEDICAL HELP",
    `   ${data.when_to_seek_help}`,
    "",
    "🏥 RECOMMENDED ACTION",
    `   ${data.recommended_action}`,
    "",
    data.severity_score > 1 ? [
      "═══════════════════════════════════════",
      "🔵 NEXT STEPS",
      "   Book an appointment with a healthcare provider based on the urgency level.",
      "   Click the 'Book Appointment' button below to proceed.",
      "═══════════════════════════════════════"
    ].join('\n') : "",
    "",
    "═══════════════════════════════════════",
    "⚖️ MEDICAL DISCLAIMER",
    `   ${data.disclaimer}`,
    "═══════════════════════════════════════"
  ].filter(Boolean);
  
  return report.join('\n');
};

// Fallback formatting for non-JSON responses
const formatFallbackResponse = (query, rawText) => {
  const report = [
    "🏥 SYMPTOM ANALYSIS REPORT",
    "═══════════════════════════════════════",
    "",
    `📝 SYMPTOMS ANALYZED: ${query}`,
    "",
    "📊 ASSESSMENT",
    `   ${rawText}`,
    "",
    "═══════════════════════════════════════",
    "⚖️ MEDICAL DISCLAIMER",
    "   This is AI-generated health information for educational purposes only.",
    "   Always consult healthcare professionals for medical advice, diagnosis, or treatment.",
    "═══════════════════════════════════════"
  ];
  
  return report.join('\n');
};

// Error response formatting
const formatErrorResponse = (query, errorMessage) => {
  const report = [
    "🏥 SYMPTOM ANALYSIS REPORT",
    "═══════════════════════════════════════",
    "",
    `📝 SYMPTOMS ANALYZED: ${query}`,
    "",
    "📊 SEVERITY ASSESSMENT",
    "   🟡 Score: 5/10 | Level: Moderate",
    "   🟡 Urgency: Same Day",
    "",
    "🔍 GENERAL ASSESSMENT",
    "   Based on your symptoms, this appears to be a health concern that requires attention and monitoring.",
    "",
    "⚡ IMMEDIATE ACTIONS",
    "   ✓ Monitor your symptoms closely",
    "   ✓ Rest and stay hydrated",
    "   ✓ Avoid strenuous activities",
    "",
    "🏠 SELF-CARE RECOMMENDATIONS",
    "   • Get adequate rest and sleep",
    "   • Stay well hydrated with water",
    "   • Maintain a comfortable environment",
    "",
    "⚠️ WARNING SIGNS TO WATCH",
    "   🚨 Symptoms getting worse rapidly",
    "   🚨 Severe pain or discomfort",
    "   🚨 Difficulty breathing or chest pain",
    "",
    "👨‍⚕️ WHEN TO SEEK MEDICAL HELP",
    "   If symptoms persist for more than 2-3 days, worsen, or if you develop any warning signs, consult a healthcare professional immediately.",
    "",
    "═══════════════════════════════════════",
    "⚖️ MEDICAL DISCLAIMER",
    "   This is general health information only. For accurate medical advice, please consult with a qualified healthcare provider.",
    "",
    `   Note: ${errorMessage}. Please try again later or consult with a healthcare professional directly.`,
    "═══════════════════════════════════════"
  ];
  
  return report.join('\n');
};

// Get emoji based on severity score
const getSeverityEmoji = (score) => {
  if (score <= 2) return '🟢'; // Green - Low
  if (score <= 4) return '🟡'; // Yellow - Mild
  if (score <= 6) return '🟠'; // Orange - Moderate
  if (score <= 8) return '🔴'; // Red - High
  return '🆘'; // Emergency - Critical
};

// Get urgency indicator
const getUrgencyIndicator = (urgency) => {
  const indicators = {
    'Routine': '🔵',
    'Same Day': '🟡',
    'Urgent': '🟠',
    'Emergency': '🔴'
  };
  return indicators[urgency] || '🔵';
};

module.exports = { queryNLPService }
