# PIML Chrome Extension

## Description

A Chrome extension to display .piml files in chrome. For what .piml files are see [https://github.com/petrusjt/piml](https://github.com/petrusjt/piml).  
So there is no need to convert .piml files to .html prior to opening in chrome.

After installation, for testing open [test piml](https://raw.githubusercontent.com/petrusjt/piml/main/test.piml).  
If it renders correctly, then the extension is working.

## Installation (For now)

1. Clone this repo
2. Open [chrome://extension](chrome://extension)
3. Turn Developer Mode on
4. Click Load Unpacked
5. Select the root folder of the local repository

## Note

### Warning

This extension can't load javascript, so for javascript you still have to use the python script in the above mentioned repository.


###
The HTMLNode and HTMLTree classes are ports of the classes found in [htmltree.py file in the above mentioned repository](https://github.com/petrusjt/piml/blob/main/htmltree.py).
