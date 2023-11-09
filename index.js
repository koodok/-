
  function chat(question) {
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${'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'}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    })
      .then((res) => res.json())
      .then((data) => data.choices[0].message.content);
  }
  
  chat("").then((answer) => console.log(answer));    

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("💬 ChatGPT 터미널 챗앱 💬\n");
rl.prompt();

rl.on("line", (question) => {
  chat(question).then((answer) => {
    console.log(`🤖 ${answer}\n`);
    rl.prompt();
  });
});