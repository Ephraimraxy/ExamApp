import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/login";
import StudentDashboard from "@/pages/student-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ExamInterface from "@/pages/exam-interface";
import ExamSetup from "@/pages/exam-setup";
import Results from "@/pages/results";
import ProtectedRoute from "@/components/protected-route";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/">
            {user?.role === "admin" ? <AdminDashboard /> : <StudentDashboard />}
          </Route>
          <Route path="/admin">
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/student">
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/exam/:examId">
            <ProtectedRoute requiredRole="student">
              <ExamInterface />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/exams/new">
            <ProtectedRoute requiredRole="admin">
              <ExamSetup />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/exams/:examId/edit">
            <ProtectedRoute requiredRole="admin">
              <ExamSetup />
            </ProtectedRoute>
          </Route>
          <Route path="/results/:attemptId">
            <Results />
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
