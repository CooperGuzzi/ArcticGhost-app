# Script to scan for networks

switch="0"

time=60
mkdir scan1
chmod 775 scan1
cd scan1

sudo airmon-ng start wlan0 #Set into monitor mode
sudo iwconfig > iwconfig.txt #output command to file

#parse through output to insure monitor mode is on
grep Monitor iwconfig.txt > monitor.txt #look for 'Monitor' in iwconfig command
cut -b 29-35 monitor.txt > new.txt #extract 
echo "Monitor" > test.txt #create test file ***MAKE ON BOOT***
diff new.txt test.txt > check.txt #check difference

if [ -s check.txt ] #check for monitor mode
then 
	switch = "1"
else
	echo "Monitor mode activated!"
	sleep 10
fi

cd .. #back to home directory
sudo airmon-ng start wlan0 #scan networks

#check if switch == 1
if [ $switch == 1 ]
then
	echo "Abort mission..."
else
	timeout $time sudo airodump-ng -w bigData --output-format csv wlan0
	echo "Your data file has been created in the Arctic-Ghost directory"
	echo "Select the Wi-Fi you wish to attack..."
	#scp user@domain:/file/dir/on/pi/bigData-01.csv newName.csv
fi
