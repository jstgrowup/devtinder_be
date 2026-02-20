1. sudo apt-get update && sudo apt-get install docker.io -y && sudo systemctl start docker
2. sudo chmod 666 /var/run/docker.sock
3. sudo systemctl enable docker
4. docker ps
5. gitproject > settings > actions > runners > new self hosted runners
   Now you run all the commands that are mentioned
   1. mkdir actions-runner && cd actions-runner
   2. curl -o actions-runner-linux-x64-2.331.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.331.0/actions-runner-linux-x64-2.331.0.tar.gz
   3. ./config.sh --url https://github.com/jstgrowup/devtinder_fe --token AJV7CZ 4. ./run.sh
   4. sudo ./svc.sh install
   5. sudo ./svc.sh start
   6. write the docker
   7. Enable the 3000 port in the security group
