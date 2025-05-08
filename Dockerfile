FROM ubuntu:latest
LABEL authors="choi"

ENTRYPOINT ["top", "-b"]