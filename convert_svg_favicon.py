#!/usr/bin/env python3
"""
Convert SVG favicon to PNG formats using cairosvg
"""
import os
import subprocess

svg_path = '/home/ktmjn/Documents/Do_An/webs/MoviePredict/static/favicon/favicon.svg'
output_dir = '/home/ktmjn/Documents/Do_An/webs/MoviePredict/static/favicon'

# Sizes to generate
sizes = [32, 64, 128, 180, 192, 256, 512]

print("Converting SVG favicon to PNG formats...")

# Try using cairosvg
try:
    import cairosvg
    print("✓ cairosvg is available")
    
    for size in sizes:
        output_file = os.path.join(output_dir, f'favicon-{size}x{size}.png')
        cairosvg.svg2png(
            url=svg_path,
            write_to=output_file,
            output_width=size,
            output_height=size
        )
        print(f"✓ Created favicon-{size}x{size}.png")
    
    # Create standard favicon.ico (using 32x32 PNG)
    output_file = os.path.join(output_dir, 'favicon.ico')
    cairosvg.svg2png(
        url=svg_path,
        write_to=output_file,
        output_width=32,
        output_height=32
    )
    print(f"✓ Created favicon.ico")
    
except ImportError:
    print("⚠️ cairosvg not found, trying ImageMagick (convert command)...")
    
    # Try using ImageMagick
    for size in sizes:
        output_file = os.path.join(output_dir, f'favicon-{size}x{size}.png')
        cmd = f'convert -density 200 -resize {size}x{size} "{svg_path}" "{output_file}"'
        result = subprocess.run(cmd, shell=True, capture_output=True)
        
        if result.returncode == 0:
            print(f"✓ Created favicon-{size}x{size}.png")
        else:
            print(f"✗ Failed to create favicon-{size}x{size}.png")
            print(f"  Error: {result.stderr.decode()}")
    
    # Create favicon.ico
    output_file = os.path.join(output_dir, 'favicon.ico')
    cmd = f'convert -density 200 -resize 32x32 "{svg_path}" "{output_file}"'
    result = subprocess.run(cmd, shell=True, capture_output=True)
    if result.returncode == 0:
        print(f"✓ Created favicon.ico")
    else:
        print(f"✗ Failed to create favicon.ico: {result.stderr.decode()}")

print("\n✅ SVG favicon conversion complete!")
