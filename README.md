# Features sliders

## Description
This feature add multiples components to display slides. 

## Requirement
Gsap and the draggable/inertia plugins. Inertia plugin is included in Gsap ShockinglyGreen price plan.

# AppSlider
An infinite draggable slider.

## Props:

### name 
Name for the components and child items. Ussefull if multiples componenets in the same page. Default `slider`

### items
Array of data object to build the slides. Default `[]`

### infinite
Boolean to determine if the sliders loop from end to start. Default `true`

### hasDrag
Boolean to determine if you can drag the elements. Default `true`
  
### hasSnap
Boolean to determine if the slides snap into round position. Default `true`
    
### autoplay
Boolean to determine if the slides autoplay. Default `false`

### speed
Number to determine autoplay slides speed. Default `1`

### direction
Number to determine the directions of the autoplay. Can be [1,-1]. Default `1`

### draggableOptions
Object to override Draggable options like drag resistance for exemple.


# AppSlideShow
A slide show with swipe on touch device and autoplay features.

## Props:
### name
Name for the components and child items. Ussefull if multiples componenets in the same page. Default `slideshow`

### items
Array of data object to build the slides. Default `[]`

### autoplay
Boolean to determine if the slides autoplay. Default `true`

### duration
Number to determine autoplay between slides. Default `8`

### delay
Number to determine delay before autoplay continue. Default `0.3`

### swipe
Boolean to determine if the slides has swipe capacity. Default `true`

# AppBullets
Bullets points for the slider progress.

## Props:
### index
Number to determine current index.
### length
Number of bullets to show.

