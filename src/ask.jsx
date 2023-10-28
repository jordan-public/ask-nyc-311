  const [apiKey, setApiKey] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [links, setLinks] = useState('');
  const [parsedAnswer, setParsedAnswer] = useState('');
  const [searchWords, setSearchWords] = useState('');
  const [answerUrl, setAnswerUrl] = useState('');

  const urlRoot = 'https://portal.311.nyc.gov';

  const askGPT = (question, setAnswer) => {
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

  const ask311 = (words, setAnswer) => {
    const response = asyncFetch('https://portal.311.nyc.gov/search/?q=' + words, {
        method: 'GET',
    });

    response.then((data) => {
        const text = unescapeSequences(data.body);
        console.log("response", text);
        const links = extractLinks(text);
        const articleLinks = links.filter((link) => link.url.includes('article'));
        console.log("articleLinks", articleLinks, Array.isArray(articleLinks), articleLinks.length, typeof articleLinks);
        const absoluteLinks = articleLinks.map(link => {
          return { url: `${urlRoot}${link.url}`, text: link.text };
        });
        console.log("absoluteLinks", absoluteLinks);
        setAnswer(absoluteLinks);
    }).catch((error) => {
        console.log("error", error);
    });
  };

  const handleAsk = () => {
    const prompt = 
      'For the following question, provide a set of 1 to 5 single word keywords that best describe the question. '+
      'Answer with the keywords separated by + signs, no spacing and nothing else' + question;
    askGPT(prompt, setSearchWords);
  };

  useEffect(() => {
    if (searchWords) {
      ask311(searchWords, setLinks);
    }
  }, [searchWords]);

  useEffect(() => {
    if (links) {
      const textList = links
        .map((item, index) => `${index}. "${item.text}"`)
        .join('\n');
      const prompt = 
        "Here is the user's question: " + question + 
        "Here are the relevant search result titles: \n" + textList +
        "Which of the above search results best answers the question? " + 
        "Please enter the just number of the best answer, without the answer."
        setAnswer(prompt);
        askGPT(prompt, setParsedAnswer);
    }
  }, [links]);

  useEffect(() => {
    if (parsedAnswer) {
      const answerIndex = parseInt(parsedAnswer);
      const answerLink = links[answerIndex];
      setAnswerUrl(answerLink.url);
      // const answerUrl = answerLink.url;
      // console.log("answerUrl", answerUrl);
      // window.open(answerUrl, '_blank');
    }
  }, [parsedAnswer]);

  function unescapeSequences(str) {
    return str
      .replace(/\\r/g, '\r')  // Unescapes \r
      .replace(/\\n/g, '\n')  // Unescapes \n
      .replace(/\\t/g, '\t')  // Unescapes \t
      .replace(/\\"/g, '\"')  // Unescapes \
      // Add other escape sequences as needed
      ;
  }

  function extractLinks(html) {
    const links = [];
    // Use a non-capturing group (?:) with alternation to match either 'a' or 'link'
    const regex = /<(?:a|link)[^>]*href="([^"]*)"[^>]*>([^<]*)<\/(?:a|link)>/g;
    let match;
    while (match = regex.exec(html)) {
      links.push({ url: match[1], text: match[2] });
    }
    return links;
  }

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
        style={{ width: '600px', marginRight: '10px' }}
      />
      <button onClick={handleAsk}>Ask</button>
      {/*<textarea
        value={answer}
        readOnly
        style={{ width: '100%', height: '200px', marginTop: '10px' }}
      />
      <textarea
        value={parsedAnswer}
        readOnly
        style={{ width: '100%', height: '200px', marginTop: '10px' }}
      />*/}
      {answerUrl && <a href={answerUrl} target="_blank">Click here for your answer.</a>}
    </div>
  );

