# 🎬 CAMEO - Creative AI Media Engine Orchestrator

Turn your imagination into reality with CAMEO – your gateway to next-generation AI-powered media creation. Seamlessly generate stunning images and captivating videos using Azure's cutting-edge AI models.

## ✨ What Makes CAMEO Special?

Imagine having a professional creative studio at your fingertips. CAMEO combines the power of Azure's most advanced AI models to bring your ideas to life:

- 🎨 **GPT-Image-1**: Create breathtaking images with unparalleled detail and accuracy
- 🎥 **SORA**: Generate mesmerizing videos with cinematic quality (5-20 seconds)
- 🔄 **Smart Image Editing**: Transform and enhance your existing images
- 🌓 **Dark/Light Themes**: Work comfortably in any lighting condition
- 📱 **Fully Responsive**: Perfect experience on any device
- 🔐 **Privacy First**: Your data stays local, your creativity stays yours

## 🆕 Latest Updates (v0.2.0)

- ✨ **Welcome Tips**: Smart onboarding for first-time users
- 🔧 **Consolidated Upload System**: Unified, optimized image upload handling
- 🛡️ **Enhanced Error Boundaries**: Robust error handling and recovery
- 📝 **Complete PropTypes Validation**: Comprehensive type checking for all components
- 🎯 **Production Ready**: Optimized build with comprehensive testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Azure Foundry access with appropriate subscriptions
- Model deployments:
  - Image Generation: GPT-Image-1
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

No environment variables are required! All configuration is done through the Settings UI:

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Configure API Settings**
   - Click the "⚙️ Settings" button in the sidebar
   - Enter your Azure OpenAI endpoint URLs and API keys
   - Configure both Image Generation and Video Generation tabs
   - Save your settings

Your API credentials are stored securely in your browser's localStorage.

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
│   │   ├── Settings.jsx        # Settings modal for API configuration
│   │   └── styles/            # Component CSS files
│   │
│   ├── services/       # API and service integrations
│   │   └── apiService.js    # Azure OpenAI API integration
│   │
│   ├── utils/         # Utility functions
│   │   └── debug.js        # Debug logging
│   │
│   ├── App.jsx         # Root component with theme and history management
│   └── main.jsx        # Entry point
│
├── public/            # Static assets
└── package.json      # Project dependencies
```

## Advanced Features

### 🎨 Image Generation
- GPT-Image-1: Exceptional at understanding complex prompts
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

2. **Deploy Models**   - Deploy through Azure Foundry interface
   - Configure GPT-Image-1 for images
   - Set up SORA for video generation
   - Note deployment endpoints for the Settings UI

## 🚀 Model Guide

### Image Models

- **GPT-Image-1**
  - Best for: Precise, detail-oriented image generation
  - Excels at: Understanding complex prompts and requirements

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
