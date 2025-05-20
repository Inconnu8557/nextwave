declare global {
  interface PuterAIResponse {
    message: {
      content: string;
    };
  }

  interface PuterAI {
    chat: (message: string, options?: { model?: string }) => Promise<PuterAIResponse>;
  }

  interface Puter {
    ai: PuterAI;
    // Ajoute d'autres propriétés si nécessaire
  }

  const puter: Puter;
}

export {};
