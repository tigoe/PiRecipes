# Automating Processes with Cron

When you want to automate a process on any POSIX computer, `cron` is the tool to do the job. It's a tool for scheduling the operation of different processes on a computer. With cron, you can call a process on the month, day of the week or month, hour, minute, or other times. Cron will run a process just as if you had typed it on the command line yourself. You can combine cron with shell scripts for more complex automation. The Raspberry Pi foundation has a good [introduction to cron](https://www.raspberrypi.org/documentation/linux/usage/cron.md) on their site. There's a [slightly more advanced tutorial on cron](https://opensource.com/article/17/11/how-use-cron-linux) at opensource.com as well. [Crontab.guru](https://crontab.guru/) is a useful cron helper also.

## Cron to Log Data

Cron is useful for things you do regularly. It's often used to backup different directories, or to reboot your computer on a regular basis. [Time lapse photography](timelapse.md) is a popular use for cron on the Pi. You can also use it to call any script you want. For example, perhaps you want to make an HTTP request to a given website using the `curl` command. Here's a curl request to [openweathermap.org(https://openweathermap.org) to get the sunrise and weather for a given location:

````
curl 'api.openweathermap.org/data/2.5/weather?zip=10003,us'
````

The result of this is a JSON string, so perhaps you want append this to a file of times called `weather.json` in your home directory. You'd redirect the output of this like so:

````
curl 'api.openweathermap.org/data/2.5/weather?zip=10003,us' >> /home/username/weather.json
````

You could make this into a daily cron job like so. Edit your crontab by typing `crontab -e`, then add the following line:

````
 0 0 * * * curl 'api.openweathermap.org/data/2.5/weather?zip=10003,us' >> /home/username/weather.json
````
This will make the request every day at midnight. 

## Irregular Cron Jobs

Perhaps you want a cron job that runs at irregular times. You can do that. For example, when I set up the lights on my holiday tree every December, I want the lights to come on when I wake up in the morning and when I come home at night, and go off when I go to work or to bed. On the weekends, I want them to stay on all day. The tree lights are operated by an [Arduino Yún](https://www.arduino.cc/en/Guide/ArduinoYunRev2), and I use the Bridge [Mailbox](https://www.arduino.cc/en/Reference/YunMailboxConstructor) library to manage the tree's on and off states. The cron job on the Linux side of the Yún looks like this (note that you can add comments to a cron job by preceding them with #):

````
15 6 * * * curl 'http://localhost/mailbox/on' # at 6:15 AM, turn on
30 8 * * 1-5 curl 'http://localhost/mailbox/off' # at 8:30 AM, M-F turn off
30 8 24,25 12 * curl 'http://localhost/mailbox/on' # Turn on  at 8:30 AM Christmas day and Christmas eve

45 16 * * * curl 'http://localhost/mailbox/on' # at 4:45 PM, turn on
0 23 * * * curl 'http://localhost/mailbox/off' # at 11 PM, turn off
````

## Cron and Shell Scripts

Perhaps you have several steps you want to do at a given time. You can combine these steps into a shell script, which will run them all in sequence. [Pimoroni](https://learn.pimoroni.com/) has a nice [intro to bash scripts](https://learn.pimoroni.com/tutorial/bash/getting-started-with-bash) to get you started. For example, here's a shell script to take a picture, upload it to a website using curl, and then write to a log file to confirm the action:

````
#!/bin/bash
# Take a picture, 100ms delay, 400x300, 80% quality, no preview:
raspistill -t 100 -w 400 -h 300 -q 80 -o image.jpg -n
# upload to the server using curl
curl -F "image=@image.jpg" 'http://example.com:8080/upload'
# print  a confirmation to a log file:
echo "picture uploaded at $(date)" >> /home/username/logfile.txt
````

If you have this saved in your home directory as `webcam.sh`, with the permissions set to make it executable (see the Pimoroni page for more on that), then you could run the whole script from cron once every 10 minutes like so:

````
*/10 * * * * ./webcam.sh
````

Once you get to know cron, there are many interesting things you can do with it. Combined with shell scripts and network communications like curl, The Pi Zero becomes a handy hub for automating many networked devices in the home. 