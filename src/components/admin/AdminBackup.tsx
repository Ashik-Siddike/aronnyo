import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, UploadCloud, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminBackup() {
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState('2026-04-29 23:00:00');

  const handleExport = async () => {
    setLoading(true);
    // Simulate database export
    toast.info('Initiating database export. This may take a moment...');
    
    setTimeout(() => {
      setLoading(false);
      setLastBackup(new Date().toLocaleString());
      toast.success('Database backup completed and downloaded successfully.');
      
      // Simulating file download
      const a = document.createElement('a');
      a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ backup: true, date: new Date() }));
      a.download = `backup_playlearngrow_${new Date().getTime()}.json`;
      a.click();
    }, 3000);
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
            <Database className="w-6 h-6 text-amber-400" /> System Backup
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="grid gap-8">
          
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-amber-50/50 border-b rounded-t-2xl">
              <CardTitle className="text-slate-700 flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-600" /> Export Database
              </CardTitle>
              <CardDescription>Create a full JSON/CSV export of the MongoDB collections.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-gray-800">Last Backup</h3>
                  <p className="text-gray-500">{lastBackup}</p>
                </div>
                
                <Button 
                  onClick={handleExport} 
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto"
                >
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" /> Generate Backup</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 rounded-2xl border-red-100">
            <CardHeader className="bg-red-50/50 border-b rounded-t-2xl">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <UploadCloud className="w-5 h-5" /> Restore Database
              </CardTitle>
              <CardDescription className="text-red-600/70">Warning: This will overwrite existing data.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4 items-start mb-6 text-red-800">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <p className="text-sm">Restoring a database backup is a destructive action. All current data will be erased and replaced with the contents of the backup file. Proceed with extreme caution.</p>
              </div>
              
              <div className="flex justify-end">
                <Button variant="destructive" onClick={() => toast.error('Restore functionality is restricted in demo mode.')}>
                  Upload Backup File to Restore
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
