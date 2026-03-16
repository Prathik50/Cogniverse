#!/bin/bash

# Script to download learning images
# Run this script to download all images for the Visual Learning section

ASSETS_DIR="./assets/learning"
mkdir -p "$ASSETS_DIR"

echo "Downloading images to $ASSETS_DIR..."

# Animals
curl -L "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80&fit=crop" -o "$ASSETS_DIR/cat.jpg"
curl -L "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop" -o "$ASSETS_DIR/dog.jpg"
curl -L "https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=800&q=80&fit=crop" -o "$ASSETS_DIR/cow.jpg"
curl -L "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80&fit=crop" -o "$ASSETS_DIR/lion.jpg"
curl -L "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80&fit=crop" -o "$ASSETS_DIR/elephant.jpg"
curl -L "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80&fit=crop" -o "$ASSETS_DIR/horse.jpg"
curl -L "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&fit=crop" -o "$ASSETS_DIR/sheep.jpg"
curl -L "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80&fit=crop" -o "$ASSETS_DIR/pig.jpg"

# Birds
curl -L "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80&fit=crop" -o "$ASSETS_DIR/bird.jpg"
curl -L "https://images.unsplash.com/photo-1598641795816-a84ac9eac40c?w=800&q=80&fit=crop" -o "$ASSETS_DIR/duck.jpg"
curl -L "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80&fit=crop" -o "$ASSETS_DIR/parrot.jpg"
curl -L "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80&fit=crop" -o "$ASSETS_DIR/rooster.jpg"
curl -L "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80&fit=crop" -o "$ASSETS_DIR/owl.jpg"
curl -L "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80&fit=crop" -o "$ASSETS_DIR/crow.jpg"

# Objects
curl -L "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&fit=crop" -o "$ASSETS_DIR/apple.jpg"
curl -L "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&fit=crop" -o "$ASSETS_DIR/car.jpg"
curl -L "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80&fit=crop" -o "$ASSETS_DIR/book.jpg"
curl -L "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&fit=crop" -o "$ASSETS_DIR/chair.jpg"
curl -L "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fit=crop" -o "$ASSETS_DIR/phone.jpg"
curl -L "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&fit=crop" -o "$ASSETS_DIR/watch.jpg"
curl -L "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fit=crop" -o "$ASSETS_DIR/shoes.jpg"
curl -L "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80&fit=crop" -o "$ASSETS_DIR/ball.jpg"

# Time of Day
curl -L "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&fit=crop" -o "$ASSETS_DIR/morning.jpg"
curl -L "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80&fit=crop" -o "$ASSETS_DIR/afternoon.jpg"
curl -L "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop" -o "$ASSETS_DIR/evening.jpg"
curl -L "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&fit=crop" -o "$ASSETS_DIR/night.jpg"
curl -L "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80&fit=crop" -o "$ASSETS_DIR/noon.jpg"
curl -L "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800&q=80&fit=crop" -o "$ASSETS_DIR/sunrise.jpg"
curl -L "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&q=80&fit=crop" -o "$ASSETS_DIR/sunset.jpg"

# Sentences
curl -L "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80&fit=crop" -o "$ASSETS_DIR/cat_sits.jpg"
curl -L "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80&fit=crop" -o "$ASSETS_DIR/boy_eats.jpg"
curl -L "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&fit=crop" -o "$ASSETS_DIR/dog_runs.jpg"
curl -L "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&fit=crop" -o "$ASSETS_DIR/big_house.jpg"
curl -L "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80&fit=crop" -o "$ASSETS_DIR/green_tree.jpg"
curl -L "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80&fit=crop" -o "$ASSETS_DIR/reads_book.jpg"
curl -L "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&q=80&fit=crop" -o "$ASSETS_DIR/bright_sun.jpg"
curl -L "https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=800&q=80&fit=crop" -o "$ASSETS_DIR/cow_milk.jpg"

echo "Download complete! Images saved to $ASSETS_DIR"
echo "Total images downloaded: $(ls -1 $ASSETS_DIR | wc -l)"
