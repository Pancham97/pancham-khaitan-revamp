---
title: "My rant on Google Takeout for Photos"
description: "So I recently used Google Takeout to export my files from Google Photos to iCloud. This is my rant on the whole thing. Hope this helps you!"
tags:
    - "rant"
    - "technical"
createdAt: "2023-06-25"
updatedAt: "2023-06-25"
---

So I recently tried to export all of my photos from Google Photos using [Google Takeout](https://takeout.google.com/settings/takeout). While it is great to have the power to export all of my data out of Photos, I found the whole process taking me much longer than I would have liked.

1. The actual export time did not take long: Google took about 1-2 hours to export the whole data and send the download link to me via email
2. Because I had a lot of photos on Google Photos (about 50GB), the download took about 1-2 hours to complete. I also have photos on iCloud (about 60GB).
3. My MacBook Air 2015 with Intel i5 was trying its best to decompress the large five 10 gig zip files, but that process took about an hour (yes! I know!)
4. Now comes the problem!

### The problem

Now that I had 5 different folders named "Takeout", "Takeout 1", "Takeout 2", etc. all I needed to do was to upload these photos to my other cloud provider (iCloud in this case). But it was not as simple as one might think. Every photo / video has an associated JSON file that contains the metadata about the file itself. "That's fine," you may think. Yes, it would have been fine because to store all of the geo-location data, with the camera info and other stuff would have made the original file larger.

What I didn't quite like was the fact that almost all files had the camera info (shutter speed, aperture, model, etc) baked right into the EXIF data of the file, but none of the files had the "Creation date", and "Last modified date" in the EXIF info. WHY!

### The solution

After fiddling through Google to automatically add the creation date and updated date in the file's EXIF, I came across [this tool](https://github.com/TheLastGimbus/GooglePhotosTakeoutHelper). It was basically a script that would read through all the files and add that metadata. But, there was a catch. Remember how there were 5 Takeout folders created? Each Takeout folder contained multiple folders, each signifying an album in Google Photos. And because I use a Mac for everything, a simple copy-paste of one folder into another didn't work because there isn't a concept of "Merging" data. I thought, "Hey, let me do it manually."

So I spent about 30 minutes to an hour manually copy-pasting all files into the common Takeout folder, and ran the script. "Woohoo!" I thought. But not quite.

### The frustration

You see, when I ran the script, it failed. Why? Because I was using an Ex-FAT system to store those files (my Mac had run out of storage). After looking at the GitHub issues of the script, I came across [this issue](https://github.com/TheLastGimbus/GooglePhotosTakeoutHelper/issues/203). It mentioned using `dot_clean` before running the script. Voilà! Did I find the fix? Not yet ☹️

When the script failed, I deleted the output directory because I wanted to start afresh. But there lied the problem! The script does not clone the files and store a copy of that in the output directory. It moves the files!! That meant that I had literally deleted the production database. I needed to start all over.

### The hope

So I redownloaded the whole Google Photos export in the same way mentioned before, and this time, I did not want to make the same mistakes. After 3 hours of waiting for it to download and extract, I wanted to automate my manual effort. That's where I decided to use `rsync`. It's great! I basically typed

```bash
rsync -av /source/. /destination/
```

And just like that, all of the files in all the nested folders started getting copied to the root Takeout folder. After about 2 hours of this, I finally had the folder where all of my Google Photos were safe with their EXIF data separated. I still needed to do my job.

While the files were being copied, I fiddled online to find a better tool (a story of every software engineer), and I came across [google-photos-exif](https://github.com/mattwilson1024/google-photos-exif). It basically did the same thing, but it was built on Node. So I liked it. After letting it do its thing, I finally had all of my photos / videos / GIFs in one output folder. YAY? Not quite. I know, I know, I was frustrated too. That's why I am writing this rant.

While the script worked fine, it only modified the "Modified date" of all files. If you recall uploading files to iCloud, you would know that it likes to store in order of "Creation date". I needed to modify all of my 25,000+ files with their creation date matching the modified date. I came across this shell command:

```shell
for f in *.[iI][mM][gG]; do m="$(stat -f'%Sm' -t "%m/%d/%Y %H:%M:%S" "$f")"; SetFile -m "$m" -d "$m" "$f"; done
```

The brackets `[iI][mM][gG]` told the terminal which extensions it should be looking for. I updated the command to also look for PNGs and JPGs. After running that command 2-3 times (for MOV, JPEG, GIF) I finally had all of my files with the correct EXIF data.

Why couldn't Google just store those two things within the file?!
