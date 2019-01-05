# Automating Processes with Cron

When you want to automate a process on any POSIX computer, `cron` is the tool to do the job. It's a tool for scheduling the operation of different processes on a computer. With cron, you can call a process on the month, day of the week or month, hour, minute, or other times. Cron will run a process just as if you had typed it on the command line yourself. You can combine cron with shell scripts for more complex automation. The Raspberry Pi foundation has a good [introduction to cron](https://www.raspberrypi.org/documentation/linux/usage/cron.md) on their site. 

## A Few Things You Might Do with cron

Cron is useful for things you do regularly. It's often used to backup different directories, or to reboot your computer on a regular basis. [Time lapse photography](timelapse.md) is a popular use for cron on the Pi. 