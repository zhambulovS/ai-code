
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemId, userId, failedSubmission, testOutput } = await req.json();

    // Create prompt for the AI
    const promptTemplate = `Based on the following information about a coding problem:

Problem ID: ${problemId}
User's Failed Code:
${failedSubmission}

Test Output:
${testOutput}

Please provide a helpful hint that:
1. Identifies potential issues in the approach
2. Suggests improvements without giving away the solution
3. Points to relevant concepts or patterns that might help
4. Addresses specific test case failures if applicable

Keep the hint concise, clear, and focused on guiding the user toward the solution rather than providing it directly.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful programming mentor who provides hints for coding problems. Keep hints constructive and avoid giving direct solutions.'
          },
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    const aiResponse = await response.json();
    const hint = aiResponse.choices[0].message.content;

    // Store the hint in the database
    const { error: insertError } = await fetch('https://cpyiqxbdktckgoreexxu.supabase.co/rest/v1/hint_logs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        problem_id: problemId,
        generated_hint: hint
      })
    }).then(r => r.json());

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ hint }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating hint:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
