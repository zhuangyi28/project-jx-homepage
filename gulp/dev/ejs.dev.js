/**模板引擎合并
 * 开发*/

var gulp = require('gulp'),

    ejs = require('gulp-ejs'),//ejs模板

    cheerio = require('gulp-cheerio'),//批量更换html中的引用

    connect = require('gulp-connect'),//服务器

    rename = require("gulp-rename");//重命名

var bom = require('gulp-bom');//解决UTF-8文件是采用无BOM


function devEjs() {

    gulp.src('src/view/**/*.{ejs,html}')

        .pipe(ejs())

        //增加媒体查询，通用样式文件
        .pipe(cheerio({

            run: function ($) {

                var addHtml = "";

                addHtml += "<meta name='renderer' content='webkit' />\n";

                addHtml +="<meta name='keywords' content='企业薪酬服务，薪酬管理，社保代理，公积金，工资代发，报税，工资计算，薪酬计算，劳务工资，社保，社保代缴，缴社保，缴公积金，发工资，嘉薪，个税，劳务工资，算工资' />\n";

                addHtml +='<meta name="description" content="专注在弹性福利领域，面对企业提供服务，帮助企业发放和管理员工福利、奖励。"/>\n'


                addHtml += "<link rel='shortcut icon' href='favicon.ico' type='image/x-icon' />\n";


                addHtml += "<link rel='stylesheet'  href='../css/jx_homepage.css'/>\n";//第二版开发样式

                $('head').append(addHtml);

            },

            parserOptions: {
                // Options herecnpm
                decodeEntities: false
            }

        }))

        //顺序增加脚本文件
        .pipe(cheerio({

            run:function($){
                var addJsMain = '\n<script src="../js/jx_homepage.js"></script>\n';//主要的脚本文件

                var addJsHtml="";//保存用的业务脚本

                var addJsRun="<script>\n";//运行的脚本

                var addJsHtmlHead="<script src='";

                var addJSHtmlBottom = "'></script>\n";

                $('script').each(function(index,ele){

                    if($(this).attr('src')){

                        addJsHtml+=addJsHtmlHead+$(this).attr('src')+addJSHtmlBottom;

                    }else {
                        addJsRun += $(this).html() + '\n';
                    }

                })

                addJsRun += "\n</script>\n";

                $('script').remove();

                $('body').append(addJsMain);

                $('body').append(addJsHtml);

                $('body').append(addJsRun);


            },
            parserOptions: {
                // Options here
                decodeEntities: false
            }
        }))


        .pipe(rename({

            extname: ".html"

        }))

        .pipe(gulp.dest('build/html'))//输出为html

        .pipe(bom())

        .pipe(connect.reload());

}

module.exports = devEjs;