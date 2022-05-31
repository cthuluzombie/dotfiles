#!/bin/bash
ICON=$HOME/Downloads/icon.png
TMPBG=/tmp/screen.png
BLUR=/tmp/screenblur.png
scrot /tmp/screen.png
convert $TMPBG -blur 0x20 $BLUR
convert $BLUR $ICON -gravity center -composite -matte $BLUR
i3lock -u -i $BLUR
rm /tmp/screen.png
rm /tmp/screenblur.png
