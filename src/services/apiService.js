import { debugLog } from '../utils/debug';

/**
 * Service for interacting with the Azure OpenAI API (GPT-4V image generation and Sora video generation)
 */

/**
 * Generate a video using Azure OpenAI's Sora API
 * @param {string} prompt - The text prompt for video generation
 * @param {number} duration - Duration in seconds (default: 5)
 * @returns {Promise<Object>} - Object containing videoUrl
 */
export async function generateVideo(prompt, duration = 5) {
  const apiKey = import.meta.env.VITE_AZURE_VIDEO_API_KEY;
  const endpoint = import.meta.env.VITE_AZURE_VIDEO_ENDPOINT;
  const model = import.meta.env.VITE_AZURE_VIDEO_MODEL;
  const apiVersion = import.meta.env.VITE_AZURE_VIDEO_API_VERSION;

  // Validation to ensure we're using the correct video endpoint
  if (!endpoint || !endpoint.includes('joshua-11111-resource')) {
    throw new Error(`Video generation must use the correct video endpoint. Current: ${endpoint}`);
  }
  
  if (!model || model !== 'sora') {
    throw new Error(`Video generation must use sora model. Current: ${model}`);
  }

  if (!endpoint || !apiKey) {
    throw new Error('Video API configuration is missing');
  }  try {    // Setup API URL - using v1 endpoint instead of deployments
    const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
    const apiUrl = `${baseUrl}openai/v1/video/generations/jobs?api-version=${apiVersion}`;
    
    debugLog('Video Request URL:', apiUrl);debugLog('Video Request Config:', {
      endpoint,
      model,
      apiVersion,
      baseUrl,
      fullApiUrl: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey ? `${apiKey.substring(0, 8)}...` : 'missing'
      }
    });// Submit video generation request
    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n_seconds: duration,
        n_variants: 1,
        height: 1080,
        width: 1920
      })
    });    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      debugLog('Video API Error Response:', {
        status: submitResponse.status,
        statusText: submitResponse.statusText,
        errorData,
        url: apiUrl
      });
      
      let errorMessage = '';
      switch (submitResponse.status) {        case 404:
          errorMessage = `Video API endpoint not found at '${endpoint}'. Please verify the Sora API is available and the endpoint is correct.`;
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
          errorMessage = errorData.error?.message || `Video API error: ${submitResponse.statusText}`;      }
      throw new Error(errorMessage);
    }

    const responseData = await submitResponse.json();
    debugLog('Initial Sora API Response:', responseData);    if (!responseData?.id) {
      throw new Error('No video generation job ID in response');
    }    // Poll for completion - using v1 endpoint instead of deployments
    const statusUrl = `${baseUrl}openai/v1/video/generations/jobs/${responseData.id}?api-version=${apiVersion}`;
    for (let i = 0; i < 120; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between checks

      const statusResponse = await fetch(statusUrl, {
        headers: { 'api-key': apiKey }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check video generation status');
      }

      const statusData = await statusResponse.json();
      debugLog('Status check response:', {
        status: statusData.status,
        id: statusData.id,
        hasGenerations: !!statusData.generations,
        generationsLength: statusData.generations?.length,
        firstGeneration: statusData.generations?.[0],
      });

      if (statusData.status === 'succeeded') {
        debugLog('Job succeeded, full response:', JSON.stringify(statusData, null, 2));

        // Check for generations array
        if (!statusData.generations) {
          throw new Error(`No generations array in response. Full response: ${JSON.stringify(statusData)}`);
        }

        if (!statusData.generations[0]) {
          throw new Error('No generation data in generations array');
        }

        const generation = statusData.generations[0];
        debugLog('Generation data:', generation);

        // Get the generation ID from the succeeded response
        const generationId = generation.id;
        if (!generationId) {
          throw new Error('No generation ID found in the response');        }        // Get video content - using v1 endpoint instead of deployments
        const videoUrl = `${baseUrl}openai/v1/video/generations/${generationId}/content/video?api-version=${apiVersion}`;
        debugLog('Video content URL:', videoUrl);

        // Make a fetch request to get the actual video data
        const videoResponse = await fetch(videoUrl, {
          headers: {
            'api-key': apiKey
          }
        });

        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video content');
        }

        const videoBlob = await videoResponse.blob();
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
  const apiKey = import.meta.env.VITE_AZURE_IMAGE_API_KEY;
  const endpoint = import.meta.env.VITE_AZURE_IMAGE_ENDPOINT;
  const modelName = import.meta.env.VITE_AZURE_IMAGE_MODEL;
  const apiVersion = import.meta.env.VITE_AZURE_IMAGE_API_VERSION;

  // Validation to ensure we're using the correct image endpoint
  if (!endpoint || !endpoint.includes('joshu-mbfklkej-westus3')) {
    throw new Error(`Image generation must use the correct image endpoint. Current: ${endpoint}`);
  }
  
  if (!modelName || modelName !== 'gpt-image-1') {
    throw new Error(`Image generation must use gpt-image-1 model. Current: ${modelName}`);
  }

  debugLog('Image Configuration:', {
    endpoint,
    modelName,
    apiVersion,
    apiKeyLength: apiKey?.length || 0
  });

  try {
    if (!endpoint || !apiKey) {
      throw new Error('Image API configuration is missing');
    }

    const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
    const apiUrl = `${baseUrl}openai/deployments/${modelName}/images/generations?api-version=${apiVersion}`;
    
    debugLog('Image Request URL:', apiUrl);

    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'high'
      })
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      debugLog('Error data:', errorData);
      const errorMessage = errorData.error?.message || submitResponse.statusText;
      throw new Error(`GPT-4V API error: ${errorMessage}`);
    }

    const responseData = await submitResponse.json();
    debugLog('GPT-4V API Response:', responseData);

    if (!responseData || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No images were generated in the response');
    }

    const firstImage = responseData.data[0];
    if (!firstImage) {
      throw new Error('Image data is missing from response');
    }

    // For gpt-image-1, we always get base64 data
    if (firstImage.b64_json) {
      return { imageUrl: `data:image/png;base64,${firstImage.b64_json}` };
    }
    // Fallback for url format
    if (firstImage.url) {
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
export async function editImage(prompt, imageFile, maskFile = null) {  const apiKey = import.meta.env.VITE_AZURE_IMAGE_API_KEY;
  const endpoint = import.meta.env.VITE_AZURE_IMAGE_ENDPOINT;
  const modelName = import.meta.env.VITE_AZURE_IMAGE_MODEL;
  const apiVersion = import.meta.env.VITE_AZURE_IMAGE_API_VERSION;

  // Validation to ensure we're using the correct image endpoint for editing
  if (!endpoint || !endpoint.includes('joshu-mbfklkej-westus3')) {
    throw new Error(`Image editing must use the correct image endpoint. Current: ${endpoint}`);
  }
  
  if (!modelName || modelName !== 'gpt-image-1') {
    throw new Error(`Image editing must use gpt-image-1 model. Current: ${modelName}`);
  }

  debugLog('Edit Configuration:', {
    endpoint,
    modelName,
    apiVersion,
    apiKeyLength: apiKey?.length || 0,
    hasImage: !!imageFile,
    hasMask: !!maskFile
  });

  try {
    const baseUrl = new URL(endpoint).toString().replace(/\/?$/, '/');
    const apiUrl = `${baseUrl}openai/deployments/${modelName}/images/edits?api-version=${apiVersion}`;
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', imageFile);
    if (maskFile) {
      formData.append('mask', maskFile);
    }
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('quality', 'high');

    debugLog('Edit Request URL:', apiUrl);

    const submitResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'api-key': apiKey
      },
      body: formData
    });

    debugLog('Edit Response status:', submitResponse.status);

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      debugLog('Error data:', errorData);
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
    }

    const responseData = await submitResponse.json();
    debugLog('Edit Response:', responseData);

    if (!responseData || !Array.isArray(responseData.data) || responseData.data.length === 0) {
      throw new Error('No images were generated in the response');
    }

    const firstImage = responseData.data[0];
    if (!firstImage) {
      throw new Error('First image data is missing from response');
    }

    // For gpt-image-1, we always get base64 data
    if (firstImage.b64_json) {
      return { imageUrl: `data:image/png;base64,${firstImage.b64_json}` };
    }
    // Fallback for url format
    if (firstImage.url) {
      return { imageUrl: firstImage.url };
    }

    throw new Error('No image data found in the response');
  } catch (error) {
    console.error('Image edit failed:', error);
    throw error;
  }
}