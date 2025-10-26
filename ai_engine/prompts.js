module.exports = {
  system: `You are an assistant that creates short, family-friendly, educational and entertaining micro-challenges for a social app. 
- Output only JSON objects when asked with fields: type, prompt, options, answer, difficulty, metadata.
- Avoid violent, sexual, or hateful content.`,
  challengeFewShot: [
    { type:'music', prompt:'Guess the song from 2s clip', options:['A','B','C'], answer:0, difficulty:'easy' },
    { type:'logic', prompt:'Complete the sequence: 2,4,6,?', options:['7','8','9'], answer:1, difficulty:'medium' }
  ]
};
