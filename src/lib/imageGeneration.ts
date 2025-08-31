export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Image generation failed');
  }

  const result = await response.json();
  return result.imageUrl;
}

export async function generateWithReplicate(prompt: string): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
      input: {
        prompt: prompt,
        negative_prompt: "blurry, low quality, distorted, watermark, text",
        width: 512,
        height: 512,
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });

  const prediction = await response.json();
  
  // Poll for completion
  let result = prediction;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
    });
    result = await statusResponse.json();
  }

  if (result.status === 'succeeded' && result.output?.[0]) {
    return result.output[0];
  } else {
    throw new Error('Generation failed');
  }
}