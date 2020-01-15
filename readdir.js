var testFolder='./data';//실행하는 위치를 기준
var fs=require('fs');

fs.readdir(testFolder, function(error, filelist){
    console.log(filelist);
})
