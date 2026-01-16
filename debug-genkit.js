
const genkitModule = require('genkit');
console.log('Genkit module keys:', Object.keys(genkitModule));

if (genkitModule.genkit) {
    console.log('genkit function exists');
    try {
        const ai = genkitModule.genkit({ plugins: [] });
        console.log('AI instance keys:', Object.keys(ai));
        console.log('Has definePrompt?', !!ai.definePrompt);
        console.log('Has prompt?', !!ai.prompt);
    } catch (e) {
        console.error('Error initializing genkit:', e);
    }
} else {
    console.log('genkit function MISSING from export');
}

if (genkitModule.definePrompt) {
    console.log('definePrompt exported directly from genkit');
}
