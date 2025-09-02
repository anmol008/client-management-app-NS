import { API_BASE_URL } from "@/constants/api";

// Client API interfaces
export interface Client {
  client_comp_id: number;
  client_comp_code: string;
  client_comp_name: string;
  client_comp_short_name: string;
  is_active: boolean;
}

export interface CreateClientRequest {
  client_comp_name: string;
  client_comp_short_name: string;
  is_active: boolean;
}

export interface UpdateClientRequest {
  client_comp_id: number;
  client_comp_name: string;
  client_comp_short_name: string;
  is_active: boolean;
}

export interface DeleteClientRequest {
  client_comp_id: number;
  is_active: false;
}

// Product API interfaces
export interface Product {
  main_app_id: number;
  main_app_name: string;
  main_app_version: string;
  main_app_code: string;
  main_app_model_no: string;
  main_app_desc: string;
  is_active: boolean;
}

export interface CreateProductRequest {
  main_app_name: string;
  main_app_version: string;
  main_app_code: string;
  main_app_model_no: string;
  main_app_desc: string;
  is_active: boolean;
}

export interface UpdateProductRequest {
  main_app_id: number;
  main_app_name: string;
  main_app_version: string;
  main_app_code: string;
  main_app_model_no: string;
  main_app_desc: string;
  is_active: boolean;
}

export interface DeleteProductRequest {
  main_app_id: number;
  is_active: false;
}

export interface Subscription {
  subscription_id: number;
  subscription_name: string;
  subscription_price: number;
  duration_days: number;
  max_allowed_users: number;
  is_active: boolean;
}

export interface CreateSubscriptionRequest {
  subscription_name: string;
  subscription_price: number;
  duration_days: number;
  max_allowed_users: number;
  is_active: boolean;
}

export interface UpdateSubscriptionRequest {
  subscription_id: number;
  subscription_name: string;
  subscription_price: number;
  duration_days: number;
  max_allowed_users: number;
  is_active: boolean;
}

export interface DeleteSubscriptionRequest {
  subscription_id: number;
  is_active: false;
}

// Generic API response interface
export interface ApiResponse<T> {
  success: boolean;
  statusCode: string;
  msg: string;
  data: T[];
}

// Client API functions
export const clientApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/client-comp?is_active=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    const result: ApiResponse<Client> = await response.json();
    return result.data;
  },

  // Create a new client
  create: async (clientData: CreateClientRequest): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/client-comp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    const result: ApiResponse<Client> = await response.json();
    return result.data[0];
  },

  // Update a client
  update: async (clientData: UpdateClientRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/client-comp`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
  },

  // Delete a client (soft delete by setting is_active to false)
  delete: async (clientData: DeleteClientRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/client-comp`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
  },
};

// Product API functions
export const productApi = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/main-app?is_active=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const result: ApiResponse<Product> = await response.json();
    return result.data;
  },

  // Create a new product
  create: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/main-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    const result: ApiResponse<Product> = await response.json();
    return result.data[0];
  },

  // Update a product
  update: async (productData: UpdateProductRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/main-app`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
  },

  // Delete a product (soft delete by setting is_active to false)
  delete: async (productData: DeleteProductRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/main-app`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },
};

// Subscription API functions
export const subscriptionApi = {
  // Get all subscriptions
  getAll: async (): Promise<Subscription[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription?is_active=true`);
    if (!response.ok) {
      throw new Error("Failed to fetch subscriptions");
    }
    const result: ApiResponse<Subscription> = await response.json();
    return result.data;
  },

  // Create a new subscription
  create: async (subscriptionData: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });
    if (!response.ok) {
      throw new Error("Failed to create subscription");
    }
    const result: ApiResponse<Subscription> = await response.json();
    return result.data[0];
  },

  // Update a subscription
  update: async (subscriptionData: UpdateSubscriptionRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });
    if (!response.ok) {
      throw new Error("Failed to update subscription");
    }
  },

  // Delete a subscription (soft delete by setting is_active to false)
  delete: async (subscriptionData: DeleteSubscriptionRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });
    if (!response.ok) {
      throw new Error("Failed to delete subscription");
    }
  },
};