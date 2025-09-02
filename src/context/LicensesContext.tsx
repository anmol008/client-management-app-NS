import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { licenseApi, License, CreateLicenseRequest, UpdateLicenseRequest } from "@/services/api";
import { toast } from "sonner";

interface LicensesContextType {
  licenses: License[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadLicenses: () => Promise<void>;
  createLicense: (licenseData: CreateLicenseRequest) => Promise<boolean>;
  updateLicense: (licenseData: UpdateLicenseRequest) => Promise<boolean>;
  deleteLicense: (licenseId: number) => Promise<boolean>;
}

const LicensesContext = createContext<LicensesContextType | undefined>(undefined);

export function LicensesProvider({ children }: { children: ReactNode }) {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      const data = await licenseApi.getAll();
      setLicenses(data);
    } catch (error) {
      toast.error("Failed to load licenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createLicense = async (licenseData: CreateLicenseRequest): Promise<boolean> => {
    try {
      setCreating(true);
      const newLicense = await licenseApi.create(licenseData);
      setLicenses(prev => [...prev, newLicense]);
      toast.success("License created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create license. Please try again.");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateLicense = async (licenseData: UpdateLicenseRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      await licenseApi.update(licenseData);
      setLicenses(prev =>
        prev.map(license =>
          license.client_subscription_id === licenseData.client_subscription_id
            ? { ...license, ...licenseData }
            : license
        )
      );
      toast.success("License updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update license. Please try again.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteLicense = async (licenseId: number): Promise<boolean> => {
    try {
      setDeleting(true);
      await licenseApi.delete({ client_subscription_id: licenseId, is_active: false });
      setLicenses(prev => prev.filter(license => license.client_subscription_id !== licenseId));
      toast.success("License deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete license. Please try again.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return (
    <LicensesContext.Provider
      value={{
        licenses,
        loading,
        creating,
        updating,
        deleting,
        loadLicenses,
        createLicense,
        updateLicense,
        deleteLicense,
      }}
    >
      {children}
    </LicensesContext.Provider>
  );
}

export const useLicenses = () => {
  const context = useContext(LicensesContext);
  if (!context) {
    throw new Error("useLicenses must be used within a LicensesProvider");
  }
  return context;
};