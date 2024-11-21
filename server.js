const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const atob = require('atob');
const fileType = require('file-type');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const upload = multer();

const user_id = "Bhupesh_Kurra";
const email = "Bhupeshkurra221162@acropolis.in";
const roll_number = "0827CID06223";

// Helper functions
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const processFile = (file_b64) => {
    if (!file_b64) return { file_valid: false, file_mime_type: null, file_size_kb: null };
    try {
        const buffer = Buffer.from(file_b64, 'base64');
        const type = fileType(buffer);
        if (!type) return { file_valid: false, file_mime_type: null, file_size_kb: null };
        return { file_valid: true, file_mime_type: type.mime, file_size_kb: (buffer.length / 1024).toFixed(2) };
    } catch (error) {
        return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }
};

app.post('/bfhl', upload.none(), (req, res) => {
    try {
        const { data, file_b64 } = req.body;
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const highest_lowercase_alphabet = alphabets.filter(item => item === item.toLowerCase()).sort().pop() || null;
        const is_prime_found = numbers.some(num => isPrime(Number(num)));
        const file_info = processFile(file_b64);

        res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
            highest_lowercase_alphabet,
            is_prime_found,
            ...file_info
        });
    } catch (error) {
        res.status(500).json({ is_success: false, error: error.message });
    }
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});