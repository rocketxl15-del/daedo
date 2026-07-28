export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, image, style } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: '서버에 GEMINI_API_KEY 설정이 되어있지 않습니다.' });
  }

  const styleInstructions = {
    natural: "자연스러운 한국어 번역 스타일: 영문의 의미를 완벽히 전달하되, 한국어 모국어 화자가 읽기에 어색함이 없는 자연스러운 표현으로 번역하세요.",
    direct: "정확한 직역 스타일: 영문의 문장 구조와 단어의 본래 의미를 가급적 그대로 살려 직역하세요.",
    exam: "시험 및 학습용 스타일:\n1. 전체 해석\n2. 주요 구문 및 문법 요소 설명\n3. 핵심 단어 정리(영단어: 뜻) 순서로 상세히 분석해주세요.",
    easy: "쉬운 설명 스타일: 초등학생도 쉽게 이해할 수 있도록 대화체로 친근하고 쉽게 풀어서 해석해 주세요.",
    formal: "비즈니스/격식 스타일: 격식 있고 단정한 공문서/비즈니스 한국어 어조(~하십시오, ~입니다)로 번역하세요."
  };

  const selectedInstruction = styleInstructions[style] || styleInstructions.natural;

  // Gemini REST API 엔드포인트
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${apiKey}`;

  const parts = [];

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: base64Data
      }
    });
    parts.push({
      text: `이 이미지에서 영문 텍스트를 정확히 추출한 뒤, 아래 지정된 지침에 맞춰 한국어로 해석해 주세요.\n\n[해석 지침]:\n${selectedInstruction}`
    });
  } else if (text) {
    parts.push({
      text: `다음 영문 텍스트를 지정된 지침에 맞춰 한국어로 해석해 주세요.\n\n[영문 텍스트]:\n${text}\n\n[해석 지침]:\n${selectedInstruction}`
    });
  } else {
    return res.status(400).json({ error: '해석할 텍스트 또는 이미지가 필요합니다.' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 중 에러가 발생했습니다.');
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '해석 결과를 생성하지 못했습니다.';
    return res.status(200).json({ result: resultText });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
