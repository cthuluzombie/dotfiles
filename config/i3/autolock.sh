#!/bin/bash

exec xautolock -detectsleep -time 10 -locker "/home/aiden/.config/i3/lock.sh" -notify 30 -notifier "notify-send -u critical -t 10000 -- 'LOCKING SCREEN IN 30 SECONDS'"
