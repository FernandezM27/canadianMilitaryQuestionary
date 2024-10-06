import express from "express";
import session from "express-session";
import fs from "fs";

const app = express();
const port = process.env.Port || 8080;

// Connect and read the JSON file
const quizQuestions = JSON.parse(fs.readFileSync('./data/quizQuestions.json'), 'utf-8');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Session Middleware
app.use(session({
    secret: 'mh07',
    resave: false,
    saveUninitialized: true
}));

// Will Display the main page
app.get("/", async (req, res) => {
    // Initialize session data for a new quiz
    req.session.currentQuestion = 0; //First Question that is be select randomly
    req.session.answers = []; // Array to store the answers
    res.render("index.ejs");
});

app.post("/start", async (req, res)=> {  
    // This will give a random number for the 10 question I have 
    let randomQuiz = Math.floor(Math.random() * 11);
    res.render('index.ejs', {questions:quizQuestions[0]});
});

app.post("/next", async (req, res)=> {
    let answer = req.body; // this is the user answer
    let currentQuestion = req.session.currentQuestion;
    
    // // Store the user's answer in the session
    req.session.answers[currentQuestion] = answer;

    // Move to the next question
    req.session.currentQuestion++;
    
    if (req.session.currentQuestion >= quizQuestions.length) {
        // If all questions have been answered, calculate the result
        const score = calculateScore(req.session.answers, quizQuestions);
        res.render("results.ejs", { score: score, totalQuestions: quizQuestions.length });
    } else {
        // If there are more questions, display the next question
        
        let nextQuestion = quizQuestions[req.session.currentQuestion];
        res.render("index.ejs", { questions: nextQuestion });
    }

    function calculateScore(userAnswers, questions) {
        
        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            // This validate if the users answer match with our answers
            if (userAnswers[i]?.options === questions[i].answer) {
                score++;
            }
        }
        return score;
    }
});

app.post("/restart", async (req, res)=> {
    // To restart the questionary
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
