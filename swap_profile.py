with open('frontend/components/Customer/Profile.jsx', 'r') as f:
    content = f.read()

# I need to swap:
# {/* Security */}
# <div className="...">...</div>
# 
# {/* My Vehicles */}
# <div className="...">...</div>

import re

# Find the grid section
start_marker = "{/* ── Lower Section (Security & Vehicles) ── */}"
grid_start = content.find(start_marker)

# Extract everything from start_marker to the end of the grid (before Modal)
modal_marker = "{/* ── Edit Profile Modal ── */}"
modal_start = content.find(modal_marker)

grid_section = content[grid_start:modal_start]

# We can split grid_section by "{/* My Vehicles */}"
parts = grid_section.split("{/* My Vehicles */}")
security_part = parts[0]
vehicles_part = "{/* My Vehicles */}" + parts[1]

# Now we construct the new grid section by putting vehicles_part first, then security_part.
# However, security_part starts with the grid container opening:
# {/* ── Lower Section (Security & Vehicles) ── */}
# <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
#    {/* Security */}

# Let's cleanly extract just the inner divs.
sec_start = security_part.find("{/* Security */}")
sec_div = security_part[sec_start:].rstrip()

veh_div = vehicles_part.rsplit("</div>\\n        </div>", 1)[0].rstrip() # wait, the last two </div> are closing the grid and the main container
# Let's do it safer with regex or simple string replacement.

# Let's find the blocks:
sec_block = re.search(r'(\{\/\* Security \*\/}.*?)(?=\{\/\* My Vehicles \*\/})', grid_section, re.DOTALL).group(1)
veh_block = re.search(r'(\{\/\* My Vehicles \*\/}.*?)(?=\s*<\/div>\s*<\/div>\s*\{\/\* ── Edit Profile Modal)', content, re.DOTALL).group(1)

# Now just swap them in the original content
new_grid_inner = veh_block + "\n\n" + sec_block
# Replace the combined block with the swapped block
combined_block = sec_block + veh_block
new_content = content.replace(combined_block, new_grid_inner)

with open('frontend/components/Customer/Profile.jsx', 'w') as f:
    f.write(new_content)

