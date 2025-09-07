export interface ChatRequest {
  message: string;
  conversation?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

// Use production URL or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export class ChatApiService {
  private conversation: Array<{ role: string; content: string }> = [];

  async sendMessage(
    message: string,
    conversationOverride?: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
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

      // Update internal conversation history
      this.conversation.push({ role: 'user', content: message });
      this.conversation.push({ role: 'assistant', content: data.message });

      return data.message;

    } catch (error) {
      console.error('Chat API error:', error);
      if (error instanceof Error) throw error;
      throw new Error('Unable to connect to chat service. Please try again.');
    }
  }

  clearHistory() {
    this.conversation = [];
  }
}
