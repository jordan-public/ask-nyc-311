  const [apiKey, setApiKey] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [links, setLinks] = useState('');
  const [parsedAnswer, setParsedAnswer] = useState('');

  const handleAsk = () => {
    const response = asyncFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        temperature: 0.5,
      }),
    });

    response.then((data) => {
        console.log("response", data);
        console.log("Answer", data.body.choices[0].message.content);
        setAnswer(data.body.choices[0].message.content);
    }).catch((error) => {
        console.log("error", error);
    });
  };

  const ask311 = () => {
    const response = asyncFetch('https://portal.311.nyc.gov/search/?q=Water+leak+solutions', {
        method: 'GET',
    });

    response.then((data) => {
        console.log("response", data);
        //console.log("Answer", data.body.choices[0].message.content);
        setAnswer(JSON.stringify(data));
    }).catch((error) => {
        console.log("error", error);
    });
  };

  function extractLinks(htmlText) {
    // Create a DOM parser
    var parser = new DOMParser();
    
    // Parse the HTML text
    var doc = parser.parseFromString(htmlText, 'text/html');
    
    // Get all anchor elements
    var anchors = doc.querySelectorAll('a');
    
    // Initialize an empty array to hold the links
    var links = [];
    
    // Iterate over the anchor elements, extracting the href and text content
    anchors.forEach(function(anchor) {
      var linkObj = {
        text: anchor.textContent,
        url: anchor.href
      };
      links.push(linkObj);
    });
    
    return links;
  }
  
  useEffect(() => {
    setParsedAnswer(setLinks(extractLinks(answer)));
  }, [answer]);

  return (<div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleAsk}>Ask</button>
      <button onClick={ask311}>311</button>
      <textarea
        value={answer}
        readOnly
        style={{ width: '100%', height: '200px', marginTop: '10px' }}
      />
     <textarea
        value={parsedAnswer}
        readOnly
        style={{ width: '100%', height: '200px', marginTop: '10px' }}
      />
    </div>
  );

