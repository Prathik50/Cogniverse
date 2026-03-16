#!/usr/bin/env bash

# Create the assets folder if needed
mkdir -p src/assets/social

# --- Social Skills main tiles ---

# Saying Hello (main tile)
curl -L "https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/hello_main.png

# Big Feelings (main tile)
curl -L "https://images.pexels.com/photos/4148860/pexels-photo-4148860.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/feelings_main.png

# Asking for Help (main tile)
curl -L "https://images.pexels.com/photos/4475922/pexels-photo-4475922.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/help_main.png

# Personal Space (main tile)
curl -L "https://images.pexels.com/photos/3951652/pexels-photo-3951652.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/personal_space_main.png


# --- Greetings activity cards ---

# Hello
curl -L "https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/hello.png

# Goodbye
curl -L "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/goodbye.png

# Nice to meet you (handshake)
curl -L "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/handshake.png


# --- Big Feelings activity cards ---

# Happy
curl -L "https://images.pexels.com/photos/3760853/pexels-photo-3760853.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/happy.png

# Sad
curl -L "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/sad.png

# Angry
curl -L "https://images.pexels.com/photos/5727875/pexels-photo-5727875.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/angry.png

# Scared
curl -L "https://images.pexels.com/photos/4100426/pexels-photo-4100426.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/scared.png


# --- Asking for Help activity cards ---

# Need help
curl -L "https://images.pexels.com/photos/4475923/pexels-photo-4475923.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/help.png

# Don't understand / confused
curl -L "https://images.pexels.com/photos/4101131/pexels-photo-4101131.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/confused.png

# Break
curl -L "https://images.pexels.com/photos/4475921/pexels-photo-4475921.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/break.png


# --- Personal Space activity cards ---

# Too close (two people close)
curl -L "https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/too_close.png

# Hug
curl -L "https://images.pexels.com/photos/4260323/pexels-photo-4260323.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/hug.png

# High five
curl -L "https://images.pexels.com/photos/1181425/pexels-photo-1181425.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop" \
  -o src/assets/social/high_five.png

echo \"Downloaded social skills placeholder images into src/assets/social\"