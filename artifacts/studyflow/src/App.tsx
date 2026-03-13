import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGate } from "@/components/AuthGate";
import Dashboard from "@/pages/Dashboard";
import Tutor from "@/pages/Tutor";
import YoutubeSummarizer from "@/pages/YoutubeSummarizer";
import Notes from "@/pages/Notes";
import GenerateNotes from "@/pages/GenerateNotes";
import Flashcards from "@/pages/Flashcards";
import Quiz from "@/pages/Quiz";
import StudyPlanner from "@/pages/StudyPlanner";
import DoubtSolver from "@/pages/DoubtSolver";
import LectureNotes from "@/pages/LectureNotes";
import ExamPredictor from "@/pages/ExamPredictor";
import CodingPlayground from "@/pages/CodingPlayground";
import StudyRoadmap from "@/pages/StudyRoadmap";
import PDFStudyMode from "@/pages/PDFStudyMode";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tutor" component={Tutor} />
      <Route path="/youtube" component={YoutubeSummarizer} />
      <Route path="/notes" component={Notes} />
      <Route path="/generate-notes" component={GenerateNotes} />
      <Route path="/flashcards" component={Flashcards} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/planner" component={StudyPlanner} />
      <Route path="/doubt-solver" component={DoubtSolver} />
      <Route path="/lecture-notes" component={LectureNotes} />
      <Route path="/exam-predictor" component={ExamPredictor} />
      <Route path="/coding" component={CodingPlayground} />
      <Route path="/roadmap" component={StudyRoadmap} />
      <Route path="/pdf-study" component={PDFStudyMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthGate>
            <Router />
          </AuthGate>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
