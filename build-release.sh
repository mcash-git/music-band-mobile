#!/bin/sh
rm -rf android/app/build
# npm i
# react-native run-android --variant=release
cd android
./gradlew installRelease
cd ..
