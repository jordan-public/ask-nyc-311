# Ask New York City 311

## What is this?

Users can ask questions in natural language and obtain answers from the New York City 311 system.

## How does it work?

- The user enters the question.
- The question is posted to the Large Language AI model (LLM), with request to produce a set of relevant search keywords.
- The New York City 311 web site is searched with those keywords.
- The Large Language AI model (LLM) is asked to analyze the search result titles and pick the most relevant article.
- A link to the most relevant article from the New York City 311 web site is posted, on which the user can click and get the answer.

The application is technically performing AI actions, but without the use of any tool. To achieve this,
the LLM is prompted to suggest an action. Then the action is parsed by the application and executed. The
response is HTML, which the application parses and submits back to the LLM for further questions,
in this case to select the most relevant article. Then again, the response is parsed and the article URL
is placed as a link presented to the user.

## Demo

The prototype is deployed [here](https://near.org/nearjordan.near/widget/ask). As this is a prototype, the user is asked to enter their OpenAI API key, which can be obtained [here](https://platform.openai.com/account/api-keys). 
DISCLAIMER: This is a prototype and it can produce incorrect answers, for which we are not responsible.

Video demo can be downloaded [here](./askNYC311.mov) or viewed on YouTube [here](https://youtu.be/ZD0AwvebVio).

[#hack #buildcity #hackoween](https://taikai.network/hackbox/hackathons/HackoweenCivicTech/projects/cloa8sznb00dkxk01w93wp0ax/idea)