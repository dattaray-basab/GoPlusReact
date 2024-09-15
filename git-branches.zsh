#!/bin/zsh

# Fetch all remote branches
git fetch --all --prune

# Create an array to store branch names and their latest commit timestamps
branch_timestamps=()

# Iterate over each remote branch
for branch in $(git branch -r | grep -v HEAD)
do
    # Get the latest commit timestamp for the branch
    latest_timestamp=$(git log -1 --format="%at" "$branch" 2>/dev/null)
    
    # If the branch has commits, store the branch name and latest commit timestamp in the array
    if [ -n "$latest_timestamp" ]; then
        branch_timestamps+=("$latest_timestamp $branch")
    fi
done

# Sort the array by the first field (latest commit timestamp) in descending order
sorted_branches=(${(Oon)branch_timestamps})

# Find the maximum length of the branch names
max_length=0
for entry in "${sorted_branches[@]}"
do
    branch_name="${entry#* }"
    length="${#branch_name}"
    if [ "$length" -gt "$max_length" ]; then
        max_length="$length"
    fi
done

# Print the branch names and their latest commit dates in chronological order with aligned dates
printf "%-${max_length}s  %s\n" "Branch" "Commit Date"
printf "%-${max_length}s  %s\n" "------" "-----------"
for entry in "${sorted_branches[@]}"
do
    timestamp="${entry% *}"
    branch_name="${entry#* }"
    commit_date=$(date -r "$timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$timestamp")
    printf "%-${max_length}s  %s\n" "$branch_name" "$commit_date"
done
