# Backing Up a Pi Disk

Sometimes you have your SD card for your Pi configured just right. That's a good time to make a copy of it so you can return to it later.

## Copying on MacOS Mojave (and Previous)
Prior to MacOS Mojave, it was relatively easy to back up a Pi image using Disk Utility. You'd just make an image from disk and save as a CD-ROM/Master disk. Mojave switched the MacOS over to the APFS file system, however, which complicates things with the Pi. No more Disk Utility GUI.

You can still use the command line diskutil application though. To start with, insert your Pi's SD card into an SD card reader on your Mac and open the Terminal app. Then get a list of your drives like so:

````
$ diskutil list
````

You should get a list more or less like this:

````
/dev/disk0 (internal):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                         500.3 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +500.0 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            486.7 GB   disk1s1
   2:                APFS Volume Preboot                 45.4 MB    disk1s2
   3:                APFS Volume Recovery                510.3 MB   disk1s3
   4:                APFS Volume VM                      3.2 GB     disk1s4

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *32.0 GB    disk2
   1:             Windows_FAT_32 boot                    268.4 MB   disk2s1
   2:                      Linux                         31.7 GB    disk2s2
````
What you care about is that last one, `/dev/disk2`. That's your SD card. To copy it, you need to unmount it like so:

````
$ diskutil unmountDisk /dev/disk2
````

Then use the `dd` application to copy it into a file like so:

````
$ sudo dd if=/dev/disk2 of=my-pi-image.img bs=1m
````

* `if` is the input file. That's the SD card you're copying from
* `of` is the output file. That's an image file you're going to make on your hard drive
* `bs` is the input and output file block size. You can use `512` bytes, `64k` bytes, ot `1m` (i.e. 1 megabyte). 

While `dd` is working, it won't give you any output, but you can check its progress by typing cmd-T. You should get a response like this:

````
load: 7.68  cmd: dd 51476 uninterruptible 0.17u 494.84s
29051+0 records in
29051+0 records out
30462181376 bytes transferred in 5652.227182 secs (5389412 bytes/sec)
````

The numbers will get bigger until it's copied your whole disk.

## Making a new SD card

You can also use `dd` to make a new SD card from the image you just made, by reversing the input and output files. You'll need to format a blank SD card as FAT32, though, rather than APFS. You can do it from the command line like so:

````
$ sudo diskutil eraseDisk FAT32 UNTITLED MBRFormat /dev/disk2
````

This will erase the SD card at `/dev/disk2` and reformat it as FAT32 and the name UNTITLED. FAT32 is a bit picky about naming, so stick to 8 characters, all upper case. 

Once you've got the card formatted, you can either use the `dd` command again, or you can use the [Etcher GUI](https://www.balena.io/etcher/). Etcher's faster and easier. 


