const express = require('express');
const cors = require('cors');
const { runRotasi } = require('./rotasi');
const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post('/start-rotasi', async (req, res) => {
  let { startDate, endDate, dept, divisi } = req.body;

  const today = new Date();

  if (!startDate) {
    const start = new Date(today);
    start.setDate(today.getDate() - 2);
    startDate = start.toISOString().split('T')[0];
  }
  if (!endDate) {
    endDate = today.toISOString().split('T')[0];
  }

  dept = dept || 'null';
  divisi = divisi || 'null';

  try {
    const message = await runRotasi(startDate, endDate, dept, divisi);
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`API Rotasi siap diakses di http://localhost:${port}/start-rotasi`);
});
