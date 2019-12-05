#!/bin/sh -e

# This trick is to overcome the problem that SSH keys need specific permissions when used directly with ssh -i
cat deployment/qa/parker.pem | ssh-add -q -k -

# SSH to QA and forward ports for MySQL and Docker registry to local machine (local MySQL must not be running!!!)
ssh -L 3306:127.0.0.1:3306 -L 5000:127.0.0.1:5000 ubuntu@parker-qa.aplaline.com
