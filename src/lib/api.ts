import { API_BASE_URL } from "@/config/config.example";

export type ApiSuccessResponse<T = unknown> = {
  status: 'success';
  message: string;
  data?: T;
};

export type ApiErrorResponse = {
  status: 'error';
  error: string;
  code: 'SERVER_ERROR' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND';
  details?: Record<string, unknown> | null;
};

export type LoginResponse = {
  status: 'success';
  message: string;
  data: { access_token: string };
};

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
};

export type Blog = {
  id: number;
  title: string;
  body: string;
};

const BASE_URL = API_BASE_URL ?? 'http://localhost:8080';

export class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private buildHeaders(extra?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...extra,
    };
    const token = this.getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: this.buildHeaders(init?.headers),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const apiError: ApiErrorResponse = (payload as ApiErrorResponse) ?? {
        status: 'error',
        error: typeof payload === 'string' ? payload : 'Request failed',
        code: 'SERVER_ERROR',
      };
      if (response.status === 401) {
        // Token likely invalid/expired
        localStorage.removeItem('access_token');
      }
      throw apiError;
    }

    return payload as T;
  }

  // Auth
  async register(input: { name: string; username: string; email: string; password: string }): Promise<ApiSuccessResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async login(input: { username_email: string; password: string }): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // User
  async getUser(id: number): Promise<ApiSuccessResponse<User>> {
    return this.request(`/user/${id}`, { method: 'GET' });
  }

  async updateUser(input: Partial<{ username: string; email: string; name: string; password: string }>): Promise<ApiSuccessResponse> {
    return this.request('/user', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteUser(password: string): Promise<ApiSuccessResponse> {
    return this.request('/user', {
      method: 'DELETE',
      headers: { 'X-Password': password },
    });
  }

  // Blogs
  async listBlogs(params?: { page?: number; limit?: number; sort?: 'latest' | 'oldest' }): Promise<ApiSuccessResponse<{ blogs: Blog[]; pagination: { page: number; limit: number; total: number } }>> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.sort) q.set('sort', params.sort);
    const qs = q.toString();
    return this.request(`/blogs${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async listUserBlogs(userId: number, params?: { page?: number; limit?: number; sort?: 'latest' | 'oldest' | 'popular' }): Promise<ApiSuccessResponse<{ blogs: Blog[]; pagination: { page: number; limit: number; total: number } }>> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.sort) q.set('sort', params.sort);
    const qs = q.toString();
    return this.request(`/user/${userId}/blogs${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async getBlog(id: number): Promise<ApiSuccessResponse<Blog>> {
    return this.request(`/blog/${id}`, { method: 'GET' });
  }

  async createBlog(input: { title: string; body: string }): Promise<ApiSuccessResponse> {
    return this.request('/blog', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateBlog(id: number, input: Partial<{ title: string; body: string }>): Promise<ApiSuccessResponse> {
    return this.request(`/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteBlog(id: number): Promise<ApiSuccessResponse> {
    return this.request(`/blog/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();


