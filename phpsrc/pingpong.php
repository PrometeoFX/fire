<?php
if (isset($_GET['action']) && $_GET['action'] === 'cors') {
	header("Access-Control-Allow-Origin: *");
}

passthru('/usr/syno/bin/synopingpong');
?>
