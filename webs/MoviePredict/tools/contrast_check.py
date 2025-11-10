#!/usr/bin/env python3
"""
Simple WCAG contrast checker for two hex colors.
Usage: python tools/contrast_check.py # prints contrast between configured colors
"""

import math

def hex_to_rgb(hexstr):
    hexstr = hexstr.strip().lstrip('#')
    if len(hexstr) == 3:
        hexstr = ''.join([c*2 for c in hexstr])
    r = int(hexstr[0:2], 16)
    g = int(hexstr[2:4], 16)
    b = int(hexstr[4:6], 16)
    return (r, g, b)

def srgb_to_linear(c):
    c = c / 255.0
    if c <= 0.03928:
        return c / 12.92
    return ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(rgb):
    r, g, b = rgb
    R = srgb_to_linear(r)
    G = srgb_to_linear(g)
    B = srgb_to_linear(b)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B

def contrast_ratio(hex1, hex2):
    lum1 = relative_luminance(hex_to_rgb(hex1))
    lum2 = relative_luminance(hex_to_rgb(hex2))
    L1 = max(lum1, lum2)
    L2 = min(lum1, lum2)
    return (L1 + 0.05) / (L2 + 0.05)

def main():
    # Colors used when header is scrolled in CSS
    scrolled_bg = '#FAFAFA'   # --bg-primary default
    scrolled_text = '#111827' # --text-primary default

    ratio = contrast_ratio(scrolled_text, scrolled_bg)
    print('Scrolled header background:', scrolled_bg)
    print('Scrolled header text:', scrolled_text)
    print('Contrast ratio:', round(ratio, 2))
    if ratio >= 4.5:
        print('Result: PASS (WCAG AA for normal text)')
    elif ratio >= 3:
        print('Result: PASS for large text (>=3.0), FAIL for normal text')
    else:
        print('Result: FAIL - adjust colors')

if __name__ == "__main__":
    main()
