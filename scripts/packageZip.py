import os
import zipfile

def package_project():
    output_dir = "public/download"
    os.makedirs(output_dir, exist_ok=True)
    zip_path = os.path.join(output_dir, "forkframe-studio-infinite-dimension.zip")

    # Exclusions
    exclude_dirs = {"node_modules", ".git", "dist", ".cache", "__pycache__"}
    exclude_files = {".DS_Store"}

    count = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Prune excluded directories in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            # Avoid packing the zip into itself
            if "public/download" in root:
                files = [f for f in files if not f.endswith('.zip')]

            for file in files:
                if file in exclude_files:
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                zipf.write(file_path, arcname)
                count += 1

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"Successfully packaged {count} files into {zip_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    package_project()
