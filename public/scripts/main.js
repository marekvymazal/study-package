var package_data = {};
var question_index = 0;
var correctCnt = 0;
var wrongCnt = 0;

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

    let textArea = document.createElement('textarea');
    inputDiv.appendChild(textArea);

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

        // show answer
        let answerDisplay = document.createElement('div');
        answerDisplay.innerHTML = q_data.answer;
        answerDiv.appendChild(answerDisplay);

        // prompt
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
    };
}

async function init() {

    // load packages
    let packages = await loadPackages();

    // create package menu
    generatePackageMenu(packages);
}

init();