/* eslint-disable no-useless-return */
/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
// HERE ARE SOME EXAMPLES OF RAW HTTP REQUESTS (text)
// WE ARE GOING TO WRITE A COLLECTION OF FUNCTIONS THAT PARSE THE HTTP REQUEST
// AND CONVERTS IT ALL INTO A Javascript object

// EXAMPLE INPUT 1
const rawGETRequest = `
GET / HTTP/1.1
Host: www.example.com
`
// OUTPUT
const request = {
  method: 'GET',
  path: '/',
  headers: {
    Host: 'www.example.com'
  },
  body: null,
  query: null
}
// EXAMPLE 2
const rawGETRequestComplex = `
GET /api/data/123?someValue=example HTTP/1.1
Host: www.example.com
Authorization: Bearer your_access_token
`
const requestComplex = {
  method: 'GET',
  path: '/api/data/123',
  headers: {
    Host: 'www.example.com',
    Authorization: 'Bearer your_access_token'
  },
  body: null,
  query: {
    someValue: 'example'
  }
}
// EXAMPLE 3: NOTE the BODY is separated from the HEADERS via an empty line
const rawPOSTRequest = `
POST /api/data HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 36

{"key1": "value1", "key2": "value2"}
`
const requestPOST = {
  method: 'POST',
  path: '/api/data',
  headers: {
    Host: 'www.example.com',
    'Content-Type': 'application/json',
    'Content-Length': '36'
  },
  body: {
    key1: 'value1',
    key2: 'value2'
  },
  query: null
}

// IMPLEMENTATION
// WE WILL provide different tests for the different functions

// 1. Create a function named parseRequest that accepts one parameter:
// - the raw HTTP request string
// It must return an object with the following properties:
// - method: the HTTP method used in the request
// - path: the path in the request
// - headers: an object with the headers in the request
// - body: the body in the request
// - query: an object with the query parameters in the request
function parseRequest(req) {
  const request = {
    method: '',
    path: '',
    headers: {},
    body: null,
    query: null
  }

  let trimmedReq = req.trim()

  //method
  if (trimmedReq.startsWith('GET')) {
    request.method = 'GET'
    trimmedReq = trimmedReq.slice(3).trim()
  } else if (trimmedReq.startsWith('POST')) {
    request.method = 'POST'
    trimmedReq = trimmedReq.slice(4).trim()
  }

  //path
  let pathString = ''
  let indexCount = 0
  for (let i = 0; i < trimmedReq.length; i++) {
    if (trimmedReq[i] === ' ' || trimmedReq[i] ==='?') {
      request.path = pathString
      break;
    } else {
      pathString = pathString + trimmedReq[i]
      indexCount = indexCount + 1
    }
  }
  trimmedReq = trimmedReq.slice(indexCount).trim()

  //query
  if (trimmedReq.startsWith('?')) {
    const lines = trimmedReq.split('\n')
    const queryLine = lines.shift()
    
    const queryDict = Object.fromEntries(
      queryLine
        .substring(1, queryLine.indexOf(' '))
        .split('&')
        .map(param => param.split('='))
    )

    request.query = queryDict
    trimmedReq = lines
  } else {
    trimmedReq = trimmedReq.split('\n').slice(1)
  }


  //headers
  const headers = {}
  let i = 0;

  for (; i < trimmedReq.length; i++) {
    const line = trimmedReq[i].trim()
    if (line === '') break;
    const [key, value] = line.split(':').map(str => str.trim())
    if (key && value) headers[key] = value
  }
  request.headers = headers;
  trimmedReq = trimmedReq.slice(i + 1).join('\n').trim()

  //body
  if (trimmedReq && trimmedReq.trim() !== '') {
    const dict = JSON.parse(trimmedReq);
    request.body = dict
  }

  return request
}

// 2. Create a function named parseHeader that accepts two parameters:
// - a string for one header, and an object of current headers that must be augmented with the parsed header
// it doesnt return nothing, but updates the header object with the parsed header
// eg: parseHeader('Host: www.example.com', {})
//        => { Host: 'www.example.com' }
// eg: parseHeader('Authorization: Bearer your_access_token', { Host: 'www.example.com' })
//        => { Host: 'www.example.com', Authorization: 'Bearer your_access_token'}
// eg: parseHeader('', { Host: 'www.example.com' }) => { Host: 'www.example.com' }
function parseHeader(header, headers) {
  if (header.trim() === '') return;

  const [key, value] = header.split(':').map(str => str.trim());

  if (key && value) {
    headers[key] = value;
  }
}

// 3. Create a function named parseBody that accepts one parameter:
// - a string for the body
// It must return the parsed body as a JavaScript object
// search for JSON parsing
// eg: parseBody('{"key1": "value1", "key2": "value2"}') => { key1: 'value1', key2: 'value2' }
// eg: parseBody('') => null
function parseBody(body) {
  if (!body.trim()) return null;

  try {
    return JSON.parse(body);
  } catch (error) {
    return null;
}
}

// 4. Create a function named extractQuery that accepts one parameter:
// - a string for the full path
// It must return the parsed query as a JavaScript object or null if no query ? is present
// eg: extractQuery('/api/data/123?someValue=example') => { someValue: 'example' }
// eg: extractQuery('/api/data/123') => null
function extractQuery(path) {
  const queryIndex = path.indexOf('?');
  if (queryIndex === -1) return null;

  const queryString = path.slice(queryIndex + 1);

  const queryObject = Object.fromEntries(
    queryString
      .split('&')
      .map(pair => pair.split('=').map(decodeURIComponent))
  );

  return queryObject;
}

module.exports = {
  rawGETRequest,
  rawGETRequestComplex,
  rawPOSTRequest,
  request,
  requestComplex,
  requestPOST,
  parseRequest /* eslint-disable-line no-undef */,
  parseHeader /* eslint-disable-line no-undef */,
  parseBody /* eslint-disable-line no-undef */,
  extractQuery /* eslint-disable-line no-undef */
}
