
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Image, Download, RefreshCw, Eraser, Pencil, Palette } from 'lucide-react';
import { useUserActivities } from '@/hooks/useUserActivities';

const CanvasAI = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const { trackActivity } = useUserActivities();
  const [analysisResult, setAnalysisResult] = useState('');


  // Track page access when component mounts
  useEffect(() => {
    trackActivity('page_visited', { 
      page: 'Canvas AI',
      timestamp: new Date().toISOString()
    });
  }, [trackActivity]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : currentColor;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas_drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const analyzeCanvas = async () => {
  setIsAnalyzing(true);
  setAnalysisResult("Analyzing...");

  trackActivity('canvas_used', {
    action: 'analyze',
    timestamp: new Date().toISOString()
  });

  const canvas = canvasRef.current;
  if (!canvas) {
    setIsAnalyzing(false);
    setAnalysisResult("Canvas not available.");
    return;
  }

  const imageData = canvas.toDataURL('image/png');

  if (!imageData.startsWith('data:image/png;base64,')) {
    setIsAnalyzing(false);
    setAnalysisResult("Invalid image format.");
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8900/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: imageData,
        dict_of_vars: {}  // ✅ required field for FastAPI model
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const data = await response.json();
    if (data?.data?.length) {
    const interpretations = data.data
      .map((item: any) => `${item.expr} → ${item.result}`)
      .join('\n');
    setAnalysisResult(interpretations);
} else {
  setAnalysisResult("No result received.");
}

  } catch (error: any) {
    console.error('Error analyzing canvas:', error);
    setAnalysisResult(`Error: ${error.message}`);
  }

  setIsAnalyzing(false);
};




  const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb'];

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Image className="h-8 w-8 mr-3 text-purple-600" />
              Canvas AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Draw and analyze handwritten equations with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Drawing Tools */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-purple-600" />
                  Drawing Tools
                </CardTitle>
                <CardDescription>Select your drawing tools and colors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div className="space-y-2">
                  <Label>Tool</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={tool === 'pencil' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTool('pencil')}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Pencil
                    </Button>
                    <Button
                      variant={tool === 'eraser' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTool('eraser')}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      Eraser
                    </Button>
                  </div>
                </div>

                {/* Brush Size */}
                <div className="space-y-2">
                  <Label>Brush Size: {brushSize}px</Label>
                  <Input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          currentColor === color ? 'border-gray-800 dark:border-white' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCurrentColor(color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" onClick={clearCanvas} className="w-full">
                    <Eraser className="h-4 w-4 mr-2" />
                    Clear Canvas
                  </Button>
                  <Button onClick={downloadCanvas} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="bg-white dark:bg-gray-800 lg:col-span-3">
              <CardHeader>
                <CardTitle>Drawing Canvas</CardTitle>
                <CardDescription>Draw your equation or diagram here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-full max-w-4xl">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      className="border border-gray-300 dark:border-gray-700 rounded-md cursor-crosshair bg-white w-full h-auto max-w-full shadow-lg"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onMouseMove={draw}
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 bg-opacity-50 flex items-center justify-center rounded-md">
                        <p className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">
                          Analyzing...
                        </p>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={analyzeCanvas} 
                    disabled={isAnalyzing}
                    className="w-full max-w-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>AI interpretation of your drawing will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {analysisResult || 'Draw something on the canvas and click "Analyze with AI" to see the results.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CanvasAI;
