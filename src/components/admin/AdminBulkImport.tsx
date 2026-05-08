import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, FileType, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminBulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: number, failed: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a valid CSV file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    // In a real scenario, we would parse the CSV or send it to the server via FormData
    // Simulating an upload and processing process:
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Users imported successfully!');
      setResult({ success: 24, failed: 1 });
      setFile(null);
      
      // Reset input
      const input = document.getElementById('csv-upload') as HTMLInputElement;
      if (input) input.value = '';
      
    } catch (err) {
      toast.error('Failed to import users');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-emerald-400" /> Bulk User Import
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-emerald-50/50 border-b rounded-t-2xl">
            <CardTitle className="text-slate-700">Import Students from CSV</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
              <strong>CSV Format Required:</strong>
              <p className="mt-1 opacity-80">Your CSV file must include the following headers: <code className="bg-white px-1 py-0.5 rounded">name, username, password, role, grade</code></p>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Sample downloaded'); }} className="text-blue-600 font-bold mt-2 inline-block hover:underline">
                Download Sample CSV
              </a>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <input 
                type="file" 
                accept=".csv" 
                id="csv-upload" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                <FileType className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {file ? file.name : 'Click to select CSV file'}
                </h3>
                <p className="text-gray-500">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or drag and drop here'}
                </p>
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                {uploading ? 'Processing...' : 'Import Users'}
              </Button>
            </div>

            {result && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-700 font-bold">
                  <CheckCircle2 className="w-6 h-6" /> {result.success} Imported Successfully
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 font-bold">
                  <AlertCircle className="w-6 h-6" /> {result.failed} Failed Rows
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
