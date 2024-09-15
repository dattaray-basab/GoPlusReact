#!/bin/bash

# Get all environment variables containing "cks_"
cks_vars=$(env | grep "cks_" | cut -d= -f1)

# Remove each variable
for var in $cks_vars; do
    unset $var
done