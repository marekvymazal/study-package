var package_data = {};
var question_index = 0;
var correctCnt = 0;
var wrongCnt = 0;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function loadPackages() {
    try {
        let res = await fetch('packages.json');
        let data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function loadPackageJSON( label ) {
    try {
        let res = await fetch('packages/' + label + '.json');
        return await res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function loadPackage( label ) {
    console.log('load package:', label);

    let packageName = document.getElementById('package-name');
    packageName.innerHTML = label;

    // load package json file
    package_data = await loadPackageJSON( label );
    question_index = 0;

    // shuffle questions
    package_data.questions = shuffle(package_data.questions)

    // start quizzer
    doQuestion();
}

function generatePackageMenu( packages) {
    let container = document.getElementById('menu');
    for (const pkg of packages) {
        let btn = document.createElement('button');
        btn.innerHTML = pkg;

        btn.onclick = () => { loadPackage( pkg ); }

        container.appendChild(btn);
    }
}

function clearAll() {
    let questionDiv = document.getElementById('question');
    questionDiv.innerHTML = '';

    let inputDiv = document.getElementById('input');
    inputDiv.innerHTML = '';

    let answerDiv = document.getElementById('answer');
    answerDiv.innerHTML = '';
}

function doFinished() {

    clearAll();

    // show results
    let questionDiv = document.getElementById('question');

    let resultsLabel = document.createElement('div');
    resultsLabel.innerHTML = "Results";
    questionDiv.appendChild(resultsLabel);

    let correctResults = document.createElement('div');
    correctResults.innerHTML = "Correct: " + correctCnt;
    questionDiv.appendChild(correctResults);

    let wrongResults = document.createElement('div');
    wrongResults.innerHTML = "Wrong: " + wrongCnt;
    questionDiv.appendChild(wrongResults);


    // reset counts
    correctCnt = 0;
    wrongCnt = 0;
}

function doQuestion() {

    if (!package_data.questions) {
        doFinished();
        return
    }
    if (package_data.questions.length <= question_index) {
        doFinished();
        return;
    }

    // clear
    let answerDiv = document.getElementById('answer');
    answerDiv.innerHTML = '';

    // get question data
    console.log(JSON.stringify( package_data, null, 2));
    let q_data = package_data.questions[question_index];
    console.log(q_data);

    // 
    let questionDiv = document.getElementById('question');
    questionDiv.innerHTML = q_data.question;

    // setup input
    let inputDiv = document.getElementById('input');
    inputDiv.innerHTML = '';

    if (q_data.input === 'text') {
        let textArea = document.createElement('textarea');
        inputDiv.appendChild(textArea);
    } else if (q_data.input === 'choice') {
        // multiple choice ( one selection / radio )
        // copy options, shuffle
        let answerIndexes = []
        for (let index = 0; index < q_data.options.length; index++) {
            answerIndexes.push( index )
        }
        answerIndex = shuffle(answerIndexes)

        for (let index in answerIndex) {

            let sectionDiv = document.createElement('div')
            sectionDiv.className = 'input-section'

            let answer = q_data.options[answerIndex[index]]

            let answerDiv = document.createElement('input')
            answerDiv.type = 'radio'
            answerDiv.value = answerIndex[index]
            answerDiv.id = answerIndex[index]
            answerDiv.name = 'answer'

            if (index === '0') answerDiv.checked = true

            let labelDiv = document.createElement('label')
            labelDiv.htmlFor = index
            labelDiv.innerText = answer

            sectionDiv.appendChild(answerDiv)
            sectionDiv.appendChild(labelDiv)

            inputDiv.appendChild(sectionDiv)
        }
    }

    // setup next
    let nextButton = document.createElement('button');
    inputDiv.appendChild(nextButton);
    nextButton.innerHTML = 'Next';
    nextButton.onclick = () => {
        
        answerDiv.innerHTML = '';

        // label
        let answerLabel = document.createElement('div');
        answerLabel.innerHTML = 'Answer';
        answerDiv.appendChild(answerLabel);

        // prompt
        if (q_data.input === 'text') {

            // show answer
            let answerDisplay = document.createElement('div');
            answerDisplay.innerHTML = q_data.answer;
            answerDiv.appendChild(answerDisplay);

            let promptDiv = document.createElement('div');
            promptDiv.innerHTML = "Where you correct?";
            answerDiv.appendChild(promptDiv);

            // show correct / incorrect buttons
            let correctBtn = document.createElement('button');
            let wrongBtn = document.createElement('button');

            correctBtn.innerHTML = 'Yes';
            wrongBtn.innerHTML = 'No';

            answerDiv.appendChild(correctBtn);
            answerDiv.appendChild(wrongBtn);

            correctBtn.onclick = () => {
                correctCnt += 1;
                question_index += 1;
                doQuestion();
            }

            wrongBtn.onclick = () => {
                wrongCnt += 1;
                question_index += 1;
                doQuestion();
            }
        }
        else if (q_data.input === 'choice') {
            // get radio button option
            // show answer
            let answerDisplay = document.createElement('div');
            answerDisplay.innerHTML = q_data.options[0];
            answerDiv.appendChild(answerDisplay);

            //var answers = document.getElementsByName('answer'); 
            // for(i = 0; i < answers.length; i++) { 
            //     if(answers[i].checked) {
            //         if (answers[i].id == )
            //     }
            // }
            var selectedAnswer = document.getElementById('0')
            var correct = false
            if (selectedAnswer.checked) {
                correct = true
                correctCnt += 1
            } else {
                wrongCnt += 1
            }

            let resultDisplay = document.createElement('div');
            if (correct) {
                resultDisplay.innerHTML = "You are correct!"
            } else {
                resultDisplay.innerHTML = "You are wrong"
            }
            answerDiv.appendChild(resultDisplay);

            // next buttons
            let nextBtn = document.createElement('button');
            nextBtn.innerHTML = 'Next';
            answerDiv.appendChild(nextBtn);

            nextBtn.onclick = () => {
                question_index += 1;
                doQuestion();
            }
        }
    };
}

async function init() {

    // load packages
    let packages = await loadPackages();

    // create package menu
    generatePackageMenu(packages);
}

init();