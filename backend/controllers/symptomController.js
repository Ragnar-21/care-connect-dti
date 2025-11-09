const { queryNLPService } = require('../services/nlpService')

exports.checkSymptoms = async (req, res) => {
  const { symptoms } = req.body
  try {
    const result = await queryNLPService(symptoms)
    console.log('NLP Service result:', result);
    
    const response = { 
      message: result.formattedMessage || result.message || result,
      severityScore: result.severityScore || 0,
      urgency: result.urgency || 'Routine',
      recommendedAction: result.recommendedAction || ''
    };
    
    console.log('Sending response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in symptom check:', error);
    res.status(500).json({ error: error.message })
  }
}
