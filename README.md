# Parallax


## Description
Add a directive `v-parallax` for making animation with parallax.
Add a css var `--px-progress` with a progress between 0 and 1 based on the scroll and if the element is visible in the viewport.
See `playground` for examples.

## Options

### Default values
```
<div v-sticky="{
    cssVar:`--px-progress`,
    margin: 100,
    hasLerp: true,
    hasClamp: true,
    normalised: false,
    onProgress: null,
    ratio: 0.1,
    precision: 6,
    offsetY: 0,
    active: true
}" />
```

### cssVar
Name of the css variable set on the target element. Default `--px-progress`
```
<div v-sticky="{cssVar:`--px-progress`}" />
```

### margin
Margin top and bottom in px. Used to trigger the intersection observer a little before and a little after the element is in viewport. Default `100`.
```
<div v-sticky="{margin:100}" />
```

### hasLerp
Boolean that determine if the progress is lerped. Default `true`.
```
<div v-sticky="{hasLerp:true}" />
```
### hasClamp
Boolean that determine if the progress is clamp between 0 and 1. Default `true`.
```
<div v-sticky="{hasLerp:100}" />
```
### normalised
Boolean that determine if the progress is normalised between -1 and 1. Default `true`.
```
<div v-sticky="{hasLerp:100}" />
```
### onProgress
Callback method that return the progress change every tick. It returns the target element of the directive too. Default `null`.
```
<div v-sticky="{onProgress:({el, value, lerp})=>}" />
```
### ratio
Ratio use to lerp the progress. Default `0.1`.
```
<div v-sticky="{ratio:0.1}" />
```
### precision
Precision used to fixed the progress. Default `6`.
```
<div v-sticky="{precision:6}" />
```
### offsetY
Offset the start/end trigger by a pixel value. Usefull for element on the top of the page. Default `0`.
```
<div v-sticky="{offsetY:windowHeight * -0.5}" />
```

### active
Boolean that determine if the directive is active. Default `true`.
```
<div v-sticky="{active:true}" />
```
