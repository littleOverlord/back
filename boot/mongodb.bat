:::
::: 配置
:::
@echo off
cd ../
set basepath=%cd%
:::数据库数据存放目录
:::dbpath=""
:::数据库日志存放目录
:::logpath=""
:::以追加的方式记录日志
:::logappend=true
:::端口号 默认为29817
set port=29817 
:::mongodb所绑定的ip地址
set bind_ip=127.0.0.1 
::: 检查创建db目录
::: cd ../
set dbpath=%basepath%\db
if exist %dbpath% (
    echo "%dbpath%目录已经存在"
) else (
    md %dbpath%
    echo "创建%dbpath%目录成功"
)
::: 检查创建db log目录
:::cd ../
set logdir=%basepath%\log
if exist %logdir% (
    echo %logdir% exist
) else (
    md %logdir%
    echo create %logdir% dir ok
)
cd log
set logpath=%logdir%\mongodb.log
if exist %logpath% (
    echo %logpath% exist
) else (
    cd.>%logpath%
    echo create %logpath% file ok
)

echo dbpath=%dbpath% logpath=%logpath% port=%port% bind_ip=%bind_ip%
::: 启动mongodb
mongod --dbpath=%dbpath% --logpath=%logpath% --logappend --port=%port% --bind_ip=%bind_ip%
pause