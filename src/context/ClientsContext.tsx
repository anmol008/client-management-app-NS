import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { clientApi, Client, CreateClientRequest, UpdateClientRequest } from "@/services/api";
import { toast } from "sonner";

interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadClients: () => Promise<void>;
  createClient: (clientData: CreateClientRequest) => Promise<boolean>;
  updateClient: (clientData: UpdateClientRequest) => Promise<boolean>;
  deleteClient: (clientId: number) => Promise<boolean>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientApi.getAll();
      setClients(data);
    } catch (error) {
      toast.error("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: CreateClientRequest): Promise<boolean> => {
    try {
      setCreating(true);
      const newClient = await clientApi.create(clientData);
      setClients(prev => [...prev, newClient]);
      toast.success("Client created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create client. Please try again.");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateClient = async (clientData: UpdateClientRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      await clientApi.update(clientData);
      setClients(prev =>
        prev.map(client =>
          client.client_comp_id === clientData.client_comp_id
            ? { ...client, ...clientData }
            : client
        )
      );
      toast.success("Client updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update client. Please try again.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteClient = async (clientId: number): Promise<boolean> => {
    try {
      setDeleting(true);
      await clientApi.delete({ client_comp_id: clientId, is_active: false });
      setClients(prev => prev.filter(client => client.client_comp_id !== clientId));
      toast.success("Client deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete client. Please try again.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        creating,
        updating,
        deleting,
        loadClients,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};