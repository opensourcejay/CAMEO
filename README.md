# 🎬 CAMEO - Creative AI Media Engine Orchestrator

Turn your imagination into reality with CAMEO – your gateway to next-generation AI-powered media creation. Seamlessly generate stunning images and captivating videos using Azure's cutting-edge AI models.

## ✨ What Makes CAMEO Special?

Imagine having a professional creative studio at your fingertips. CAMEO combines the power of Azure's most advanced AI models to bring your ideas to life:

- 🎨 **GPT-Image-1 & DALL-E-3**: Create breathtaking images with unparalleled detail and accuracy
- 🎥 **SORA**: Generate mesmerizing videos with cinematic quality (5-20 seconds)
- 🔄 **Smart Image Editing**: Transform and enhance your existing images
- 🌓 **Dark/Light Themes**: Work comfortably in any lighting condition
- 📱 **Fully Responsive**: Perfect experience on any device
- 🔐 **Privacy First**: Your data stays local, your creativity stays yours

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Azure Foundry access with appropriate subscriptions
- Model deployments:
  - Image Generation: GPT-Image-1 or DALL-E-3
  - Video Generation: SORA

### Installation

```bash
# Clone the magic
git clone https://github.com/opensourcejay/cameo.git
cd cameo

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in your project root:

```env
# Image Generation Setup
VITE_AZURE_IMAGE_ENDPOINT=your-azure-endpoint
VITE_AZURE_IMAGE_MODEL=gpt-image-1  # or dall-e-3
VITE_AZURE_IMAGE_API_KEY=your-api-key
VITE_AZURE_IMAGE_API_VERSION=your-api-version

# Video Generation Setup
VITE_AZURE_VIDEO_ENDPOINT=your-azure-endpoint
VITE_AZURE_VIDEO_MODEL=sora
VITE_AZURE_VIDEO_API_KEY=your-api-key
VITE_AZURE_VIDEO_API_VERSION=your-api-version
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## Project Structure

```
cameo/
├── src/
│   ├── components/      # React components
│   │   ├── ImageDisplay.jsx    # Image display and preview
│   │   ├── VideoDisplay.jsx    # Video display and playback
│   │   ├── MediaGenerator.jsx  # Main media generation component
│   │   ├── ImageUpload.jsx     # Image upload handling
│   │   ├── PromptInput.jsx     # Prompt input with duration controls
│   │   └── styles/            # Component CSS files
│   │
│   ├── services/       # API and service integrations
│   │   └── apiService.js    # Azure OpenAI API integration
│   │
│   ├── hooks/         # Custom React hooks
│   │   └── useLocalStorage.js  # Local storage management
│   │
│   ├── utils/         # Utility functions
│   │   └── debug.js        # Debug logging
│   │
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
│
├── public/            # Static assets
├── .env              # Environment configuration
└── package.json      # Project dependencies
```

## Advanced Features

### 🎨 Image Generation
- Choose between two powerhouse models:
  - **GPT-Image-1**: Exceptional at understanding complex prompts
  - **DALL-E-3**: Master of artistic and creative interpretations
- Support for reference image editing
- Intelligent error handling with retry capabilities

### 🎥 Video Generation with SORA
- Create stunning videos from text descriptions
- Multiple duration options: 5s, 10s, 15s, 20s
- High-definition output (1080p)
- Seamless video storage and management

### User Interface
- Toggle between image and video generation modes
- Intuitive prompt input with generation controls
- Real-time media preview and display
- Responsive layout optimized for single-page experience
- Smooth animations and transitions
- Persistent media history across page refreshes

### Error Handling
- Detailed error messages with troubleshooting steps
- Request ID tracking for support
- Comprehensive Azure endpoint debugging
- Automatic retry with exponential backoff

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API key is correct and not expired
   - Check if key has proper permissions

2. **Rate Limiting**
   - Wait between requests
   - Check your quota limits

3. **Generation Failures**
   - Ensure prompt follows content policy
   - Try simplifying complex prompts
   - Check for service availability

### Azure Foundry Setup

1. **Create Resource**
   - Create a new project in Azure Foundry
   - Set up your resource group
   - Note your endpoint and API key

2. **Deploy Models**
   - Deploy through Azure Foundry interface
   - Configure GPT-Image-1 or DALL-E-3 for images
   - Set up SORA for video generation
   - Save deployment names for your .env file

## 🚀 Model Guide

### Image Models

- **GPT-Image-1**
  - Best for: Precise, detail-oriented image generation
  - Excels at: Understanding complex prompts and requirements

- **DALL-E-3**
  - Best for: Artistic and creative interpretations
  - Excels at: Unique artistic styles and compositions

### Video Model

- **SORA**
  - State-of-the-art video generation
  - Cinematic quality output
  - Flexible duration options
  - Realistic motion and transitions

Choose based on:
- Model availability in your region
- Quota and pricing considerations
- Performance characteristics in your use case
- Required features (image-only vs. image+video)

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Privacy & Security

- Credentials stored locally only
- No data sharing with third parties
- End-to-end secure communication
- Uses your Azure infrastructure

## License

MIT License - Feel free to use in your projects!

## 🤝 Support & Community

Need help or want to contribute?
- Submit issues via [GitHub](https://github.com/opensourcejay)
- Contact [@opensourcejay](https://github.com/opensourcejay)
- Include detailed error messages and steps to reproduce

---

<p align="center">
Created with ❤️ by <a href="https://github.com/opensourcejay">@opensourcejay</a>
</p>
