import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { subscriptionApi, Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from "@/services/api";
import { toast } from "sonner";

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadSubscriptions: () => Promise<void>;
  createSubscription: (subscriptionData: CreateSubscriptionRequest) => Promise<boolean>;
  updateSubscription: (subscriptionData: UpdateSubscriptionRequest) => Promise<boolean>;
  deleteSubscription: (subscriptionId: number) => Promise<boolean>;
  getSubscriptionById: (subscriptionId: number) => Subscription | undefined;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      toast.error("Failed to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: CreateSubscriptionRequest): Promise<boolean> => {
    try {
      setCreating(true);
      const newSubscription = await subscriptionApi.create(subscriptionData);
      setSubscriptions(prev => [...prev, newSubscription]);
      toast.success("Subscription created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create subscription. Please try again.");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateSubscription = async (subscriptionData: UpdateSubscriptionRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      await subscriptionApi.update(subscriptionData);
      setSubscriptions(prev =>
        prev.map(subscription =>
          subscription.subscription_id === subscriptionData.subscription_id
            ? { ...subscription, ...subscriptionData }
            : subscription
        )
      );
      toast.success("Subscription updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update subscription. Please try again.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteSubscription = async (subscriptionId: number): Promise<boolean> => {
    try {
      setDeleting(true);
      await subscriptionApi.delete({ subscription_id: subscriptionId, is_active: false });
      setSubscriptions(prev => prev.filter(subscription => subscription.subscription_id !== subscriptionId));
      toast.success("Subscription deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete subscription. Please try again.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const getSubscriptionById = (subscriptionId: number): Subscription | undefined => {
    return subscriptions.find(sub => sub.subscription_id === subscriptionId);
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        loading,
        creating,
        updating,
        deleting,
        loadSubscriptions,
        createSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscriptionById,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
};