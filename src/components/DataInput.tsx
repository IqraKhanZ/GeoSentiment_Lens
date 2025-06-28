import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Download, Info } from 'lucide-react';
import { SentimentData } from '../types';

interface DataInputProps {
  onCsvUpload: (csvText: string) => void;
  onLiveFeedToggle: (enabled: boolean) => void;
  onLiveDataReceived: (data: SentimentData[]) => void;
  loading: boolean;
  error: string | null;
  hasUploadedData: boolean;
}

export function DataInput({ 
  onCsvUpload, 
  loading, 
  error, 
  hasUploadedData 
}: DataInputProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    setProcessingFile(true);
    setUploadSuccess(false);
    
    try {
      const content = await readFileContent(file);
      console.log('File content loaded, length:', content.length);
      
      if (!content.trim()) {
        throw new Error('File appears to be empty');
      }
      
      // Check if it looks like CSV
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('File must have at least a header row and one data row');
      }
      
      onCsvUpload(content);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      console.error('Error processing file:', err);
    } finally {
      setProcessingFile(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const downloadSampleCSV = () => {
    const sampleData = `text,timestamp,lat,lng,city,country,source
"Just watched an amazing movie! Absolutely loved it.",2024-01-15T10:30:00Z,40.7128,-74.0060,New York,USA,twitter
"Terrible traffic today. So frustrated with delays.",2024-01-15T11:45:00Z,51.5074,-0.1278,London,UK,twitter
"Beautiful sunset at the beach today. Feeling peaceful.",2024-01-15T18:20:00Z,-33.8688,151.2093,Sydney,Australia,news
"Political situation is getting worse. People are angry.",2024-01-16T09:15:00Z,48.8566,2.3522,Paris,France,news
"Our team won the championship! Best day ever!",2024-01-16T20:30:00Z,35.6762,139.6503,Tokyo,Japan,twitter
"Concert was absolutely phenomenal tonight!",2024-01-17T21:00:00Z,34.0522,-118.2437,Los Angeles,USA,twitter
"Stock market crashed again. Investors panicking.",2024-01-17T14:30:00Z,52.5200,13.4050,Berlin,Germany,news
"Hospital staff are overwhelmed with patients.",2024-01-18T08:15:00Z,19.0760,72.8777,Mumbai,India,news
"New restaurant in town is fantastic!",2024-01-18T19:45:00Z,55.7558,37.6176,Moscow,Russia,twitter
"Flight delayed for 6 hours. Airport chaos.",2024-01-19T12:00:00Z,-23.5505,-46.6333,São Paulo,Brazil,twitter`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-sentiment-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        Dataset Upload
      </h2>

      {/* Dataset Status */}
      {hasUploadedData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Dataset Loaded</span>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm mt-1">
            Your dataset is stored and ready for analysis. Upload a new file to replace it.
          </p>
        </div>
      )}

      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {dragOver ? 'Drop your file here' : hasUploadedData ? 'Upload new dataset' : 'Upload your dataset'}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          CSV, JSON, or TXT files with sentiment data
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || processingFile}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {processingFile ? 'Processing...' : loading ? 'Analyzing...' : 'Choose File'}
          </button>
          <button
            onClick={downloadSampleCSV}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Sample CSV
          </button>
        </div>
      </div>

      {/* File Format Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Expected CSV Format:
        </h3>
        <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <p><strong>Required:</strong> text (the content to analyze)</p>
          <p><strong>Optional:</strong> timestamp, lat, lng, city, country, source</p>
          <p><strong>Example header:</strong> text,timestamp,lat,lng,city,country,source</p>
          <p><strong>Sample row:</strong> "I love this movie!",2024-01-15T10:30:00Z,40.7128,-74.0060,New York,USA,twitter</p>
        </div>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-4">
          <CheckCircle className="h-5 w-5" />
          <span>Dataset uploaded and stored successfully! It will persist across sessions.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-4">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}