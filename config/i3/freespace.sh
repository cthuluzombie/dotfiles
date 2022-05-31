while :
do
	echo "ip:" $(hostname -I | awk '{print $1}') "|"  "free:" $(df -Th | grep -vE "tmpfs|nfs|boot|overlay|vfat|cifs"| awk '{print $4}'|sed 's/.$//'| grep -vw "^Use"| paste -s -d+|bc) "|" $(date +" : %T") "|" $(date +" : %d/%m/%y") "     "
	sleep 1
	clear
done
