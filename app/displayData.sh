# Script to attack entire network
#bold=$(tput bold)
#normal=$(tput sgr0)

# Print out ESSIDs and BSSIDs of scanned networks and load BSSIDs and ESSIDs into an associative array
declare -A networks
declare -A channels

rm -f attack.html

touch attack.html

echo "<!DOCTYPE html>" >> attack.html
echo "<html>" >> attack.html
echo "<head>" >> attack.html
echo "<meta charset='UTF-8'>" >> attack.html
echo "<link rel='stylesheet' href='./css/main.css'>" >> attack.html
echo "<title>Rapid and Remote Deauthentication Drone (R2D2)</title>" >> attack.html
echo "</head>" >> attack.html
echo "<body>" >> attack.html
echo "<div class='grid-container'>" >> attack.html
echo "<div class='header'>" >> attack.html
echo "<h1>Scan Results<h1></div>" >> attack.html
echo "<div class='left'></div>" >> attack.html
echo "<div class='middle' style='background-color: #ccc;'>" >> attack.html
echo "<table>" >> attack.html
echo "<tr>" >> attack.html
echo "<th>ESSID</th>" >> attack.html
echo "<th>BSSID</th>" >> attack.html
echo "</tr>" >> attack.html
#echo "<tr>" >> attack.html

while IFS=, read -r bssid first last channel speed privacy cipher authentication power numBeacons numIV lanIP lenID essid key
do
	if [[ "$lanIP" = *[!\ ]* ]]; then
		if [ "$essid" != " ESSID" ]; then
			if [[ "$essid" != *[!\ ]* ]]; then
				echo "<tr><td>Hidden Network</td><td>$bssid</td></tr>" >> attack.html
        networks["$bssid"]="$essid"
			  channels["$bssid"]="$channel"
			else
				echo "<tr><td>$essid</td><td>$bssid</td></tr>" >> attack.html
        networks["$bssid"]="$essid"
			  channels["$bssid"]="$channel"
			fi
		fi
	fi
done < bigData-01.csv
echo "</table><br></div>" >> attack.html

# Check if any networks were found
if [ "${#networks[@]}" -eq 0 ]; then
	echo "<p>No Networks Detected! Close out of this window and try scanning again.</p>"
else
	# Attack a network
  echo "<div class='right'></div>" >> attack.html
  echo "<div class='footer'>" >> attack.html
  echo "<h3>Launch a Deauthentication Attack</h3>" >> attack.html
  echo "<p> Use the below form to launch an attack against a specified network.</p>" >> attack.html
  echo "<p><form id='attackForm'>" >> attack.html
  echo "<label for='networks'>Select a Network to attack:</label>" >> attack.html
  echo "<select id='networks' name='networks'>" >> attack.html
  for key in "${!networks[@]}";
  do
    echo "<option value='$key'>$key</option>" >> attack.html
  done
  echo "</select>" >> attack.html
  echo "<input type='submit' value='Submit'>" >> attack.html
  echo "<script src='./attack.js'></script>" >> attack.html
  echo "</form></p></div></div><br>" >> attack.html
fi
