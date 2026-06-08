// Using global fetch (Node 18+)

async function testChatbot() {
  const payload = {
    message: "হ্যালো! আমার নাম কি মনে আছে? আমাকে একটা গণিতের কোশ্চেন করো তো!",
    history: [],
    studentContext: {
      name: "রাফাত",
      grade: "Class 2",
      stars: 120,
      streak: 5
    }
  };

  console.log('Sending mock chat request to /api/chatbot...');
  
  try {
    const res = await fetch('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    console.log('API response:', JSON.stringify(data, null, 2));
    
    if (data.text) {
      console.log('✅ Success! Chatbot responded:');
      console.log(`"${data.text}"`);
      console.log(`Source: ${data.source}`);
    } else {
      console.warn('⚠️ API returned empty text response.');
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testChatbot();
