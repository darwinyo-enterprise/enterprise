var path=require('path');
var sassTrue=require('sass-true');

var sassFile='./../../tests/test.scss';
sassTrue.runSass({file: sassFile}, describe, it);