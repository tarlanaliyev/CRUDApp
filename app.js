const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('joi');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req,res) => {
    res.send("Heelo World");
})

app.get('/api/courses', (req,res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not find!");
    res.send(course);
})

app.post('/api/courses', (req,res) => {
    const { error } = validateCourse(req.body.name);
    if (error) return res.status(400).send(error.details[0].message);

    const courseObj = {id: courses.length + 1, name: req.body.name};
    courses.push(courseObj);
    res.send(courses);

})

app.put('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not find!");

    const { error } = validateCourse(req.body.name);

    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(courses);
})

app.delete('/api/courses/:id', (req,res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not find!");

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(courses);

})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate({name: course});
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))