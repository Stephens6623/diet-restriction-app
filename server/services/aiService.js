const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

/**
 * Analyze product by barcode
 * Note: In a real application, you would fetch product details from a barcode database API
 * For this implementation, we'll simulate the barcode lookup
 */
async function analyzeByBarcode(barcode, restrictions) {
  try {
    // In a real app, you would call a barcode API like Open Food Facts
    // For now, we'll use AI to provide general guidance
    const prompt = `A user with dietary restrictions scanned a barcode: ${barcode}.
Their restrictions are: ${restrictions.join(', ')}.

Since we don't have real-time barcode database access, please provide:
1. General advice on what to look for on product labels for these restrictions
2. Common ingredients to avoid for each restriction
3. Recommendations for verifying product safety

Format the response as a JSON object with:
- safe: boolean (false since we can't verify without real data)
- warnings: array of warnings
- recommendations: array of recommendations`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful dietary restriction assistant. Provide clear, accurate information about food safety for people with dietary restrictions." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(responseText);
      return {
        ...parsed,
        barcode,
        method: 'barcode'
      };
    } catch (e) {
      // If AI doesn't return valid JSON, create a structured response
      return {
        safe: false,
        barcode,
        method: 'barcode',
        warnings: ['Unable to verify product safety from barcode alone'],
        recommendations: [
          'Please scan the ingredient label for accurate analysis',
          'Look for allergen warnings on the package',
          responseText
        ]
      };
    }
  } catch (error) {
    console.error('Error in analyzeByBarcode:', error);
    throw new Error('Failed to analyze barcode');
  }
}

/**
 * Analyze product by image of ingredient label
 */
async function analyzeByImage(imageBuffer, restrictions) {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `Analyze this product ingredient label image for someone with the following dietary restrictions: ${restrictions.join(', ')}.

Please:
1. Extract and list all visible ingredients
2. Identify any ingredients that conflict with the restrictions
3. Determine if the product is safe to consume
4. Provide specific warnings about problematic ingredients
5. Give recommendations

Return a JSON object with:
- safe: boolean (true if safe, false if not)
- ingredients: array of extracted ingredients
- conflicts: array of problematic ingredients with explanations
- warnings: array of warning messages
- recommendations: array of recommendations`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(responseText);
      return {
        ...parsed,
        method: 'image'
      };
    } catch (e) {
      // If AI doesn't return valid JSON, parse the text response
      return {
        safe: responseText.toLowerCase().includes('safe') && !responseText.toLowerCase().includes('not safe'),
        method: 'image',
        ingredients: [],
        conflicts: [],
        warnings: [responseText.substring(0, 200)],
        recommendations: ['Please verify the analysis by checking the product label carefully'],
        rawResponse: responseText
      };
    }
  } catch (error) {
    console.error('Error in analyzeByImage:', error);
    throw new Error('Failed to analyze image: ' + error.message);
  }
}

module.exports = {
  analyzeByBarcode,
  analyzeByImage
};
