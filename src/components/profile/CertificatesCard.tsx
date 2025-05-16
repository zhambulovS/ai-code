
import { Award, Calendar, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface Certificate {
  id: string;
  course_id: string;
  user_id: string;
  course_title: string;
  issued_at: string;
  score: number;
  certificate_url?: string;
}

interface CertificatesCardProps {
  certificates: Certificate[];
}

export function CertificatesCard({ certificates }: CertificatesCardProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});

  const handleDownload = async (certificate: Certificate) => {
    try {
      setIsDownloading(prev => ({ ...prev, [certificate.id]: true }));
      
      // Simulate a delay for certificate generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would fetch the certificate PDF
      // from Supabase storage or generate it on the fly
      
      toast({
        title: "Certificate Downloaded",
        description: `${certificate.course_title} certificate has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(prev => ({ ...prev, [certificate.id]: false }));
    }
  };

  if (certificates.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{certificate.course_title}</h4>
              <p className="text-sm text-gray-600">
                Completed with score: {certificate.score}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Issued: {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleDownload(certificate)}
                disabled={isDownloading[certificate.id]}
              >
                {isDownloading[certificate.id] ? (
                  <span className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin mr-1" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Certificate
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
