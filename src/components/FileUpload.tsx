import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export function FileUpload({ onFileUpload, isProcessing = false }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer transition-colors',
            isDragActive && 'opacity-70',
            isProcessing && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10">
            {isDragActive ? (
              <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            ) : (
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            )}
          </div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold px-2">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag & drop your CSV or Excel file here'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports .csv, .xls, .xlsx files
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

