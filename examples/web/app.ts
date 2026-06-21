import { ComputeBroker, WebLLMLocalProvider, OpenAICloudProvider } from '../../src/index';

// Initialize the providers
const localProvider = new WebLLMLocalProvider({});
const cloudProvider = new OpenAICloudProvider({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key',
  baseUrl: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1', 
});

// For safety in this demo, we override the provider methods
localProvider.generate = async (prompt: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`(Simulated Local Response) I am a local model. You asked: ${prompt}`);
    }, 500);
  });
};

cloudProvider.generate = async (prompt: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`(Simulated Cloud Response) I am the cloud model. This was complex: ${prompt}`);
    }, 1500);
  });
};

const broker = new ComputeBroker({
  localProvider,
  cloudProvider,
  analyzerOptions: { threshold: 0.5 }
});

const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
const promptEl = document.getElementById('prompt') as HTMLTextAreaElement;
const outputEl = document.getElementById('output') as HTMLDivElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

sendBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return;

  outputEl.textContent = 'Generating...';
  statusEl.textContent = 'Analyzing complexity...';

  try {
    // In a real app, you can manually check score if you want to display it
    // But the broker handles routing automatically
    const start = performance.now();
    const result = await broker.generate(prompt);
    const end = performance.now();

    outputEl.textContent = result;
    statusEl.textContent = `Completed in ${Math.round(end - start)}ms`;
  } catch (err: any) {
    outputEl.textContent = `Error: ${err.message}`;
    statusEl.textContent = 'Failed';
  }
});
