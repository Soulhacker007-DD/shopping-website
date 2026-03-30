#!/usr/bin/env python3
import sys

# Read the file with UTF-8 encoding
with open('src/app/add-vendor-product/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Tailwind classes
content = content.replace('bg-white/[0.03]', 'bg-white/3')
content = content.replace('bg-white/[0.02]', 'bg-white/2')
content = content.replace('hover:bg-white/[0.04]', 'hover:bg-white/4')
content = content.replace('rounded-[2.5rem]', 'rounded-3xl')
content = content.replace('bg-gradient-to-r', 'bg-linear-to-r')

# Write back
with open('src/app/add-vendor-product/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Tailwind classes fixed')
