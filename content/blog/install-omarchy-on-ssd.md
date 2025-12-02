---
title: "How I Installed Omarchy on an External SSD"
description: "Here's a step-by-step guide on how to install Omarchy on an external SSD easily"
tags:
    - "omarchy"
    - "linux"
    - "os"
    - "guide"
createdAt: "2025-12-02"
updatedAt: "2025-12-02"
---


If you want to try [Omarchy](http://omarchy.org/) without wiping your current computer clean, here's a step-by-step guide.

## Prerequisites

1. A USB stick (8–16 GB)
2. An external SSD (Omarchy uses the entire drive to install — I didn't want to risk my current disk, so I got a [Samsung T7](https://www.samsung.com/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7-usb-3-2-1tb-gray-mu-pc1t0t-am/))
3. A computer
4. Internet connection

(And good posture. Sit up!)

## Creating the Bootable USB

Installing Omarchy is straightforward. First, download the ISO image from [omarchy.org](http://omarchy.org).

The ISO won't install itself like a `.exe`. You need to flash it onto your USB stick using [balenaEtcher](https://etcher.balena.io/). Open balenaEtcher, select the ISO, select your USB drive, and wait for it to finish. Done — your USB is now a bootable Omarchy installer.

## Booting from the USB

1. Shut down your computer.
2. Insert the bootable USB.
3. Power on and immediately press the key to enter BIOS setup. On Lenovo, this is usually `F2`. Other manufacturers use `Del`, `F12`, or `Esc` — check your machine's documentation.
4. In the BIOS, navigate to the boot menu and change the boot order so the USB drive appears before your built-in disk. On Lenovo, you typically use `F5`/`F6` to reorder; this varies by manufacturer.
5. Plug your external SSD into another USB port (keep the bootable USB connected).
6. Save and exit the BIOS.

## Installing Omarchy

The Omarchy installer will now load. It will ask which disk you want to install the OS on.

**Select your external SSD** (e.g., Samsung T7). Double-check you're not selecting your internal drive — the installer will wipe whatever you choose.

The installer will download and set up everything. Once finished, it will ask you to remove the USB stick. Before you do:

1. Re-enter the BIOS.
2. Change the boot order again so your external SSD (Samsung T7) appears above your built-in disk. This is where Omarchy now lives.
3. Save and exit.

## Enjoy

You're done. Remove the USB, and Omarchy will boot from your external SSD. Play around. Bye!
