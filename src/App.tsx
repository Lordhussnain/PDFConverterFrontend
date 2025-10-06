import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Progress } from "./components/ui/progress";
import "./App.css";

const formats = ["Word", "Excel", "Image", "Text"];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState(formats[0]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError("");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleConvert = () => {
    if (!file) {
      setError("Please select a PDF file to convert.");
      return;
    }
    setIsConverting(true);
    setProgress(0);
    setConvertedUrl("");
    // Simulate conversion progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsConverting(false);
        setConvertedUrl("#"); // Replace with actual download URL
      }
    }, 200);
  };

  return (
    <div className="pdf-converter-app">
      <Card className="max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>PDF Converter</CardTitle>
          <CardDescription>
            Convert your PDF files to Word, Excel, Image, or Text formats easily. Drag and drop your PDF or use the upload button below.
          </CardDescription>
        </CardHeader>
        <div
          className="upload-area border-dashed border-2 rounded-lg p-6 text-center cursor-pointer transition hover:border-primary"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="pdf-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-upload" className="block cursor-pointer">
            {file ? (
              <span className="font-medium text-primary">{file.name}</span>
            ) : (
              <span className="text-muted-foreground">Drag & drop PDF here or click to upload</span>
            )}
          </label>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Convert to:</span>
            <select
              className="border rounded-md px-3 py-2 bg-background text-base"
              value={format}
              onChange={e => setFormat(e.target.value)}
            >
              {formats.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <Button
            variant="default"
            size="lg"
            disabled={!file || isConverting}
            onClick={handleConvert}
          >
            {isConverting ? "Converting..." : "Convert PDF"}
          </Button>
          {error && <div className="text-destructive text-sm mt-2">{error}</div>}
          {isConverting && (
            <div className="mt-4">
              <Progress value={progress} />
              <div className="text-muted-foreground text-xs mt-2">Converting: {progress}%</div>
            </div>
          )}
          {convertedUrl && (
            <div className="mt-4">
              <a href={convertedUrl} download className="text-primary underline font-medium">Download Converted File</a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default App;
