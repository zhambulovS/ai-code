
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

    // Получим дополнительную информацию о проблеме из базы данных
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://cpyiqxbdktckgoreexxu.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let problemDetails = {};
    let userHistory = {};

    // Получение информации о проблеме
    try {
      const problemResponse = await fetch(`${supabaseUrl}/rest/v1/problems?id=eq.${problemId}&select=*`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        }
      });
      const problemData = await problemResponse.json();
      if (problemData && problemData.length > 0) {
        problemDetails = problemData[0];
      }
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }

    // Получение истории решений пользователя
    try {
      const historyResponse = await fetch(
        `${supabaseUrl}/rest/v1/submissions?user_id=eq.${userId}&select=*&order=created_at.desc&limit=10`, 
        {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
          }
        }
      );
      const historyData = await historyResponse.json();
      if (historyData) {
        userHistory = {
          submissionCount: historyData.length,
          recentLanguages: [...new Set(historyData.map((s: any) => s.language))],
          successRate: historyData.filter((s: any) => s.status === 'accepted').length / historyData.length
        };
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
    }

    // Create prompt for the AI with enhanced context
    const promptTemplate = `Based on the following information about a coding problem:

Problem ID: ${problemId}
${problemDetails.title ? `Problem Title: ${problemDetails.title}` : ''}
${problemDetails.difficulty ? `Difficulty: ${problemDetails.difficulty}` : ''}
${problemDetails.tags ? `Tags: ${problemDetails.tags.join(', ')}` : ''}

User's Profile:
${Object.keys(userHistory).length ? `- Submission Count: ${(userHistory as any).submissionCount}
- Recently Used Languages: ${(userHistory as any).recentLanguages?.join(', ')}
- Recent Success Rate: ${Math.round(((userHistory as any).successRate || 0) * 100)}%` : '- No history available'}

User's Failed Code:
\`\`\`
${failedSubmission}
\`\`\`

Test Output:
${testOutput}

Please provide a helpful hint that:
1. Identifies potential issues in the approach
2. Suggests improvements without giving away the solution
3. Points to relevant concepts or patterns that might help
4. Addresses specific test case failures if applicable
5. Considers the user's past performance and preferred languages

Keep the hint concise, clear, and focused on guiding the user toward the solution rather than providing it directly.
Tailor your response based on the user's past performance - if they have a high success rate, be more technical; if low, be more supportive.`;

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
            content: 'You are a helpful programming mentor who provides hints for coding problems. Keep hints constructive and avoid giving direct solutions. Tailor your response to the user\'s skill level and past performance.'
          },
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      }),
    });

    const aiResponse = await response.json();
    const hint = aiResponse.choices[0].message.content;

    // Store the hint in the database
    const { error: insertError } = await fetch(`${supabaseUrl}/rest/v1/hint_logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
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
