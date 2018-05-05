# SWEN90016 Software Processes and Management
# Semester 1 2018
# Assignment 2 - Groomie
# Makefile
# Team Orange

EXECUTABLE=src/server/server.js
EXECUTOR?=node
INSTALLER?=npm

all:
	${INSTALLER} install
	sudo service mysql start
	${EXECUTOR} ${EXECUTABLE}

install:
	${INSTALLER} install

start:
	sudo service mysql start

run:
	${EXECUTOR} ${EXECUTABLE}
