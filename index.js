import http from 'http';
import { v4 } from 'uuid';

const port = 4000;
const grades = [];

const server = http.createServer((request, response) => {
    const { method, url } = request;
    let body = '';

    request.on('data', (chunk) => {
        body += chunk.toString();
    });

    request.on('end', () => {
        if (url === '/grades' && method === 'GET') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(grades));
        } else if (url === '/grades' && method === 'POST') {
            if (body) { // Verifica se o corpo não está vazio
                try {
                    const { studentName, subject, grade } = JSON.parse(body);
                    const newGrade = { id: v4(), studentName, subject, grade };
                    grades.push(newGrade);
                    response.writeHead(201, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(newGrade));
                } catch (err) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Invalid JSON input' }));
                }
            } else {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Empty body, JSON input required' }));
            }
        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Route not found' }));
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
