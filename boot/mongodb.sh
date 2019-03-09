###
# 配置
###
basepath=$(pwd)
basepath=${basepath%boot*}
#数据库数据存放目录
dbpath=""
#数据库日志存放目录
logpath=""
#以追加的方式记录日志
logappend=true
#端口号 默认为29817
port=29817 
#mongodb所绑定的ip地址
bind_ip=127.0.0.1 
# 检查创建db目录
cd ../
if [ ! -d "db" ];
then
sudo mkdir db
fi
dbpath="${basepath}/db"
# 检查创建db log目录
if [ ! -d "log" ];
then
sudo mkdir log
fi
if [ ! -f "/log/mongodb.log" ];
then
cd log
sudo touch mongodb.log
fi
logpath="${basepath}log/mongodb.log"
echo "dbpath=$dbpath logpath=$logpath port=$port bind_ip=$bind_ip"
# 启动mongodb
sudo mongod --dbpath=$dbpath --logpath=$logpath --logappend --port=$port --bind_ip=$bind_ip