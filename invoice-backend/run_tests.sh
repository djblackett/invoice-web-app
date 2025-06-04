#!/bin/sh

export CI=true

yarn test:unit
yarn test:integration:memory
