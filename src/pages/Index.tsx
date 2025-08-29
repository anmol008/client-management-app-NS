import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-accent/10 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
            Loading...
          </h1>
        </div>
      </div>
    </div>
  );
}
