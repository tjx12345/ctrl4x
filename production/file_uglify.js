var compresser = require('dir-compress');
compresser.compress({
    rootPath: '../teacher',
    newRootPath: '../teacher_production'
})