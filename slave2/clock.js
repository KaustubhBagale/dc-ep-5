// clock.js
let localTime = Date.now();

// Simulate clock drift by adjusting local time every second
setInterval(() => {
    localTime += 1000 + (Math.random() * 10 - 5); // random drift between -5ms and +5ms
}, 1000);

function getLocalTime() {
    return localTime;
}

function setLocalTime(newTime) {
    localTime = newTime;
}

module.exports = { getLocalTime, setLocalTime };
