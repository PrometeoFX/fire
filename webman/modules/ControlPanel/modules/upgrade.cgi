#!/bin/sh

# This script is for compatible with DSM 4.3 updater.cgi.
# We plain to remove this script at DSM 5.1.
# Please refer to [DSM] #52116 for detail.

BOOT_STATUS=`synogetkeyvalue /tmp/boot_seq.tmp STEP`;

cat <<EOF
Content-type: text/plain; charset="UTF-8"
P3P: CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"

EOF

PID=`cat /run/httpd/httpd-sys.pid`
if [ -n "$PID" ]; then
	if pidof httpd | grep -q "$PID"; then
		echo '{ "boot" : true,  "success" : true }';
		exit 0
	fi
fi
echo '{ "boot" : false,  "success" : true }';
