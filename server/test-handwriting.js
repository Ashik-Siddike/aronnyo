// Using global fetch (Node 18+)

async function testHandwriting() {
  const ink = [
    [
      [100, 150, 200], // X coordinates
      [400, 250, 100], // Y coordinates
      [0, 100, 200]    // Times
    ],
    [
      [200, 250, 300],
      [100, 250, 400],
      [300, 400, 500]
    ],
    [
      [130, 200, 270],
      [250, 250, 250],
      [600, 700, 800]
    ]
  ];

  console.log('Sending mock strokes for letter "A" to /api/handwriting...');
  
  try {
    const res = await fetch('http://localhost:3001/api/handwriting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ink, language: 'en' })
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    console.log('API response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates.includes('A')) {
      console.log('✅ Success! Handwriting API recognized the strokes as "A"');
    } else {
      console.warn('⚠️ API returned candidates but "A" was not found in:', data.candidates);
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testHandwriting();
