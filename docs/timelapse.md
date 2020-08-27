# Time Lapse Photography With A Pi

A single-board computer running Linux, like the Raspberry Pi, can take time lapses using its on-board camera, or using a USB camera attached. For the Pi, these two approaches require two different applications.

## Use the Built-In Camera and raspistill
If you're using the Pi cam, then you can use the raspistill app to take photos. There is an [intro to raspicam on the Raspberry Pi site](https://www.raspberrypi.org/documentation/usage/camera/raspicam/) that's very good. There's also a page on [using raspistill to make time lapses](https://www.raspberrypi.org/documentation/usage/camera/raspicam/timelapse.md).

The advantage to using the built-in camera is that it's fast, and the Raspberry Pi foundation has put a lot of work into making the camera interface usable. I'm also quite fond of the Pi Zero case that has a built-in camera mount on the lid. The disadvantage is that the Pi cameras tend to be a bit more expensive than other camera options. amd it's not as high resolution as many standard webcams these days. You can also use other cameras that use the same interface with other cameras. 

Here's a quickstart to setting up the built-in Pi camera:

Once you've got the camera connected, you need to give yourself permission to access the camera in the device (/dev) directory. To do that, type the following on the command line:

````
$ sudo usermod -a -G video $(whoami)
````

This will make you a member of the `video` group of users who can access the camera device. Now logout and log back in.

Now you're ready to take a picture. Type the following:

````
raspistill -o cam.jpg
````
The `-o cam.jpg` is telling the raspistill program to output to a file called `cam.jpg` in the current working directory. After a few seconds, type `ls` to see if there's a new file in your directory called `cam.jpg`. If so, you're all set. 

You can change a number of options in the raspistill app. type `raspistill --help` to get the full list, or see the documentation links above. Here are some of the more common ones (quoted from the documentation):

* -q, --quality	: Set jpeg quality <0 to 100>
* -r, --raw	: Add raw bayer data to jpeg metadata
* -tl, --timelapse	: Timelapse mode. Takes a picture every <t>ms. %d == frame number (Try: -o img_%04d.jpg)
* -w, --width	: Set image width <size>
* -h, --height	: Set image height <size>
* -o, --output	: Output filename <filename> (to write to stdout, use '-o -'). If not specified, no file is saved
* -v, --verbose	: Output verbose information during run
* -sh, --sharpness	: Set image sharpness (-100 to 100)
* -co, --contrast	: Set image contrast (-100 to 100)
* -br, --brightness	: Set image brightness (0 to 100)
* -sa, --saturation	: Set image saturation (-100 to 100)

## Use a USB Camera and fswebcam
If you're using an external USB camera, you won't be able to use raspistill, but you can use another app. The Raspberry Pi site has a good [tutorial on using an external USB camera with fswebcam](https://www.raspberrypi.org/documentation/usage/webcams/).

The advantage of using a USB camera is that you can get cheap ones, and they come with a variety of different features. The disadvantage is that you're on your own if they don't work with the built-in drivers.

## Automating The Time Lapse with a Cron Job
To automate your time lapse, you will need to configure the Pi using a cron jobs. cron is a tool that lets you automate tasks on all POSIX computers, including Linux and Unix (including MacOS) computers.

## Stitching The Photos together with ffmpeg
The approaches above both result in a directory full of still images. To create a video from them, you need a tool to stitch these images together into a video. You can do it on a Pi, but the processing power of a Pi is probably much less than your personal computer. 

[ffmpeg](https://www.ffmpeg.org/) is a useful command line video to do this. Transfer the directory of images from your Pi to your personal computer, then open a command line interface and change directories to the image directory. Once you're there, enter the following command:

````
ffmpeg -r 30 -f image2 -s 1920x1080 -i image%04d.jpg -vcodec libx264 -crf 25  -pix_fmt yuv420p video.mp4
````

This assumes the following: 

* You have a directory of images all called `imageXXXX.jpg`, where XXXX is a 4-digit number, and they're all in sequence. The` -i` flag sets your input for the command;
* The images are all 1920x1080, or you want the video that way. the `-s` flag sets the size.
* You want a frame rate of 30 frames per second. the `-r` flag sets this.
* You want to use the H.264 codec. THe `-vcodec` flag sets this.
* You want good quality. the `-crf` flag (constant rate factor) sets this. 0 is lossless compression, 51 is really bad quality, but small file size.
* Your pixel format is [yuv420p](http://softpixel.com/~cwright/programming/colorspace/yuv/). the `-pix_fmt` flag sets this.

The command will output a video file called `video.mp4`.

If your images are all not rotated quite right, you can rotate them using the rotate filter:

````
-vf "rotate=degrees*PI/180"
````

Replace `degrees` above with a rotation value in degrees. Negative numbers are counterclockwise rotation, and positive are clockwise. So to rotate all images counterclockwise by 2 degrees:

````
ffmpeg -r 30 -f image2 -s 1920x1080 -i image%04d.jpg -vf "rotate=-2*PI/180" -vcodec libx264 -crf 25  -pix_fmt yuv420p video.mp4
````

Hammad Mazhar's page on [stitching photos together with ffmpeg](http://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/) is a good summary of how to do it. They cover a number of additional techniques such as start and end frames, converting from other formats, etc.