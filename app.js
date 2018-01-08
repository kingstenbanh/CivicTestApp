const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const civicSip = require('civic-sip-api');
const https = require('https');
const fs = require('fs');
const path = require('path');

const sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const civicClient = civicSip.newClient({
    appId: 'S1FXOI1EG',
    prvKey: '69960c0ee527363ef78406ac073760beb68552f111bb82bf1d2f149164cff27a',
    appSecret: '9bba692f4d56cd3bcc1aa602d5926179',
});

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.route('/api/authenticate')
    .post((req, res) => {
        const { token } = req.body;

        civicClient.exchangeCode(token)
            .then((userData) => {
                console.log(`userData: ${JSON.stringify(userData, null, 4)}`);
                res.json(userData);
            }).catch((error) => {
                console.log('error', error);
                res.send(error);
            });
    });

app.use('/', router);

const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(port);
console.log(`Magic happens on port ${port}`);






