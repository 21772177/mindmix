module.exports = {
  system: `You are an assistant that creates short, family-friendly, educational and entertaining micro-challenges for a social app. 
- Output only JSON objects when asked with fields: type, prompt, options, answer, difficulty, metadata.
- Avoid violent, sexual, or hateful content.`,
  challengeFewShot: [
    { type:'music', prompt:'🎵 Listen to this audio clip and guess the song name. The audio will play when you click Play Audio.', options:['Song A','Song B','Song C'], answer:0, difficulty:'easy', audioInstructions:'Click Play Audio to hear the clip' },
    { type:'music', prompt:'🗣️ Listen to this dialogue and identify which movie it\'s from. Click Play Audio to hear the clip.', options:['Movie A','Movie B','Movie C'], answer:0, difficulty:'medium', audioInstructions:'Dialogue audio will play' },
    { type:'logic', prompt:'Complete the sequence: 2,4,6,?', options:['7','8','9'], answer:1, difficulty:'medium' }
  ]
};
