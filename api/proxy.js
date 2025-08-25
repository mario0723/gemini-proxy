const { GoogleGenAI  } = require('@google/genai')

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export default async function handler(request, response) {
  // 1. 只允许 POST 请求
  if (request.method !== 'POST') {
    // 如果不是 POST，返回 405 Method Not Allowed
    return response.status(405).json({ error: 'Only POST method is allowed' });
  }

  // 2. 核心业务逻辑包裹在 try...catch 中，方便捕获错误
  try {
    // 从客户端发来的请求体 (body) 中获取 prompt
    const { prompt } = request.body;

    // 3. 检查 prompt 是否存在
    if (!prompt) {
      return response.status(400).json({ error: 'Prompt is required in the request body' });
    }

    // 4. 初始化 Gemini 模型
    // 你可以根据需要更改模型，比如 "gemini-pro"
    const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config:  {
            thinkingConfig:  {
                thinkingBudget: 0
            }
        }
    })

    const text = result.text

    // 6. 将 Gemini 返回的文本作为成功响应发回给客户端
    // 使用 { text: text } 的 JSON 格式返回，方便客户端解析
    return response.status(200).json({ text });

  } catch (error) {
    // 7. 如果发生任何错误，在 Vercel 后台打印错误日志
    console.error("Error calling Gemini API:", error);
    // 并向客户端返回一个 500 服务器错误
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}