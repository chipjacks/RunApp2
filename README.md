
### Setup

```
yarn install
```

### Run

```
yarn serve
```

### Test

##### Unit tests
  
```
yarn test
```

Or, have them run automatically using [fswatch](https://github.com/emcrisostomo/fswatch):

```
fswatch src/* tests/* | while read line; do elm-test; done;
```

##### Integration tests

Start the dev server and then open cypress:

```
yarn run cypress open
```

