
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { executeCode } from "./execution.ts";
import { getTestCases, saveSubmission } from "./database.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to normalize output for comparison
function normalizeOutput(output: string): string {
  if (!output) return "";
  
  const trimmed = output.trim();
  
  // Handle array output normalization
  if ((trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      // Try to parse as JSON and re-stringify to ensure consistent format
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      return JSON.stringify(parsed);
    } catch {
      // If parsing fails, do basic normalization
      return trimmed
        .replace(/\s+/g, '')  // Remove all whitespace
        .replace(/'/g, '"');  // Replace single quotes with double quotes
    }
  }
  
  // For other outputs, normalize whitespace
  return trimmed.replace(/\s+/g, ' ');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get submission data from request
    const submission = await req.json();
    const { code, language, problemId, userId, input, timeLimit, memoryLimit } = submission;

    // Validate basic input
    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing submission: language=${language}, problemId=${problemId || 'none'}`);

    // Handle single input execution (like when user clicks "Run")
    if (input !== undefined) {
      const result = await executeCode(code, language, input, timeLimit, memoryLimit);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For test cases execution
    if (!problemId) {
      return new Response(
        JSON.stringify({ error: "Problem ID is required for test cases" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const testCases = await getTestCases(supabase, problemId);

    if (!testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: "No test cases found for this problem" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Execute code on each test case
    const testResults = [];
    let allPassed = true;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;

    for (const testCase of testCases) {
      const result = await executeCode(code, language, testCase.input, timeLimit, memoryLimit);
      
      const normalizedOutput = normalizeOutput(result.output || "");
      const normalizedExpected = normalizeOutput(testCase.expected_output);
      const passed = normalizedOutput === normalizedExpected;
      
      if (!passed) allPassed = false;
      
      totalExecutionTime += result.executionTime || 0;
      maxMemoryUsed = Math.max(maxMemoryUsed, result.memoryUsed || 0);
      
      testResults.push({
        id: testCase.id,
        input: testCase.input,
        expected: testCase.expected_output,
        output: result.output || "",
        passed,
        executionTime: result.executionTime || 0,
        memoryUsed: result.memoryUsed || 0,
        error: result.error
      });
    }

    // Save submission result to database if userId is provided
    if (userId) {
      const status = allPassed ? "accepted" : "wrong_answer";
      await saveSubmission(
        supabase,
        userId,
        problemId,
        code,
        language,
        status,
        totalExecutionTime,
        maxMemoryUsed
      );
    }

    // Prepare and return the results
    const response = {
      status: allPassed ? "accepted" : "wrong_answer",
      executionTime: totalExecutionTime,
      memoryUsed: maxMemoryUsed,
      testResults
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
