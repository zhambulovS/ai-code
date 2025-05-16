
import { supabase } from "@/integrations/supabase/client";
import { Certificate } from "@/components/profile/CertificatesCard";
import { createCourseCompletionAchievement } from "@/services/achievementsService";

// Minimum score required to earn a certificate (75%)
const CERTIFICATION_THRESHOLD = 75;

interface CertificateData {
  course_id: string;
  user_id: string;
  course_title: string;
  score: number;
}

export const issueCertificate = async (
  userId: string,
  courseId: string,
  courseTitle: string,
  score: number
): Promise<Certificate | null> => {
  try {
    // Check if score meets certification threshold
    if (score < CERTIFICATION_THRESHOLD) {
      console.log(`Score ${score} is below certification threshold ${CERTIFICATION_THRESHOLD}`);
      return null;
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingCert) {
      console.log("Certificate already exists for this course");
      return existingCert;
    }

    // Create certificate
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        course_title: courseTitle,
        score,
        issued_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating certificate:", error);
      throw error;
    }

    // Also create an achievement for getting a certificate
    await createCourseCompletionAchievement(userId, courseId, courseTitle);

    return certificate;
  } catch (error) {
    console.error("Error in issueCertificate:", error);
    return null;
  }
};

export const fetchUserCertificates = async (userId: string): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchUserCertificates:", error);
    return [];
  }
};

export const verifyCertificate = async (certificateId: string): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (error) {
      console.error("Error verifying certificate:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in verifyCertificate:", error);
    return null;
  }
};
