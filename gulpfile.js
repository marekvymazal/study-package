const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

function processPackage( packageName, data, subDir) {
    var files = fs.readdirSync("packages/" + subDir);
    for (var i in files) {
        var ext = path.extname(files[i]);
        if (ext == '.json') {
            //filesToProcess.push(packageName, data, "data/" + subDir + files[i]);
            var fData = JSON.parse(fs.readFileSync('./packages/' + subDir + files[i], 'utf8'));
            if ("questions" in fData) {
                //data['questions'] = data['questions'].concat(fData['questions']);
                data['questions'].push(...fData['questions']);
            }
            //console.log( JSON.stringify(fData, null, 2));
            // load json data
            //console.log('  ', files[i]);
            // add to data

        } else if (ext == "" && !files[i].startsWith('.')) {
            data = processPackage(packageName, data, files[i] + "/");
        }
    }

    return data;
}

function generatePackageList() {
    var files = fs.readdirSync("packages/");

    var package_list = [];

    for (var i in files) {
        var ext = path.extname(files[i]);
        if (ext == "" && !files[i].startsWith('.')) {
            // root package
            console.log(files[i]);
            var data = processPackage(files[i], { 'questions':[] }, files[i] + "/");
            package_list.push( files[i] );

            fs.writeFileSync("./public/packages/" + files[i] + '.json', JSON.stringify(data, null, 2));
        }
    }

    //JSON.stringify(package_data, null, 2);
    fs.writeFileSync("./public/" + 'packages.json', JSON.stringify(package_list, null, 2));
}

function savePackageData() {

}

gulp.task('build', async function() {
    //console.log('build');
    // generate package list
    //package_data = [];
    generatePackageList();

    // save package data
    //savePackageData();
});

gulp.task('default', async function() {
    gulp.series('build');
    gulp.watch(['./packages/**/*','./public/scripts/**/*.js'], gulp.series('build'));
});