const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Your App
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A clean, minimal foundation ready for your next great idea.
              </p>
            </div>
            
            <div className="pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-soft">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Ready to build</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
