const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Groq } = require('groq-sdk');
const crypto = require('crypto');
const path = require('path');
const upload = multer();

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/wasteRequestRoutes')); // Add this line


// 1) Initialize AWS S3 Client
// -------------------------------------------------------------------
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});



const bucketName = process.env.S3_BUCKET_NAME;

// 2) Initialize Groq Client
// -------------------------------------------------------------------
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });


// 3) Hard‐coded treatment recommendations map
// -------------------------------------------------------------------
const treatmentMap = {
  "infectious waste": "Use autoclaving or incineration to neutralize pathogens.",
  "sharps waste":      "Disinfect (autoclave) and shred before landfill or encapsulation.",
  "pathological waste":"Incineration is preferred due to organic content.",
  "pharmaceutical waste":"Encapsulation, return to supplier, or high-temp incineration.",
  "chemical waste":    "Treat with neutralization or specialized chemical disposal.",
  "radioactive waste": "Store in shielded containers and follow radiation authority protocols.",
  "non-hazardous general waste":"Standard municipal disposal or sanitary landfill."
};


// 4) Utility: Upload buffer to S3, return public URL
// -------------------------------------------------------------------
async function uploadBufferToS3(buffer, originalName) {
  // Generate a random filename to avoid collisions
  const ext = path.extname(originalName); // e.g., ".jpg" or ".png"
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const key = `uploads/${randomBytes}${ext}`;

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeTypeFromExt(ext),  // helper to set correct MIME type
    //ACL: 'public-read'
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  // Construct the public URL
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}



function mimeTypeFromExt(ext) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}


// 5) Endpoint: /api/classify
//    - Uploads image to S3
//    - Calls Groq with image_url
//    - Returns label + treatment
// -------------------------------------------------------------------
app.post('/api/classify', upload.single('image'), async (req, res) => {
  try {
    // 1) Validate that file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No image file sent.' });
    }

      console.log('Received file:', req.file.originalname);
    // 2) Upload image buffer to S3
    const publicUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname);
    console.log('after file:', req.file.originalname);

    // 3) Build your classification prompt
    const prompt = `
You are an expert in healthcare waste management.

Step 1: Classify the type of waste shown in the image into **EXACTLY one** of the following categories:
- Infectious Waste
- Sharps Waste
- Pathological Waste
- Pharmaceutical Waste
- Chemical Waste
- Radioactive Waste
- Non-Hazardous General Waste

Step 2: For the classified type, list the most appropriate disposal and recycling or treatment methods.

Your response must be in the following format:
Category: <one of the seven categories>
Disposal & Recycling Methods:
- Point 1
- Point 2
- Point 3
`.trim();

    // 4) Call Groq’s multimodal endpoint with `image_url`
    const response = await groqClient.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct', 
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: publicUrl } }
          ]
        }
      ],
      max_tokens: 500
    });
    console.log('Groq response:', response);

   const content = response.choices[0].message.content.trim();

// Example parsing (can be improved based on output consistency)
const [categoryLine, ...methods] = content.split('\n').filter(line => line.trim() !== '');
const label = categoryLine.replace('Category:', '').trim().toLowerCase();
// const treatment = methods
//   .filter(line => line.startsWith('-'))
//   .map(line => line.trim())
//   .join('\n');
const treatment = methods
  .filter(line => line.startsWith('-'))
  .map(line => line.replace(/^-\s*/, '').trim());





    // 7) Return JSON to frontend
    return res.json({ label, treatment });  //array


  } catch (err) {
    console.error('Error in /api/classify:', err);
    return res.status(500).json({ error: 'Classification failed.' });
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));