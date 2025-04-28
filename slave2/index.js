// slave1/index.js or slave2/index.js
const express = require('express');
const axios = require('axios');
const { getLocalTime, setLocalTime } = require('./clock');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002; // 3001 for slave1, 3002 for slave2
const MASTER_URL = 'http://localhost:3000';

// Endpoint to return local time
app.get('/local_time', (req, res) => {
    res.json({ time: getLocalTime() });
});

// Endpoint to adjust clock based on master's offset
app.post('/adjust_time', (req, res) => {
    const { offset } = req.body;
    setLocalTime(getLocalTime() + offset);
    res.send('Clock adjusted');
});

// Endpoint for Cristian's Algorithm (Client side)
// Improved Cristian's Algorithm sync on Slave
app.get('/sync_with_master', async (req, res) => {
    const T1 = Date.now();
    const response = await axios.get(`${MASTER_URL}/get_time`);
    const T2 = Date.now();
    const serverTime = response.data.time;

    const RTT = T2 - T1;
    const adjustedTime = serverTime + RTT / 2;
    const oldTime = getLocalTime();

    setLocalTime(adjustedTime);

    res.json({
        method: "Cristian's Algorithm",
        oldLocalTime: new Date(oldTime).toString(),
        serverTime: new Date(serverTime).toString(),
        RTT: `${RTT} ms`,
        newLocalTime: new Date(adjustedTime).toString()
    });
});


app.listen(PORT, () => {
    console.log(`Slave running at http://localhost:${PORT}`);
});
