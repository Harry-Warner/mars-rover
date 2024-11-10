# Mars rover
A program that takes in commands and moves one or more robots around
Mars.

## Pre-requisites
- Node.js installed (v20.x and above)

## Run
- run `npm run start` to run against the existing large dataset
- run `npm run start -- --file="path/to/file.txt"` if using your own file.

## Test
- run `npm run test` to run the tests

## Future improvements
- Use typescript for type safety
- Use a readable stream to read in chunks for improved performance with extra large files
- Implement caching where applicable
- Add a validation workflow using github actions