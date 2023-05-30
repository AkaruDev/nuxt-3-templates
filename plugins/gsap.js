
import { defineNuxtPlugin } from '#app'
import { gsap } from 'gsap'
/*
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'
*/

export default defineNuxtPlugin(() => {
  // gsap.registerPlugin(Draggable,Observer, ScrollTrigger, SplitText, CustomEase)

  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  })

  return {
    provide: {
      gsap
    }
  }
})
