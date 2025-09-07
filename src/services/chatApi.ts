export interface ChatRequest {
  message: string;
  conversation?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

<<<<<<< HEAD
// Use the Render URL or environment variable for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
=======
// Use production URL or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;
>>>>>>> 07d93af (Updated bot code + built dist folder for deployment)

export class ChatApiService {
  private conversation: Array<{ role: string; content: string }> = [];

<<<<<<< HEAD
  async sendMessage(message: string, conversationOverride?: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const conversation = conversationOverride || this.conversation;

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Update conversation history
      this.conversation.push({ role: 'user', content: message });
      this.conversation.push({ role: 'assistant', content: data.message });

      return data.message;

    } catch (error) {
      console.error('Chat API error:', error);
      if (error instanceof Error) throw error;
      throw new Error('Unable to connect to chat service. Please try again.');
    }
  }

  clearHistory(): void {
=======
  async sendMessage(
    message: string,
    conversationOverride?: Array<{ role: string; content: string }>
  ): Promise<string> {
    const conversation = conversationOverride || this.conversation;

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to get response');

    // Update conversation
    this.conversation.push({ role: 'user', content: message });
    this.conversation.push({ role: 'assistant', content: data.message });

    return data.message;
  }

  clearHistory() {
>>>>>>> 07d93af (Updated bot code + built dist folder for deployment)
    this.conversation = [];
  }
}
