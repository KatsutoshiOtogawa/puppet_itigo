read -p "input site username>" PUPPETEER_USERNAME

export PUPPETEER_USERNAME

echo "export PUPPETEER_USERNAME=$PUPPETEER_USERNAME" >> $HOME/.profile

read -sp "input site password>\n" PUPPETEER_PASSWORD

export PUPPETEER_PASSWORD

echo "export PUPPETEER_PASSWORD=$PUPPETEER_PASSWORD" >> $HOME/.profile
