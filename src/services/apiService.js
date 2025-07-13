/**
 * Service for interacting with Azure OpenAI API (Image and Video generation)
 */

/**
 * Get API settings from localStorage
 * @param {string} type - 'image' or 'video'
 * @returns {Object} - Object containing apiKey and endpoint
 */
function getApiSettings(type) {
  const settingsKey = type === 'image' ? 'azure_image_config' : 'azure_video_config';
  const settings = localStorage.getItem(settingsKey);
  
  if (!settings) {
    throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} API settings not configured. Please go to Settings to configure your API credentials.`);
  }
  
  try {
    const parsed = JSON.parse(settings);
    if (!parsed.apiKey || !parsed.endpoint) {
      throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} API settings incomplete. Please check your API key and endpoint in Settings.`);
    }
    return parsed;
  } catch (error) {
    throw new Error(`Invalid ${type} API settings. Please reconfigure in Settings.`);
  }
}

/**
 * Determine the correct authentication header based on the endpoint
 * @param {string} endpoint - The API endpoint URL
 * @returns {string} - The header name to use ('api-key' or 'Authorization')
 */
function getAuthHeaderName(endpoint) {
  const url = endpoint.toLowerCase();
  
  // Azure Cognitive Services / Azure OpenAI Service uses 'api-key'
  if (url.includes('cognitiveservices.azure.com') || url.includes('openai.azure.com')) {
    return 'api-key';
  }
  
  // Azure AI Foundry / Azure Machine Learning uses 'Authorization: Bearer'
  if (url.includes('inference.ai.azure.com') || url.includes('ml.azure.com')) {
    return 'Authorization';
  }
  
  // Default to api-key for backward compatibility
  return 'api-key';
}

/**
 * Get authentication headers for API requests
 * @param {string} apiKey - The API key
 * @param {string} endpoint - The API endpoint URL
 * @returns {Object} - Headers object with appropriate authentication
 */
function getAuthHeaders(apiKey, endpoint) {
  const authHeaderName = getAuthHeaderName(endpoint);
  
  if (authHeaderName === 'Authorization') {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  } else {
    return {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    };
  }
}

/**
 * Generate a video using Azure OpenAI's Video API
 * @param {string} prompt - The text prompt for video generation
 * @param {number} duration - Duration in seconds (default: 5)
 * @returns {Promise<Object>} - Object containing videoUrl
 */
export async function generateVideo(prompt, duration = 5) {
  const { apiKey, endpoint } = getApiSettings('video');
  try {    // Use the endpoint directly if it's already a complete URL with path and query params
    let apiUrl;
    if (endpoint.includes('/video/generations/jobs') && endpoint.includes('?api-version=')) {
      // Complete Azure OpenAI endpoint URL provided with API version
      apiUrl = endpoint;
    } else if (endpoint.includes('/video/generations') && endpoint.includes('?api-version=')) {
      // Complete endpoint URL provided with API version
      apiUrl = endpoint;
    } else if (endpoint.includes('/video/generations') || endpoint.includes('/v1/video/generations')) {
      // Complete endpoint URL provided
      apiUrl = endpoint;} else {
      // Base endpoint provided, construct the URL
      const baseUrl = endpoint.replace(/\/$/, ''); // Remove trailing slash
      
      if (endpoint.includes('inference.ai.azure.com')) {
        // Azure AI Foundry endpoint
        apiUrl = `${baseUrl}/v1/video/generations`;
      } else if (endpoint.includes('/openai/')) {
        // Azure OpenAI Service endpoint that already contains /openai/ path
        const apiVersion = '2024-10-01-preview';
        apiUrl = `${baseUrl}/v1/video/generations/jobs?api-version=${apiVersion}`;
      } else {
        // Azure OpenAI Service endpoint without /openai/ path
        const apiVersion = '2024-10-01-preview';
        apiUrl = `${baseUrl}/openai/v1/video/generations/jobs?api-version=${apiVersion}`;
      }
    }    
    const headers = getAuthHeaders(apiKey, endpoint);    // Submit video generation request
    console.log('🎬 Starting video generation...', { prompt, duration, endpoint: apiUrl });
    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'sora', // Video generation currently uses Sora model
        prompt: prompt,
        n_seconds: duration,
        n_variants: 1,
        height: 1080,
        width: 1920
      })
    });if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      
      let errorMessage = '';
      switch (submitResponse.status) {
        case 404:
          errorMessage = `Video API endpoint not found at '${endpoint}'. Please verify the video API is available and the endpoint is correct.`;
          break;
        case 401:
          errorMessage = 'Authentication failed. Please verify your video API key is correct.';
          break;
        case 403:
          errorMessage = 'Access forbidden. Please check your video API key permissions.';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded for video generation. Please wait and try again.';
          break;
        default:
          errorMessage = errorData.error?.message || `Video API error: ${submitResponse.statusText}`;
      }
      throw new Error(errorMessage);
    }    const responseData = await submitResponse.json();

    if (!responseData?.id) {
      throw new Error('No video generation job ID in response');
    }

    console.log('✅ Video generation job submitted successfully', { jobId: responseData.id });// Poll for completion - construct status URL based on the original endpoint structure
    const authHeaders = getAuthHeaders(apiKey, endpoint);
    let statusUrl;
    
    if (endpoint.includes('/video/generations/jobs') && endpoint.includes('?api-version=')) {
      // Complete Azure OpenAI endpoint URL - just replace the path
      statusUrl = endpoint.replace('/video/generations/jobs?', `/video/generations/jobs/${responseData.id}?`);
    } else if (endpoint.includes('/video/generations') && endpoint.includes('?')) {
      // Complete endpoint URL - derive status URL from it
      const baseEndpoint = endpoint.split('/video/generations')[0];
      if (endpoint.includes('inference.ai.azure.com')) {
        statusUrl = `${baseEndpoint}/v1/video/generations/${responseData.id}`;
      } else {
        statusUrl = `${baseEndpoint}/openai/v1/video/generations/jobs/${responseData.id}?api-version=2024-10-01-preview`;
      }
    } else {
      // Base endpoint - construct status URL
      const baseUrl = endpoint.replace(/\/$/, ''); // Remove trailing slash
      if (endpoint.includes('inference.ai.azure.com')) {
        statusUrl = `${baseUrl}/v1/video/generations/${responseData.id}`;
      } else if (endpoint.includes('/openai/v1/')) {
        // Azure OpenAI Service endpoint that already contains /openai/v1/ path
        statusUrl = `${baseUrl}/video/generations/jobs/${responseData.id}?api-version=2024-10-01-preview`;
      } else {
        // Azure OpenAI Service endpoint without /openai/v1/ path
        statusUrl = `${baseUrl}/openai/v1/video/generations/jobs/${responseData.id}?api-version=2024-10-01-preview`;
      }    }
      
    console.log('⏳ Polling for video generation completion...');
    for (let i = 0; i < 120; i++) {
      const waitTime = 5000; // 5 seconds
      console.log(`🔄 Checking video generation status (attempt ${i + 1}/120)...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait 5 seconds between checks

      const statusResponse = await fetch(statusUrl, {
        headers: authHeaders
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check video generation status');
      }      const statusData = await statusResponse.json();

      console.log(`📊 Video generation status: ${statusData.status}`);

      if (statusData.status === 'succeeded') {
        

        // Check for generations array
        if (!statusData.generations) {
          throw new Error(`No generations array in response. Full response: ${JSON.stringify(statusData)}`);
        }

        if (!statusData.generations[0]) {
          throw new Error('No generation data in generations array');
        }        const generation = statusData.generations[0];
        

        // Get the generation ID from the succeeded response
        const generationId = generation.id;
        if (!generationId) {
          throw new Error('No generation ID found in the response');
        }

        console.log('🎯 Video generation completed, fetching video content...', { generationId });// Get video content - construct content URL based on the original endpoint structure
        let videoUrl;
        if (endpoint.includes('/video/generations/jobs') && endpoint.includes('?api-version=')) {
          // Complete Azure OpenAI endpoint URL - replace path with content path
          videoUrl = endpoint.replace('/video/generations/jobs?', `/video/generations/${generationId}/content/video?`);
        } else if (endpoint.includes('/video/generations') && endpoint.includes('?')) {
          // Complete endpoint URL - derive content URL from it
          const baseEndpoint = endpoint.split('/video/generations')[0];
          if (endpoint.includes('inference.ai.azure.com')) {
            videoUrl = `${baseEndpoint}/v1/video/generations/${generationId}/content`;
          } else {
            videoUrl = `${baseEndpoint}/openai/v1/video/generations/${generationId}/content/video?api-version=2024-10-01-preview`;
          }
        } else {
          // Base endpoint - construct content URL
          const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
          if (endpoint.includes('inference.ai.azure.com')) {
            videoUrl = `${baseUrl}v1/video/generations/${generationId}/content`;
          } else if (endpoint.includes('/openai/v1/')) {
            // Azure OpenAI Service endpoint that already contains /openai/v1/ path
            videoUrl = `${baseUrl}video/generations/${generationId}/content/video?api-version=2024-10-01-preview`;
          } else {
            // Azure OpenAI Service endpoint without /openai/v1/ path
            videoUrl = `${baseUrl}openai/v1/video/generations/${generationId}/content/video?api-version=2024-10-01-preview`;
          }
        }
        
        

        // Make a fetch request to get the actual video data
        const videoResponse = await fetch(videoUrl, {
          headers: authHeaders
        });

        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video content');        }

        const videoBlob = await videoResponse.blob();
        console.log('🎉 Video generation completed successfully!', { blobSize: videoBlob.size });
        return { videoUrl: URL.createObjectURL(videoBlob) };
      } 
      
      if (statusData.status === 'failed') {
        throw new Error(`Video generation failed: ${statusData.error?.message || 'Unknown error'}`);
      }
    }

    throw new Error('Video generation timed out after 10 minutes');
  } catch (error) {
    console.error('Video generation failed:', error);
    throw error;
  }
}

/**
 * Generate an image using Azure OpenAI GPT-4V API
 * @param {string} prompt - The text prompt for image generation
 * @returns {Promise<Object>} - Object containing imageUrl
 */
export async function generateImage(prompt) {
  const { apiKey, endpoint, model } = getApiSettings('image');

  try {
    // Determine the API URL based on endpoint format
    let apiUrl;
    
    // If the endpoint contains the full path and API version, use it directly
    if (endpoint.includes('/openai/deployments/') && endpoint.includes('/images/generations') && endpoint.includes('api-version=')) {
      apiUrl = endpoint;
    }
    // If it contains the foundry-style path, use it directly
    else if (endpoint.includes('/v1/images/generations')) {
      apiUrl = endpoint;
    }
    // If it just contains the generic path, use it directly
    else if (endpoint.includes('/images/generations')) {
      apiUrl = endpoint;
    }
    // Otherwise, treat it as a base URL and construct the full endpoint
    else {
      const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
      
      if (endpoint.includes('inference.ai.azure.com')) {
        // Azure AI Foundry endpoint
        apiUrl = `${baseUrl}v1/images/generations`;
      } else {
        // Azure OpenAI Service endpoint
        const apiVersion = '2024-10-01-preview';
        const modelName = model || 'dall-e-3'; // Use selected model or default fallback
        apiUrl = `${baseUrl}openai/deployments/${modelName}/images/generations?api-version=${apiVersion}`;
      }
    }    const headers = getAuthHeaders(apiKey, endpoint);

    console.log('🖼️ Starting image generation...', { prompt, model, endpoint: apiUrl });
    
    // Build request body based on model capabilities
    const requestBody = {
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    };
    
    // Add quality parameter only for models that support it (not DALL-E-3)
    if (model && model.toLowerCase() !== 'dall-e-3') {
      requestBody.quality = 'high';
    }
    
    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      
      const errorMessage = errorData.error?.message || submitResponse.statusText;
      throw new Error(`Image generation API error: ${errorMessage}`);
    }    const responseData = await submitResponse.json();
    console.log('✅ Image generation API response received');

    if (!responseData || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No images were generated in the response');
    }

    const firstImage = responseData.data[0];
    if (!firstImage) {
      throw new Error('Image data is missing from response');
    }

    // Check for base64 data (common format)
    if (firstImage.b64_json) {
      console.log('🎉 Image generation completed successfully!');
      return { imageUrl: `data:image/png;base64,${firstImage.b64_json}` };
    }
    // Fallback for url format
    if (firstImage.url) {
      console.log('🎉 Image generation completed successfully!');
      return { imageUrl: firstImage.url };
    }

    throw new Error('No image data found in the response');
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
}

/**
 * Convert a File object to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} base64 string
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/xyz;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Edit an image using Azure OpenAI API
 * @param {string} prompt - The text prompt for image editing
 * @param {File} imageFile - The image file to edit
 * @param {File} [maskFile] - Optional mask file for selective editing
 * @returns {Promise<Object>} - Object containing imageUrl
 */
export async function editImage(prompt, imageFile, maskFile = null) {
  const { apiKey, endpoint } = getApiSettings('image');

  try {
    // Use the endpoint directly if it's already a complete URL with path and query params
    let apiUrl;
    if (endpoint.includes('/images/edits') && endpoint.includes('?api-version=')) {
      // Complete endpoint URL provided with API version
      apiUrl = endpoint;
    } else if (endpoint.includes('/images/edits') || endpoint.includes('/v1/images/edits')) {
      // Complete endpoint URL provided
      apiUrl = endpoint;
    } else if (endpoint.includes('/images/generations')) {
      // Convert generations endpoint to edits endpoint
      apiUrl = endpoint.replace('/images/generations', '/images/edits');
    } else {
      // Base endpoint provided, construct the URL
      const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
      
      if (endpoint.includes('inference.ai.azure.com')) {
        // Azure AI Foundry endpoint
        apiUrl = `${baseUrl}v1/images/edits`;
      } else {
        // Azure OpenAI Service endpoint - use the selected model
        const { model } = getApiSettings('image');
        const apiVersion = '2024-10-01-preview';
        const modelName = model || 'dall-e-3'; // Use selected model or default fallback
        apiUrl = `${baseUrl}openai/deployments/${modelName}/images/edits?api-version=${apiVersion}`;
      }
    }
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', imageFile);
    if (maskFile) {
      formData.append('mask', maskFile);
    }
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    
    // Add quality parameter only for models that support it (not DALL-E-3)
    const { model } = getApiSettings('image');
    if (model && model.toLowerCase() !== 'dall-e-3') {
      formData.append('quality', 'high');
    }

    console.log('✏️ Starting image editing...', { prompt, hasImage: !!imageFile, hasMask: !!maskFile, endpoint: apiUrl });

    // Get headers without Content-Type for FormData
    const authHeaderName = getAuthHeaderName(endpoint);
    const headers = {};
    if (authHeaderName === 'Authorization') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      headers['api-key'] = apiKey;
    }

    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData
    });

    

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      
      const errorMessage = errorData.error?.message || submitResponse.statusText;

      switch (submitResponse.status) {
        case 401:
          throw new Error('Authentication failed. Please verify your API key is correct.');
        case 403:
          throw new Error('Access forbidden. Please check your API key permissions.');
        case 404:
          throw new Error('Resource not found. Please verify the endpoint and deployment.');
        case 429:
          throw new Error('Rate limit exceeded. Please wait and try again.');
        default:
          throw new Error(`Azure OpenAI API error: ${errorMessage}`);
      }
    }    const responseData = await submitResponse.json();
    console.log('✅ Image editing API response received');

    if (!responseData || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No images were generated in the response');
    }

    const firstImage = responseData.data[0];
    if (!firstImage) {
      throw new Error('First image data is missing from response');
    }

    // Check for base64 data (common format)
    if (firstImage.b64_json) {
      console.log('🎉 Image editing completed successfully!');
      return { imageUrl: `data:image/png;base64,${firstImage.b64_json}` };
    }
    // Fallback for url format
    if (firstImage.url) {
      console.log('🎉 Image editing completed successfully!');
      return { imageUrl: firstImage.url };
    }

    throw new Error('No image data found in the response');
  } catch (error) {
    console.error('Image edit failed:', error);
    throw error;
  }
}
