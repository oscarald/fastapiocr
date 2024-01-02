import os
from PIL import Image

fileDir = os.path.dirname('D://CODE//OCR//image_path//')  # this file directory
imagesFolder = os.path.join(fileDir, "images")
optimizedFolder = os.path.join(fileDir, "optimized")

# if the folder to save optimized images doesn't exist don't create a new folder
if os.path.isdir("optimized") == False:
    os.mkdir(optimizedFolder)

unopt_images = []
for file in os.listdir(imagesFolder):
    if file.endswith(("jpg", "jpeg", "png")):
        unopt_images.append(file)
        size = os.stat(imagesFolder + f"\{file}").st_size
        print(f"Original Image's Size: {file} -{ size}")

print("Compressing images...")
for image in unopt_images:
    img = Image.open(os.path.join(fileDir, "images", image))
    # if you want to resize the image use the code below & set the size
    # img = img.resize((800,500), resample=1)
    img.save(
        os.path.join(optimizedFolder, "Optimized_" + image),
        optimize=True,
        quality=10,
    )
    size = os.stat(optimizedFolder + f"\Optimized_{image}").st_size
    print(f"New Compressed Image's Size: Optimized_{image} - {size}")
