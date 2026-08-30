import Groq from 'groq-sdk';
import { ENV } from '../config/env.js';

let groqClient = null;

if (ENV.GROQ_API_KEY) {
  try {
    groqClient = new Groq({ apiKey: ENV.GROQ_API_KEY });
    console.log('[Groq AI] Initialized successfully with Groq SDK.');
  } catch (err) {
    console.warn(`[Groq AI] Initialization failed: ${err.message}`);
  }
} else {
  console.warn('[Groq AI] GROQ_API_KEY not found in environment. Using smart heuristic fallback.');
}

/**
 * Fallback classification when Groq API key is absent or unavailable
 */
const fallbackClassify = (title = '', description = '', userCategory = 'other') => {
  const combined = `${title} ${description}`.toLowerCase();

  let detected = userCategory !== 'other' ? userCategory : 'other';
  let confidence = 0.75;
  let severity = 'medium';
  let reasoning = 'Keyword-based heuristic classification.';

  if (combined.includes('pothole') || combined.includes('crater') || combined.includes('road broken') || combined.includes('asphalt') || combined.includes('road damage') || combined.includes('hole in road') || combined.includes('road crack')) {
    detected = 'pothole';
    confidence = 0.88;
    severity = combined.includes('large') || combined.includes('accident') || combined.includes('deep') ? 'high' : 'medium';
    reasoning = 'Detected road damage/pothole keywords.';
  } else if (combined.includes('garbage') || combined.includes('trash') || combined.includes('dump') || combined.includes('waste') || combined.includes('bin')) {
    detected = 'garbage';
    confidence = 0.90;
    severity = combined.includes('overflowing') || combined.includes('stink') || combined.includes('huge') ? 'high' : 'medium';
    reasoning = 'Detected waste and refuse management keywords.';
  } else if (combined.includes('drain') || combined.includes('sewage') || combined.includes('waterlog') || combined.includes('clog')) {
    detected = 'drainage';
    confidence = 0.87;
    severity = combined.includes('flood') || combined.includes('overflow') ? 'high' : 'medium';
    reasoning = 'Detected drainage blockage keywords.';
  } else if (combined.includes('light') || combined.includes('pole') || combined.includes('dark') || combined.includes('lamp')) {
    detected = 'streetlight';
    confidence = 0.89;
    severity = 'medium';
    reasoning = 'Detected streetlighting keywords.';
  } else if (combined.includes('leak') || combined.includes('pipe') || combined.includes('water supply') || combined.includes('tap')) {
    detected = 'water';
    confidence = 0.86;
    severity = combined.includes('burst') || combined.includes('flooding') ? 'high' : 'medium';
    reasoning = 'Detected water supply issue keywords.';
  }

  const needsManualReview = confidence < ENV.AI_CONFIDENCE_THRESHOLD;

  return {
    category: detected,
    confidence,
    severity,
    reasoning,
    needsManualReview,
  };
};

/**
 * Classifies an issue using Groq LLM / Vision model
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.userCategory
 * @param {string} [params.imageUrl]
 * @param {Buffer} [params.imageBuffer]
 * @param {string} [params.mimetype]
 * @returns {Promise<{category: string, confidence: number, severity: string, reasoning: string, needsManualReview: boolean}>}
 */
export const classifyIssueWithAI = async ({
  title = '',
  description = '',
  userCategory = 'other',
  imageUrl = null,
  imageBuffer = null,
  mimetype = 'image/jpeg',
}) => {
  if (!groqClient) {
    return fallbackClassify(title, description, userCategory);
  }

  try {
    const promptText = `
You are an expert municipal civic issue classifier for a smart city reporting system.
Evaluate the reported civic issue based on the provided information and image.

CRITICAL INSTRUCTION:
- If an image is provided, VISUALLY INSPECT the image first. The image is your GROUND TRUTH.
- Even if the user selected a different category or wrote a vague description (e.g. "large damage", "fix this"), identify what is physically visible in the photo:
  * Road pits, holes, cracks, asphalt breakage, road craters -> "pothole"
  * Trash, waste piles, overflowing bins, litter -> "garbage"
  * Open drains, clogged gutters, sewage overflow, stagnant dirty water canal -> "drainage"
  * Broken streetlights, damaged electric poles, unlit lamps -> "streetlight"
  * Broken pipe, leaking potable water line, tap leakage -> "water"
  * Any other municipal issue -> "other"

Allowed categories: ["pothole", "garbage", "drainage", "streetlight", "water", "other"]
Allowed severities: ["low", "medium", "high", "critical"]

Issue Title: "${title}"
Citizen Description: "${description}"
User-Selected Category: "${userCategory}"

Respond ONLY with a valid JSON object without markdown fences or additional explanation:
{
  "category": "pothole | garbage | drainage | streetlight | water | other",
  "confidence": 0.0 to 1.0,
  "severity": "low | medium | high | critical",
  "reasoning": "Concise 1-sentence explanation of what is detected in the image/text"
}
`.trim();

    let messages = [];

    // Prioritize Cloudinary image URL, fallback to image buffer
    if ((imageUrl || imageBuffer) && ENV.GROQ_VISION_MODEL) {
      let imageContent;
      if (imageUrl) {
        imageContent = {
          type: 'image_url',
          image_url: {
            url: imageUrl,
          },
        };
      } else if (imageBuffer) {
        const base64Data = imageBuffer.toString('base64');
        imageContent = {
          type: 'image_url',
          image_url: {
            url: `data:${mimetype};base64,${base64Data}`,
          },
        };
      }

      if (imageContent) {
        messages = [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              imageContent,
            ],
          },
        ];
      }
    }

    if (messages.length === 0) {
      messages = [
        {
          role: 'system',
          content: 'You are an accurate civic issue classification AI. Return only raw JSON.',
        },
        {
          role: 'user',
          content: promptText,
        },
      ];
    }

    const modelToUse = messages[0].content && Array.isArray(messages[0].content)
      ? ENV.GROQ_VISION_MODEL
      : ENV.GROQ_MODEL;

    const response = await groqClient.chat.completions.create({
      model: modelToUse,
      messages,
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return fallbackClassify(title, description, userCategory);
    }

    const parsed = JSON.parse(content);
    const validCategories = ['pothole', 'garbage', 'drainage', 'streetlight', 'water', 'other'];
    const validSeverities = ['low', 'medium', 'high', 'critical'];

    const category = validCategories.includes(parsed.category) ? parsed.category : userCategory;
    const confidence = typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 0), 1) : 0.80;
    const severity = validSeverities.includes(parsed.severity) ? parsed.severity : 'medium';
    const reasoning = parsed.reasoning || 'AI inferred category and urgency from report data.';
    const needsManualReview = confidence < ENV.AI_CONFIDENCE_THRESHOLD;

    return {
      category,
      confidence: Number(confidence.toFixed(2)),
      severity,
      reasoning,
      needsManualReview,
    };
  } catch (error) {
    console.error(`[Groq AI Error] ${error.message}. Falling back to heuristic classifier.`);
    return fallbackClassify(title, description, userCategory);
  }
};
