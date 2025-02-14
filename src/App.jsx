import React, { useState, useEffect } from 'react';

function App() {
  const [productName, setProductName] = useState('');
  const [paymentGateways, setPaymentGateways] = useState(['Cielo', 'PagSeguro']);
  const [customGateway, setCustomGateway] = useState('');
  const [domainRestrictions, setDomainRestrictions] = useState(['.br', '.com']);
  const [customKeywords, setCustomKeywords] = useState('');
  const [generatedDork, setGeneratedDork] = useState('');
  const [estimatedResults, setEstimatedResults] = useState('Fetching...');
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);

  const predefinedPaymentGateways = ['Cielo', 'PagSeguro', 'Pagarme', 'Zoop', 'Ebanx', 'Erede', 'Safrapay', 'Braspag', 'Getnet', 'Adyen', 'Iugu', 'Assas'];

  const generateDork = async () => {
    let baseDork = `("${productName}") (site:${domainRestrictions.join(' OR site:')})`;
    let gatewayString = paymentGateways.map(gateway => `"${gateway}"`).join(' OR ');
    if (customGateway) {
      gatewayString += ` OR "${customGateway}"`;
    }
    baseDork += ` (${gatewayString})`;
    if (customKeywords) {
      baseDork += ` ${customKeywords}`;
    }

    setGeneratedDork(baseDork);
    setEstimatedResults('Awaiting analysis...');
    setImprovementSuggestions([]);
  };

  const enhanceDorkWithGemini = async () => {
    const optimizedDork = await optimizeDorkWithGemini(generatedDork);
    setGeneratedDork(optimizedDork);

    // Simulate result analysis and get suggestions
    const analysisResults = await analyzeSearchResults(optimizedDork);
    setEstimatedResults(analysisResults.estimatedResults);
    setImprovementSuggestions(analysisResults.suggestions);
  };

  const optimizeDorkWithGemini = async (dork) => {
    const apiKey = 'AIzaSyAM7UoGJyXbKe9-zJkYM8HE_oJdcNH74DE';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const prompt = `You are an expert in crafting precise Google dorks for targeted searches. Your task is to refine the following dork for maximum accuracy and relevance:\n\n${dork}\n\nReturn the optimized dork in plain text format ready for use.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Gemini API returned unexpected format:', data);
        return dork; // Return original dork if optimization fails
      }
    } catch (error) {
      console.error('Error optimizing dork with Gemini API:', error);
      return dork; // Return original dork if API call fails
    }
  };

  const analyzeSearchResults = async (dork) => {
    // This is a placeholder function to simulate analyzing search results
    // In a real environment, this would involve web scraping and analysis
    console.warn('Simulating search result analysis.  Real implementation requires web scraping.');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const randomResults = Math.floor(Math.random() * 1000000);
    const suggestions = [];

    if (randomResults > 500000) {
      suggestions.push('Try adding more specific keywords to narrow down the results.');
    } else if (randomResults < 10000) {
      suggestions.push('Consider broadening your search terms to increase the number of results.');
    } else {
      suggestions.push('The dork seems well-optimized.  Consider testing different variations.');
    }

    return {
      estimatedResults: `${randomResults}+ (simulated)`,
      suggestions: suggestions,
    };
  };

  const addPaymentGateway = () => {
    if (customGateway && !paymentGateways.includes(customGateway)) {
      setPaymentGateways([...paymentGateways, customGateway]);
      setCustomGateway('');
    }
  };

  const removePaymentGateway = (gatewayToRemove) => {
    setPaymentGateways(paymentGateways.filter(gateway => gateway !== gatewayToRemove));
  };

  return (
    <div>
      <h1>JCM GROUP DORK GENERATOR</h1>

      <label htmlFor="productName" className="neon-text">Product Name:</label>
      <input
        type="text"
        id="productName"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <label className="neon-text">Payment Gateways:</label>
      <div>
        {predefinedPaymentGateways.map(gateway => (
          <label key={gateway}>
            <input
              type="checkbox"
              value={gateway}
              checked={paymentGateways.includes(gateway)}
              onChange={(e) => {
                if (e.target.checked) {
                  setPaymentGateways([...paymentGateways, gateway]);
                } else {
                  removePaymentGateway(gateway);
                }
              }}
            />
            {gateway}
          </label>
        ))}
        <div>
          <input
            type="text"
            placeholder="Custom Gateway"
            value={customGateway}
            onChange={(e) => setCustomGateway(e.target.value)}
          />
          <button type="button" onClick={addPaymentGateway}>
            Add Gateway
          </button>
        </div>
      </div>

      <label className="neon-text">Domain Restrictions:</label>
      <div>
        <label>
          <input
            type="checkbox"
            value=".br"
            checked={domainRestrictions.includes('.br')}
            onChange={(e) => {
              if (e.target.checked) {
                setDomainRestrictions([...domainRestrictions, '.br']);
              } else {
                setDomainRestrictions(domainRestrictions.filter(domain => domain !== '.br'));
              }
            }}
          />
          .br
        </label>
        <label>
          <input
            type="checkbox"
            value=".com"
            checked={domainRestrictions.includes('.com')}
            onChange={(e) => {
              if (e.target.checked) {
                setDomainRestrictions([...domainRestrictions, '.com']);
              } else {
                setDomainRestrictions(domainRestrictions.filter(domain => domain !== '.com'));
              }
            }}
          />
          .com
        </label>
      </div>

      <label htmlFor="customKeywords" className="neon-text">Custom Keywords:</label>
      <textarea
        id="customKeywords"
        value={customKeywords}
        onChange={(e) => setCustomKeywords(e.target.value)}
        placeholder="e.g., frete grátis, parcelamento"
      />

      <button onClick={generateDork}>Generate Dork</button>

      <div className="output-section">
        <h2>Generated Dork:</h2>
        <p>{generatedDork}</p>
        <button onClick={() => {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(generatedDork)}`, '_blank');
        }}>Test in New Tab</button>
        <button onClick={() => {
          navigator.clipboard.writeText(generatedDork);
          alert('Dork copied to clipboard!');
        }}>Copy</button>
        <button onClick={enhanceDorkWithGemini}>Enhance with Gemini</button>
        <p>Estimated Results: {estimatedResults}</p>
        {improvementSuggestions.length > 0 && (
          <div>
            <h3>Improvement Suggestions:</h3>
            <ul>
              {improvementSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
