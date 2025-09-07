export interface ChatRequest {
  message: string;
  conversation?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

// Point frontend to backend running on port 3001
const API_BASE_URL = 'http://localhost:3001';

export class ChatApiService {
  private conversation: Array<{ role: string; content: string }> = [];

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if server is reachable first
      const isHealthy = await this.checkServerHealth();
      if (!isHealthy) {
        throw new Error(
          'Backend server is not running. Please start the server with "npm run server" or "npm run dev:full"'
        );
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation: this.conversation
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to connect to chat service. Please try again.');
    }
  }

  clearHistory(): void {
    this.conversation = [];
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
