##
## Dont change this file,if you dont understand
##

## すべてローカル環境側の設定

ssh_config_host="vagrant"

loginuser="vagrant"

secret_key="ansible_ecdsa"

password_file="ansible_password.yml"

secret_key_path=./.ssh/$secret_key

# sshでログイン用のプロジェクト配下に作成
mkdir -m 700 ./.ssh

# vagrant(server)側の設定をクライアント側のPCに書く。
vagrant ssh-config  --host $ssh_config_host >> ./.ssh/config

# scpは非推奨になったためsftpで実装
sftp -F ./.ssh/config $ssh_config_host  <<END
lcd ./.ssh/
get /home/vagrant/$secret_key
END

# scpは非推奨になったためsftpで実装
sftp -F ./.ssh/config $ssh_config_host  <<END
get /home/vagrant/$password_file
END

# 秘密鍵をダウンロードしたので、安全のためサーバー側の秘密鍵を削除
ssh -F ./.ssh/config $ssh_config_host rm /home/$loginuser/$secret_key

# パスワードファイルをダウンロードしたので、安全のためサーバー側のパスワードファイルを削除
ssh -F ./.ssh/config $ssh_config_host rm /home/$loginuser/$password_file

# 秘密鍵を使うためにパーミッション変更
chmod 600 ./.ssh/$secret_key

# User,IdentityFileをansibleの物に変更
vagrant ssh-config  --host ${ssh_config_host}_ansible | 
    sed "s/User $loginuser/User ansible/" |
    sed -E "s|IdentityFile .*$|IdentityFile ./.ssh/$secret_key|" >> ./.ssh/config

# ansible 
ansible-vault encrypt $password_file