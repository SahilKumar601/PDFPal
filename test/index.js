require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
});

const openai = new OpenAIApi(configuration);

const testOpenAI = async () => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Hello, world!",
      max_tokens: 5,
    });
    console.log(response.data.choices[0].text);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

testOpenAI();
