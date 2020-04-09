var grunt=require('grunt');

//配置
grunt.config.init({
    pkg: grunt.file.readJSON('gruntPackage.json'),
    'create-windows-installer': {
        x64:{
            version:'2.0.6',
            authors:'AlexHu',
            projectUrl:'',
            appDirectory:'./electron2-win32-x64 --platform=win32 --arch=x64 ',//要打包的输入目录
            outputDirectory:'./OutPut/exePath',//grunt打包后的输出目录
            exe:'electron2.exe',
            description:'electron2',
            setupIcon:"./assets/1.ico",
            noMsi:true
        }
    }
});

//加载任务
grunt.loadNpmTasks('grunt-electron-installer');

//设置为默认
grunt.registerTask('default', ['create-windows-installer']);