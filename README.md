# back
nodejs server

# install

打开/etc/sudoers文件，查看secure_path这一项配置，这就是用sudo命令时的环境变量，可以通过修改这一设置

Defaults secure_path = /sbin:/bin:/usr/sbin:/sur/bin

使用visudo命令，就可以打开/etc/sudoers文件进行修改，在secure_path后面加入pip的执行路径，我这里是/usr/local/bin，保存即可生效
