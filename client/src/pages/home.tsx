import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, BookOpen, BarChart3, Archive, Video, Upload, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Online Exam System
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create, manage, and take exams with our comprehensive online examination platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Setup Exam */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Setup Test/Exam</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create new exams with multiple question types, set duration, and configure exam settings
              </p>
              <Button 
                onClick={() => navigate("/setup")}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Create Exam
              </Button>
            </CardContent>
          </Card>

          {/* Take Exam */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Take Exam</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                View available exams and start taking them with real-time timer and navigation
              </p>
              <Button 
                onClick={() => navigate("/exams")}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                View Exams
              </Button>
            </CardContent>
          </Card>

          {/* View Results */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">View Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                View exam results, export data as CSV/PDF, and analyze performance
              </p>
              <Button 
                onClick={() => navigate("/results")}
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                View Results
              </Button>
            </CardContent>
          </Card>

          {/* View Exam Records */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Exam Records</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                View all past exam records and details for future reference
              </p>
              <Button 
                onClick={() => navigate("/exam-records")}
                className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                View Records
              </Button>
            </CardContent>
          </Card>

          {/* Video Upload */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Video Upload</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Upload and manage video files with play and delete functionality
              </p>
              <Button 
                onClick={() => navigate("/videos")}
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Manage Videos
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">File Upload</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Upload files of different formats and sizes with download options
              </p>
              <Button 
                onClick={() => navigate("/files")}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                Manage Files
              </Button>
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                View all uploaded videos in a detailed table with play and download options
              </p>
              <Button 
                onClick={() => navigate("/video-details")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                View Video Details
              </Button>
            </CardContent>
          </Card>

          {/* File Details */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-white">File Details</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                View all uploaded files in a detailed table with view and download options
              </p>
              <Button 
                onClick={() => navigate("/file-details")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
              >
                View File Details
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Multiple Question Types</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Support for MCQ, True/False, and Fill-in-the-blank questions</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-time Timer</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Countdown timer with auto-submit when time expires</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Results</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Automatic grading with detailed performance analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}