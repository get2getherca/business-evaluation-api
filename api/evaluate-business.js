// AI Business Evaluation Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const {
    business_name,
    business_website,
    industry_type,
    business_location,
    monthly_revenue,
    revenue_trend,
    active_customers,
    customer_acquisition,
    current_challenge,
    employee_count,
    cash_flow,
    marketing_investment,
    primary_goal,
    additional_notes
  } = req.body;

  const prompt = `
You are an experienced business analyst and consultant.
Based on the following details, determine the business stage: Growing, Stable, Stagnant, or Dying.

- Business Name: ${business_name}
- Website: ${business_website}
- Industry: ${industry_type}
- Location: ${business_location}
- Average Monthly Revenue: ${monthly_revenue}
- Revenue Trend: ${revenue_trend}
- Number of Active Customers: ${active_customers}
- Customer Acquisition Frequency: ${customer_acquisition}
- Main Challenges: ${current_challenge}
- Number of Employees: ${employee_count}
- Cash Flow Situation: ${cash_flow}
- Monthly Marketing/Growth Investment: ${marketing_investment}
- 12-Month Goal: ${primary_goal}
- Additional Notes: ${additional_notes}

Even if browsing the website is unavailable, guess its professionalism based on the domain name.

Provide output with:
1. 📈 Business Stage
2. 🔍 Key Observations
3. 🚀 Strategic Suggestion (based on 2025 trends)
4. 📢 Social Media Growth Tip

Use a friendly, supportive, professional tone. Limit to 300 words.
`;

  const openaiApiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert business consultant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 500
    })
  });

  const data = await response.json();
  const result = data.choices[0].message.content.trim();

  res.status(200).json({ evaluation: result });
}
