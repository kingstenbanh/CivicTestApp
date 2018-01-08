const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const civicSip = require('civic-sip-api');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const civicClient = civicSip.newClient({
    appId: 'rJiZRKeEM',
    prvKey: '859568b6bd33e65c2725eb3bbbe09ec824c11d231d6a3c62e894e35bb945c5d5',
    appSecret: '185e8015524e82f8fda319ec1312f15c',
});

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to my app!' });
});

router.route('/authenticate')
    .post((req, res) => {
        const { token } = req.body;

        console.log(token);

        civicClient.exchangeCode(token)
            .then((userData) => {
                console.log(`userData: ${JSON.stringify(userData, null, 4)}`);
                res.json(userData);
            }).catch((error) => {
                console.log('error', error);
                res.send(error, 500);
            });
    });


app.use('/api', router);

app.listen(port);
console.log(`Magic happens on port ${port}`);






