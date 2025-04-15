
import { GraphQLClient } from 'graphql-request';
import { toast } from 'sonner';

// Default API configuration
const DEFAULT_CONFIG = {
  baseUrl: import.meta.env.VITE_GRAPHQL_API_URL || '/graphql',
  timeout: 30000,
};

class ApiClient {
  private client: GraphQLClient;

  constructor(config = DEFAULT_CONFIG) {
    this.client = new GraphQLClient(config.baseUrl, {
      // Remove timeout from the GraphQLClient options since it's not supported
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.setHeader('Authorization', `Bearer ${token}`);
    } else {
      this.client.setHeader('Authorization', '');
    }
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      console.error('API Query Error:', error);
      toast.error('Error fetching data');
      throw error;
    }
  }

  async mutate<T>(mutation: string, variables?: Record<string, any>): Promise<T> {
    try {
      return await this.client.request<T>(mutation, variables);
    } catch (error) {
      console.error('API Mutation Error:', error);
      toast.error('Error updating data');
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
