import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import AvailableExams from "@/pages/available-exams";
import ExamInterface from "@/pages/exam-interface";
import ExamSetup from "@/pages/exam-setup";
import Results from "@/pages/results";
import AllResults from "@/pages/all-results";
import ExamRecords from "@/pages/exam-records";
import VideoUpload from "@/pages/video-upload";
import FileUpload from "@/pages/file-upload";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/setup" component={ExamSetup} />
      <Route path="/setup/:examId" component={ExamSetup} />
      <Route path="/exams" component={AvailableExams} />
      <Route path="/exam/:examId/start" component={ExamInterface} />
      <Route path="/exam/:examId" component={ExamInterface} />
      <Route path="/results" component={AllResults} />
      <Route path="/results/:examId" component={AllResults} />
      <Route path="/result/:attemptId" component={Results} />
      <Route path="/exam-records" component={ExamRecords} />
      <Route path="/student" component={AvailableExams} />
      <Route path="/videos" component={VideoUpload} />
      <Route path="/files" component={FileUpload} />
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
