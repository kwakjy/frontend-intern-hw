import {Animated} from 'react-native'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useFetchImage} from './useFetchImage'
import {imageSource} from '../assets/source/imageSource'

export const useFadeAnimation = (second: number) => {
  const {imageArray, copyImageArray, setImageArray, setCopyImageArray} = imageSource()
  const [isFetchNeeded, setIsFetchNeeded] = useState(true)
  const firstFadeValue = useRef(new Animated.Value(0)).current
  const secondFadeValue = useRef(new Animated.Value(0)).current
  const [isFirstDelayOver, setIsFirstDelayOver] = useState(false)
  const [isSecondDelayOver, setIsSecondDelayOver] = useState(false)
  const [isFirstSlideRun, setIsFirstSlideRun] = useState(true)
  const [isMounted, setIsMounted] = useState(true)

  const {pushImageArray} = useFetchImage(setIsFetchNeeded, setImageArray)

  useEffect(() => {
    if (isFetchNeeded) {
      pushImageArray()
    }
  }, [isFetchNeeded])

  const fadeAnimation = (fadeValue: Animated.Value, toValue: number) => Animated.timing(fadeValue, {
    toValue: toValue,
    duration: 1000,
    useNativeDriver: true,
  })

  const firstImageFadeIn = fadeAnimation(firstFadeValue, 1)
  const firstImageFadeOut = fadeAnimation(firstFadeValue, 0)
  const secondImageFadeIn = fadeAnimation(secondFadeValue, 1)
  const secondImageFadeOut = fadeAnimation(secondFadeValue, 0)

  const firstImageAnimation = useCallback(() => {
    Animated.sequence(
      [firstImageFadeIn, Animated.delay(second * 1000)],
    ).start(() => {
      setCopyImageArray(imageArray)
      setIsFirstDelayOver(true)
      firstImageFadeOut.start(() => {
        setImageArray(prev => prev.slice(2))
        if (imageArray.length === 6) {
          setIsFetchNeeded(true)
        }
      })
    })
  }, [imageArray, copyImageArray, second])

  const secondImageAnimation = useCallback(() => {
    Animated.sequence(
      [secondImageFadeIn, Animated.delay(second * 1000)],
    ).start(() => {
      setIsSecondDelayOver(true)
      secondImageFadeOut.start()
    })
  }, [second])

  const runAnimation = useCallback(() => {
    if (isMounted) {
      if (isFirstSlideRun || isSecondDelayOver) {
        firstImageAnimation()
        setIsSecondDelayOver(false)
        setIsFirstSlideRun(false)
      } else if (isFirstDelayOver) {
        secondImageAnimation()
        setIsFirstDelayOver(false)
      }
    }
  }, [imageArray, copyImageArray, isFirstDelayOver, isSecondDelayOver, isFirstSlideRun])

  return {
    imageArray,
    copyImageArray,
    isFirstDelayOver,
    isSecondDelayOver,
    firstFadeValue,
    secondFadeValue,
    setIsMounted,
    runAnimation,
  }
}
