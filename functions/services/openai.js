const functions = require("firebase-functions");
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.chatCompletion = (content="Hello world") => {
  return new Promise((resolve, reject) => {
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          // eslint-disable-next-line max-len
          content: "You are a laconic assistant. You reply with brief, to-the-point answers with no elaboration.",
        },
        {role: "user", content: content},
      ],
      temperature: 0.1,
    }).then(async (res) => {
      functions.logger.log(
          "OpenAI response: ",
          res.data.choices[0].message.content
      );
      resolve({
        message: {
          content: res.data.choices[0].message.content,
        },
      });
    }).catch((err) => {
      if (err.response) {
        functions.logger.error("OpenAI Error: ", err.response);
        reject(err.response);
      } else {
        functions.logger.error("OpenAI Error message: ", err.message);
        reject(err.message);
      }
    });
  });
};
