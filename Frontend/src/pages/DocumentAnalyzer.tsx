import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { FileText, Upload, BookOpen, Brain, Download } from 'lucide-react';
import { useUserActivities } from '@/hooks/useUserActivities';

const DocumentAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>({ quizzes: [], flashcards: [], studyPath: [] });
  const { trackActivity } = useUserActivities();

  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'Document Analyzer',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const analyzeDocument = async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);
    trackActivity('document_analyzed', { 
      filename: uploadedFile.name,
      timestamp: new Date().toISOString()
    });

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('http://localhost:5002/upload', {
        method: 'POST',
        body: formData
      });

      const text = await response.text();
      if (!response.ok) throw new Error(text);

      const data = JSON.parse(text);
      setAnalysisResults({
        quizzes: Array.isArray(data.quiz) ? data.quiz.map((q: any) => ({
          question: q.question,
          options: q.possible_answers,
          correct: q.index
        })) : [],
        flashcards: Array.isArray(data.flash_cards) ? data.flash_cards.map((f: any) => ({
          front: f[0],
          back: f[1]
        })) : [],
        studyPath: Array.isArray(data.todo) ? data.todo : []
      });

    } catch (error: any) {
      console.error('Analysis failed:', error);
      alert(`Document analysis failed: ${error.message || error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-green-600" />
              Document Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload PDFs to extract quizzes, flashcards, and personalized learning paths.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" /> Upload Document
                </CardTitle>
                <CardDescription>Upload PDF or DOCX files for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-2">PDF, DOCX up to 10MB</p>
                  </div>
                  <input id="file-upload" type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
                  {uploadedFile && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">{uploadedFile.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-300">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                  <Button onClick={analyzeDocument} disabled={!uploadedFile || isAnalyzing} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              {isAnalyzing && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Analyzing document with AI...</p>
                  </CardContent>
                </Card>
              )}

              {analysisResults && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>AI-generated study materials from your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="quizzes" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="quizzes" className="flex items-center"><Brain className="h-4 w-4 mr-2" /> Quizzes</TabsTrigger>
                        <TabsTrigger value="flashcards" className="flex items-center"><BookOpen className="h-4 w-4 mr-2" /> Flashcards</TabsTrigger>
                        <TabsTrigger value="studypath" className="flex items-center"><FileText className="h-4 w-4 mr-2" /> Study Path</TabsTrigger>
                      </TabsList>

                      <TabsContent value="quizzes" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Generated Quizzes</h3>
                            <Badge variant="secondary">{analysisResults.quizzes.length} questions</Badge>
                          </div>
                          {Array.isArray(analysisResults.quizzes) && analysisResults.quizzes.map((quiz: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="font-medium mb-3">{quiz.question}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {quiz.options.map((option: string, optIndex: number) => (
                                  <Badge key={optIndex} variant={optIndex === quiz.correct ? "default" : "outline"} className="justify-start p-2">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button className="w-full" variant="outline"><Download className="h-4 w-4 mr-2" /> Export Quizzes</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="flashcards" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Flashcards</h3>
                            <Badge variant="secondary">{analysisResults.flashcards.length} cards</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.isArray(analysisResults.flashcards) && analysisResults.flashcards.map((card: any, index: number) => (
                              <div key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                                <div className="font-semibold mb-2">{card.front}</div>
                                <div className="text-sm opacity-90">{card.back}</div>
                              </div>
                            ))}
                          </div>
                          <Button className="w-full" variant="outline"><Download className="h-4 w-4 mr-2" /> Export Flashcards</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="studypath" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Personalized Study Path</h3>
                            <Badge variant="secondary">{analysisResults.studyPath.length} steps</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Recommended learning sequence based on your document
                          </p>
                          <div className="space-y-3">
                            {Array.isArray(analysisResults.studyPath) && analysisResults.studyPath.map((step: string, index: number) => (
                              <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                          <Button className="w-full" variant="outline"><Download className="h-4 w-4 mr-2" /> Export Study Path</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
