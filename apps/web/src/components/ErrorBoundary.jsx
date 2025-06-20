import React from "react";
import { Button } from "../shared/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/Card.jsx";
import { AlertCircle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-full max-w-lg text-center p-6">
            <CardHeader>
              <div className="mx-auto bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="mt-4">Application Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Something went wrong. Please try refreshing the page.
              </p>
              <pre className="text-xs text-left p-2 bg-gray-100 rounded overflow-auto mb-4">
                {this.state.error?.message || "No error message available."}
              </pre>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary }; 