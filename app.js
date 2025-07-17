const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let tasksByDate = {}; // Menyimpan semua task berdasarkan tanggal
let currentDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Fungsi bantu untuk memastikan array task selalu tersedia
function getTasksForDate(date) {
    if (!tasksByDate[date]) {
        tasksByDate[date] = [];
    }
    return tasksByDate[date];
}

// Halaman utama
function formatTanggal(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

app.get('/', (req, res) => {
    const date = req.query.date || currentDate;
    const tasks = getTasksForDate(date);
    const formattedDate = formatTanggal(date);
    res.render('index', { tasks, date, formattedDate });
});


// Menambah task
app.post('/add', (req, res) => {
    const date = req.body.date;
    const title = req.body.title;
    const task = {
        id: Date.now(),
        title,
        completed: false
    };
    getTasksForDate(date).push(task);
    res.redirect('/?date=' + date);
});

// Menandai task selesai
app.post('/complete/:id', (req, res) => {
    const date = req.body.date;
    const id = parseInt(req.params.id);
    tasksByDate[date] = getTasksForDate(date).map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    res.redirect('/?date=' + date);
});

// Menghapus task
app.post('/delete/:id', (req, res) => {
    const date = req.body.date;
    const id = parseInt(req.params.id);
    tasksByDate[date] = getTasksForDate(date).filter(task => task.id !== id);
    res.redirect('/?date=' + date);
});

app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});
